-- ArtlyPet Database Schema
-- Run this in Supabase SQL Editor after creating your project

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Function to generate referral codes
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := 'ARTLY-';
  i INTEGER;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT DEFAULT '',
  avatar_url TEXT,
  credits INTEGER DEFAULT 3,
  subscription TEXT DEFAULT 'free' CHECK (subscription IN ('free', 'creator', 'pro')),
  resolution_max TEXT DEFAULT 'hd' CHECK (resolution_max IN ('hd', '4k')),
  referral_code TEXT UNIQUE DEFAULT generate_referral_code(),
  referred_by UUID REFERENCES users(id),
  referral_credits_earned INTEGER DEFAULT 0,
  credits_reset_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Portraits table
CREATE TABLE IF NOT EXISTS portraits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mode TEXT NOT NULL CHECK (mode IN ('pets', 'humans', 'mix')),
  style TEXT NOT NULL,
  input_image_urls TEXT[] NOT NULL,
  output_image_url TEXT,
  output_image_4k_url TEXT,
  resolution TEXT DEFAULT 'hd' CHECK (resolution IN ('hd', '4k')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'generating', 'completed', 'failed')),
  is_watermarked BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_session_id TEXT,
  type TEXT NOT NULL CHECK (type IN ('credits', 'print', 'subscription')),
  amount_eur NUMERIC(10, 2),
  credits_added INTEGER DEFAULT 0,
  coupon_code TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Print orders table
CREATE TABLE IF NOT EXISTS print_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  portrait_id UUID NOT NULL REFERENCES portraits(id),
  provider_order_id TEXT,
  size TEXT NOT NULL,
  price_eur NUMERIC(10, 2) NOT NULL,
  shipping_address JSONB,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered')),
  tracking_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Discount codes table
CREATE TABLE IF NOT EXISTS discount_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed')),
  value NUMERIC(10, 2) NOT NULL,
  max_uses INTEGER,
  used_count INTEGER DEFAULT 0,
  valid_from TIMESTAMPTZ DEFAULT now(),
  valid_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referred_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'signed_up' CHECK (status IN ('signed_up', 'converted')),
  credits_awarded BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_portraits_user_id ON portraits(user_id);
CREATE INDEX IF NOT EXISTS idx_portraits_status ON portraits(status);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_print_orders_user_id ON print_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_id ON referrals(referred_id);
CREATE INDEX IF NOT EXISTS idx_discount_codes_code ON discount_codes(code);
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);

-- Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE portraits ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE print_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can read own portraits" ON portraits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own portraits" ON portraits FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can read own print orders" ON print_orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own print orders" ON print_orders FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own referrals" ON referrals FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

-- Discount codes are publicly readable for validation
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can validate discount codes" ON discount_codes FOR SELECT USING (true);

-- Storage buckets (run these after schema)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('portraits', 'portraits', true);

-- Storage policies
-- CREATE POLICY "Users can upload files" ON storage.objects FOR INSERT WITH CHECK (auth.uid()::text = (storage.foldername(name))[1] AND bucket_id = 'uploads');
-- CREATE POLICY "Users can read own uploads" ON storage.objects FOR SELECT USING (auth.uid()::text = (storage.foldername(name))[1] AND bucket_id = 'uploads');
-- CREATE POLICY "Anyone can read portraits" ON storage.objects FOR SELECT USING (bucket_id = 'portraits');
