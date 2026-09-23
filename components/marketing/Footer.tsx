"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  Mail,
  MapPin,
  Music2,
  Phone,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import { FacebookIcon, InstagramIcon, TikTokIcon, YouTubeIcon, XIcon } from "@/components/marketing/SocialIcons";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { BrandLogo } from "@/components/marketing/BrandLogo";
import { cn } from "@/lib/utils";
import type { MarketingPricing, MarketingSettings } from "@/components/marketing/types";
import { footerGroupSizeLine, resolveMinPlayers } from "@/lib/site/groupSizeCopy";

const EXPLORE_LINKS = [
  { href: "/hunts", label: "Our Hunts" },
  { href: "/pricing", label: "Pricing" },
  { href: "/shop", label: "Shop" },
  { href: "/brochure", label: "Brochure" },
  { href: "/book-qr", label: "Book QR" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/leaderboard", label: "Leaderboard" },
];

const COMPANY_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
  { href: "/safety", label: "Safety" },
  { href: "/booking", label: "Book a Hunt" },
];

const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/refund-policy", label: "Refunds" },
];

type FooterProps = {
  settings: MarketingSettings;
  pricing?: MarketingPricing | null;
};

type SocialLinks = {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  twitter?: string;
};

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-1 text-sm text-cream/75 transition-colors hover:text-gold"
    >
      <span>{label}</span>
      <ArrowUpRight
        className="size-3.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
        aria-hidden
      />
    </Link>
  );
}

