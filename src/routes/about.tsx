import { createFileRoute } from "@tanstack/react-router";
import { Heart, Shirt, Wallet, Truck as TruckIcon, HeadphonesIcon } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About SheikhStore — Har Order Mein Bharosa" },
      {
        name: "description",
        content:
          "SheikhStore is a trusted Pakistani online clothing brand founded in 2026, offering quality, affordable clothing with nationwide delivery across Pakistan.",
      },
      { property: "og:title", content: "About SheikhStore" },
      {
        property: "og:description",
        content: "Har Order Mein Bharosa — our mission, values and story.",
      },
    ],
  }),
  component: About,
});

const values = [
  {
    icon: Heart,
    title: "Trust First",
    copy: "Our tagline says it all — Har Order Mein Bharosa. We value the trust every customer places in us.",
  },
  {
    icon: Shirt,
    title: "Quality Clothing",
    copy: "We aim to provide clothing that offers a great combination of quality, comfort and style.",
  },
  {
    icon: Wallet,
    title: "Affordable Prices",
    copy: "We strive to offer products at prices that provide good value for our customers.",
  },
  {
    icon: TruckIcon,
    title: "Pakistan-Wide Delivery",
    copy: "We deliver our products across Pakistan, bringing your orders directly to your doorstep.",
  },
  {
    icon: HeadphonesIcon,
    title: "Customer Support",
    copy: "If there is an issue caused by our mistake, we are committed to resolving it and providing a return where applicable.",
  },
];

function About() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <p className="text-[11px] uppercase tracking-[0.24em] text-gold">Our story</p>
      <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
        SheikhStore — Har Order Mein Bharosa ❤️
      </h1>

      <p className="mt-5 text-base leading-relaxed text-muted-foreground">
        Welcome to <strong className="text-foreground">SheikhStore</strong>, your online
        destination for stylish and quality clothing in Pakistan. Established in{" "}
        <strong className="text-foreground">2026</strong>, SheikhStore was created with a simple
        goal: to make online clothing shopping easy, reliable, and affordable for everyone.
      </p>

      <p className="mt-4 text-base leading-relaxed text-muted-foreground">
        We believe that every order is more than just a purchase — it's a customer's trust in our
        brand. That's why we focus on providing quality clothing, reasonable prices, and a smooth
        shopping experience from order placement to delivery.
      </p>

      <div className="mt-10">
        <h2 className="text-xl font-bold">What We Offer</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          At SheikhStore, we offer clothing for everyone. Our collection is selected with an
          emphasis on style, quality, comfort, and value. Whether you're shopping for yourself,
          your family, or looking for something new to add to your wardrobe, we're here to make
          your online shopping experience simple and convenient.
        </p>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-bold">Why Choose SheikhStore?</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          {values.map((v) => (
            <div key={v.title} className="hairline flex gap-3 rounded-2xl p-5">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary">
                <v.icon className="size-5 text-gold" />
              </span>
              <div>
                <h3 className="text-sm font-semibold">{v.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{v.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        <div className="surface-elevated hairline rounded-2xl p-6">
          <p className="text-[11px] uppercase tracking-[0.24em] text-gold">Our Mission</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Our mission is to build SheikhStore into a trusted Pakistani online clothing brand
            where customers can shop confidently and receive products that meet their
            expectations.
          </p>
        </div>
        <div className="surface-elevated hairline rounded-2xl p-6">
          <p className="text-[11px] uppercase tracking-[0.24em] text-gold">Our Vision</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Our vision is to grow SheikhStore into a well-known online clothing store recognized
            for trust, quality, affordability, and customer satisfaction.
          </p>
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground">
          Every order matters to us, and every customer is part of our journey.
        </p>
        <p className="mt-2 text-lg font-semibold">
          SheikhStore — Har Order Mein Bharosa. ❤️
        </p>
      </div>
    </section>
  );
}