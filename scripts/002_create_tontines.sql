-- Create tontines table
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

-- Enable RLS
ALTER TABLE public.tontines ENABLE ROW LEVEL SECURITY;

-- RLS Policies - users can view tontines they are members of or public ones
CREATE POLICY "tontines_select" ON public.tontines FOR SELECT USING (
  is_public = true OR 
  created_by = auth.uid() OR
  id IN (SELECT tontine_id FROM public.tontine_members WHERE user_id = auth.uid())
);
CREATE POLICY "tontines_insert" ON public.tontines FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "tontines_update" ON public.tontines FOR UPDATE USING (
  created_by = auth.uid() OR
  president_id = auth.uid() OR
  id IN (SELECT tontine_id FROM public.tontine_members WHERE user_id = auth.uid() AND role IN ('admin', 'president'))
);
CREATE POLICY "tontines_delete" ON public.tontines FOR DELETE USING (created_by = auth.uid());
