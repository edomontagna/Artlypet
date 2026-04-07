-- Add missing index on print_orders foreign key for faster JOINs and CASCADE operations
CREATE INDEX IF NOT EXISTS idx_print_orders_generated_image_id
  ON public.print_orders(generated_image_id);
