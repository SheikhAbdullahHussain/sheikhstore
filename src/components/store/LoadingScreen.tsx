import { Logo } from "./Logo";

export function LoadingScreen({ visible }: { visible: boolean }) {
  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-0 z-[100] grid place-items-center bg-background transition-opacity duration-300 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="flex flex-col items-center gap-5">
        <Logo />
        <div className="h-1 w-40 overflow-hidden rounded-full bg-secondary">
          <div className="h-full w-1/3 animate-[loading-bar_1.1s_ease-in-out_infinite] rounded-full bg-gold" />
        </div>
        <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
          Loading…
        </p>
      </div>
    </div>
  );
}