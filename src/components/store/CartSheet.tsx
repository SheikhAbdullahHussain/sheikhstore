import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { money, useStore } from "@/lib/store";

export function CartSheet() {
  const { cart, cartOpen, setCartOpen, setQty, removeFromCart, cartTotal, cartCount } = useStore();

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent className="flex w-full flex-col gap-0 sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display text-xl">Your Bag</SheetTitle>
          <SheetDescription>
            {cartCount === 0 ? "Nothing here yet." : `${cartCount} item(s) ready to ship.`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 py-16 text-center">
              <span className="grid size-14 place-items-center rounded-full bg-secondary">
                <ShoppingBag className="size-6 text-muted-foreground" />
              </span>
              <p className="text-sm text-muted-foreground">
                Your bag is empty — explore the collection.
              </p>
              <Button asChild onClick={() => setCartOpen(false)}>
                <Link to="/collections">Browse Collections</Link>
              </Button>
            </div>
          ) : (
            <ul className="divide-y">
              {cart.map((item) => (
                <li key={item.key} className="flex gap-3 py-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    width={80}
                    height={80}
                    className="size-20 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold leading-snug">{item.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {[item.size, item.color].filter(Boolean).join(" · ") || "One size"}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex items-center rounded-full border">
                        <button
                          className="grid size-7 place-items-center rounded-l-full hover:bg-secondary"
                          aria-label="Decrease quantity"
                          onClick={() => setQty(item.key, item.qty - 1)}
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="w-7 text-center text-sm">{item.qty}</span>
                        <button
                          className="grid size-7 place-items-center rounded-r-full hover:bg-secondary"
                          aria-label="Increase quantity"
                          onClick={() => setQty(item.key, item.qty + 1)}
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                      <button
                        className="text-muted-foreground transition-colors hover:text-destructive"
                        aria-label={`Remove ${item.title}`}
                        onClick={() => removeFromCart(item.key)}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm font-semibold">{money(item.price * item.qty)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cart.length > 0 && (
          <SheetFooter className="gap-3">
            <Separator />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-display text-lg font-semibold">{money(cartTotal)}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Shipping and taxes are calculated at checkout.
            </p>
            <Button asChild size="lg" onClick={() => setCartOpen(false)}>
              <Link to="/checkout">Checkout</Link>
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}