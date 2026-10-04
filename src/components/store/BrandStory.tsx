import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store";

export function BrandStory() {
  const { products } = useStore();
  const image = products[Math.floor(products.length / 2)]?.image ?? products[0]?.image;

  if (!image) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="aspect-[4/5] overflow-hidden bg-secondary">
          <img src={image} alt="SheikhStore craftsmanship" loading="lazy" className="h-full w-full object-cover" />
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-accent">
            Our Story
          </p>
          <h2 className="font-display mt-3 text-3xl font-medium leading-tight sm:text-4xl">
            Tradition, Refined.
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
            SheikhStore brings together contemporary Pakistani fashion and timeless craftsmanship,
            offering carefully selected pieces for everyday elegance and special occasions.
          </p>
          <Link
            to="/about"
            className="group mt-6 inline-flex items-center gap-2 border-b border-foreground/30 pb-1 text-xs font-medium uppercase tracking-[0.1em] transition-colors hover:border-foreground"
          >
            Discover Our Story
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}