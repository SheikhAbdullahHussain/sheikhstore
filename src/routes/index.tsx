import { createFileRoute } from "@tanstack/react-router";
import { HeroSlider } from "@/components/store/HeroSlider";
import { NewsTicker } from "@/components/store/NewsTicker";
import { FeaturedCarousel } from "@/components/store/FeaturedCarousel";
import { ProductGrid } from "@/components/store/ProductGrid";

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

function Index() {
  return (
    <div className="pb-8">
      <HeroSlider />

      <div className="mt-8">
        <NewsTicker />
      </div>

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