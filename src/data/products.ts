export type Category = "Men" | "Women" | "Kids";
export type ClothingType = "Stitched (Ready to Wear)" | "Unstitched";
export type KidsGender = "Boys" | "Girls";
export type Subcategory = ClothingType | KidsGender;

export type Measurements = {
  chest?: string;
  length?: string;
  shoulder?: string;
  waist?: string;
  sleeve?: string;
};

export type Product = {
  id: string;
  title: string;
  price: number;
  compareAt?: number | undefined;
  category: Category;
  /** Men/Women -> Stitched/Unstitched. Kids -> Boys/Girls. */
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
  /** Optional garment measurements (chest, length, shoulder, waist, sleeve). */
  measurements?: Measurements | undefined;
  featured?: boolean | undefined;
};

export const CATEGORIES: Array<"All" | Category> = ["All", "Men", "Women", "Kids"];
export const CLOTHING_TYPES: ClothingType[] = ["Stitched (Ready to Wear)", "Unstitched"];
export const KIDS_GENDERS: KidsGender[] = ["Boys", "Girls"];

export const productSlug = (p: Pick<Product, "title">) =>
  p.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");