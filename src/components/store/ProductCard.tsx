import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { money, useStore } from "@/lib/store";
import { productSlug, type Product } from "@/data/products";
import { toast } from "sonner";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, setCartOpen } = useStore();

  return (
    <article className="group surface-elevated hairline flex flex-col overflow-hidden rounded-2xl transition-transform duration-300 hover:-translate-y-1">
      <Link
        to="/product/$productId/{-$slug}"
        params={{ productId: product.id, slug: productSlug(product) }}
        className="relative block overflow-hidden bg-secondary"
      >
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          width={900}
          height={900}
          className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.compareAt ? (
          <span className="absolute left-3 top-3 rounded-full bg-ink px-2.5 py-1 text-[11px] font-medium tracking-wide text-primary-foreground">
            -{Math.round((1 - product.price / product.compareAt) * 100)}%
          </span>
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {product.category}
            </p>
            <h3 className="mt-1 text-base font-semibold leading-snug">{product.title}</h3>
          </div>
          <Button
            size="icon"
            variant="secondary"
            aria-label={`Quick add ${product.title} to cart`}
            onClick={() => {
              addToCart(product);
              setCartOpen(true);
              toast.success(`${product.title} added to cart`);
            }}
          >
            <ShoppingBag className="size-4" />
          </Button>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3">
          <p className="flex items-baseline gap-2">
            <span className="text-lg font-semibold">{money(product.price)}</span>
            {product.compareAt ? (
              <span className="text-sm text-muted-foreground line-through">
                {money(product.compareAt)}
              </span>
            ) : null}
          </p>
          <Button asChild size="sm" variant="outline">
            <Link
              to="/product/$productId/{-$slug}"
              params={{ productId: product.id, slug: productSlug(product) }}
            >
              View Details
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
