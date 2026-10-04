import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — SheikhStore" },
      {
        name: "description",
        content:
          "How SheikhStore collects, uses and protects your personal information when you shop with us.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-[11px] uppercase tracking-[0.24em] text-gold">Legal</p>
      <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Privacy Policy</h1>
      <p className="mt-3 text-sm text-muted-foreground">Last updated: October 2026</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <div>
          <h2 className="text-base font-semibold text-foreground">Information We Collect</h2>
          <p className="mt-2">
            When you place an order, we collect the information you provide at checkout: your
            name, email address, phone number, shipping address and city. If you subscribe to our
            newsletter, we collect your email address. We do not collect or store any payment
            card details — Bank Transfer and Easypaisa payments are confirmed manually, and Cash
            on Delivery is paid directly to our courier.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground">How We Use Your Information</h2>
          <p className="mt-2">
            We use your information to process and deliver your order, send order confirmations
            and updates, respond to your questions, and — if you've subscribed — send occasional
            updates about new arrivals and offers. We do not sell or rent your personal
            information to third parties.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground">Order & Account Data</h2>
          <p className="mt-2">
            Your order details are stored securely in our database so we can fulfil your order
            and assist you if there's an issue. Your shopping cart is kept in your browser's
            local storage so your bag is saved if you return to the site — this never leaves your
            device until you check out.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground">Sharing Your Information</h2>
          <p className="mt-2">
            We share your name, phone number and address with our courier partners solely to
            deliver your order. We do not share your information with advertisers or data
            brokers.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground">Your Choices</h2>
          <p className="mt-2">
            You can unsubscribe from our newsletter at any time by contacting us. If you'd like us
            to delete your order history or personal information, reach out via WhatsApp or
            email and we'll action your request.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground">Contact Us</h2>
          <p className="mt-2">
            Questions about this policy? Reach us at{" "}
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