-- Fix referral bonus race condition: use SELECT ... FOR UPDATE on referrer profile
-- This serializes concurrent referral bonus grants for the same referrer
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
  _ref_code := public.generate_referral_code();

  INSERT INTO public.profiles (user_id, display_name, referral_code)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)), _ref_code)
  RETURNING id INTO _profile_id;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');

  INSERT INTO public.credit_transactions (user_id, type, amount, balance_after, description)
  VALUES (NEW.id, 'signup_bonus', 300, 300, 'Welcome bonus — 300 free credits');

  INSERT INTO public.audit_log (user_id, event_type, metadata)
  VALUES (NEW.id, 'signup_bonus_granted', jsonb_build_object('credits', 300));

  IF NEW.raw_user_meta_data->>'referral_code' IS NOT NULL THEN
    -- FOR UPDATE locks the referrer row, preventing concurrent bonus grants
    SELECT * INTO _referrer_profile FROM profiles
    WHERE referral_code = NEW.raw_user_meta_data->>'referral_code'
    FOR UPDATE;

    IF _referrer_profile.id IS NOT NULL THEN
      UPDATE profiles SET referred_by = _referrer_profile.id WHERE id = _profile_id;

      -- Bonus to new user (+150 credits)
      UPDATE profiles SET credit_balance = credit_balance + _referral_bonus WHERE id = _profile_id;
      INSERT INTO credit_transactions (user_id, type, amount, balance_after, description)
      VALUES (NEW.id, 'referral_bonus', _referral_bonus, 300 + _referral_bonus,
              'Referral bonus — invited by ' || _referrer_profile.display_name);

      -- Bonus to referrer (+150 credits) — row is locked by FOR UPDATE above
      UPDATE profiles SET credit_balance = credit_balance + _referral_bonus
      WHERE user_id = _referrer_profile.user_id;
      INSERT INTO credit_transactions (user_id, type, amount, balance_after, description)
      VALUES (_referrer_profile.user_id, 'referral_bonus', _referral_bonus,
              _referrer_profile.credit_balance + _referral_bonus,
              'Referral bonus — ' || COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)) || ' joined');

      INSERT INTO audit_log (user_id, event_type, metadata)
      VALUES (_referrer_profile.user_id, 'referral_bonus_granted',
              jsonb_build_object('referred_user_id', NEW.id, 'bonus', _referral_bonus));
    END IF;
  END IF;

  RETURN NEW;
END;
$$;
