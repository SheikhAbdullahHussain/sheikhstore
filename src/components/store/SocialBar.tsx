import { Facebook, Instagram, MessageCircle } from "lucide-react";

// Add real Facebook/TikTok links here once you have them, then add an entry
// below the same way — the bar renders whatever is in this array.
const SOCIALS: { Icon: typeof Instagram; href: string; label: string }[] = [
  { Icon: Instagram, href: "https://instagram.com/sheikhstore_1", label: "Instagram" },
  { Icon: MessageCircle, href: "https://wa.me/923343849978", label: "WhatsApp" },
  {
    Icon: Facebook,
    href: "https://web.facebook.com/profile.php?id=61590036345456",
    label: "facebook",
  },
];

export function SocialBar() {
  return (
    <div className="fixed inset-x-0 top-0 z-[60] flex h-8 items-center justify-center gap-4 bg-foreground">
      {SOCIALS.map(({ Icon, href, label }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="text-background/80 transition-colors hover:text-background"
        >
          <Icon className="size-3.5" />
        </a>
      ))}
    </div>
  );
}
