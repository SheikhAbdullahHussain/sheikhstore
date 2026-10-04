import { supabase } from "@/lib/supabase";
import type { Order } from "@/lib/store";

export type OrderStatus = "pending" | "shipped" | "delivered";

export type OrderRow = Order & { status: OrderStatus };

type RawOrderRow = {
  id: string;
  created_at: string;
  items: Order["items"];
  total: number;
  shipping: Order["shipping"];
  payment: Order["payment"];
  status: OrderStatus;
};

/**
 * Inserts an order and returns it with the id the database generated
 * (a sequential SS-000001-style id — see order-sequence-migration.sql).
 * We don't send an id in the payload; the column's default fills it in.
 */
export async function insertOrder(
  order: Omit<Order, "id">,
): Promise<{ id: string; createdAt: string }> {
  const { data, error } = await supabase
    .from("orders")
    .insert({
      items: order.items,
      total: order.total,
      shipping: order.shipping,
      payment: order.payment,
    })
    .select("id, created_at")
    .single();
  if (error) throw error;
  return { id: data.id as string, createdAt: data.created_at as string };
}

export async function fetchOrders(): Promise<OrderRow[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as RawOrderRow[]).map((r) => ({
    id: r.id,
    createdAt: r.created_at,
    items: r.items,
    total: Number(r.total),
    shipping: r.shipping,
    payment: r.payment,
    status: r.status,
  }));
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function deleteOrder(id: string): Promise<void> {
  const { error } = await supabase.from("orders").delete().eq("id", id);
  if (error) throw error;
}