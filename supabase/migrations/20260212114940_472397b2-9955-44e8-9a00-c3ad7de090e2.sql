
-- ============================================
-- Artlypet Database Schema — Phase 1
-- ============================================

-- 1. ENUM TYPES
CREATE TYPE public.app_role AS ENUM ('user', 'admin');
CREATE TYPE public.generation_status AS ENUM ('pending', 'processing', 'completed', 'failed');
CREATE TYPE public.transaction_type AS ENUM ('purchase', 'deduction', 'refund');
CREATE TYPE public.print_order_status AS ENUM ('pending', 'paid', 'shipped', 'delivered');
CREATE TYPE public.audit_event_type AS ENUM (
  'login_attempt', 'login_success', 'login_failed',
  'credit_purchase', 'credit_deduction', 'credit_refund',
  'generation_requested', 'generation_completed', 'generation_failed',
  'print_order_created', 'print_order_paid',
  'account_locked', 'account_deleted'
);

-- 2. PROFILES TABLE
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  credit_balance INTEGER NOT NULL DEFAULT 0 CHECK (credit_balance >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. USER ROLES TABLE
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- Security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Admin policies using has_role
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- 4. STYLES TABLE
CREATE TABLE public.styles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  prompt_template TEXT NOT NULL,
  preview_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.styles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active styles" ON public.styles FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage styles" ON public.styles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 5. CREDIT TRANSACTIONS TABLE
CREATE TABLE public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type transaction_type NOT NULL,
  amount INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  idempotency_key TEXT UNIQUE,
  stripe_session_id TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions" ON public.credit_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all transactions" ON public.credit_transactions FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_credit_transactions_user_id ON public.credit_transactions(user_id);
CREATE INDEX idx_credit_transactions_idempotency ON public.credit_transactions(idempotency_key);

-- 6. IMAGE ORIGINALS TABLE
CREATE TABLE public.image_originals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '30 days'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.image_originals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own originals" ON public.image_originals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own originals" ON public.image_originals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own originals" ON public.image_originals FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all originals" ON public.image_originals FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_image_originals_user_id ON public.image_originals(user_id);
CREATE INDEX idx_image_originals_expires ON public.image_originals(expires_at);

-- 7. GENERATED IMAGES TABLE
CREATE TABLE public.generated_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  original_id UUID REFERENCES public.image_originals(id) ON DELETE SET NULL,
  style_id UUID REFERENCES public.styles(id) ON DELETE SET NULL,
  custom_prompt TEXT,
  improved_prompt TEXT,
  status generation_status NOT NULL DEFAULT 'pending',
  storage_path TEXT,
  error_message TEXT,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '30 days'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);
ALTER TABLE public.generated_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own generations" ON public.generated_images FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own generations" ON public.generated_images FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all generations" ON public.generated_images FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update all generations" ON public.generated_images FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_generated_images_user_id ON public.generated_images(user_id);
CREATE INDEX idx_generated_images_status ON public.generated_images(status);
CREATE INDEX idx_generated_images_expires ON public.generated_images(expires_at);

-- 8. PRINT ORDERS TABLE
CREATE TABLE public.print_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  generated_image_id UUID NOT NULL REFERENCES public.generated_images(id),
  status print_order_status NOT NULL DEFAULT 'pending',
  stripe_session_id TEXT UNIQUE,
  idempotency_key TEXT UNIQUE,
  price_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'eur',
  shipping_encrypted TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.print_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders" ON public.print_orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own orders" ON public.print_orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all orders" ON public.print_orders FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update all orders" ON public.print_orders FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_print_orders_user_id ON public.print_orders(user_id);
CREATE INDEX idx_print_orders_status ON public.print_orders(status);

-- 9. AUDIT LOG TABLE
CREATE TABLE public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type audit_event_type NOT NULL,
  ip_address INET,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit log" ON public.audit_log FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Service role can insert audit log" ON public.audit_log FOR INSERT WITH CHECK (true);

CREATE INDEX idx_audit_log_user_id ON public.audit_log(user_id);
CREATE INDEX idx_audit_log_event_type ON public.audit_log(event_type);
CREATE INDEX idx_audit_log_created_at ON public.audit_log(created_at);

-- 10. UPDATED_AT TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_print_orders_updated_at BEFORE UPDATE ON public.print_orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 11. AUTO-CREATE PROFILE + ROLE ON SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 12. SEED STYLES
INSERT INTO public.styles (name, description, prompt_template, sort_order) VALUES
  ('Oil Painting', 'Classic museum-quality oil painting with rich textures and deep colors', 'Transform this pet photo into a classical oil painting style with rich brush strokes, deep shadows, and warm golden tones reminiscent of Dutch Golden Age masters', 1),
  ('Watercolor', 'Soft, flowing watercolor with delicate washes and gentle transitions', 'Transform this pet photo into a delicate watercolor painting with soft color washes, gentle blending, and artistic splashes of color', 2),
  ('Pop Art', 'Bold, vibrant pop art inspired by Warhol and Lichtenstein', 'Transform this pet photo into bold pop art style with vibrant neon colors, strong outlines, and graphic halftone patterns inspired by Andy Warhol', 3),
  ('Renaissance', 'Regal Renaissance portrait with dramatic lighting and noble bearing', 'Transform this pet photo into a Renaissance-style portrait with dramatic chiaroscuro lighting, noble bearing, and rich period costume elements', 4),
  ('Art Nouveau', 'Elegant flowing lines and organic forms in the Art Nouveau tradition', 'Transform this pet photo into Art Nouveau style with elegant flowing lines, organic floral motifs, and decorative ornamental borders', 5),
  ('Impressionist', 'Light-dappled scenes with visible brushwork and vibrant color', 'Transform this pet photo into an Impressionist painting with visible brushwork, dappled light effects, and vibrant color palette inspired by Monet', 6),
  ('Stained Glass', 'Luminous stained glass window design with bold colors and leading', 'Transform this pet photo into a stained glass window design with bold jewel-toned colors, black leading lines, and luminous translucent effects', 7),
  ('Pencil Sketch', 'Detailed graphite pencil drawing with fine shading and texture', 'Transform this pet photo into a detailed pencil sketch with fine graphite shading, cross-hatching, and realistic texture work', 8);

-- 13. STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public) VALUES ('pet-originals', 'pet-originals', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('generated-images', 'generated-images', false);

-- Storage RLS policies
CREATE POLICY "Users can upload own pet photos" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'pet-originals' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own pet photos" ON storage.objects FOR SELECT
  USING (bucket_id = 'pet-originals' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own pet photos" ON storage.objects FOR DELETE
  USING (bucket_id = 'pet-originals' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own generated images" ON storage.objects FOR SELECT
  USING (bucket_id = 'generated-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Service can upload generated images" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'generated-images');
