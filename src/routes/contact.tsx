import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact SheikhStore — Customer Care" },
      {
        name: "description",
        content:
          "Questions about an order, sizing or returns? Reach the SheikhStore care team by phone, email or the contact form.",
      },
      { property: "og:title", content: "Contact SheikhStore" },
      {
        property: "og:description",
        content: "Talk to our care team about orders, sizing and returns.",
      },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2">
      <div>
        <p className="text-[11px] uppercase tracking-[0.24em] text-gold">Contact</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">We reply within one day</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Our care team is available Monday to Saturday, 9am–7pm PKT.
        </p>
        <ul className="mt-8 space-y-4 text-sm">
          <li className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-secondary">
              <Phone className="size-4 text-gold" />
            </span>
            +92 334 3849978
          </li>
          <li className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-secondary">
              <Mail className="size-4 text-gold" />
            </span>
            bc230204207@gmail.com
          </li>
          <li className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-secondary">
              <MapPin className="size-4 text-gold" />
            </span>
            Pakistan — nationwide delivery
          </li>
        </ul>
      </div>

      <form
        className="surface-elevated hairline space-y-4 rounded-2xl p-6"
        onSubmit={(e) => {
          e.preventDefault();
          toast.success("Message sent — we'll be in touch shortly.");
          (e.target as HTMLFormElement).reset();
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="c-name">Name</Label>
          <Input id="c-name" required placeholder="Your full name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="c-email">Email</Label>
          <Input id="c-email" type="email" required placeholder="you@email.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="c-msg">Message</Label>
          <Textarea id="c-msg" required rows={5} placeholder="How can we help?" />
        </div>
        <Button type="submit" size="lg" className="w-full">
          Send message
        </Button>
      </form>
    </section>
  );
}