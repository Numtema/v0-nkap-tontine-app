-- Create chat messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tontine_id UUID REFERENCES public.tontines(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'text' CHECK (type IN ('text', 'image', 'file', 'system', 'announcement')),
  is_pinned BOOLEAN DEFAULT FALSE,
  read_by JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "messages_select" ON public.messages FOR SELECT USING (
  sender_id = auth.uid() OR
  receiver_id = auth.uid() OR
  (tontine_id IS NOT NULL AND tontine_id IN (SELECT tontine_id FROM public.tontine_members WHERE user_id = auth.uid()))
);
CREATE POLICY "messages_insert" ON public.messages FOR INSERT WITH CHECK (sender_id = auth.uid());
CREATE POLICY "messages_update" ON public.messages FOR UPDATE USING (sender_id = auth.uid());
CREATE POLICY "messages_delete" ON public.messages FOR DELETE USING (sender_id = auth.uid());
