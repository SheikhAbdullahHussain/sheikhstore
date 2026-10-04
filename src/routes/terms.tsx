import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — SheikhStore" },
      {
        name: "description",
        content: "The terms and conditions for shopping with SheikhStore.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-[11px] uppercase tracking-[0.24em] text-gold">Legal</p>
      <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Terms of Service</h1>
      <p className="mt-3 text-sm text-muted-foreground">Last updated: October 2026</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <div>
          <h2 className="text-base font-semibold text-foreground">Orders & Pricing</h2>
          <p className="mt-2">
            All prices on SheikhStore are listed in Pakistani Rupees (PKR) and are inclusive of
            applicable taxes unless stated otherwise. Delivery charges are confirmed separately
            based on your city and are not included in the product price. We reserve the right to
            correct pricing errors and to cancel orders affected by a pricing error, with a full
            refund or store credit where applicable.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground">Payment</h2>
          <p className="mt-2">
            We accept Cash on Delivery, Bank Transfer and Easypaisa. For Bank Transfer and
            Easypaisa payments, please share your payment screenshot with us on WhatsApp so we
            can confirm and dispatch your order. Orders are processed once payment is confirmed
            (for Bank Transfer/Easypaisa) or immediately (for Cash on Delivery).
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground">Delivery</h2>
          <p className="mt-2">
            We deliver nationwide across Pakistan through our courier partners. Delivery
            timelines vary by city and are communicated at checkout or by our team after you
            order. SheikhStore is not responsible for delays caused by the courier, weather, or
            circumstances beyond our control.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground">Returns & Exchanges</h2>
          <p className="mt-2">
            We accept returns or exchanges only when the issue is caused by SheikhStore — such as
            receiving an incorrect, damaged or defective product — within 7 days of delivery.
            Please contact us with your order ID and photos of the issue so we can review and
            assist you. Items must be unused, unwashed and in their original condition.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground">Product Information</h2>
          <p className="mt-2">
            We do our best to display product colours and details accurately, but slight
            variations may occur due to photography, screen settings, or the handmade nature of
            some embroidery and fabric work.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground">Changes to These Terms</h2>
          <p className="mt-2">
            We may update these terms from time to time. Continued use of SheikhStore after
            changes are posted means you accept the updated terms.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground">Contact Us</h2>
          <p className="mt-2">
            Questions about these terms? Reach us at{" "}
            <a href="mailto:shaikhsuffiyan22@gmail.com" className="text-foreground underline">
              shaikhsuffiyan22@gmail.com
            </a>{" "}
            or on WhatsApp at +92 334 3849978.
          </p>
        </div>
      </div>
    </section>
  );
}