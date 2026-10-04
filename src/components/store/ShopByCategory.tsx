import { Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import type { Category, Subcategory } from "@/data/products";

type CategoryTile = {
  key: string;
  label: string;
  category?: Category;
  subcategory?: Subcategory;
};

const TILES: CategoryTile[] = [
  { key: "men", label: "Men", category: "Men" },
  { key: "women", label: "Women", category: "Women" },
  { key: "kids", label: "Kids", category: "Kids" },
  { key: "unstitched", label: "Unstitched", subcategory: "Unstitched" },
];

export function ShopByCategory() {
  const { products } = useStore();

  const tiles = TILES.map((t) => {
    const product = products.find(
      (p) =>
        (t.category ? p.category === t.category : true) &&
        (t.subcategory ? p.subcategory === t.subcategory : true),
    );
    return { ...t, image: product?.image };
  });

  if (tiles.every((t) => !t.image)) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-accent">
          Shop by Category
        </p>
        <h2 className="font-display mt-2 text-3xl font-medium sm:text-4xl">
          Explore our collections
        </h2>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {tiles.map((t) =>
          t.image ? (
            <Link
              key={t.key}
              to="/collections"
              search={t.category ? { category: t.category } : { subcategory: t.subcategory }}
              className="group relative block aspect-[3/4] overflow-hidden bg-secondary"
            >
              <img
                src={t.image}
                alt={t.label}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-transparent" />
              <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-sm font-medium uppercase tracking-[0.12em] text-white">
                {t.label}
              </span>
            </Link>
          ) : null,
        )}
      </div>
    </section>
  );
}