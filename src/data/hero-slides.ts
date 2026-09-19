import type { Category, Subcategory } from "./products";

export type HeroSlideDef = {
  key: string;
  label: string;
  category: Category;
  subcategory?: Subcategory;
};

// One slot per slide. Both HeroSlider.tsx (storefront) and admin.tsx
// (banner upload) share this list so they never drift out of sync.
export const HERO_SLIDES: HeroSlideDef[] = [
  {
    key: "men-stitched",
    label: "Men — Stitched (Ready to Wear)",
    category: "Men",
    subcategory: "Stitched (Ready to Wear)",
  },
  { key: "men-unstitched", label: "Men — Unstitched", category: "Men", subcategory: "Unstitched" },
  {
    key: "women-stitched",
    label: "Women — Stitched (Ready to Wear)",
    category: "Women",
    subcategory: "Stitched (Ready to Wear)",
  },
  {
    key: "women-unstitched",
    label: "Women — Unstitched",
    category: "Women",
    subcategory: "Unstitched",
  },
  { key: "kids-boys", label: "Kids — Boys", category: "Kids", subcategory: "Boys" },
  { key: "kids-girls", label: "Kids — Girls", category: "Kids", subcategory: "Girls" },
];