// import coat from "@/assets/p-coat.jpg";
// import watch from "@/assets/p-watch.jpg";
// import headphones from "@/assets/p-headphones.jpg";
// import bag from "@/assets/p-bag.jpg";
// import sunglasses from "@/assets/p-sunglasses.jpg";
// import sneakers from "@/assets/p-sneakers.jpg";
// import scarf from "@/assets/p-scarf.jpg";

export type Category = "Clothing" | "Accessories" | "Electronics";

export type Product = {
  id: string;
  title: string;
  price: number;
  compareAt?: number | undefined;
  category: Category;
  description: string;
  image: string;
  /** Optional gallery — admin-uploaded images from their device. images[0] mirrors `image`. */
  images?: string[] | undefined;
  rating: number;
  reviews: number;
  stock: number;
  sizes?: string[] | undefined;
  colors?: string[] | undefined;
  featured?: boolean | undefined;
};

export const CATEGORIES: Array<"All" | Category> = [
  "All",
  "Clothing",
  "Accessories",
  "Electronics",
];

export const productSlug = (p: Pick<Product, "title">) =>
  p.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const seedProducts: Product[] = [
  // {
  //   id: "sk-001",
  //   title: "Heritage Wool Overcoat",
  //   price: 289,
  //   compareAt: 420,
  //   category: "Clothing",
  //   description:
  //     "Tailored from a dense Italian wool blend with a clean notch lapel and a half-canvas construction that holds its shape season after season. Fully lined, with interior pockets and horn-finish buttons.",
  //   image: coat,
  //   rating: 4.8,
  //   reviews: 214,
  //   stock: 18,
  //   sizes: ["S", "M", "L", "XL"],
  //   colors: ["Charcoal", "Camel", "Black"],
  //   featured: true,
  // },
  // {
  //   id: "sk-002",
  //   title: "Astra Gold Automatic Watch",
  //   price: 549,
  //   compareAt: 720,
  //   category: "Accessories",
  //   description:
  //     "A 39mm brushed gold case paired with a hand-stitched leather strap and sapphire crystal. Automatic movement with a 42-hour power reserve and 50m water resistance.",
  //   image: watch,
  //   rating: 4.9,
  //   reviews: 388,
  //   stock: 9,
  //   colors: ["Cognac", "Espresso"],
  //   featured: true,
  // },
  // {
  //   id: "sk-003",
  //   title: "Nocturne Studio Headphones",
  //   price: 329,
  //   compareAt: 449,
  //   category: "Electronics",
  //   description:
  //     "Adaptive noise cancellation, 40mm bio-cellulose drivers and 38 hours of playback. Memory foam earcups wrapped in lambskin for all-day listening comfort.",
  //   image: headphones,
  //   rating: 4.7,
  //   reviews: 512,
  //   stock: 26,
  //   colors: ["Matte Black", "Brass"],
  //   featured: true,
  // },
  // {
  //   id: "sk-004",
  //   title: "Voyager Leather Duffle",
  //   price: 419,
  //   compareAt: 560,
  //   category: "Accessories",
  //   description:
  //     "Full-grain vegetable-tanned leather that patinas beautifully, with solid brass hardware, a suede-lined interior and a detachable shoulder strap. Cabin-friendly dimensions.",
  //   image: bag,
  //   rating: 4.8,
  //   reviews: 167,
  //   stock: 12,
  //   colors: ["Tan", "Dark Brown"],
  //   featured: true,
  // },
  // {
  //   id: "sk-005",
  //   title: "Meridian Acetate Sunglasses",
  //   price: 159,
  //   compareAt: 220,
  //   category: "Accessories",
  //   description:
  //     "Hand-polished Italian acetate frames with gold temple detailing and polarised CR-39 lenses offering full UV400 protection. Supplied with a leather case.",
  //   image: sunglasses,
  //   rating: 4.6,
  //   reviews: 143,
  //   stock: 34,
  //   colors: ["Tortoise", "Onyx"],
  // },
  // {
  //   id: "sk-006",
  //   title: "Atelier Low Sneakers",
  //   price: 199,
  //   compareAt: 260,
  //   category: "Clothing",
  //   description:
  //     "Minimal silhouette in soft calfskin with a cushioned cork footbed and a hand-stitched rubber sole. Designed to be worn every day and resoled, not replaced.",
  //   image: sneakers,
  //   rating: 4.5,
  //   reviews: 298,
  //   stock: 41,
  //   sizes: ["39", "40", "41", "42", "43", "44"],
  //   colors: ["Off White", "Sand"],
  // },
  // {
  //   id: "sk-007",
  //   title: "Cloudspun Cashmere Scarf",
  //   price: 129,
  //   compareAt: 180,
  //   category: "Clothing",
  //   description:
  //     "Woven from grade-A Mongolian cashmere in a two-tone rib with hand-knotted fringe. Featherweight, generously sized and warm without bulk.",
  //   image: scarf,
  //   rating: 4.9,
  //   reviews: 96,
  //   stock: 52,
  //   colors: ["Camel", "Cream"],
  // },
];