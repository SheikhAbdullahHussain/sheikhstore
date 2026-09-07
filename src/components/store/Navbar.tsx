import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, ShieldCheck, ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { useStore } from "@/lib/store";

const links = [
  { to: "/", label: "Home" },
  { to: "/collections", label: "Collections" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const { cartCount, setCartOpen } = useStore();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              activeProps={{ className: "text-foreground bg-secondary" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              className="rounded-full px-4 py-2 text-sm font-medium transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <Button asChild variant="ghost" size="icon" aria-label="Admin panel">
            <Link to="/admin">
              <ShieldCheck className="size-5" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label={`Cart with ${cartCount} items`}
            onClick={() => setCartOpen(true)}
          >
            <ShoppingBag className="size-5" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-gold px-1 text-[11px] font-bold text-accent-foreground">
                {cartCount}
              </span>
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <nav className="border-t bg-background px-4 pb-4 pt-2 md:hidden">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              activeOptions={{ exact: l.to === "/" }}
              activeProps={{ className: "text-foreground" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              className="block rounded-lg px-3 py-3 text-sm font-medium hover:bg-secondary"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}