// // import { useState } from "react";
// // import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
// // import { ArrowLeft, Minus, Plus, ShoppingBag, Truck } from "lucide-react";
// // import { toast } from "sonner";
// // import { Button } from "@/components/ui/button";
// // import { Badge } from "@/components/ui/badge";
// // import { Separator } from "@/components/ui/separator";
// // import { money, useStore } from "@/lib/store";
// // import { productSlug } from "@/data/products";
// // import { fetchProductById } from "@/lib/products-api";
// // import { ProductCard } from 'ProductCard';
// // import { error } from "console";

// // // const BASE_URL = "https://sheikh-store-shop.lovable.app";
// // const BASE_URL = "https://sheikhstore-sheikh-abdullahs.vercel.app";

// // // export function ProductCard(){
// // //   try{
// // //     console.log("product card")
// // //   }catch{error}
// // // }

// // export const Route = createFileRoute("/product/$productId/{-$slug}")({
// //   loader: async ({ params }) => {
// //     const product = await fetchProductById(params.productId);
// //     if (!product) throw notFound();
// //     return product;
// //   },
// //   head: ({ params, loaderData: product }) => {
// //     if (!product) {
// //       return {
// //         meta: [
// //           { title: "Product not found — SheikhStore" },
// //           {
// //             name: "description",
// //             content: "This SheikhStore item may have sold out or been removed.",
// //           },
// //           { name: "robots", content: "noindex" },
// //         ],
// //       };
// //     }

// //     const url = `${BASE_URL}/product/${params.productId}/${productSlug(product)}`;
// //     const title = `${product.title} — SheikhStore`;
// //     const description = `${product.description} ${product.category} from SheikhStore — nationwide shipping across Pakistan, 7-day easy exchange and cash on delivery.`.slice(
// //       0,
// //       158,
// //     );

// //     return {
// //       meta: [
// //         { title },
// //         { name: "description", content: description },
// //         { property: "og:title", content: title },
// //         { property: "og:description", content: description },
// //         { property: "og:type", content: "product" },
// //         { property: "og:url", content: url },
// //       ],
// //       links: [{ rel: "canonical", href: url }],
// //       scripts: [
// //         {
// //           type: "application/ld+json",
// //           children: JSON.stringify({
// //             "@context": "https://schema.org",
// //             "@type": "Product",
// //             name: product.title,
// //             sku: product.id,
// //             description: product.description,
// //             category: product.category,
// //             brand: { "@type": "Brand", name: "SheikhStore" },
// //             offers: {
// //               "@type": "Offer",
// //               url,
// //               price: product.price,
// //               priceCurrency: "PKR",
// //               availability:
// //                 product.stock > 0
// //                   ? "https://schema.org/InStock"
// //                   : "https://schema.org/OutOfStock",
// //             },
// //           }),
// //         },
// //       ],
// //     };
// //   },
// //   component: ProductDetail,
// //   notFoundComponent: ProductMissing,
// // });

// // function ProductMissing() {
// //   return (
// //     <div className="mx-auto max-w-xl px-4 py-24 text-center">
// //       <h1 className="text-2xl font-bold">Product not found</h1>
// //       <p className="mt-3 text-sm text-muted-foreground">
// //         This item may have sold out or been removed.
// //       </p>
// //       <Button asChild className="mt-6">
// //         <Link to="/collections">Back to collections</Link>
// //       </Button>
// //     </div>
// //   );
// // }

// // export function ProductCard(){
// //   try{
// //     console.log("product card")
// //   }catch{error}
// // }
// // function ProductDetail() {
// //   const { productId } = Route.useParams();
// //   const { products, addToCart, setCartOpen} = useStore();
// //   const navigate = useNavigate();
// //   const loaderProduct = Route.useLoaderData();
// //   const product = products.find((p) => p.id === productId) ?? loaderProduct;

// //   const [size, setSize] = useState<string | undefined>(undefined);
// //   const [color, setColor] = useState<string | undefined>(undefined);
// //   const [qty, setQty] = useState(1);
// //   const [activeImage, setActiveImage] = useState(0);

// //   if (!product) return <ProductMissing />;

// //   const gallery = product.images?.length ? product.images : [product.image];

// //   const chosenSize = size ?? product.sizes?.[0];
// //   const chosenColor = color ?? product.colors?.[0];

// //   const add = () => {
// //     addToCart(product, { qty, size: chosenSize, color: chosenColor });
// //     toast.success(`${product.title} × ${qty} added to cart`);
// //   };

// //   return (
// //     <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
// //       <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2">
// //         <Link to="/collections">
// //           <ArrowLeft className="size-4" /> Back to collections
// //         </Link>
// //       </Button>

