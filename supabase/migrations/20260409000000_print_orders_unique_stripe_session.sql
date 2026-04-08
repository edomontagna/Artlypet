-- Prevent duplicate print orders from webhook retries
ALTER TABLE public.print_orders
  ADD CONSTRAINT print_orders_stripe_session_id_unique UNIQUE (stripe_session_id);
