import { supabase } from "@/integrations/supabase/client";

export const getPortraitCount = async (): Promise<number> => {
  const { count, error } = await supabase
    .from("generated_images")
    .select("*", { count: "exact", head: true })
    .eq("status", "completed");

  if (error) throw error;
  return count ?? 0;
};
