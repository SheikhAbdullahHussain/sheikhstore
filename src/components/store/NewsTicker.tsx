// import { Truck, RefreshCcw, Wallet, Sparkles } from "lucide-react";

// const ITEMS = [
//   { icon: Truck, text: "Nationwide Delivery Across Pakistan" },
//   { icon: Wallet, text: "Cash on Delivery Available" },
//   { icon: RefreshCcw, text: "7-Day Easy Exchange" },
//   { icon: Sparkles, text: "New Season 2026 Arrivals" },
// ];

// export function NewsTicker() {
//   // Duplicate once so translating by -50% loops seamlessly.
//   const loopItems = [...ITEMS, ...ITEMS];

//   return (
//     <div className="overflow-hidden border-y bg-secondary/60 py-2.5">
//       <div className="flex w-max animate-[marquee_22s_linear_infinite] items-center gap-10">
//         {loopItems.map((item, i) => (
//           <span
//             key={i}
//             className="flex shrink-0 items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground"
//           >
//             <item.icon className="size-3.5 text-gold" />
//             {item.text}
//           </span>
//         ))}
//       </div>
//     </div>
//   );
// }

import { Truck, RefreshCcw, Wallet, Sparkles } from "lucide-react";

const ITEMS = [
  { icon: Truck, text: "Nationwide Delivery Across Pakistan" },
  { icon: Wallet, text: "Cash on Delivery Available" },
  { icon: RefreshCcw, text: "7-Day Easy Exchange" },
  { icon: Sparkles, text: "New Season 2026" },
];

export function NewsTicker() {
  return (
    <div className="border-y bg-secondary/50">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 py-3 sm:px-6">
        {ITEMS.map((item, i) => (
          <div key={item.text} className="flex items-center gap-6">
            <span className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
              <item.icon className="size-3.5 text-accent" strokeWidth={1.75} />
              {item.text}
            </span>
            {i < ITEMS.length - 1 && (
              <span className="hidden h-3 w-px bg-border sm:block" aria-hidden="true" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}