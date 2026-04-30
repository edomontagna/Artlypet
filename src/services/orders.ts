import { supabase } from "@/integrations/supabase/client";

export type PrintOrderStatus = "pending" | "paid" | "shipped" | "delivered";

export interface PrintOrderRow {
  id: string;
  created_at: string;
  updated_at: string;
  status: PrintOrderStatus;
  price_cents: number;
  currency: string;
  generated_image_id: string;
  stripe_session_id: string | null;
  generated_image: {
    storage_path: string | null;
    is_hd_unlocked: boolean;
    style: { name: string } | null;
  } | null;
}

/**
 * Fetch the current user's print orders with related portrait + style metadata.
 * RLS on print_orders enforces user_id = auth.uid() so this is safe.
 */
export const fetchPrintOrders = async (): Promise<PrintOrderRow[]> => {
  const { data, error } = await supabase
    .from("print_orders")
    .select(`
      id,
      created_at,
      updated_at,
      status,
      price_cents,
      currency,
      generated_image_id,
      stripe_session_id,
      generated_image:generated_images (
        storage_path,
        is_hd_unlocked,
        style:styles ( name )
      )
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as unknown as PrintOrderRow[];
};
