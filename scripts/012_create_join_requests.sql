-- Create join requests table
CREATE TABLE IF NOT EXISTS public.join_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tontine_id UUID NOT NULL REFERENCES public.tontines(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tontine_id, user_id)
);

-- Enable RLS
ALTER TABLE public.join_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "join_requests_select" ON public.join_requests FOR SELECT USING (
  user_id = auth.uid() OR
  tontine_id IN (SELECT tontine_id FROM public.tontine_members WHERE user_id = auth.uid() AND role IN ('admin', 'president'))
);
CREATE POLICY "join_requests_insert" ON public.join_requests FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "join_requests_update" ON public.join_requests FOR UPDATE USING (
  tontine_id IN (SELECT tontine_id FROM public.tontine_members WHERE user_id = auth.uid() AND role IN ('admin', 'president'))
);
