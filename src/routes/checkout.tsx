import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, CreditCard, Minus, Plus, ShoppingBag, Trash2, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { money, useStore, type Order } from "@/lib/store";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Cart & Checkout — SheikhStore" },
      {
        name: "description",
        content:
          "Review your SheikhStore bag, enter shipping details, choose cash on delivery or card, and confirm your order in three quick steps.",
      },
      { property: "og:title", content: "Checkout — SheikhStore" },
      {
        property: "og:description",
        content: "Three-step checkout: shipping, payment and order confirmation.",
      },
    ],
  }),
  component: Checkout,
});

type Shipping = { name: string; email: string; address: string; city: string; phone: string };

const steps = ["Shipping", "Payment", "Confirm"];

function Checkout() {
  const { cart, cartTotal, setQty, removeFromCart, placeOrder } = useStore();
  const [step, setStep] = useState(0);
  const [order, setOrder] = useState<Order | null>(null);
  const [payment, setPayment] = useState<"cod" | "card">("cod");
  const [shipping, setShipping] = useState<Shipping>({
    name: "",
    email: "",
    address: "",
    city: "",
    phone: "",
  });

  const shippingFee = 0; // Free nationwide shipping across Pakistan
  const grandTotal = cartTotal + shippingFee;

  if (order) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-gold-soft">
          <Check className="size-8 text-accent-foreground" />
        </span>
        <h1 className="mt-6 text-3xl font-bold">Thank You for Ordering</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          A confirmation is on its way to {order.shipping.email}.
        </p>
        <div className="surface-elevated hairline mt-8 rounded-2xl p-6 text-left">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Order ID</span>
            <span className="font-mono font-semibold">{order.id}</span>
          </div>
          <Separator className="my-4" />
          <ul className="space-y-3">
            {order.items.map((i) => (
              <li key={i.key} className="flex items-center justify-between gap-3 text-sm">
                <span>
                  {i.title} × {i.qty}
                </span>
                <span className="font-medium">{money(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <Separator className="my-4" />
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Total paid ({order.payment === "cod" ? "Cash on delivery" : "Card"})
            </span>
            <span className="font-display text-xl font-bold">{money(order.total)}</span>
          </div>
        </div>
        <Button asChild size="lg" className="mt-8">
          <Link to="/collections">Continue Shopping</Link>
        </Button>
      </section>
    );
  }

  if (cart.length === 0) {
    return (
      <section className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-secondary">
          <ShoppingBag className="size-6 text-muted-foreground" />
        </span>
        <h1 className="mt-5 text-2xl font-bold">Your bag is empty</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Add a few pieces and your checkout will appear here.
        </p>
        <Button asChild className="mt-6">
          <Link to="/collections">Browse Collections</Link>
        </Button>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Cart & Checkout</h1>

      <ol className="mt-6 flex items-center gap-3">
        {steps.map((s, i) => (
          <li key={s} className="flex items-center gap-3">
            <span
              className={`grid size-8 place-items-center rounded-full text-xs font-semibold ${
                i <= step ? "bg-ink text-primary-foreground" : "bg-secondary text-muted-foreground"
              }`}
            >
              {i + 1}
            </span>
            <span
              className={`text-sm ${i === step ? "font-semibold" : "text-muted-foreground"}`}
            >
              {s}
            </span>
            {i < steps.length - 1 && <span className="h-px w-6 bg-border sm:w-12" />}
          </li>
        ))}
      </ol>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="surface-elevated hairline rounded-2xl p-6">
          {step === 0 && (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setStep(1);
              }}
            >
              <h2 className="text-lg font-semibold">Shipping Address</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="s-name">Full name</Label>
                  <Input
                    id="s-name"
                    required
                    value={shipping.name}
                    onChange={(e) => setShipping({ ...shipping, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="s-email">Email</Label>
                  <Input
                    id="s-email"
                    type="email"
                    required
                    value={shipping.email}
                    onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="s-phone">Phone number</Label>
                  <Input
                    id="s-phone"
                    required
                    value={shipping.phone}
                    onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="s-address">Address</Label>
                  <Input
                    id="s-address"
                    required
                    value={shipping.address}
                    onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="s-city">City</Label>
                  <Input
                    id="s-city"
                    required
                    value={shipping.city}
                    onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                  />
                </div>
              </div>
              <Button type="submit" size="lg" className="w-full">
                Continue to payment
              </Button>
            </form>
          )}

          {step === 1 && (
            <form
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                setStep(2);
              }}
            >
              <h2 className="text-lg font-semibold">Payment Method</h2>
              <div className="grid gap-3">
                <button
                  type="button"
                  onClick={() => setPayment("cod")}
                  className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-colors ${
                    payment === "cod" ? "border-gold bg-secondary" : "hover:bg-secondary/60"
                  }`}
                >
                  <Wallet className="size-5 text-gold" />
                  <span>
                    <span className="block text-sm font-semibold">Cash on Delivery</span>
                    <span className="block text-xs text-muted-foreground">
                      Pay the courier when your parcel arrives
                    </span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setPayment("card")}
                  className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-colors ${
                    payment === "card" ? "border-gold bg-secondary" : "hover:bg-secondary/60"
                  }`}
                >
                  <CreditCard className="size-5 text-gold" />
                  <span>
                    <span className="block text-sm font-semibold">Credit Card</span>
                    <span className="block text-xs text-muted-foreground">
                      Demo form — no real payment is processed
                    </span>
                  </span>
                </button>
              </div>

              {payment === "card" && (
                <div className="grid gap-4 rounded-xl bg-secondary/50 p-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="p-num">Card number</Label>
                    <Input id="p-num" required placeholder="4242 4242 4242 4242" inputMode="numeric" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="p-exp">Expiry</Label>
                    <Input id="p-exp" required placeholder="MM/YY" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="p-cvc">CVC</Label>
                    <Input id="p-cvc" required placeholder="123" inputMode="numeric" />
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button type="button" variant="outline" size="lg" onClick={() => setStep(0)}>
                  Back
                </Button>
                <Button type="submit" size="lg" className="flex-1">
                  Review order
                </Button>
              </div>
            </form>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold">Order Summary</h2>
              <ul className="divide-y">
                {cart.map((i) => (
                  <li key={i.key} className="flex items-center gap-3 py-3">
                    <img
                      src={i.image}
                      alt={i.title}
                      loading="lazy"
                      width={56}
                      height={56}
                      className="size-14 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{i.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {[i.size, i.color].filter(Boolean).join(" · ") || "One size"} · Qty {i.qty}
                      </p>
                    </div>
                    <span className="text-sm font-semibold">{money(i.price * i.qty)}</span>
                  </li>
                ))}
              </ul>
              <div className="rounded-xl bg-secondary/50 p-4 text-sm">
                <p className="font-semibold">{shipping.name}</p>
                <p className="text-muted-foreground">
                  {shipping.address}, {shipping.city}
                </p>
                <p className="text-muted-foreground">
                  {shipping.phone} · {shipping.email}
                </p>
                <p className="mt-2 text-muted-foreground">
                  Payment: {payment === "cod" ? "Cash on Delivery" : "Credit Card (demo)"}
                </p>
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" size="lg" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={() => setOrder(placeOrder({ shipping, payment }))}
                >
                  Place Order · {money(grandTotal)}
                </Button>
              </div>
            </div>
          )}
        </div>

        <aside className="surface-elevated hairline h-fit rounded-2xl p-6">
          <h2 className="text-lg font-semibold">Your Bag</h2>
          <ul className="mt-4 divide-y">
            {cart.map((i) => (
              <li key={i.key} className="flex items-center gap-3 py-3">
                <img
                  src={i.image}
                  alt={i.title}
                  loading="lazy"
                  width={56}
                  height={56}
                  className="size-14 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium leading-snug">{i.title}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="flex items-center rounded-full border">
                      <button
                        className="grid size-6 place-items-center rounded-l-full hover:bg-secondary"
                        aria-label="Decrease quantity"
                        onClick={() => setQty(i.key, i.qty - 1)}
                      >
                        <Minus className="size-3" />
                      </button>
                      <span className="w-6 text-center text-xs">{i.qty}</span>
                      <button
                        className="grid size-6 place-items-center rounded-r-full hover:bg-secondary"
                        aria-label="Increase quantity"
                        onClick={() => setQty(i.key, i.qty + 1)}
                      >
                        <Plus className="size-3" />
                      </button>
                    </div>
                    <button
                      aria-label={`Remove ${i.title}`}
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => removeFromCart(i.key)}
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
                <span className="text-sm font-semibold">{money(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <Separator className="my-4" />
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd>{money(cartTotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Shipping</dt>
              <dd>Free — nationwide</dd>
            </div>
            <div className="flex justify-between pt-2 text-base font-semibold">
              <dt>Total</dt>
              <dd className="font-display text-lg">{money(grandTotal)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>
  );
}