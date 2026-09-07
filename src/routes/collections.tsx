import { createFileRoute } from "@tanstack/react-router";
import { ProductGrid } from "@/components/store/ProductGrid";

export const Route = createFileRoute("/collections")({
  head: () => ({
    meta: [
      { title: "Collections — Shop All SheikhStore Products" },
      {
        name: "description",
        content:
          "Browse the full SheikhStore catalogue: tailored clothing, leather accessories and premium electronics. Filter by category or search by name.",
      },
      { property: "og:title", content: "Collections — SheikhStore" },
      {
        property: "og:description",
        content: "Filter and search the full SheikhStore catalogue of premium goods.",
      },
    ],
  }),
  component: Collections,
});

function Collections() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <p className="text-[11px] uppercase tracking-[0.24em] text-gold">Collections</p>
      <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Every piece, one place</h1>
      <p className="mt-3 max-w-xl text-sm text-muted-foreground">
        Filter by category or search to find exactly what you're after.
      </p>
      <div className="mt-10">
        <ProductGrid />
      </div>
    </section>
  );
}