import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Search, ShieldCheck, ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { useStore } from "@/lib/store";

const navLinkClass =
  "group relative px-3.5 py-2 text-[13px] font-medium uppercase tracking-[0.08em] text-muted-foreground transition-colors hover:text-foreground";
const navUnderline =
  "absolute inset-x-3.5 -bottom-0.5 h-px scale-x-0 bg-accent transition-transform duration-200 group-hover:scale-x-100";

const mobileLinks = [
  { to: "/", label: "Home" },
  { to: "/collections", label: "Collections" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const { cartCount, setCartOpen } = useStore();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-8 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-0.5 md:flex">
          <Link to="/" className={navLinkClass}>
            New Arrivals
            <span className={navUnderline} />
          </Link>
          <Link to="/collections" search={{ category: "Men" }} className={navLinkClass}>
            Men
            <span className={navUnderline} />
          </Link>
          <Link to="/collections" search={{ category: "Women" }} className={navLinkClass}>
            Women
            <span className={navUnderline} />
          </Link>
          <Link to="/collections" search={{ category: "Kids" }} className={navLinkClass}>
            Kids
            <span className={navUnderline} />
          </Link>
          <Link
            to="/collections"
            search={{ subcategory: "Stitched (Ready to Wear)" }}
            className={navLinkClass}
          >
            Stitched
            <span className={navUnderline} />
          </Link>
          <Link to="/collections" search={{ subcategory: "Unstitched" }} className={navLinkClass}>
            Unstitched
            <span className={navUnderline} />
          </Link>
        </nav>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" aria-label="Search" className="hidden sm:inline-flex">
            <Search className="size-[18px]" />
          </Button>
          <Button asChild variant="ghost" size="icon" aria-label="Admin panel">
            <Link to="/admin">
              <ShieldCheck className="size-[18px]" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label={`Cart with ${cartCount} items`}
            onClick={() => setCartOpen(true)}
          >
            <ShoppingBag className="size-[18px]" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold leading-4 text-accent-foreground">
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
            {open ? <X className="size-[18px]" /> : <Menu className="size-[18px]" />}
          </Button>
        </div>
      </div>

      {open && (
        <nav className="border-t bg-background px-4 pb-4 pt-2 md:hidden">
          {mobileLinks.map((l) => (
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