-- Create caisses (fund categories) table
CREATE TABLE IF NOT EXISTS public.caisses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tontine_id UUID NOT NULL REFERENCES public.tontines(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'custom' CHECK (type IN ('main', 'epargne', 'bonheur', 'solidarite', 'custom')),
  description TEXT,
  contribution_amount DECIMAL(15, 2) DEFAULT 0,
  balance DECIMAL(15, 2) DEFAULT 0,
  is_mandatory BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.caisses ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "caisses_select" ON public.caisses FOR SELECT USING (
  tontine_id IN (SELECT tontine_id FROM public.tontine_members WHERE user_id = auth.uid())
);
CREATE POLICY "caisses_insert" ON public.caisses FOR INSERT WITH CHECK (
  tontine_id IN (SELECT tontine_id FROM public.tontine_members WHERE user_id = auth.uid() AND role IN ('admin', 'president', 'treasurer'))
);
CREATE POLICY "caisses_update" ON public.caisses FOR UPDATE USING (
  tontine_id IN (SELECT tontine_id FROM public.tontine_members WHERE user_id = auth.uid() AND role IN ('admin', 'president', 'treasurer'))
);
CREATE POLICY "caisses_delete" ON public.caisses FOR DELETE USING (
  tontine_id IN (SELECT tontine_id FROM public.tontine_members WHERE user_id = auth.uid() AND role IN ('admin', 'president'))
);
