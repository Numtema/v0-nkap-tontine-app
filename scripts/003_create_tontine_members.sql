-- Create tontine members table
CREATE TABLE IF NOT EXISTS public.tontine_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tontine_id UUID NOT NULL REFERENCES public.tontines(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'president', 'secretary', 'treasurer', 'member')),
  order_number INTEGER,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'excluded')),
  total_contributed DECIMAL(15, 2) DEFAULT 0,
  total_received DECIMAL(15, 2) DEFAULT 0,
  has_received_this_cycle BOOLEAN DEFAULT FALSE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tontine_id, user_id)
);

-- Enable RLS
ALTER TABLE public.tontine_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "tontine_members_select" ON public.tontine_members FOR SELECT USING (
  user_id = auth.uid() OR
  tontine_id IN (SELECT tontine_id FROM public.tontine_members WHERE user_id = auth.uid())
);
CREATE POLICY "tontine_members_insert" ON public.tontine_members FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "tontine_members_update" ON public.tontine_members FOR UPDATE USING (
  user_id = auth.uid() OR
  tontine_id IN (SELECT tontine_id FROM public.tontine_members WHERE user_id = auth.uid() AND role IN ('admin', 'president'))
);
CREATE POLICY "tontine_members_delete" ON public.tontine_members FOR DELETE USING (
  user_id = auth.uid() OR
  tontine_id IN (SELECT tontine_id FROM public.tontine_members WHERE user_id = auth.uid() AND role IN ('admin', 'president'))
);
