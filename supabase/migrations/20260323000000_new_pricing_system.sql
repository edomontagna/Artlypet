-- ============================================
-- Artlypet — New Pricing System Migration
-- Freemium model with HD tiers and watermark
-- ============================================

-- 1. NEW ENUM TYPES
CREATE TYPE public.plan_type AS ENUM ('free', 'premium', 'business');
CREATE TYPE public.generation_type AS ENUM ('single', 'mix');

-- Add signup_bonus to existing transaction_type enum
ALTER TYPE public.transaction_type ADD VALUE IF NOT EXISTS 'signup_bonus';

-- Add new audit event types
ALTER TYPE public.audit_event_type ADD VALUE IF NOT EXISTS 'signup_bonus_granted';
ALTER TYPE public.audit_event_type ADD VALUE IF NOT EXISTS 'hd_unlock_purchased';
ALTER TYPE public.audit_event_type ADD VALUE IF NOT EXISTS 'premium_purchased';
ALTER TYPE public.audit_event_type ADD VALUE IF NOT EXISTS 'plan_upgraded';

-- 2. ALTER PROFILES TABLE
ALTER TABLE public.profiles
  ADD COLUMN plan_type public.plan_type NOT NULL DEFAULT 'free',
  ADD COLUMN premium_purchased_at TIMESTAMPTZ;

-- Change default credit_balance from 0 to 300 for new users
ALTER TABLE public.profiles ALTER COLUMN credit_balance SET DEFAULT 300;

-- Protect plan_type from client modification (update the existing RLS policy)
DROP POLICY IF EXISTS "Users can update own profile (no credits)" ON public.profiles;

CREATE POLICY "Users can update own profile (restricted)"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND credit_balance = (SELECT credit_balance FROM profiles WHERE user_id = auth.uid())
    AND plan_type = (SELECT plan_type FROM profiles WHERE user_id = auth.uid())
  );

-- 3. ALTER GENERATED_IMAGES TABLE
ALTER TABLE public.generated_images
  ADD COLUMN is_hd_unlocked BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN generation_type public.generation_type NOT NULL DEFAULT 'single',
  ADD COLUMN hd_stripe_session_id TEXT;

-- 4. UPDATE handle_new_user() TRIGGER to grant 300 credits + log signup bonus
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _profile_id UUID;
BEGIN
  -- Create profile with 300 free credits (via default)
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)))
  RETURNING id INTO _profile_id;

  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');

  -- Log the signup bonus transaction
  INSERT INTO public.credit_transactions (user_id, type, amount, balance_after, description)
  VALUES (NEW.id, 'signup_bonus', 300, 300, 'Welcome bonus — 300 free credits');

  -- Audit log
  INSERT INTO public.audit_log (user_id, event_type, metadata)
  VALUES (NEW.id, 'signup_bonus_granted', jsonb_build_object('credits', 300));

  RETURN NEW;
END;
$$;

-- 5. STORAGE: Create watermarked-images bucket for cached low-res versions
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('watermarked-images', 'watermarked-images', false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Service role policies for watermarked-images bucket
CREATE POLICY "Service role manages watermarked images"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'watermarked-images')
WITH CHECK (bucket_id = 'watermarked-images');

-- Users can read their own watermarked images
CREATE POLICY "Users read own watermarked"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'watermarked-images' AND auth.uid()::text = (storage.foldername(name))[1]);
