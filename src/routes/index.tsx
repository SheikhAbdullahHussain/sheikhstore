// import { createFileRoute } from "@tanstack/react-router";
// import { HeroSlider } from "@/components/store/HeroSlider";
// import { NewsTicker } from "@/components/store/NewsTicker";
// import { FeaturedCarousel } from "@/components/store/FeaturedCarousel";
// import { ProductGrid } from "@/components/store/ProductGrid";

// export const Route = createFileRoute("/")({
//   head: () => ({
//     meta: [
//       { title: "SheikhStore — Premium Clothing, Accessories & Electronics" },
//       {
//         name: "description",
//         content:
//           "Shop SheikhStore for premium-quality clothing, fine accessories and considered electronics. Curated collections, fast nationwide delivery across Pakistan.",
//       },
//       { property: "og:title", content: "SheikhStore — Discover Premium Quality" },
//       {
//         property: "og:description",
//         content:
//           "Curated premium clothing, accessories and electronics with nationwide delivery across Pakistan from SheikhStore.",
//       },
//     ],
//   }),
//   component: Index,
// });

// function Index() {
//   return (
//     <div className="pb-8">
//       <HeroSlider />

//       <div className="mt-8">
//         <NewsTicker />
//       </div>

//       <div className="mt-16">
//         <FeaturedCarousel />
//       </div>

//       <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6">
//         <div className="mb-6">
//           <p className="text-[11px] uppercase tracking-[0.24em] text-gold">The catalogue</p>
//           <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Shop All Products</h2>
//         </div>
//         <ProductGrid />
//       </section>
//     </div>
//   );
// }

import { createFileRoute } from "@tanstack/react-router";
import { HeroSlider } from "@/components/store/HeroSlider";
import { NewsTicker } from "@/components/store/NewsTicker";
import { ShopByCategory } from "@/components/store/ShopByCategory";
import { ProductSection } from "@/components/store/ProductSection";
import { EditorialSection } from "@/components/store/EditorialSection";
import { BrandStory } from "@/components/store/BrandStory";
import { SocialGrid } from "@/components/store/SocialGrid";
import { Newsletter } from "@/components/store/Newsletter";
import { ProductGrid } from "@/components/store/ProductGrid";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SheikhStore — Premium Pakistani Fashion" },
      {
        name: "description",
        content:
          "SheikhStore — premium Pakistani fashion for men, women and kids. Refined silhouettes, timeless craftsmanship, nationwide delivery across Pakistan.",
      },
      { property: "og:title", content: "SheikhStore — Premium Pakistani Fashion" },
      {
        property: "og:description",
        content: "Refined silhouettes. Timeless craftsmanship. Shop the new season now.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { products } = useStore();
  // New Arrivals: most recently added. Bestsellers: a different slice so the
  // two sections don't just repeat each other (no real sales data exists yet
  // to rank by actual bestseller performance).
  const newArrivals = products.slice(0, 4);
  const bestsellers = products.length > 4 ? products.slice(4, 8) : [...products].reverse().slice(0, 4);

  return (
    <div className="pb-8">
      <HeroSlider />

      <div className="mt-8">
        <NewsTicker />
      </div>

      <ShopByCategory />

      <ProductSection
        eyebrow="New In"
        title="New Arrivals"
        subtitle="Discover the latest additions to SheikhStore."
        products={newArrivals}
      />

      <EditorialSection />

      <ProductSection
        eyebrow="Best Loved"
        title="Bestsellers"
        subtitle="The pieces everyone is reaching for."
        products={bestsellers}
      />

      <section className="mx-auto mt-4 max-w-7xl px-4 sm:px-6">
        <div className="mb-6 text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-accent">
            The Collection
          </p>
          <h2 className="font-display mt-2 text-3xl font-medium sm:text-4xl">Shop All Products</h2>
        </div>
        <ProductGrid />
      </section>

      <BrandStory />
      <SocialGrid />
      <Newsletter />
    </div>
  );
}