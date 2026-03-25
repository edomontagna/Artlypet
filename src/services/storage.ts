import { supabase } from "@/integrations/supabase/client";

export const uploadOriginalImage = async (
  userId: string,
  file: File,
) => {
  const ext = file.name.split(".").pop();
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from("pet-originals")
    .upload(path, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) throw error;

  // Insert record in image_originals
  const { data: record, error: dbError } = await supabase
    .from("image_originals")
    .insert({
      user_id: userId,
      file_name: file.name,
      file_size: file.size,
      mime_type: file.type,
      storage_path: path,
    })
    .select()
    .single();

  if (dbError) throw dbError;
  return record;
};

export const getImageUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};

export const getSignedUrl = async (
  bucket: string,
  path: string,
  expiresIn = 3600,
) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);
  if (error) throw error;
  return data.signedUrl;
};
