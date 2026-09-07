import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import Autoplay from "embla-carousel-autoplay";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { money, useStore } from "@/lib/store";
import { productSlug } from "@/data/products";

export function FeaturedCarousel() {
  // const { products, addToCart, setCartOpen } = useStore();
  const { products, productsLoading, addToCart, setCartOpen } = useStore();
  const [plugin, setPlugin] = useState<ReturnType<typeof Autoplay>[]>([]);
  // const featured = products.filter((p) => p.featured).slice(0, 6);
  const featured = products.slice(0, 6);

  useEffect(() => {
    setPlugin([Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })]);
  }, []);

  if (productsLoading) {
    return (
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="py-12 text-center text-sm text-muted-foreground">
          Loading featured products...
        </div>
      </section>
    );
  }
  
  if (featured.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-gold">Trending now</p>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Featured & Top Selling</h2>
        </div>
      </div>

      <Carousel opts={{ loop: true, align: "start" }} plugins={plugin} className="w-full">
        <CarouselContent>
          {featured.map((p) => (
            <CarouselItem key={p.id} className="sm:basis-1/2 lg:basis-1/3">
              <div className="surface-elevated hairline overflow-hidden rounded-2xl">
                <Link
                  to="/product/$productId/{-$slug}"
                  params={{ productId: p.id, slug: productSlug(p) }}
                >
                  <img
                    src={p.image}
                    alt={p.title}
                    loading="lazy"
                    width={900}
                    height={900}
                    className="aspect-[4/3] w-full object-cover"
                  />
                </Link>
                <div className="space-y-3 p-5">
                  <h3 className="text-lg font-semibold">{p.title}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-xl font-bold">{money(p.price)}</span>
                    {p.compareAt ? (
                      <span className="text-sm text-muted-foreground line-through">
                        {money(p.compareAt)}
                      </span>
                    ) : null}
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => {
                      addToCart(p);
                      setCartOpen(true);
                      toast.success(`${p.title} added to cart`);
                    }}
                  >
                    <ShoppingBag className="size-4" /> Quick Add to Cart
                  </Button>
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
