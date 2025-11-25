-- Create exchange rates table
CREATE TABLE IF NOT EXISTS public.exchange_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  currency_code TEXT NOT NULL UNIQUE,
  currency_name TEXT NOT NULL,
  country TEXT NOT NULL,
  rate_to_nkap DECIMAL(15, 6) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default rates
INSERT INTO public.exchange_rates (currency_code, currency_name, country, rate_to_nkap) VALUES
  ('XAF', 'CFA Franc BEAC', 'CM', 100),
  ('XOF', 'CFA Franc BCEAO', 'SN', 100),
  ('NGN', 'Nigerian Naira', 'NG', 50),
  ('KES', 'Kenyan Shilling', 'KE', 10),
  ('GHS', 'Ghanaian Cedi', 'GH', 1),
  ('ZAR', 'South African Rand', 'ZA', 1.5),
  ('MAD', 'Moroccan Dirham', 'MA', 1),
  ('EGP', 'Egyptian Pound', 'EG', 5),
  ('TZS', 'Tanzanian Shilling', 'TZ', 200),
  ('EUR', 'Euro', 'EU', 0.15),
  ('USD', 'US Dollar', 'US', 0.16)
ON CONFLICT (currency_code) DO NOTHING;

-- Enable RLS (public read)
ALTER TABLE public.exchange_rates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "exchange_rates_select" ON public.exchange_rates FOR SELECT USING (true);
