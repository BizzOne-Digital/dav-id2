import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Settings,
  Map,
  MapPin,
  Puzzle,
  ShoppingBag,
  Radio,
  FileText,
  Image,
  Gift,
  Megaphone,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/hunts", label: "Hunts", icon: Map },
  { href: "/admin/locations", label: "Locations", icon: MapPin },
  { href: "/admin/challenges", label: "Challenges", icon: Puzzle },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/live", label: "Live", icon: Radio },
  { href: "/admin/content", label: "Content", icon: FileText },
  { href: "/admin/offers", label: "In-game offers", icon: Gift },
  { href: "/admin/marketing", label: "Marketing", icon: Megaphone },
  { href: "/admin/media", label: "Media", icon: Image },
] as const satisfies ReadonlyArray<{ href: string; label: string; icon: LucideIcon }>;

type AdminNavLinksProps = {
  onNavigate?: () => void;
  className?: string;
};

export function AdminNavLinks({ onNavigate, className }: AdminNavLinksProps) {
  return (
    <nav className={cn("space-y-1", className)}>
      {ADMIN_NAV.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          onClick={onNavigate}
          className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-cream/80 hover:bg-cream/10 hover:text-cream"
        >
          <Icon className="size-4 shrink-0" aria-hidden />
          {label}
        </Link>
      ))}
      <Link
        href="/"
        onClick={onNavigate}
        className="mt-6 block px-3 text-xs text-cream/50 hover:text-gold"
      >
        ← Site
      </Link>
    </nav>
  );
}
