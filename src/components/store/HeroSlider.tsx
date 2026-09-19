import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight, Shirt } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useStore } from "@/lib/store";
import { fetchHeroBanners } from "@/lib/hero-banners-api";
import { HERO_SLIDES } from "@/data/hero-slides";

export function HeroSlider() {
  const { products } = useStore();
  const [plugin, setPlugin] = useState<ReturnType<typeof Autoplay>[]>([]);
  const [banners, setBanners] = useState<Record<string, string>>({});

  useEffect(() => {
    setPlugin([Autoplay({ delay: 4500, stopOnInteraction: false, stopOnMouseEnter: true })]);
    fetchHeroBanners()
      .then(setBanners)
      .catch((err) => console.error("Failed to load hero banners:", err));
  }, []);

  const slides = useMemo(
    () =>
      HERO_SLIDES.map((s) => {
        const product = products.find(
          (p) =>
            p.category === s.category &&
            (s.subcategory ? p.subcategory === s.subcategory : true),
        );
        // A manually uploaded banner always wins over an auto-picked product photo.
        const image = banners[s.key] ?? product?.image;
        return { ...s, image, hasShopTarget: Boolean(product) };
      }),
    [products, banners],
  );

  return (
    <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
      <Carousel opts={{ loop: true, align: "start" }} plugins={plugin} className="w-full">
        <CarouselContent>
          {slides.map((s) => (
            <CarouselItem key={s.key}>
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl bg-secondary sm:aspect-[21/8]">
                {s.image ? (
                  <>
                    <img
                      src={s.image}
                      alt={s.label}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  </>
                ) : (
                  <div className="absolute inset-0 grid place-items-center">
                    <Shirt className="size-10 text-muted-foreground" />
                  </div>
                )}
                <div
                  className={`absolute inset-x-0 bottom-0 p-6 sm:p-10 ${
                    s.image ? "text-white" : "text-foreground"
                  }`}
                >
                  <p
                    className={`text-[11px] uppercase tracking-[0.24em] ${
                      s.image ? "text-white/80" : "text-muted-foreground"
                    }`}
                  >
                    {s.image ? "SheikhStore" : "Coming soon"}
                  </p>
                  <h2 className="mt-1 text-2xl font-bold sm:text-4xl">{s.label}</h2>
                  {s.image && (
                    <Button
                      asChild
                      size="sm"
                      className="mt-4 bg-white text-foreground hover:bg-white/90"
                    >
                      <Link
                        to="/collections"
                        search={
                          s.subcategory
                            ? { category: s.category, subcategory: s.subcategory }
                            : { category: s.category }
                        }
                      >
                        Shop Now <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </section>
  );
}