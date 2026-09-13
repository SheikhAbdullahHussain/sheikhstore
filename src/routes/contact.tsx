import { createFileRoute } from "@tanstack/react-router";
import { Instagram, Mail, MessageCircle, Package, CreditCard, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact SheikhStore" },
      {
        name: "description",
        content:
          "Get in touch with SheikhStore for questions about products, orders, delivery, or payment. WhatsApp, email, and Instagram — we're here to help.",
      },
      { property: "og:title", content: "Contact SheikhStore" },
      {
        property: "og:description",
        content: "Reach us on WhatsApp, email, or Instagram — Har Order Mein Bharosa.",
      },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-[11px] uppercase tracking-[0.24em] text-gold">Get in touch</p>
      <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Contact SheikhStore</h1>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">
        Have a question about a product, your order, delivery, or payment? We're here to help.
        Contact the SheikhStore team and we'll be happy to assist you.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        <div className="hairline rounded-2xl p-6">
          <span className="grid size-10 place-items-center rounded-xl bg-secondary">
            <MessageCircle className="size-5 text-gold" />
          </span>
          <h2 className="mt-4 text-base font-semibold">WhatsApp / Phone</h2>
          <p className="mt-2 font-display text-lg font-bold">+92 334 3849978</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            For quick assistance regarding your order or products, you can contact us on
            WhatsApp.
          </p>
          <Button asChild size="sm" className="mt-4">
            <a href="https://wa.me/923343849978" target="_blank" rel="noopener noreferrer">
              Message on WhatsApp
            </a>
          </Button>
        </div>

        <div className="hairline rounded-2xl p-6">
          <span className="grid size-10 place-items-center rounded-xl bg-secondary">
            <Mail className="size-5 text-gold" />
          </span>
          <h2 className="mt-4 text-base font-semibold">Email</h2>
          <p className="mt-2 break-all font-display text-base font-bold">
            shaikhsuffiyan22@gmail.com
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            For general inquiries, order-related questions, or other business matters, you can
            email us.
          </p>
          <Button asChild size="sm" variant="outline" className="mt-4">
            <a href="mailto:shaikhsuffiyan22@gmail.com">Send an email</a>
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div className="hairline rounded-2xl p-6">
          <span className="grid size-10 place-items-center rounded-xl bg-secondary">
            <Package className="size-5 text-gold" />
          </span>
          <h2 className="mt-4 text-base font-semibold">Delivery</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            We provide Pakistan-wide delivery and aim to deliver your order safely to your
            doorstep.
          </p>
        </div>

        <div className="hairline rounded-2xl p-6">
          <span className="grid size-10 place-items-center rounded-xl bg-secondary">
            <CreditCard className="size-5 text-gold" />
          </span>
          <h2 className="mt-4 text-base font-semibold">Payment Methods</h2>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li>Cash on Delivery (COD)</li>
            <li>Bank Transfer</li>
            <li>Easypaisa</li>
          </ul>
        </div>
      </div>

      <div className="mt-6 hairline rounded-2xl p-6">
        <span className="grid size-10 place-items-center rounded-xl bg-secondary">
          <RotateCcw className="size-5 text-gold" />
        </span>
        <h2 className="mt-4 text-base font-semibold">Return Policy</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          We accept returns only when the issue is caused by SheikhStore, such as receiving an
          incorrect or defective product. If you believe there is an issue with your order,
          please contact us as soon as possible with your order details so that we can review and
          assist you.
        </p>
      </div>

      <div className="mt-6 hairline rounded-2xl p-6 text-center">
        <span className="mx-auto grid size-10 place-items-center rounded-xl bg-secondary">
          <Instagram className="size-5 text-gold" />
        </span>
        <h2 className="mt-4 text-base font-semibold">Follow Us</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Follow SheikhStore on Instagram for new arrivals, products, offers, and updates.
        </p>
        <Button asChild size="sm" variant="outline" className="mt-4">
          <a
            href="https://instagram.com/sheikhstore_1"
            target="_blank"
            rel="noopener noreferrer"
          >
            @sheikhstore_1
          </a>
        </Button>
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground">
          Your satisfaction and trust are important to us.
        </p>
        <p className="mt-2 text-lg font-semibold">SheikhStore — Har Order Mein Bharosa. ❤️</p>
      </div>
    </section>
  );
}