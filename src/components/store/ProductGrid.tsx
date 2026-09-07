import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/data/products";
import { useStore } from "@/lib/store";
import { ProductCard } from "./ProductCard";

export function ProductGrid() {
  const { products } = useStore();
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter(
      (p) =>
        (category === "All" || p.category === category) &&
        (q === "" || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)),
    );
  }, [products, category, query]);

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
              onClick={() => setCategory(c)}
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