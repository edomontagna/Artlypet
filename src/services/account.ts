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

export const exportUserData = async (): Promise<void> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Not authenticated");

  const res = await supabase.functions.invoke("export-user-data");

  if (res.error) throw res.error;

  const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `artlypet-data-export-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
};
