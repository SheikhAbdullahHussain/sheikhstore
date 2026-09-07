import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About SheikhStore — Our Craft & Standards" },
      {
        name: "description",
        content:
          "SheikhStore was founded to make premium, long-lasting goods accessible. Learn about our sourcing, makers and quality standards.",
      },
      { property: "og:title", content: "About SheikhStore" },
      {
        property: "og:description",
        content: "How we source, test and stand behind every product we sell.",
      },
    ],
  }),
  component: About,
});

const values = [
  {
    title: "Sourced, not stocked",
    copy: "We visit every workshop we buy from and place small, repeat orders instead of bulk-buying trends.",
  },
  {
    title: "Built to be repaired",
    copy: "Resolable soles, replaceable straps and serviceable movements. Longevity is a design decision.",
  },
  {
    title: "Honest pricing",
    copy: "No inflated list prices. We publish the real margin story and keep the middle layers out.",
  },
];

function About() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <p className="text-[11px] uppercase tracking-[0.24em] text-gold">Our story</p>
      <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
        Premium quality, without the theatre
      </h1>
      <p className="mt-5 text-base leading-relaxed text-muted-foreground">
        SheikhStore began in 2019 as a single workshop partnership and grew into a small,
        deliberately narrow catalogue. We would rather sell seven exceptional products than seven
        hundred forgettable ones. Every item is used by our team for at least one season before it
        reaches this store.
      </p>
      <div className="mt-12 grid gap-5 sm:grid-cols-3">
        {values.map((v) => (
          <div key={v.title} className="hairline rounded-2xl p-5">
            <h2 className="text-base font-semibold">{v.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.copy}</p>
          </div>
        ))}
      </div>
    </section>
  );
}