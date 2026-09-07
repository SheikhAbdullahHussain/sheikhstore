import { supabase } from "@/lib/supabase";
import type { Category, Product } from "@/data/products";

type ProductRow = {
  id: string;
  title: string;
  price: number;
  compare_at: number | null;
  category: Category;
  description: string;
  image: string;
  images: string[] | null;
  rating: number;
  reviews: number;
  stock: number;
  sizes: string[] | null;
  colors: string[] | null;
  featured: boolean;
};

function rowToProduct(r: ProductRow): Product {
  return {
    id: r.id,
    title: r.title,
    price: Number(r.price),
    compareAt: r.compare_at ?? undefined,
    category: r.category,
    description: r.description,
    image: r.image,
    images: r.images ?? undefined,
    rating: Number(r.rating),
    reviews: r.reviews,
    stock: r.stock,
    sizes: r.sizes ?? undefined,
    colors: r.colors ?? undefined,
    featured: r.featured ?? undefined,
  };
}

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as ProductRow[]).map(rowToProduct);
}

export async function insertProduct(
  p: Omit<Product, "id" | "rating" | "reviews">,
): Promise<Product> {
  const { data, error } = await supabase
    .from("products")
    .insert({
      title: p.title,
      price: p.price,
      compare_at: p.compareAt ?? null,
      category: p.category,
      description: p.description,
      image: p.image,
      images: p.images ?? null,
      stock: p.stock,
      sizes: p.sizes ?? null,
      colors: p.colors ?? null,
      featured: p.featured ?? false,
      rating: 5,
      reviews: 0,
    })
    .select()
    .single();
  if (error) throw error;
  return rowToProduct(data as ProductRow);
}

export async function updateProductRow(
  id: string,
  patch: Partial<Product>,
): Promise<Product> {
  const payload: Record<string, unknown> = {};
  if (patch.title !== undefined) payload.title = patch.title;
  if (patch.price !== undefined) payload.price = patch.price;
  if (patch.compareAt !== undefined) payload.compare_at = patch.compareAt;
  if (patch.category !== undefined) payload.category = patch.category;
  if (patch.description !== undefined) payload.description = patch.description;
  if (patch.image !== undefined) payload.image = patch.image;
  if (patch.images !== undefined) payload.images = patch.images;
  if (patch.stock !== undefined) payload.stock = patch.stock;
  if (patch.sizes !== undefined) payload.sizes = patch.sizes;
  if (patch.colors !== undefined) payload.colors = patch.colors;
  if (patch.featured !== undefined) payload.featured = patch.featured;

  const { data, error } = await supabase
    .from("products")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return rowToProduct(data as ProductRow);
}

export async function deleteProductRow(id: string): Promise<void> {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}