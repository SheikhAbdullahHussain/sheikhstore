import type { Product } from "@/data/products";
import { ProductCard } from "./ProductCard";

export function ProductSection({
  eyebrow,
  title,
  subtitle,
  products,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  products: Product[];
}) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="flex flex-col items-center text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-accent">
          {eyebrow}
        </p>
        <h2 className="font-display mt-2 text-3xl font-medium sm:text-4xl">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
        {products.slice(0, 4).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}