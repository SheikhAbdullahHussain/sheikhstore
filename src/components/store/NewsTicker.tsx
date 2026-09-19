import { Truck, RefreshCcw, Wallet, Sparkles } from "lucide-react";

const ITEMS = [
  { icon: Truck, text: "Free Nationwide Delivery Across Pakistan" },
  { icon: Wallet, text: "Cash on Delivery Available" },
  { icon: RefreshCcw, text: "7-Day Easy Exchange" },
  { icon: Sparkles, text: "New Season 2026 Arrivals" },
];

export function NewsTicker() {
  // Duplicate once so translating by -50% loops seamlessly.
  const loopItems = [...ITEMS, ...ITEMS];

  return (
    <div className="overflow-hidden border-y bg-secondary/60 py-2.5">
      <div className="flex w-max animate-[marquee_22s_linear_infinite] items-center gap-10">
        {loopItems.map((item, i) => (
          <span
            key={i}
            className="flex shrink-0 items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground"
          >
            <item.icon className="size-3.5 text-gold" />
            {item.text}
          </span>
        ))}
      </div>
    </div>
  );
}