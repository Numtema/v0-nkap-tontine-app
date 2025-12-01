-- ============================================
-- NKAP DATABASE SETUP - COMPLETE SCHEMA
-- Run this script to set up all tables
-- ============================================

-- 1. PROFILES TABLE (no dependencies)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  country TEXT DEFAULT 'CM',
  avatar_url TEXT,
  nkap_balance DECIMAL(15, 2) DEFAULT 0,
  reputation_score INTEGER DEFAULT 100,
  is_verified BOOLEAN DEFAULT FALSE,
  pin_hash TEXT,
  biometric_enabled BOOLEAN DEFAULT FALSE,
  preferred_language TEXT DEFAULT 'fr',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TONTINES TABLE (depends on profiles)
CREATE TABLE IF NOT EXISTS public.tontines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  slogan TEXT,
  country TEXT DEFAULT 'CM',
  contribution_amount DECIMAL(15, 2) NOT NULL,
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'biweekly', 'monthly', 'yearly')),
  membership_fee DECIMAL(15, 2) DEFAULT 0,
  late_penalty_percent INTEGER DEFAULT 10,
  min_members INTEGER DEFAULT 5,
  max_members INTEGER DEFAULT 50,
  current_cycle INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
  invite_code TEXT UNIQUE,
  is_public BOOLEAN DEFAULT FALSE,
  rules JSONB,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  president_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  secretary_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  treasurer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  cycle_start_date DATE,
  next_session_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TONTINE_MEMBERS TABLE (depends on profiles and tontines)
CREATE TABLE IF NOT EXISTS public.tontine_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tontine_id UUID NOT NULL REFERENCES public.tontines(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'president', 'secretary', 'treasurer', 'member')),
  draw_position INTEGER,
  status TEXT DEFAULT 'active' CHECK (status IN ('pending', 'active', 'suspended', 'removed')),
  total_contributed DECIMAL(15, 2) DEFAULT 0,
  total_received DECIMAL(15, 2) DEFAULT 0,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tontine_id, user_id)
);

-- 4. CAISSES TABLE (depends on tontines)
CREATE TABLE IF NOT EXISTS public.caisses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tontine_id UUID NOT NULL REFERENCES public.tontines(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('main', 'epargne', 'bonheur', 'solidarite', 'custom')),
  description TEXT,
  balance DECIMAL(15, 2) DEFAULT 0,
  contribution_amount DECIMAL(15, 2) DEFAULT 0,
  is_required BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CONTRIBUTIONS TABLE (depends on tontine_members and caisses)
CREATE TABLE IF NOT EXISTS public.contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tontine_id UUID NOT NULL REFERENCES public.tontines(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES public.tontine_members(id) ON DELETE CASCADE,
  caisse_id UUID REFERENCES public.caisses(id) ON DELETE SET NULL,
  amount DECIMAL(15, 2) NOT NULL,
  cycle_number INTEGER NOT NULL,
  session_number INTEGER,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'late', 'missed')),
  payment_method TEXT,
  transaction_ref TEXT,
  paid_at TIMESTAMPTZ,
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. WALLET_TRANSACTIONS TABLE (depends on profiles)
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('topup', 'withdraw', 'contribution', 'receive', 'penalty', 'refund', 'transfer')),
  amount DECIMAL(15, 2) NOT NULL,
  fee DECIMAL(15, 2) DEFAULT 0,
  currency TEXT DEFAULT 'NKAP',
  local_amount DECIMAL(15, 2),
  local_currency TEXT,
  exchange_rate DECIMAL(15, 6),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  payment_method TEXT,
  external_ref TEXT,
  reference_type TEXT,
  reference_id UUID,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PENALTIES TABLE (depends on tontine_members)
CREATE TABLE IF NOT EXISTS public.penalties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tontine_id UUID NOT NULL REFERENCES public.tontines(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES public.tontine_members(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('late_payment', 'absence', 'rule_violation', 'other')),
  amount DECIMAL(15, 2) NOT NULL,
  reason TEXT,
  cycle_number INTEGER,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'waived')),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. VOTES TABLE (depends on tontines and profiles)
CREATE TABLE IF NOT EXISTS public.votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tontine_id UUID NOT NULL REFERENCES public.tontines(id) ON DELETE CASCADE,
  election_id UUID NOT NULL,
  voter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  position TEXT NOT NULL CHECK (position IN ('president', 'secretary', 'treasurer')),
  candidate_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(election_id, voter_id, position)
);

