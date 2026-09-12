export type Category = "Men" | "Women" | "Toddlers";
export type Subcategory = "Stitched (Ready to Wear)" | "Unstitched";

export type Product = {
  id: string;
  title: string;
  price: number;
  compareAt?: number | undefined;
  category: Category;
  /** Only meaningful for Men/Women — Toddlers has no subcategory. */
  subcategory?: Subcategory | undefined;
  description: string;
  image: string;
  /** Optional gallery — admin-uploaded images from their device. images[0] mirrors `image`. */
  images?: string[] | undefined;
  rating: number;
  reviews: number;
  /** 0 = out of stock, any positive number = in stock. */
  stock: number;
  sizes?: string[] | undefined;
  colors?: string[] | undefined;
  featured?: boolean | undefined;
};

export const CATEGORIES: Array<"All" | Category> = ["All", "Men", "Women", "Toddlers"];
export const SUBCATEGORIES: Subcategory[] = ["Stitched (Ready to Wear)", "Unstitched"];

export const productSlug = (p: Pick<Product, "title">) =>
  p.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");