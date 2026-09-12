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