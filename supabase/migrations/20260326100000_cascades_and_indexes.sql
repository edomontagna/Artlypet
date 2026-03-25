-- Fix missing cascade delete on print_orders → generated_images
ALTER TABLE public.print_orders
  DROP CONSTRAINT IF EXISTS print_orders_generated_image_id_fkey;

ALTER TABLE public.print_orders
  ADD CONSTRAINT print_orders_generated_image_id_fkey
    FOREIGN KEY (generated_image_id) REFERENCES public.generated_images(id) ON DELETE CASCADE;

-- Fix profiles.referred_by → profiles: set null on referrer deletion
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_referred_by_fkey;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_referred_by_fkey
    FOREIGN KEY (referred_by) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Performance index for ordering generations by created_at
CREATE INDEX IF NOT EXISTS idx_generated_images_created_at ON public.generated_images(created_at DESC);
