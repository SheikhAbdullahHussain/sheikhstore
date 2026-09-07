import { supabase } from "@/lib/supabase";
import type { Order } from "@/lib/store";

export async function insertOrder(order: Order): Promise<void> {
  const { error } = await supabase.from("orders").insert({
    id: order.id,
    created_at: order.createdAt,
    items: order.items,
    total: order.total,
    shipping: order.shipping,
    payment: order.payment,
  });
  if (error) throw error;
}