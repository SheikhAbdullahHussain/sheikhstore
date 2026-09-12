import { supabase } from "@/lib/supabase";

export type Subscriber = {
  id: string;
  email: string;
  createdAt: string;
};

type RawSubscriberRow = {
  id: string;
  email: string;
  created_at: string;
};

export async function insertSubscriber(email: string): Promise<void> {
  const { error } = await supabase.from("subscribers").insert({ email });
  if (error) throw error;
}

export async function fetchSubscribers(): Promise<Subscriber[]> {
  const { data, error } = await supabase
    .from("subscribers")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as RawSubscriberRow[]).map((r) => ({
    id: r.id,
    email: r.email,
    createdAt: r.created_at,
  }));
}

export async function deleteSubscriber(id: string): Promise<void> {
  const { error } = await supabase.from("subscribers").delete().eq("id", id);
  if (error) throw error;
}