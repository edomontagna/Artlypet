-- Newsletter subscribers table for email collection
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'website',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT newsletter_subscribers_email_unique UNIQUE (email)
);

-- Enable RLS
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (public signup form)
CREATE POLICY "Anyone can subscribe to newsletter"
  ON public.newsletter_subscribers
  FOR INSERT
  WITH CHECK (true);

-- Only service role can read/update/delete
-- (no SELECT policy for anon — protects email list)

-- Add is_public column to generated_images for community gallery
ALTER TABLE public.generated_images
  ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT false;

-- Index for community gallery queries
CREATE INDEX IF NOT EXISTS idx_generated_images_public
  ON public.generated_images (is_public, created_at DESC)
  WHERE is_public = true AND status = 'completed';

-- Allow authenticated users to toggle their own images' public status
CREATE POLICY "Users can update own image public status"
  ON public.generated_images
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
