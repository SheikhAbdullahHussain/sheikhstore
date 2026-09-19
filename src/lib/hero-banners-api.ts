import { supabase } from "@/lib/supabase";

/** Map of slideKey -> uploaded banner image (data URL). */
export async function fetchHeroBanners(): Promise<Record<string, string>> {
  const { data, error } = await supabase.from("hero_banners").select("slide_key, image");
  if (error) throw error;
  const map: Record<string, string> = {};
  for (const row of data as { slide_key: string; image: string }[]) {
    map[row.slide_key] = row.image;
  }
  return map;
}

export async function upsertHeroBanner(slideKey: string, image: string): Promise<void> {
  const { error } = await supabase
    .from("hero_banners")
    .upsert({ slide_key: slideKey, image, updated_at: new Date().toISOString() });
  if (error) throw error;
}

export async function deleteHeroBanner(slideKey: string): Promise<void> {
  const { error } = await supabase.from("hero_banners").delete().eq("slide_key", slideKey);
  if (error) throw error;
}