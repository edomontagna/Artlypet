-- ============================================
-- Artlypet — Referral System
-- ============================================

-- 1. Add referral columns to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES public.profiles(id);

-- Add audit event type for referral
ALTER TYPE public.audit_event_type ADD VALUE IF NOT EXISTS 'referral_bonus_granted';
ALTER TYPE public.transaction_type ADD VALUE IF NOT EXISTS 'referral_bonus';

-- 2. Function to generate random referral code (6 chars)
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  _code TEXT;
  _exists BOOLEAN;
BEGIN
  LOOP
    _code := upper(substr(md5(random()::text), 1, 6));
    SELECT EXISTS(SELECT 1 FROM profiles WHERE referral_code = _code) INTO _exists;
    EXIT WHEN NOT _exists;
  END LOOP;
  RETURN _code;
END;
$$;

-- 3. Update handle_new_user to generate referral code + process referrals
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _profile_id UUID;
  _ref_code TEXT;
  _referrer_profile RECORD;
  _referral_bonus INTEGER := 150;
BEGIN
  -- Generate unique referral code
  _ref_code := public.generate_referral_code();

  -- Create profile with 300 free credits + referral code
  INSERT INTO public.profiles (user_id, display_name, referral_code)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)), _ref_code)
  RETURNING id INTO _profile_id;

  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');

  -- Log signup bonus
  INSERT INTO public.credit_transactions (user_id, type, amount, balance_after, description)
  VALUES (NEW.id, 'signup_bonus', 300, 300, 'Welcome bonus — 300 free credits');

  INSERT INTO public.audit_log (user_id, event_type, metadata)
  VALUES (NEW.id, 'signup_bonus_granted', jsonb_build_object('credits', 300));

  -- Process referral if ref code was provided
  IF NEW.raw_user_meta_data->>'referral_code' IS NOT NULL THEN
    SELECT * INTO _referrer_profile FROM profiles
    WHERE referral_code = NEW.raw_user_meta_data->>'referral_code';

    IF _referrer_profile.id IS NOT NULL THEN
      -- Link profiles
      UPDATE profiles SET referred_by = _referrer_profile.id WHERE id = _profile_id;

      -- Bonus to new user (+150 credits)
      UPDATE profiles SET credit_balance = credit_balance + _referral_bonus WHERE id = _profile_id;
      INSERT INTO credit_transactions (user_id, type, amount, balance_after, description)
      VALUES (NEW.id, 'referral_bonus', _referral_bonus, 300 + _referral_bonus,
              'Referral bonus — invited by ' || _referrer_profile.display_name);

      -- Bonus to referrer (+150 credits)
      UPDATE profiles SET credit_balance = credit_balance + _referral_bonus
      WHERE user_id = _referrer_profile.user_id;
      INSERT INTO credit_transactions (user_id, type, amount, balance_after, description)
      VALUES (_referrer_profile.user_id, 'referral_bonus', _referral_bonus,
              _referrer_profile.credit_balance + _referral_bonus,
              'Referral bonus — ' || COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)) || ' joined');

      -- Audit log
      INSERT INTO audit_log (user_id, event_type, metadata)
      VALUES (_referrer_profile.user_id, 'referral_bonus_granted',
              jsonb_build_object('referred_user_id', NEW.id, 'bonus', _referral_bonus));
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- 4. Generate referral codes for existing users who don't have one
UPDATE profiles SET referral_code = public.generate_referral_code() WHERE referral_code IS NULL;

-- 5. Index for fast referral lookups
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON profiles(referral_code);
CREATE INDEX IF NOT EXISTS idx_profiles_referred_by ON profiles(referred_by);
