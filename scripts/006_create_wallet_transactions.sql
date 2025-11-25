-- Create wallet transactions table
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('topup', 'withdraw', 'contribution', 'receive', 'transfer', 'fee', 'penalty')),
  amount DECIMAL(15, 2) NOT NULL,
  fee DECIMAL(15, 2) DEFAULT 0,
  currency TEXT DEFAULT 'NKAP',
  local_currency TEXT,
  local_amount DECIMAL(15, 2),
  exchange_rate DECIMAL(15, 6),
  payment_method TEXT,
  reference_id UUID,
  reference_type TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  external_ref TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "wallet_transactions_select" ON public.wallet_transactions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "wallet_transactions_insert" ON public.wallet_transactions FOR INSERT WITH CHECK (user_id = auth.uid());