-- 9. DRAWS TABLE (depends on tontines and profiles)
CREATE TABLE IF NOT EXISTS public.draws (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tontine_id UUID NOT NULL REFERENCES public.tontines(id) ON DELETE CASCADE,
  cycle_number INTEGER NOT NULL,
  draw_order JSONB NOT NULL,
  initiated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  confirmed_by JSONB DEFAULT '[]'::JSONB,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed')),
  drawn_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. MESSAGES TABLE (depends on tontines and profiles)
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tontine_id UUID REFERENCES public.tontines(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  recipient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system', 'announcement')),
  is_announcement BOOLEAN DEFAULT FALSE,
  is_pinned BOOLEAN DEFAULT FALSE,
  read_by JSONB DEFAULT '[]'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. NOTIFICATIONS TABLE (depends on profiles)
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. JOIN_REQUESTS TABLE (depends on tontines and profiles)
CREATE TABLE IF NOT EXISTS public.join_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tontine_id UUID NOT NULL REFERENCES public.tontines(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  message TEXT,
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tontine_id, user_id)
);

-- 13. EXCHANGE_RATES TABLE (no dependencies)
CREATE TABLE IF NOT EXISTS public.exchange_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  currency_code TEXT NOT NULL UNIQUE,
  currency_name TEXT NOT NULL,
  country TEXT NOT NULL,
  rate_to_nkap DECIMAL(15, 6) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tontines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tontine_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.caisses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.penalties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draws ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.join_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exchange_rates ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES - PROFILES
-- ============================================
DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update" ON public.profiles;
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- ============================================
-- RLS POLICIES - TONTINES
-- ============================================
DROP POLICY IF EXISTS "tontines_select" ON public.tontines;
DROP POLICY IF EXISTS "tontines_insert" ON public.tontines;
DROP POLICY IF EXISTS "tontines_update" ON public.tontines;
DROP POLICY IF EXISTS "tontines_delete" ON public.tontines;
CREATE POLICY "tontines_select" ON public.tontines FOR SELECT USING (true);
CREATE POLICY "tontines_insert" ON public.tontines FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "tontines_update" ON public.tontines FOR UPDATE USING (
  created_by = auth.uid() OR president_id = auth.uid()
);
CREATE POLICY "tontines_delete" ON public.tontines FOR DELETE USING (created_by = auth.uid());

-- ============================================
-- RLS POLICIES - TONTINE_MEMBERS
-- ============================================
DROP POLICY IF EXISTS "tontine_members_select" ON public.tontine_members;
DROP POLICY IF EXISTS "tontine_members_insert" ON public.tontine_members;
DROP POLICY IF EXISTS "tontine_members_update" ON public.tontine_members;
DROP POLICY IF EXISTS "tontine_members_delete" ON public.tontine_members;
CREATE POLICY "tontine_members_select" ON public.tontine_members FOR SELECT USING (true);
CREATE POLICY "tontine_members_insert" ON public.tontine_members FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "tontine_members_update" ON public.tontine_members FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "tontine_members_delete" ON public.tontine_members FOR DELETE USING (user_id = auth.uid());

-- ============================================
-- RLS POLICIES - CAISSES
-- ============================================
DROP POLICY IF EXISTS "caisses_select" ON public.caisses;
DROP POLICY IF EXISTS "caisses_insert" ON public.caisses;
DROP POLICY IF EXISTS "caisses_update" ON public.caisses;
CREATE POLICY "caisses_select" ON public.caisses FOR SELECT USING (true);
CREATE POLICY "caisses_insert" ON public.caisses FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "caisses_update" ON public.caisses FOR UPDATE USING (true);

-- ============================================
-- RLS POLICIES - CONTRIBUTIONS
-- ============================================
DROP POLICY IF EXISTS "contributions_select" ON public.contributions;
DROP POLICY IF EXISTS "contributions_insert" ON public.contributions;
DROP POLICY IF EXISTS "contributions_update" ON public.contributions;
CREATE POLICY "contributions_select" ON public.contributions FOR SELECT USING (true);
CREATE POLICY "contributions_insert" ON public.contributions FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "contributions_update" ON public.contributions FOR UPDATE USING (true);

-- ============================================
-- RLS POLICIES - WALLET_TRANSACTIONS
-- ============================================
DROP POLICY IF EXISTS "wallet_transactions_select" ON public.wallet_transactions;
DROP POLICY IF EXISTS "wallet_transactions_insert" ON public.wallet_transactions;
CREATE POLICY "wallet_transactions_select" ON public.wallet_transactions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "wallet_transactions_insert" ON public.wallet_transactions FOR INSERT WITH CHECK (user_id = auth.uid());

-- ============================================
-- RLS POLICIES - PENALTIES
-- ============================================
DROP POLICY IF EXISTS "penalties_select" ON public.penalties;
DROP POLICY IF EXISTS "penalties_insert" ON public.penalties;
DROP POLICY IF EXISTS "penalties_update" ON public.penalties;
CREATE POLICY "penalties_select" ON public.penalties FOR SELECT USING (true);
CREATE POLICY "penalties_insert" ON public.penalties FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "penalties_update" ON public.penalties FOR UPDATE USING (true);

-- ============================================
-- RLS POLICIES - VOTES
-- ============================================
DROP POLICY IF EXISTS "votes_select" ON public.votes;
DROP POLICY IF EXISTS "votes_insert" ON public.votes;
CREATE POLICY "votes_select" ON public.votes FOR SELECT USING (true);
CREATE POLICY "votes_insert" ON public.votes FOR INSERT WITH CHECK (voter_id = auth.uid());

-- ============================================
-- RLS POLICIES - DRAWS
-- ============================================
DROP POLICY IF EXISTS "draws_select" ON public.draws;
DROP POLICY IF EXISTS "draws_insert" ON public.draws;
DROP POLICY IF EXISTS "draws_update" ON public.draws;
CREATE POLICY "draws_select" ON public.draws FOR SELECT USING (true);
CREATE POLICY "draws_insert" ON public.draws FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "draws_update" ON public.draws FOR UPDATE USING (true);

-- ============================================
-- RLS POLICIES - MESSAGES
-- ============================================
DROP POLICY IF EXISTS "messages_select" ON public.messages;
DROP POLICY IF EXISTS "messages_insert" ON public.messages;
CREATE POLICY "messages_select" ON public.messages FOR SELECT USING (
  recipient_id = auth.uid() OR sender_id = auth.uid() OR tontine_id IS NOT NULL
);
CREATE POLICY "messages_insert" ON public.messages FOR INSERT WITH CHECK (sender_id = auth.uid());

-- ============================================
-- RLS POLICIES - NOTIFICATIONS
-- ============================================
DROP POLICY IF EXISTS "notifications_select" ON public.notifications;
DROP POLICY IF EXISTS "notifications_insert" ON public.notifications;
DROP POLICY IF EXISTS "notifications_update" ON public.notifications;
DROP POLICY IF EXISTS "notifications_delete" ON public.notifications;
CREATE POLICY "notifications_select" ON public.notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "notifications_insert" ON public.notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "notifications_update" ON public.notifications FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "notifications_delete" ON public.notifications FOR DELETE USING (user_id = auth.uid());

-- ============================================
-- RLS POLICIES - JOIN_REQUESTS
-- ============================================
DROP POLICY IF EXISTS "join_requests_select" ON public.join_requests;
DROP POLICY IF EXISTS "join_requests_insert" ON public.join_requests;
DROP POLICY IF EXISTS "join_requests_update" ON public.join_requests;
CREATE POLICY "join_requests_select" ON public.join_requests FOR SELECT USING (true);
CREATE POLICY "join_requests_insert" ON public.join_requests FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "join_requests_update" ON public.join_requests FOR UPDATE USING (true);

-- ============================================
-- RLS POLICIES - EXCHANGE_RATES
-- ============================================
DROP POLICY IF EXISTS "exchange_rates_select" ON public.exchange_rates;
CREATE POLICY "exchange_rates_select" ON public.exchange_rates FOR SELECT USING (true);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_tontine_members_tontine ON public.tontine_members(tontine_id);
CREATE INDEX IF NOT EXISTS idx_tontine_members_user ON public.tontine_members(user_id);
CREATE INDEX IF NOT EXISTS idx_contributions_tontine ON public.contributions(tontine_id);
CREATE INDEX IF NOT EXISTS idx_contributions_member ON public.contributions(member_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_user ON public.wallet_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_tontine ON public.messages(tontine_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_penalties_tontine ON public.penalties(tontine_id);
CREATE INDEX IF NOT EXISTS idx_caisses_tontine ON public.caisses(tontine_id);

-- ============================================
-- TRIGGER: Auto-create profile on user signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, country)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'country', 'CM')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- INSERT DEFAULT EXCHANGE RATES
-- ============================================
INSERT INTO public.exchange_rates (currency_code, currency_name, country, rate_to_nkap)
VALUES 
  ('XAF', 'Franc CFA', 'Cameroun', 100),
  ('XOF', 'Franc CFA BCEAO', 'Sénégal', 100),
  ('NGN', 'Naira', 'Nigeria', 50),
  ('KES', 'Shilling', 'Kenya', 10),
  ('GHS', 'Cedi', 'Ghana', 2),
  ('ZAR', 'Rand', 'Afrique du Sud', 3),
  ('MAD', 'Dirham', 'Maroc', 2),
  ('EUR', 'Euro', 'France', 0.15),
  ('USD', 'Dollar US', 'États-Unis', 0.16)
ON CONFLICT (currency_code) DO UPDATE SET 
  rate_to_nkap = EXCLUDED.rate_to_nkap,
  updated_at = NOW();
