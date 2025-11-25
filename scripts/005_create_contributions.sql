-- Create contributions table
CREATE TABLE IF NOT EXISTS public.contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tontine_id UUID NOT NULL REFERENCES public.tontines(id) ON DELETE CASCADE,
  caisse_id UUID NOT NULL REFERENCES public.caisses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount DECIMAL(15, 2) NOT NULL,
  cycle_number INTEGER,
  session_number INTEGER,
  payment_method TEXT CHECK (payment_method IN ('wallet', 'mobile_money', 'bank', 'card', 'crypto')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  transaction_ref TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "contributions_select" ON public.contributions FOR SELECT USING (
  user_id = auth.uid() OR
  tontine_id IN (SELECT tontine_id FROM public.tontine_members WHERE user_id = auth.uid())
);
CREATE POLICY "contributions_insert" ON public.contributions FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "contributions_update" ON public.contributions FOR UPDATE USING (
  user_id = auth.uid() OR
  tontine_id IN (SELECT tontine_id FROM public.tontine_members WHERE user_id = auth.uid() AND role IN ('admin', 'treasurer'))
);
