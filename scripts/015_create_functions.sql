-- Function to increment caisse balance
CREATE OR REPLACE FUNCTION increment_caisse_balance(caisse_id UUID, amount DECIMAL)
RETURNS VOID AS $$
BEGIN
  UPDATE public.caisses 
  SET balance = balance + amount 
  WHERE id = caisse_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment member contribution
CREATE OR REPLACE FUNCTION increment_member_contribution(tontine_id UUID, user_id UUID, amount DECIMAL)
RETURNS VOID AS $$
BEGIN
  UPDATE public.tontine_members 
  SET total_contributed = total_contributed + amount 
  WHERE tontine_members.tontine_id = increment_member_contribution.tontine_id 
  AND tontine_members.user_id = increment_member_contribution.user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment nkap balance
CREATE OR REPLACE FUNCTION increment_nkap_balance(user_id UUID, amount DECIMAL)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles 
  SET nkap_balance = nkap_balance + amount,
      updated_at = NOW()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to decrement nkap balance
CREATE OR REPLACE FUNCTION decrement_nkap_balance(user_id UUID, amount DECIMAL)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles 
  SET nkap_balance = nkap_balance - amount,
      updated_at = NOW()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
