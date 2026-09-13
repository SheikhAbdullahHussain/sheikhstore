import { Link } from "@tanstack/react-router";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="group flex items-center gap-2.5" aria-label="SheikhStore home">
      <span className="relative grid size-9 place-items-center rounded-xl bg-ink text-primary-foreground shadow-sm">
        {/* <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
          <path
            d="M12 2.5 21 7v5.5c0 4.6-3.6 8.1-9 9.5-5.4-1.4-9-4.9-9-9.5V7l9-4.5Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            className="text-gold"
          />
          <path
            d="M9.2 14.6c.6.6 1.6 1 2.7 1 1.5 0 2.5-.7 2.5-1.8 0-1-.7-1.5-2.3-1.9-1.8-.4-2.7-1-2.7-2.3 0-1.2 1.1-2.1 2.6-2.1 1 0 1.8.3 2.4.8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="text-gold"
          />
        </svg> */}
        <img src="/public/Sheikh_logo.jpg" alt="logo" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg font-bold tracking-tight">
          Sheikh<span className="text-gradient-gold">Store</span>
        </span>
        {!compact && (
          <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Premium Goods
          </span>
        )}
      </span>
    </Link>
  );
}