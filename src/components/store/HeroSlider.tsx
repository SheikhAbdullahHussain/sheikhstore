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
  type CarouselApi,
} from "@/components/ui/carousel";
import { useStore } from "@/lib/store";
import { fetchHeroBanners } from "@/lib/hero-banners-api";
import { HERO_SLIDES } from "@/data/hero-slides";

export function HeroSlider() {
  const { products } = useStore();
  const [plugin, setPlugin] = useState<ReturnType<typeof Autoplay>[]>([]);
  const [banners, setBanners] = useState<Record<string, string>>({});
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    setPlugin([Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })]);
    fetchHeroBanners()
      .then(setBanners)
      .catch((err) => console.error("Failed to load hero banners:", err));
  }, []);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => setCurrent(api.selectedScrollSnap() + 1));
  }, [api]);

  const slides = useMemo(
    () =>
      HERO_SLIDES.map((s) => {
        const product = products.find(
          (p) =>
            p.category === s.category &&
            (s.subcategory ? p.subcategory === s.subcategory : true),
        );
        const image = banners[s.key] ?? product?.image;
        return { ...s, image };
      }),
    [products, banners],
  );

  return (
    <section className="mx-auto max-w-[1600px] px-4 pt-6 sm:px-6">
      <Carousel opts={{ loop: true, align: "start" }} plugins={plugin} setApi={setApi} className="w-full">
        <CarouselContent>
          {slides.map((s) => (
            <CarouselItem key={s.key}>
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-secondary sm:aspect-[21/9]">
                {s.image ? (
                  <>
                    <img
                      src={s.image}
                      alt={s.label}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />
                  </>
                ) : (
                  <div className="absolute inset-0 grid place-items-center">
                    <Shirt className="size-10 text-muted-foreground" />
                  </div>
                )}
                <div
                  className={`absolute inset-x-0 bottom-0 p-7 sm:p-12 ${
                    s.image ? "text-white" : "text-foreground"
                  }`}
                >
                  <p
                    className={`text-[11px] font-medium uppercase tracking-[0.28em] ${
                      s.image ? "text-white/75" : "text-muted-foreground"
                    }`}
                  >
                    {s.image ? "New Season 2026" : "Coming Soon"}
                  </p>
                  <h2 className="font-display mt-2 max-w-md text-3xl font-medium leading-[1.1] sm:text-5xl">
                    {s.label}
                  </h2>
                  {s.image && (
                    <Link
                      to="/collections"
                      search={
                        s.subcategory
                          ? { category: s.category, subcategory: s.subcategory }
                          : { category: s.category }
                      }
                      className="group mt-5 inline-flex items-center gap-2 border-b border-white/60 pb-1 text-xs font-medium uppercase tracking-[0.1em] transition-colors hover:border-white"
                    >
                      Shop Now
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  )}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="mt-4 flex items-center justify-between">
          <p className="font-display text-xs tracking-[0.1em] text-muted-foreground">
            {String(current).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
          </p>
          <div className="flex items-center gap-2">
            <CarouselPrevious className="static size-8 translate-y-0 border-foreground/20" />
            <CarouselNext className="static size-8 translate-y-0 border-foreground/20" />
          </div>
        </div>
      </Carousel>
    </section>
  );
}