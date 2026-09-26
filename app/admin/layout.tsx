export const dynamic = "force-dynamic";

import Link from "next/link";
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
} from "lucide-react";
import { AdminToastProvider } from "@/components/admin/AdminToastProvider";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/hunts", label: "Hunts", icon: Map },
  { href: "/admin/locations", label: "Locations", icon: MapPin },
  { href: "/admin/challenges", label: "Challenges", icon: Puzzle },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/live", label: "Live", icon: Radio },
  { href: "/admin/content", label: "Content", icon: FileText },
  { href: "/admin/media", label: "Media", icon: Image },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-56 shrink-0 border-r border-cream/10 bg-charcoal/90 p-4 md:block">
        <Link href="/admin" className="font-[family-name:var(--font-bebas)] text-xl text-gold">
          Admin
        </Link>
        <nav className="mt-8 space-y-1">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-cream/80 hover:bg-cream/10 hover:text-cream"
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>
        <Link href="/" className="mt-8 block text-xs text-cream/50 hover:text-gold">
          ← Site
        </Link>
      </aside>
      <main className="flex-1 overflow-auto p-6 md:p-10">
        <AdminToastProvider>{children}</AdminToastProvider>
      </main>
    </div>
  );
}
