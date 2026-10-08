import { Link } from "@tanstack/react-router";
import { ChevronDown, Facebook, Instagram, MessageCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { insertSubscriber } from "@/lib/subscribers-api";
import { Logo } from "./Logo";

// Keep this the single source of truth for the support email — it must
// match the address used on /contact and as ADMIN_EMAIL in order-emails.ts.
const SUPPORT_EMAIL = "shaikhsuffiyan22@gmail.com";

const SHOP_LINKS = [
  { label: "Men", search: { category: "Men" as const } },
  { label: "Women", search: { category: "Women" as const } },
  { label: "Kids", search: { category: "Kids" as const } },
  { label: "Stitched", search: { subcategory: "Stitched (Ready to Wear)" as const } },
  { label: "Unstitched", search: { subcategory: "Unstitched" as const } },
];

const HELP_LINKS = [
  { label: "Contact", to: "/contact" as const },
  { label: "Shipping", to: "/contact" as const },
  { label: "Returns & Exchange", to: "/contact" as const },
  { label: "Privacy Policy", to: "/privacy" as const },
  { label: "Terms of Service", to: "/terms" as const },
];

function ShopLinksList() {
  return (
    <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
      <li>
        <Link to="/collections" className="transition-colors hover:text-foreground">
          New Arrivals
        </Link>
      </li>
      {SHOP_LINKS.map((l) => (
        <li key={l.label}>
          <Link to="/collections" search={l.search} className="transition-colors hover:text-foreground">
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function HelpLinksList() {
  return (
    <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
      {HELP_LINKS.map((l) => (
        <li key={l.label}>
          <Link to={l.to} className="transition-colors hover:text-foreground">
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribing(true);
    try {
      await insertSubscriber(email);
      toast.success("You're subscribed — welcome to SheikhStore.");
      setEmail("");
    } catch (err: unknown) {
      const code = (err as { code?: string } | null)?.code;
      if (code === "23505") {
        toast.error("This email is already subscribed.");
      } else {
        console.error("Subscribe failed:", err);
        toast.error("Couldn't subscribe right now. Please try again.");
      }
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="mt-24 border-t bg-secondary/30">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            Premium Pakistani fashion, delivered nationwide.
          </p>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="block text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {SUPPORT_EMAIL}
          </a>
        </div>

        {/* SHOP — mobile accordion / desktop static */}
        <Collapsible defaultOpen={false} className="group lg:hidden">
          <CollapsibleTrigger className="flex w-full items-center justify-between text-left">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em]">Shop</h3>
            <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ShopLinksList />
          </CollapsibleContent>
        </Collapsible>
        <div className="hidden lg:block">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em]">Shop</h3>
          <ShopLinksList />
        </div>

        {/* HELP — mobile accordion / desktop static */}
        <Collapsible defaultOpen={false} className="group lg:hidden">
          <CollapsibleTrigger className="flex w-full items-center justify-between text-left">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em]">Help</h3>
            <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <HelpLinksList />
          </CollapsibleContent>
        </Collapsible>
        <div className="hidden lg:block">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em]">Help</h3>
          <HelpLinksList />
        </div>

        {/* FOLLOW + NEWSLETTER */}
        <div className="space-y-8">
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em]">Follow</h3>
            <div className="mt-4 flex gap-2">
              <a
                href="https://instagram.com/sheikhstore_1"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="grid size-9 place-items-center border border-border transition-colors hover:bg-background"
              >
                <Instagram className="size-4" />
              </a>
              <a
                href="https://wa.me/923343849978"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="grid size-9 place-items-center border border-border transition-colors hover:bg-background"
              >
                <MessageCircle className="size-4" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="grid size-9 place-items-center border border-border transition-colors hover:bg-background"
              >
                <Facebook className="size-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em]">Newsletter</h3>
            <form className="mt-4 flex gap-2" onSubmit={subscribe}>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                aria-label="Email address"
                className="rounded-none"
              />
              <Button type="submit" disabled={subscribing} className="rounded-none">
                {subscribing ? "…" : "Join"}
              </Button>
            </form>
          </div>
        </div>
      </div>

      <div className="border-t px-4 py-5 text-center text-xs text-muted-foreground sm:px-6">
        © {new Date().getFullYear()} SheikhStore. All rights reserved.
      </div>
    </footer>
  );
}