import { supabase } from "@/integrations/supabase/client";

export const getCreditBalance = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("credit_balance")
    .eq("user_id", userId)
    .single();
  if (error) throw error;
  if (!data) throw new Error("Profile not found");
  return data.credit_balance;
};

export const getCreditTransactions = (
  userId: string,
  page = 0,
  pageSize = 20,
) =>
  supabase
    .from("credit_transactions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(page * pageSize, (page + 1) * pageSize - 1);
