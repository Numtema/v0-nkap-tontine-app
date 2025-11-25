-- Create profiles table for user management
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

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Allow users to view other profiles (for tontine members)
CREATE POLICY "profiles_select_public" ON public.profiles FOR SELECT USING (true);
