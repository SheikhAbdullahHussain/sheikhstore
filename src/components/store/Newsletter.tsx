import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { insertSubscriber } from "@/lib/subscribers-api";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);

  return (
    <section className="border-y bg-secondary/40">
      <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6 sm:py-20">
        <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-accent">
          Stay In The Know
        </p>
        <h2 className="font-display mt-3 text-3xl font-medium sm:text-4xl">
          Be the first to discover new arrivals, seasonal edits and exclusive offers.
        </h2>
        <form
          className="mt-7 flex flex-col gap-3 sm:flex-row"
          onSubmit={async (e) => {
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
          }}
        >
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            aria-label="Email address"
            className="h-11 flex-1 rounded-none border-foreground/20 bg-background"
          />
          <Button
            type="submit"
            disabled={subscribing}
            className="h-11 rounded-none px-8 text-xs font-medium uppercase tracking-[0.1em]"
          >
            {subscribing ? "Joining…" : "Subscribe"}
          </Button>
        </form>
      </div>
    </section>
  );
}