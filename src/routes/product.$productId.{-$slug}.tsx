import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Minus, Plus, ShoppingBag, Truck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { money, useStore } from "@/lib/store";
import { productSlug, seedProducts } from "@/data/products";

const BASE_URL = "https://sheikh-store-shop.lovable.app";

export const Route = createFileRoute("/product/$productId/{-$slug}")({
  head: ({ params }) => {
    const product = seedProducts.find((p) => p.id === params.productId);
    const url = `${BASE_URL}/product/${params.productId}${
      product ? `/${productSlug(product)}` : params.slug ? `/${params.slug}` : ""
    }`;

    if (!product) {
      return {
        meta: [
          { title: "Product not found — SheikhStore" },
          {
            name: "description",
            content: "This SheikhStore item may have sold out or been removed.",
          },
          { name: "robots", content: "noindex" },
        ],
      };
    }

    const title = `${product.title} — SheikhStore`;
    const description = `${product.description} ${product.category} from SheikhStore — nationwide shipping across Pakistan, 7-day easy exchange and cash on delivery.`.slice(
      0,
      158,
    );

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.title,
            sku: product.id,
            description: product.description,
            category: product.category,
            brand: { "@type": "Brand", name: "SheikhStore" },
            offers: {
              "@type": "Offer",
              url,
              price: product.price,
              priceCurrency: "PKR",
              availability:
                product.stock > 0
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
            },
          }),
        },
      ],
    };
  },
  component: ProductDetail,
  notFoundComponent: ProductMissing,
});


function ProductMissing() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-2xl font-bold">Product not found</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        This item may have sold out or been removed.
      </p>
      <Button asChild className="mt-6">
        <Link to="/collections">Back to collections</Link>
      </Button>
    </div>
  );
}

function ProductDetail() {
  const { productId } = Route.useParams();
  const { products, addToCart, setCartOpen } = useStore();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === productId);

  const [size, setSize] = useState<string | undefined>(undefined);
  const [color, setColor] = useState<string | undefined>(undefined);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  if (!product) return <ProductMissing />;

  const gallery = product.images?.length ? product.images : [product.image];

  const chosenSize = size ?? product.sizes?.[0];
  const chosenColor = color ?? product.colors?.[0];

  const add = () => {
    addToCart(product, { qty, size: chosenSize, color: chosenColor });
    toast.success(`${product.title} × ${qty} added to cart`);
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2">
        <Link to="/collections">
          <ArrowLeft className="size-4" /> Back to collections
        </Link>
      </Button>

      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="surface-elevated hairline overflow-hidden rounded-3xl">
            <img
              src={gallery[activeImage] ?? product.image}
              alt={product.title}
              width={900}
              height={900}
              className="aspect-square w-full object-cover"
            />
          </div>
          {gallery.length > 1 ? (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {gallery.map((src, i) => (
                <button
                  key={src.slice(0, 40) + i}
                  type="button"
                  aria-label={`View image ${i + 1}`}
                  aria-current={i === activeImage}
                  onClick={() => setActiveImage(i)}
                  className={`overflow-hidden rounded-xl border transition ${
                    i === activeImage ? "border-gold" : "border-border opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={src} alt="" className="aspect-square w-full object-cover" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div>
          <Badge variant="secondary" className="uppercase tracking-[0.16em]">
            {product.category}
          </Badge>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{product.title}</h1>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="font-display text-3xl font-bold">{money(product.price)}</span>
            {product.compareAt ? (
              <>
                <span className="text-lg text-muted-foreground line-through">
                  {money(product.compareAt)}
                </span>
                <span className="rounded-full bg-gold-soft px-2 py-0.5 text-xs font-semibold text-accent-foreground">
                  Save {money(product.compareAt - product.price)}
                </span>
              </>
            ) : null}
          </div>

          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <Separator className="my-6" />

          {product.sizes?.length ? (
            <div className="mb-5">
              <p className="mb-2 text-sm font-semibold">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant={chosenSize === s ? "default" : "outline"}
                    onClick={() => setSize(s)}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>
          ) : null}

          {product.colors?.length ? (
            <div className="mb-5">
              <p className="mb-2 text-sm font-semibold">Colour</p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <Button
                    key={c}
                    size="sm"
                    variant={chosenColor === c ? "default" : "outline"}
                    onClick={() => setColor(c)}
                  >
                    {c}
                  </Button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mb-6">
            <p className="mb-2 text-sm font-semibold">Quantity</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center rounded-full border">
                <button
                  className="grid size-10 place-items-center rounded-l-full hover:bg-secondary"
                  aria-label="Decrease quantity"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                >
                  <Minus className="size-4" />
                </button>
                <span className="w-10 text-center text-sm font-medium">{qty}</span>
                <button
                  className="grid size-10 place-items-center rounded-r-full hover:bg-secondary"
                  aria-label="Increase quantity"
                  onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))}
                >
                  <Plus className="size-4" />
                </button>
              </div>
              <span className="text-xs text-muted-foreground">{product.stock} in stock</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="flex-1" onClick={add}>
              <ShoppingBag className="size-4" /> Add to Cart
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="flex-1"
              onClick={() => {
                add();
                setCartOpen(false);
                void navigate({ to: "/checkout" });
              }}
            >
              Buy Now
            </Button>
          </div>

          <p className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
            <Truck className="size-4 text-gold" /> Free nationwide shipping across Pakistan ·
            7-day easy exchange
          </p>
        </div>
      </div>
    </section>
  );
}