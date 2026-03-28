import { supabase } from "@/integrations/supabase/client";

export const deleteAccount = async (): Promise<{ success: boolean }> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Not authenticated");

  const res = await supabase.functions.invoke("delete-account", {
    body: {},
  });

  if (res.error) throw res.error;
  return res.data as { success: boolean };
};
