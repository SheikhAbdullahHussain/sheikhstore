import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — SheikhStore" },
      {
        name: "description",
        content:
          "The terms that apply when you order from SheikhStore: pricing, shipping, returns, warranty and liability.",
      },
      { property: "og:title", content: "Terms of Service — SheikhStore" },
      {
        property: "og:description",
        content: "Ordering, shipping, returns and warranty terms for SheikhStore.",
      },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <article className="mx-auto max-w-3xl space-y-5 px-4 py-14 text-sm leading-relaxed text-muted-foreground sm:px-6">
      <h1 className="text-3xl font-bold text-foreground">Terms of Service</h1>
      <p>
        By placing an order you confirm the accuracy of your shipping details and accept the price
        shown at checkout. Orders can be amended or cancelled free of charge before dispatch.
      </p>
      <h2 className="pt-4 text-lg font-semibold text-foreground">Shipping & exchange</h2>
      <p>
        We ship nationwide across Pakistan, free of charge, and dispatch orders within 48 hours.
        Unused items in original packaging may be exchanged within 7 days of delivery for a
        different size, colour or product of equal value.
      </p>
      <h2 className="pt-4 text-lg font-semibold text-foreground">Quality guarantee</h2>
      <p>
        Every order is quality-checked before dispatch. If an item arrives with a manufacturing
        defect, report it within 7 days and we will exchange it at no cost. The guarantee does not
        cover normal wear, accidental damage or misuse.
      </p>
    </article>
  );
}