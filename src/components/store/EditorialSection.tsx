import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store";

export function EditorialSection() {
  const { products } = useStore();
  // Prefer a Women's piece for the campaign image; fall back to any product.
  const image =
    products.find((p) => p.category === "Women")?.image ?? products[0]?.image ?? undefined;

  if (!image) return null;

  return (
    <section className="relative mt-20 aspect-[4/5] w-full overflow-hidden bg-secondary sm:mt-24 sm:aspect-[21/9]">
      <img
        src={image}
        alt="The SheikhStore Edit"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent" />
      <div className="relative mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6">
        <div className="max-w-md text-white">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/75">
            The SheikhStore Edit
          </p>
          <h2 className="font-display mt-3 text-4xl font-medium leading-[1.1] sm:text-5xl">
            Tradition, Reimagined.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/85">
            Modern silhouettes inspired by timeless Pakistani craftsmanship.
          </p>
          <Link
            to="/collections"
            className="group mt-6 inline-flex items-center gap-2 border-b border-white/60 pb-1 text-xs font-medium uppercase tracking-[0.1em] transition-colors hover:border-white"
          >
            Explore Collection
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}