// //       <div className="grid gap-10 lg:grid-cols-2">
// //         <div>
// //           <div className="surface-elevated hairline overflow-hidden rounded-3xl">
// //             <img
// //               src={gallery[activeImage] ?? product.image}
// //               alt={product.title}
// //               width={900}
// //               height={900}
// //               className="aspect-square w-full object-cover"
// //             />
// //           </div>
// //           {gallery.length > 1 ? (
// //             <div className="mt-3 grid grid-cols-5 gap-2">
// //               {gallery.map((src, i) => (
// //                 <button
// //                   key={src.slice(0, 40) + i}
// //                   type="button"
// //                   aria-label={`View image ${i + 1}`}
// //                   aria-current={i === activeImage}
// //                   onClick={() => setActiveImage(i)}
// //                   className={`overflow-hidden rounded-xl border transition ${
// //                     i === activeImage ? "border-gold" : "border-border opacity-70 hover:opacity-100"
// //                   }`}
// //                 >
// //                   <img src={src} alt="" className="aspect-square w-full object-cover" />
// //                 </button>
// //               ))}
// //             </div>
// //           ) : null}
// //         </div>

// //         <div>
// //           <Badge variant="secondary" className="uppercase tracking-[0.16em]">
// //             {product.category}
// //             {product.subcategory ? ` · ${product.subcategory}` : ""}
// //           </Badge>
// //           <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{product.title}</h1>

// //           <div className="mt-5 flex items-baseline gap-3">
// //             <span className="font-display text-3xl font-bold">{money(product.price)}</span>
// //             {product.compareAt ? (
// //               <>
// //                 <span className="text-lg text-muted-foreground line-through">
// //                   {money(product.compareAt)}
// //                 </span>
// //                 <span className="rounded-full bg-gold-soft px-2 py-0.5 text-xs font-semibold text-accent-foreground">
// //                   Save {money(product.compareAt - product.price)}
// //                 </span>
// //               </>
// //             ) : null}
// //           </div>

// //           <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
// //             {product.description}
// //           </p>

// //           <Separator className="my-6" />

// //           {product.sizes?.length ? (
// //             <div className="mb-5">
// //               <p className="mb-2 text-sm font-semibold">Size</p>
// //               <div className="flex flex-wrap gap-2">
// //                 {product.sizes.map((s) => (
// //                   <Button
// //                     key={s}
// //                     size="sm"
// //                     variant={chosenSize === s ? "default" : "outline"}
// //                     onClick={() => setSize(s)}
// //                   >
// //                     {s}
// //                   </Button>
// //                 ))}
// //               </div>
// //             </div>
// //           ) : null}

// //           {product.colors?.length ? (
// //             <div className="mb-5">
// //               <p className="mb-2 text-sm font-semibold">Colour</p>
// //               <div className="flex flex-wrap gap-2">
// //                 {product.colors.map((c) => (
// //                   <Button
// //                     key={c}
// //                     size="sm"
// //                     variant={chosenColor === c ? "default" : "outline"}
// //                     onClick={() => setColor(c)}
// //                   >
// //                     {c}
// //                   </Button>
// //                 ))}
// //               </div>
// //             </div>
// //           ) : null}

// //           <div className="mb-6">
// //             <p className="mb-2 text-sm font-semibold">Quantity</p>
// //             <div className="flex items-center gap-4">
// //               <div className="flex items-center rounded-full border">
// //                 <button
// //                   className="grid size-10 place-items-center rounded-l-full hover:bg-secondary"
// //                   aria-label="Decrease quantity"
// //                   onClick={() => setQty((q) => Math.max(1, q - 1))}
// //                 >
// //                   <Minus className="size-4" />
// //                 </button>
// //                 <span className="w-10 text-center text-sm font-medium">{qty}</span>
// //                 <button
// //                   className="grid size-10 place-items-center rounded-r-full hover:bg-secondary"
// //                   aria-label="Increase quantity"
// //                   onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))}
// //                 >
// //                   <Plus className="size-4" />
// //                 </button>
// //               </div>
// //               <span className="text-xs text-muted-foreground">
// //                 {product.stock > 0 ? "In stock" : "Out of stock"}
// //               </span>
// //             </div>
// //           </div>

// //           <div className="flex flex-col gap-3 sm:flex-row">
// //             <Button size="lg" className="flex-1" onClick={add} disabled={product.stock <= 0}>
// //               <ShoppingBag className="size-4" /> {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
// //             </Button>
// //             <Button
// //               size="lg"
// //               variant="outline"
// //               className="flex-1"
// //               disabled={product.stock <= 0}
// //               onClick={() => {
// //                 add();
// //                 setCartOpen(false);
// //                 void navigate({ to: "/checkout" });
// //               }}
// //             >
// //               Buy Now
// //             </Button>
// //           </div>

// //           <p className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
// //             <Truck className="size-4 text-gold" /> Free nationwide shipping across Pakistan ·
// //             7-day easy exchange
// //           </p>
// //         </div>
// //       </div>
// //     </section>
// //   );
// // }


// import { Link } from "@tanstack/react-router";
// import { ShoppingBag } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { money, useStore } from "@/lib/store";
// import { productSlug, type Product } from "@/data/products";
// import { toast } from "sonner";

