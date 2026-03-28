import { supabase } from "@/integrations/supabase/client";
import type { GenerationType } from "@/lib/constants";

export const getGenerations = (
  userId: string,
  page = 0,
  pageSize = 12,
) =>
  supabase
    .from("generated_images")
    .select("*, styles(name), image_originals(storage_path)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(page * pageSize, (page + 1) * pageSize - 1);

export const getGeneration = (id: string) =>
  supabase
    .from("generated_images")
    .select("*, styles(name), image_originals(storage_path)")
    .eq("id", id)
    .single();

export const requestGeneration = async (
  originalId: string,
  styleId: string,
  generationType: GenerationType = "single",
  originalId2?: string,
) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Not authenticated");

  const res = await supabase.functions.invoke("generate-portrait", {
    body: { original_id: originalId, style_id: styleId, generation_type: generationType, original_id_2: originalId2 },
  });

  if (res.error) throw res.error;
  return res.data;
};

export const checkGenerationStatus = async (generationId: string) => {
  const res = await supabase.functions.invoke("check-generation-status", {
    body: { id: generationId },
  });
  if (res.error) throw res.error;
  return res.data;
};

export const getServedImage = async (generationId: string) => {
  const res = await supabase.functions.invoke("serve-image", {
    body: { generation_id: generationId },
  });
  if (res.error) throw res.error;
  return res.data as { mode: "hd" | "watermarked"; url: string; watermark?: string; maxDisplaySize?: number };
};

export const deleteGeneration = async (id: string) => {
  const { error } = await supabase
    .from("generated_images")
    .delete()
    .eq("id", id);
  if (error) throw error;
};

export const getShareData = async (generationId: string) => {
  const res = await supabase.functions.invoke("get-share-data", {
    body: { generation_id: generationId },
  });
  if (res.error) throw res.error;
  return res.data as { imageUrl: string; styleName: string | null };
};

export const purchaseHdImage = async (generationId: string) => {
  const res = await supabase.functions.invoke("purchase-hd-image", {
    body: { generation_id: generationId },
  });
  if (res.error) throw res.error;
  return res.data as { url: string };
};
