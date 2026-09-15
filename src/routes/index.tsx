import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, RefreshCcw, Truck, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeaturedCarousel } from "@/components/store/FeaturedCarousel";
import { ProductGrid } from "@/components/store/ProductGrid";
// import heroImage from "@/assets/hero.jpg";
import { Product } from '@/data/products';

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SheikhStore — Premium Clothing, Accessories & Electronics" },
      {
        name: "description",
        content:
          "Shop SheikhStore for premium-quality clothing, fine accessories and considered electronics. Curated collections, fast nationwide delivery across Pakistan.",
      },
      { property: "og:title", content: "SheikhStore — Discover Premium Quality" },
      {
        property: "og:description",
        content:
          "Curated premium clothing, accessories and electronics with nationwide delivery across Pakistan from SheikhStore.",
      },
    ],
  }),
  component: Index,
});

const perks = [
  { icon: Truck, title: "Nationwide shipping", copy: "Free delivery all across Pakistan" },
  { icon: RefreshCcw, title: "Easy exchange", copy: "Quick, hassle-free size or item swaps" },
  { icon: Wallet, title: "Cash on delivery", copy: "Pay at your doorstep, anywhere in Pakistan" },
];

function Index() {
  return (
    <div className="pb-8">
      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
        <div className="grid items-center gap-10 rounded-3xl bg-secondary/60 p-6 sm:p-10 lg:grid-cols-2 lg:p-14">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-background px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              <span className="size-1.5 rounded-full bg-gold" /> New season 2026
            </span>
            <h1 className="text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
              Discover <span className="text-gradient-gold">Premium Quality</span>
            </h1>
            <p className="max-w-md text-base leading-relaxed text-muted-foreground">
              Considered pieces built to outlast trends — tailored outerwear, fine leather goods and
              sound engineered for a lifetime of listening.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/collections">
                  Shop Now <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/about">Our Story</Link>
              </Button>
            </div>
            <dl className="grid grid-cols-3 gap-4 pt-4">
              {[
                ["25k+", "Happy customers"],
                ["7 days", "Easy exchange"],
                ["48h", "Dispatch time"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="font-display text-xl font-bold">{v}</dt>
                  <dd className="text-xs text-muted-foreground">{l}</dd>
                </div>
              ))}
            </dl>
          </div>
          <img
            // src={/product1.jpeg}
            // src={Product}
            alt="Curated flat lay of premium SheikhStore accessories"
            width={1600}
            height={1100}
            className="aspect-[4/3] w-full rounded-2xl object-cover shadow-lg"
          />
        </div>
      </section>

      <section className="mx-auto mt-10 grid max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-3">
        {perks.map((p) => (
          <div key={p.title} className="hairline flex items-center gap-3 rounded-2xl p-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary">
              <p.icon className="size-5 text-gold" />
            </span>
            <div>
              <p className="text-sm font-semibold">{p.title}</p>
              <p className="text-xs text-muted-foreground">{p.copy}</p>
            </div>
          </div>
        ))}
      </section>

      <div className="mt-16">
        <FeaturedCarousel />
      </div>

      <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6">
        <div className="mb-6">
          <p className="text-[11px] uppercase tracking-[0.24em] text-gold">The catalogue</p>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Shop All Products</h2>
        </div>
        <ProductGrid />
      </section>
    </div>
  );
}
