"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, User, CalendarDays } from "lucide-react";
import { useSession } from "next-auth/react";
import { BrandLogo } from "@/components/marketing/BrandLogo";
import { cn } from "@/lib/utils";
import type { MarketingSettings } from "@/components/marketing/types";

const NAV_LINKS = [
  { href: "/", label: "Home", match: "exact" as const },
  { href: "/about", label: "About" },
  { href: "/hunts", label: "Hunts" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

type HeaderProps = {
  settings: MarketingSettings;
};

function NavLink({ href, label, active, onClick }: { href: string; label: string; active: boolean; onClick?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "relative text-[12px] font-medium tracking-wide text-white/90 transition-colors hover:text-gold whitespace-nowrap lg:text-[13px] xl:text-sm",
        active && "text-white"
      )}
    >
      {label}
      {active && (
        <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 rounded-full bg-gold shadow-[0_0_8px_rgba(242,182,50,0.8)]" />
      )}
    </Link>
  );
}

function BookHuntButton({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <Link
      href="/booking"
      onClick={onClick}
      className={cn(
        "hero-cta-primary inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-charcoal shadow-lg transition-transform hover:scale-[1.02] sm:px-5 sm:text-[13px]",
        className
      )}
    >
      <CalendarDays className="size-4 shrink-0" aria-hidden />
      Book Your Hunt
    </Link>
  );
}

export function Header({ settings }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const isHome = pathname === "/";
  const overlay = isHome;

  function isActive(link: (typeof NAV_LINKS)[number]) {
    if (link.match === "exact") return pathname === "/";
    if (link.href.startsWith("/#")) return false;
    return pathname === link.href || pathname.startsWith(`${link.href}/`);
  }

  return (
    <header
      className={cn(
        "safe-top z-50 w-full min-w-0 transition-colors duration-300",
        overlay
          ? "absolute top-0 left-0 right-0 border-b border-white/10 bg-gradient-to-b from-black/35 to-transparent"
          : "sticky top-0 border-b border-cream/10 bg-charcoal/95 backdrop-blur-md supports-[backdrop-filter]:bg-charcoal/80"
      )}
    >
      <div
        className={cn(
          "site-x mx-auto grid max-w-[1400px] grid-cols-[1fr_auto] items-center gap-3 py-3 sm:py-3.5 lg:grid-cols-[minmax(0,auto)_1fr_auto] lg:gap-4 xl:gap-6",
          isHome && "lg:py-4"
        )}
      >
        <BrandLogo
          logoUrl={settings.logoUrl}
          variant="header"
          homeHero={isHome}
          className="justify-self-start"
        />

        <nav
          className="hidden min-w-0 items-center justify-center gap-3 lg:flex xl:gap-5"
          aria-label="Main"
        >
          {NAV_LINKS.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.label} active={isActive(link)} />
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-3 lg:flex lg:justify-self-end xl:gap-4">
          <Link
            href={session ? "/dashboard" : "/login"}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-white/90 transition-colors hover:text-gold"
          >
            <User className="size-4" aria-hidden />
            {session ? "Dashboard" : "Login"}
          </Link>
          <BookHuntButton />
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center justify-self-end rounded-lg p-2 text-white lg:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              "fixed inset-0 z-40 overflow-y-auto bg-charcoal/98 backdrop-blur-lg safe-bottom lg:hidden",
              "top-[4.75rem] sm:top-[5rem]"
            )}
          >
            <motion.nav
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 12, opacity: 0 }}
              className="flex min-h-0 flex-col px-5 py-6 sm:px-6 sm:py-8"
              aria-label="Mobile"
            >
              <ul className="flex flex-col gap-4">
                {NAV_LINKS.map((link, i) => (
                  <motion.li key={link.href} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i }}>
                    <Link
                      href={link.href}
                      className="font-[family-name:var(--font-bebas)] text-xl tracking-wide text-cream sm:text-2xl"
                      onClick={() => setOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col gap-3">
                <Link href={session ? "/dashboard" : "/login"} className="text-center text-cream/80" onClick={() => setOpen(false)}>
                  {session ? "Dashboard" : "Login"}
                </Link>
                <BookHuntButton className="w-full py-3.5" onClick={() => setOpen(false)} />
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
