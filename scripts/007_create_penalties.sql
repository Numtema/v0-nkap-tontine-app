-- Create penalties table
CREATE TABLE IF NOT EXISTS public.penalties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tontine_id UUID NOT NULL REFERENCES public.tontines(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('late_payment', 'absence', 'early_withdrawal', 'rule_violation', 'other')),
  amount DECIMAL(15, 2) NOT NULL,
  reason TEXT,
  session_number INTEGER,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'waived', 'disputed')),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.penalties ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "penalties_select" ON public.penalties FOR SELECT USING (
  user_id = auth.uid() OR
  tontine_id IN (SELECT tontine_id FROM public.tontine_members WHERE user_id = auth.uid())
);
CREATE POLICY "penalties_insert" ON public.penalties FOR INSERT WITH CHECK (
  tontine_id IN (SELECT tontine_id FROM public.tontine_members WHERE user_id = auth.uid() AND role IN ('admin', 'president', 'treasurer'))
);
CREATE POLICY "penalties_update" ON public.penalties FOR UPDATE USING (
  user_id = auth.uid() OR
  tontine_id IN (SELECT tontine_id FROM public.tontine_members WHERE user_id = auth.uid() AND role IN ('admin', 'president', 'treasurer'))
);
