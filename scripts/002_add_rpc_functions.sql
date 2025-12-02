-- Function to increment caisse balance
CREATE OR REPLACE FUNCTION increment_caisse_balance(p_caisse_id UUID, p_amount NUMERIC)
RETURNS VOID AS $$
BEGIN
  UPDATE caisses 
  SET balance = balance + p_amount,
      updated_at = NOW()
  WHERE id = p_caisse_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to decrement user balance
CREATE OR REPLACE FUNCTION decrement_user_balance(p_user_id UUID, p_amount NUMERIC)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles 
  SET nkap_balance = nkap_balance - p_amount,
      updated_at = NOW()
  WHERE id = p_user_id AND nkap_balance >= p_amount;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment user balance
CREATE OR REPLACE FUNCTION increment_user_balance(p_user_id UUID, p_amount NUMERIC)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles 
  SET nkap_balance = nkap_balance + p_amount,
      updated_at = NOW()
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION increment_caisse_balance TO authenticated;
GRANT EXECUTE ON FUNCTION decrement_user_balance TO authenticated;
GRANT EXECUTE ON FUNCTION increment_user_balance TO authenticated;
