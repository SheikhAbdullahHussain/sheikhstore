import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — SheikhStore" },
      {
        name: "description",
        content:
          "How SheikhStore collects, uses and protects your personal data, including cookies, order information and your rights.",
      },
      { property: "og:title", content: "Privacy Policy — SheikhStore" },
      {
        property: "og:description",
        content: "Our approach to your data, cookies and order information.",
      },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <article className="mx-auto max-w-3xl space-y-5 px-4 py-14 text-sm leading-relaxed text-muted-foreground sm:px-6">
      <h1 className="text-3xl font-bold text-foreground">Privacy Policy</h1>
      <p>
        We collect only the information needed to fulfil your order: name, contact details and
        shipping address. Payment details are handled by our payment processor and never stored on
        our servers.
      </p>
      <h2 className="pt-4 text-lg font-semibold text-foreground">Cookies</h2>
      <p>
        We use essential cookies to remember your bag and preferences. Analytics cookies are
        optional and can be declined without affecting your ability to shop.
      </p>
      <h2 className="pt-4 text-lg font-semibold text-foreground">Your rights</h2>
      <p>
        You may request a copy of your data or its deletion at any time by writing to
        bc230204207@gmail.com. We respond to all requests within 30 days.
      </p>
    </article>
  );
}