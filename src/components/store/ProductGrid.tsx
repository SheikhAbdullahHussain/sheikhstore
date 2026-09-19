import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CATEGORIES, CLOTHING_TYPES, KIDS_GENDERS, type Subcategory } from "@/data/products";
import { useStore } from "@/lib/store";
import { ProductCard } from "./ProductCard";

type SubcategoryFilter = Subcategory | "All";

type ProductGridProps = {
  initialCategory?: (typeof CATEGORIES)[number];
  initialSubcategory?: SubcategoryFilter;
};

export function ProductGrid({
  initialCategory = "All",
  initialSubcategory = "All",
}: ProductGridProps) {
  const { products } = useStore();
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>(initialCategory);
  const [subcategory, setSubcategory] = useState<SubcategoryFilter>(initialSubcategory);
  const [query, setQuery] = useState("");

  // Re-sync when navigated here with different search params (e.g. from the
  // hero slider's "Shop Now" links) rather than only on first mount.
  useEffect(() => {
    setCategory(initialCategory);
    setSubcategory(initialSubcategory);
  }, [initialCategory, initialSubcategory]);

  const subcategoryOptions =
    category === "Kids" ? KIDS_GENDERS : category === "Men" || category === "Women" ? CLOTHING_TYPES : [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter(
      (p) =>
        (category === "All" || p.category === category) &&
        (subcategoryOptions.length === 0 || subcategory === "All" || p.subcategory === subcategory) &&
        (q === "" || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)),
    );
  }, [products, category, subcategory, subcategoryOptions.length, query]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Button
              key={c}
              size="sm"
              variant={category === c ? "default" : "outline"}
              className="rounded-full"
              onClick={() => {
                setCategory(c);
                setSubcategory("All");
              }}
            >
              {c}
            </Button>
          ))}
        </div>
        <div className="relative sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            aria-label="Search products"
            className="pl-9"
          />
        </div>
      </div>

      {subcategoryOptions.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={subcategory === "All" ? "secondary" : "ghost"}
            className="rounded-full"
            onClick={() => setSubcategory("All")}
          >
            All types
          </Button>
          {subcategoryOptions.map((s) => (
            <Button
              key={s}
              size="sm"
              variant={subcategory === s ? "secondary" : "ghost"}
              className="rounded-full"
              onClick={() => setSubcategory(s)}
            >
              {s}
            </Button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          No products match your search.
        </p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}