// export function ProductCard({ product }: { product: Product }) {
//   const { addToCart, setCartOpen } = useStore();

//   return (
//     <article className="group surface-elevated hairline flex h-full flex-col overflow-hidden rounded-2xl transition-transform duration-300 hover:-translate-y-1">
//       <Link
//         to="/product/$productId/{-$slug}"
//         params={{ productId: product.id, slug: productSlug(product) }}
//         className="relative block overflow-hidden bg-secondary"
//       >
//         <img
//           src={product.image}
//           alt={product.title}
//           loading="lazy"
//           width={900}
//           height={900}
//           className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
//         />
//         {product.compareAt ? (
//           <span className="absolute left-3 top-3 rounded-full bg-ink px-2.5 py-1 text-[11px] font-medium tracking-wide text-primary-foreground">
//             -{Math.round((1 - product.price / product.compareAt) * 100)}%
//           </span>
//         ) : null}
//       </Link>
//       <div className="flex flex-1 flex-col gap-3 p-4">
//         <div className="flex items-start justify-between gap-2">
//           <div className="min-w-0">
//             <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
//               {product.category}
//             </p>
//             <h3
//               className="mt-1 line-clamp-2 min-h-[2.6rem] text-base font-semibold leading-snug"
//               title={product.title}
//             >
//               {product.title}
//             </h3>
//           </div>
//           <Button
//             size="icon"
//             variant="secondary"
//             className="shrink-0"
//             disabled={product.stock <= 0}
//             aria-label={
//               product.stock <= 0
//                 ? `${product.title} is out of stock`
//                 : `Quick add ${product.title} to cart`
//             }
//             onClick={() => {
//               addToCart(product);
//               setCartOpen(true);
//               toast.success(`${product.title} added to cart`);
//             }}
//           >
//             <ShoppingBag className="size-4" />
//           </Button>
//         </div>
//         <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
//           <p className="flex items-baseline gap-2">
//             <span className="text-lg font-semibold">{money(product.price)}</span>
//             {product.compareAt ? (
//               <span className="text-sm text-muted-foreground line-through">
//                 {money(product.compareAt)}
//               </span>
//             ) : null}
//           </p>
//           <Button asChild size="sm" variant="outline">
//             <Link
//               to="/product/$productId/{-$slug}"
//               params={{ productId: product.id, slug: productSlug(product) }}
//             >
//               View Details
//             </Link>
//           </Button>
//         </div>
//       </div>
//     </article>
//   );
// }

import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { money, useStore } from "@/lib/store";
import { productSlug, type Product } from "@/data/products";
import { toast } from "sonner";

/** "black plain waistcoat" -> "Black Plain Waistcoat" (display only; DB value untouched). */
function titleCase(s: string): string {
  return s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, setCartOpen } = useStore();
  const outOfStock = product.stock <= 0;

  return (
    <article className="group flex h-full flex-col">
      <Link
        to="/product/$productId/{-$slug}"
        params={{ productId: product.id, slug: productSlug(product) }}
        className="relative block overflow-hidden bg-secondary"
      >
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          width={800}
          height={1000}
          className="aspect-[4/5] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        {product.compareAt ? (
          <span className="absolute left-3 top-3 bg-primary px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-primary-foreground">
            Save {Math.round((1 - product.price / product.compareAt) * 100)}%
          </span>
        ) : null}

        {/* Quick add — appears on hover (desktop) */}
        {!outOfStock && (
          <button
            type="button"
            aria-label={`Quick add ${product.title} to bag`}
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
              setCartOpen(true);
              toast.success(`${product.title} added to bag`);
            }}
            className="absolute inset-x-3 bottom-3 flex translate-y-2 items-center justify-center gap-2 bg-background/95 py-2.5 text-xs font-medium uppercase tracking-[0.08em] opacity-0 backdrop-blur-sm transition-all duration-200 hover:bg-background group-hover:translate-y-0 group-hover:opacity-100 sm:flex"
          >
            <ShoppingBag className="size-3.5" /> Quick Add
          </button>
        )}
        {outOfStock && (
          <span className="absolute inset-x-3 bottom-3 flex items-center justify-center bg-background/90 py-2.5 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
            Out of Stock
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-0.5 pt-3">
        <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          {product.category}
        </p>
        <Link
          to="/product/$productId/{-$slug}"
          params={{ productId: product.id, slug: productSlug(product) }}
        >
          <h3 className="line-clamp-2 text-sm font-medium leading-snug text-foreground transition-colors hover:text-accent">
            {titleCase(product.title)}
          </h3>
        </Link>
        <p className="mt-1 flex items-baseline gap-2">
          <span className="text-sm font-semibold">{money(product.price)}</span>
          {product.compareAt ? (
            <span className="text-xs text-muted-foreground line-through">
              {money(product.compareAt)}
            </span>
          ) : null}
        </p>
      </div>
    </article>
  );
}