import { Instagram } from "lucide-react";
import { useStore } from "@/lib/store";

const INSTAGRAM_URL = "https://instagram.com/sheikhstore_1";

export function SocialGrid() {
  const { products } = useStore();
  const images = products.slice(0, 6).map((p) => p.image);

  if (images.length < 4) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="flex flex-col items-center text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-accent">
          Follow The SheikhStore Edit
        </p>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-display mt-2 inline-flex items-center gap-2 text-3xl font-medium transition-colors hover:text-accent sm:text-4xl"
        >
          <Instagram className="size-6" strokeWidth={1.5} /> @sheikhstore_1
        </a>
      </div>

      <div className="mt-10 grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3">
        {images.map((src, i) => (
          <a
            key={src.slice(0, 40) + i}
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group block aspect-square overflow-hidden bg-secondary"
          >
            <img
              src={src}
              alt="SheikhStore on Instagram"
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </a>
        ))}
      </div>
    </section>
  );
}