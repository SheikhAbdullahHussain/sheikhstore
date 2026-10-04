import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Banknote,
  Check,
  Copy,
  Minus,
  Plus,
  ShoppingBag,
  Smartphone,
  Trash2,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { money, useStore, type Order } from "@/lib/store";
import { sendOrderEmails } from "@/lib/order-emails";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Cart & Checkout — SheikhStore" },
      {
        name: "description",
        content:
          "Review your SheikhStore bag, enter shipping details, choose cash on delivery, bank transfer or Easypaisa, and confirm your order in three quick steps.",
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
type PaymentMethod = "cod" | "bank" | "easypaisa";

const steps = ["Shipping", "Payment", "Confirm"];

// TODO: replace with your real account details.
const BANK_DETAILS = {
  bankName: "Meezan Bank",
  accountTitle: "Sheikh Suffiyan",
  accountNumber: "0123456789012",
  iban: "PK00MEZN0000000123456789",
};
const EASYPAISA_NUMBER = "0300-1234567";
const EASYPAISA_TITLE = "Sheikh Suffiyan";

function CopyableRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
      <button
        type="button"
        aria-label={`Copy ${label}`}
        className="grid size-8 shrink-0 place-items-center rounded-lg border transition-colors hover:bg-secondary"
        onClick={() => {
          void navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
      >
        {copied ? <Check className="size-3.5 text-gold" /> : <Copy className="size-3.5" />}
      </button>
    </div>
  );
}

function Checkout() {
  const { cart, cartTotal, setQty, removeFromCart, placeOrder } = useStore();
  const [step, setStep] = useState(0);
  const [order, setOrder] = useState<Order | null>(null);
  const [payment, setPayment] = useState<PaymentMethod>("cod");
  const [shipping, setShipping] = useState<Shipping>({
    name: "",
    email: "",
    address: "",
    city: "",
    phone: "",
  });

  const [placingOrder, setPlacingOrder] = useState(false);

  const handlePlaceOrder = async () => {
    if (placingOrder) return;

    try {
      setPlacingOrder(true);

      const createdOrder = await placeOrder({
        shipping,
        payment,
      });

      setOrder(createdOrder);

      // Best-effort — a failed email should never block order confirmation.
      sendOrderEmails({ data: createdOrder }).catch((err) => {
        console.error("Failed to send order emails:", err);
      });
    } catch (error) {
      console.error("Failed to place order:", error);
      toast.error("Order can't be placed. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
  };

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
              Total paid (
              {order.payment === "cod"
                ? "Cash on delivery"
                : order.payment === "bank"
                  ? "Bank transfer"
                  : "Easypaisa"}
              )
            </span>
            <span className="font-display text-xl font-bold">{money(order.total)}</span>
          </div>
          {order.payment !== "cod" && (
            <p className="mt-4 rounded-lg bg-secondary/60 p-3 text-xs text-muted-foreground">
              Please complete your {order.payment === "bank" ? "bank transfer" : "Easypaisa payment"}{" "}
              using the details shown at checkout and send us a screenshot on WhatsApp so we can
              confirm and dispatch your order.
            </p>
          )}
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

      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:overflow-visible sm:px-0">
        <ol className="mt-6 flex w-max items-center gap-2 sm:w-auto sm:gap-3">
          {steps.map((s, i) => (
            <li key={s} className="flex shrink-0 items-center gap-2 sm:gap-3">
              <span
                className={`grid size-8 shrink-0 place-items-center rounded-full text-xs font-semibold ${
                  i <= step ? "bg-ink text-primary-foreground" : "bg-secondary text-muted-foreground"
                }`}
              >
                {i + 1}
              </span>
              <span
                className={`whitespace-nowrap text-sm ${i === step ? "font-semibold" : "text-muted-foreground"}`}
              >
                {s}
              </span>
              {i < steps.length - 1 && <span className="h-px w-6 shrink-0 bg-border sm:w-12" />}
            </li>
          ))}
        </ol>
      </div>

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
                  onClick={() => setPayment("bank")}
                  className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-colors ${
                    payment === "bank" ? "border-gold bg-secondary" : "hover:bg-secondary/60"
                  }`}
                >
                  <Banknote className="size-5 text-gold" />
                  <span>
                    <span className="block text-sm font-semibold">Bank Transfer</span>
                    <span className="block text-xs text-muted-foreground">
                      Transfer to our account, then share the receipt
                    </span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setPayment("easypaisa")}
                  className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-colors ${
                    payment === "easypaisa" ? "border-gold bg-secondary" : "hover:bg-secondary/60"
                  }`}
                >
                  <Smartphone className="size-5 text-gold" />
                  <span>
                    <span className="block text-sm font-semibold">Easypaisa</span>
                    <span className="block text-xs text-muted-foreground">
                      Send to our Easypaisa account, then share the receipt
                    </span>
                  </span>
                </button>
              </div>

              {payment === "bank" && (
                <div className="rounded-xl bg-secondary/50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Transfer to this account
                  </p>
                  <div className="mt-2 divide-y">
                    <CopyableRow label="Bank" value={BANK_DETAILS.bankName} />
                    <CopyableRow label="Account title" value={BANK_DETAILS.accountTitle} />
                    <CopyableRow label="Account number" value={BANK_DETAILS.accountNumber} />
                    <CopyableRow label="IBAN" value={BANK_DETAILS.iban} />
                  </div>
                </div>
              )}

              {payment === "easypaisa" && (
                <div className="rounded-xl bg-secondary/50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Send to this Easypaisa account
                  </p>
                  <div className="mt-2 divide-y">
                    <CopyableRow label="Easypaisa number" value={EASYPAISA_NUMBER} />
                    <CopyableRow label="Account title" value={EASYPAISA_TITLE} />
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
                  Payment:{" "}
                  {payment === "cod" ? "Cash on Delivery" : payment === "bank" ? "Bank Transfer" : "Easypaisa"}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Delivery charges are not included above — they'll be confirmed separately based on
                your city.
              </p>
              <div className="flex gap-3">
                <Button type="button" variant="outline" size="lg" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={handlePlaceOrder}
                  disabled={placingOrder}
                >
                  {placingOrder ? "Placing Order..." : `Place Order · ${money(cartTotal)}`}
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
              <dt className="text-muted-foreground">Delivery</dt>
              <dd className="text-muted-foreground">Confirmed by city</dd>
            </div>
            <div className="flex justify-between pt-2 text-base font-semibold">
              <dt>Total</dt>
              <dd className="font-display text-lg">{money(cartTotal)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>
  );
}