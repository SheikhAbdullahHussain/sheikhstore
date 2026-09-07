import { Link } from "@tanstack/react-router";
import {
  ChevronDown,
  // Facebook,
  // Instagram,
  Mail,
  MapPin,
  Phone,
  // Twitter,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Logo } from "./Logo";

export function Footer() {
  const [email, setEmail] = useState("");

  return (
    <footer className="mt-24 border-t bg-secondary/50">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">

        {/* Brand */}
        <div className="space-y-4">
          <Logo />

          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            SheikhStore curates enduring, premium-quality essentials — tailored
            clothing, fine accessories and considered electronics, delivered
            nationwide across Pakistan.
          </p>
        </div>

        {/* ================= QUICK LINKS ================= */}

        {/* Mobile Accordion */}
        <Collapsible defaultOpen={false} className="group lg:hidden">
          <CollapsibleTrigger className="flex w-full items-center justify-between text-left">
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em]">
              Quick Links
            </h3>

            <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </CollapsibleTrigger>

          <CollapsibleContent>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link
                  to="/"
                  className="transition-colors hover:text-foreground"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/collections"
                  className="transition-colors hover:text-foreground"
                >
                  Shop
                </Link>
              </li>

              <li>
                <Link
                  to="/privacy"
                  className="transition-colors hover:text-foreground"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  to="/terms"
                  className="transition-colors hover:text-foreground"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </CollapsibleContent>
        </Collapsible>

        {/* Desktop Static Links */}
        <div className="hidden lg:block">
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em]">
            Quick Links
          </h3>

          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>
              <Link
                to="/"
                className="transition-colors hover:text-foreground"
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/collections"
                className="transition-colors hover:text-foreground"
              >
                Shop
              </Link>
            </li>

            <li>
              <Link
                to="/privacy"
                className="transition-colors hover:text-foreground"
              >
                Privacy Policy
              </Link>
            </li>

            <li>
              <Link
                to="/terms"
                className="transition-colors hover:text-foreground"
              >
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

        {/* ================= CUSTOMER SUPPORT ================= */}

        {/* Mobile Accordion */}
        <Collapsible defaultOpen={false} className="group lg:hidden">
          <CollapsibleTrigger className="flex w-full items-center justify-between text-left">
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em]">
              Customer Support
            </h3>

            <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </CollapsibleTrigger>

          <CollapsibleContent>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="size-4 text-gold" />
                +92 334 3849978
              </li>

              <li className="flex items-center gap-2">
                <Mail className="size-4 text-gold" />
                bc230204207@gmail.com
              </li>

              <li className="flex items-center gap-2">
                <MapPin className="size-4 text-gold" />
                Pakistan
              </li>
            </ul>

            {/* <div className="mt-4 flex gap-2">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="https://sheikhstore.example"
                  aria-label="SheikhStore social profile"
                  className="grid size-9 place-items-center rounded-full border transition-colors hover:bg-background"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div> */}
          </CollapsibleContent>
        </Collapsible>

        {/* Desktop Static Support */}
        <div className="hidden lg:block">
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em]">
            Customer Support
          </h3>

          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Phone className="size-4 text-gold" />
              +92 334 3849978
            </li>

            <li className="flex items-center gap-2">
              <Mail className="size-4 text-gold" />
              bc230204207@gmail.com
            </li>

            <li className="flex items-center gap-2">
              <MapPin className="size-4 text-gold" />
              Pakistan — nationwide delivery
            </li>
          </ul>

          {/* <div className="mt-4 flex gap-2">
            {[Instagram, Facebook, Twitter].map((Icon, i) => (
              <a
                key={i}
                href="https://sheikhstore.example"
                aria-label="SheikhStore social profile"
                className="grid size-9 place-items-center rounded-full border transition-colors hover:bg-background"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div> */}
        </div>

        {/* ================= NEWSLETTER ================= */}

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em]">
            Newsletter
          </h3>

          <p className="mt-4 text-sm text-muted-foreground">
            New arrivals and private sales, once a month.
          </p>

          <form
            className="mt-4 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();

              if (!email) return;

              toast.success("You're subscribed — welcome to SheikhStore.");
              setEmail("");
            }}
          >
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              aria-label="Email address"
            />

            <Button type="submit">Join</Button>
          </form>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t px-4 py-5 text-center text-xs text-muted-foreground sm:px-6">
        © {new Date().getFullYear()} SheikhStore. All rights reserved.
      </div>
    </footer>
  );
}
