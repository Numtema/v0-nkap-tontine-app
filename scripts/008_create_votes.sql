-- Create elections table
CREATE TABLE IF NOT EXISTS public.elections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tontine_id UUID NOT NULL REFERENCES public.tontines(id) ON DELETE CASCADE,
  position TEXT NOT NULL CHECK (position IN ('president', 'secretary', 'treasurer')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed', 'cancelled')),
  winner_id UUID REFERENCES public.profiles(id),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);

-- Create votes table
CREATE TABLE IF NOT EXISTS public.votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  election_id UUID NOT NULL REFERENCES public.elections(id) ON DELETE CASCADE,
  voter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(election_id, voter_id)
);

-- Enable RLS
ALTER TABLE public.elections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for elections
CREATE POLICY "elections_select" ON public.elections FOR SELECT USING (
  tontine_id IN (SELECT tontine_id FROM public.tontine_members WHERE user_id = auth.uid())
);
CREATE POLICY "elections_insert" ON public.elections FOR INSERT WITH CHECK (
  tontine_id IN (SELECT tontine_id FROM public.tontine_members WHERE user_id = auth.uid() AND role IN ('admin', 'president'))
);
CREATE POLICY "elections_update" ON public.elections FOR UPDATE USING (
  tontine_id IN (SELECT tontine_id FROM public.tontine_members WHERE user_id = auth.uid() AND role IN ('admin', 'president'))
);

-- RLS Policies for votes
CREATE POLICY "votes_select" ON public.votes FOR SELECT USING (
  voter_id = auth.uid() OR
  election_id IN (SELECT id FROM public.elections WHERE tontine_id IN (SELECT tontine_id FROM public.tontine_members WHERE user_id = auth.uid()))
);
CREATE POLICY "votes_insert" ON public.votes FOR INSERT WITH CHECK (voter_id = auth.uid());