export function Footer({ settings, pricing }: FooterProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const businessName = settings.businessName ?? "Music City Scavenger Hunt";
  const tagline = settings.tagline ?? "Explore. Discover. Compete. Create Memories.";
  const phone = settings.phone ?? "615-571-9900";
  const contactEmail = settings.email ?? "howigetemail@gmail.com";
  const newsletterHeading =
    settings.newsletterHeading ?? "Get hunt tips & Music City insider clues";
  const footerText =
    settings.footerText ??
    "Locally crafted scavenger adventures across Music City. Groups, teams, and celebrations welcome.";
  const minPlayers = resolveMinPlayers(pricing?.minimumPlayers, settings.minimumPlayers);
  const social = (settings as MarketingSettings & { socialLinks?: SocialLinks }).socialLinks;

  async function onNewsletterSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setStatus("success");
      setMessage("You're on the list! Check your inbox soon.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <footer className="relative overflow-hidden border-t border-gold/20 bg-charcoal text-cream">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(242,182,50,0.12),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-12deg, transparent, transparent 48px, rgba(246,232,203,0.5) 48px, rgba(246,232,203,0.5) 49px)",
        }}
        aria-hidden
      />

      {/* CTA strip */}
      <div className="relative border-b border-cream/10 bg-gradient-to-r from-crimson/25 via-charcoal to-denim/25">
        <div className="site-x mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 py-7 sm:flex-row sm:gap-6 sm:py-8">
          <div className="flex items-start gap-4 text-center sm:text-left">
            <span className="hidden rounded-full border border-gold/40 bg-gold/10 p-3 sm:inline-flex">
              <Sparkles className="size-6 text-gold" aria-hidden />
            </span>
            <div>
              <p className="font-[family-name:var(--font-bebas)] text-2xl tracking-wide text-cream sm:text-3xl">
                Your next Music City story starts here
              </p>
              <p className="mt-1 text-sm text-cream/65">
                {footerGroupSizeLine(minPlayers)}
              </p>
            </div>
          </div>
          <Link
            href="/booking"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-gold px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-charcoal shadow-[0_4px_28px_rgba(242,182,50,0.45)] transition-transform hover:scale-[1.02] hover:bg-gold/95"
          >
            <CalendarDays className="size-5" aria-hidden />
            Book your hunt
          </Link>
        </div>
      </div>

      <div className="relative site-x mx-auto max-w-7xl py-10 sm:py-12">
        <div className="grid gap-8 sm:gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-5">
            <BrandLogo logoUrl={settings.logoUrl} variant="footer" className="mb-4 sm:mb-6" />
            <p className="font-[family-name:var(--font-caveat)] text-xl text-gold/90">{tagline}</p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-cream/70">{footerText}</p>

            <ul className="mt-8 flex flex-wrap gap-3">
              <li className="flex items-center gap-2 rounded-full border border-cream/10 bg-cream/5 px-3 py-1.5 text-xs text-cream/80">
                <Music2 className="size-3.5 text-gold" aria-hidden />
                Music City
              </li>
              <li className="flex items-center gap-2 rounded-full border border-cream/10 bg-cream/5 px-3 py-1.5 text-xs text-cream/80">
                <Users className="size-3.5 text-gold" aria-hidden />
                Groups & teams
              </li>
              <li className="flex items-center gap-2 rounded-full border border-cream/10 bg-cream/5 px-3 py-1.5 text-xs text-cream/80">
                <Trophy className="size-3.5 text-gold" aria-hidden />
                Live leaderboard
              </li>
            </ul>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <a
                href={`tel:${phone.replace(/\D/g, "")}`}
                className="flex items-center gap-3 rounded-xl border border-cream/10 bg-charcoal/80 p-4 transition-colors hover:border-gold/40 hover:bg-cream/5"
              >
                <span className="flex size-10 items-center justify-center rounded-full bg-gold/15">
                  <Phone className="size-4 text-gold" aria-hidden />
                </span>
                <span>
                  <span className="block text-[10px] uppercase tracking-wider text-cream/50">Call us</span>
                  <span className="text-sm font-semibold text-cream">{phone}</span>
                </span>
              </a>
              <a
                href={`mailto:${contactEmail}`}
                className="flex items-center gap-3 rounded-xl border border-cream/10 bg-charcoal/80 p-4 transition-colors hover:border-gold/40 hover:bg-cream/5"
              >
                <span className="flex size-10 items-center justify-center rounded-full bg-gold/15">
                  <Mail className="size-4 text-gold" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block text-[10px] uppercase tracking-wider text-cream/50">Email</span>
                  <span className="truncate text-sm font-semibold text-cream">{contactEmail}</span>
                </span>
              </a>
            </div>

            {(social?.instagram ||
              social?.facebook ||
              social?.tiktok ||
              social?.youtube ||
              social?.twitter) && (
              <div className="mt-6 flex flex-wrap gap-3">
                {social.instagram && (
                  <a
                    href={social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-cream/15 p-2.5 text-cream/70 transition-colors hover:border-gold hover:text-gold"
                    aria-label="Instagram"
                  >
                    <InstagramIcon />
                  </a>
                )}
                {social.facebook && (
                  <a
                    href={social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-cream/15 p-2.5 text-cream/70 transition-colors hover:border-gold hover:text-gold"
                    aria-label="Facebook"
                  >
                    <FacebookIcon />
                  </a>
                )}
                {social.youtube && (
                  <a
                    href={social.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-cream/15 p-2.5 text-cream/70 transition-colors hover:border-gold hover:text-gold"
                    aria-label="YouTube"
                  >
                    <YouTubeIcon />
                  </a>
                )}
                {social.tiktok && (
                  <a
                    href={social.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-cream/15 p-2.5 text-cream/70 transition-colors hover:border-gold hover:text-gold"
                    aria-label="TikTok"
                  >
                    <TikTokIcon />
                  </a>
                )}
                {social.twitter && (
                  <a
                    href={social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-cream/15 p-2.5 text-cream/70 transition-colors hover:border-gold hover:text-gold"
                    aria-label="X (Twitter)"
                  >
                    <XIcon />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Links */}
          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-4">
            <div>
              <h3 className="flex items-center gap-2 font-[family-name:var(--font-bebas)] text-lg tracking-wider text-gold">
                <span className="h-px w-6 bg-gold/60" aria-hidden />
                Explore
              </h3>
              <ul className="mt-5 space-y-3">
                {EXPLORE_LINKS.map((link) => (
                  <li key={link.href}>
                    <FooterLink href={link.href} label={link.label} />
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="flex items-center gap-2 font-[family-name:var(--font-bebas)] text-lg tracking-wider text-gold">
                <span className="h-px w-6 bg-gold/60" aria-hidden />
                Company
              </h3>
              <ul className="mt-5 space-y-3">
                {COMPANY_LINKS.map((link) => (
                  <li key={link.href}>
                    <FooterLink href={link.href} label={link.label} />
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-gold hover:underline"
              >
                Team login
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            </div>
          </div>

          {/* Newsletter card */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-gold/25 bg-gradient-to-b from-gold/10 to-transparent p-6 shadow-[inset_0_1px_0_rgba(246,232,203,0.1)]">
              <h3 className="font-[family-name:var(--font-bebas)] text-xl tracking-wide text-cream">
                Insider list
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-cream/70">{newsletterHeading}</p>
              <form onSubmit={onNewsletterSubmit} className="mt-5 space-y-3">
                <Input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  disabled={status === "loading"}
                />
                <Button type="submit" variant="primary" className="w-full" disabled={status === "loading"}>
                  {status === "loading" ? "Joining…" : "Join the hunt list"}
                </Button>
              </form>
              {message && (
                <p
                  className={cn("mt-3 text-sm", status === "error" ? "text-orange" : "text-gold")}
                  role="status"
                >
                  {message}
                </p>
              )}
              <p className="mt-4 flex items-center gap-1.5 text-[11px] text-cream/45">
                <MapPin className="size-3 shrink-0 text-crimson" aria-hidden />
                Downtown Music City & beyond
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-cream/10 bg-black/30">
        <div className="site-x mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 py-4 sm:flex-row sm:py-5">
          <p className="text-center text-xs text-cream/50 sm:text-left">
            © {new Date().getFullYear()} {businessName}. All rights reserved.
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-xs text-cream/50 transition-colors hover:text-gold">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
