import { supabase } from "@/lib/supabase";

const BUCKET = "product-images";

/** Uploads a blob to Supabase Storage and returns its public URL. */
export async function uploadImage(blob: Blob, folder: string): Promise<string> {
  const ext = blob.type === "image/png" ? "png" : "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, {
    contentType: blob.type,
    cacheControl: "31536000",
  });
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/** Best-effort delete — safely no-ops on legacy base64 strings (not a storage URL). */
export async function deleteImageByUrl(url: string): Promise<void> {
  try {
    const marker = `/object/public/${BUCKET}/`;
    const idx = url.indexOf(marker);
    if (idx === -1) return;
    const path = url.slice(idx + marker.length);
    await supabase.storage.from(BUCKET).remove([path]);
  } catch (err) {
    console.error("Failed to delete storage image:", err);
  }
}