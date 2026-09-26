"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Camera,
  Compass,
  Map,
  MapPin,
  Music,
  Sparkles,
  Trophy,
  Users,
  CalendarDays,
  Mail,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { MARKETING_IMAGES } from "@/lib/site/marketingImages";

const LINE_INPUT =
  "w-full border-0 border-b-2 border-cream/35 bg-transparent px-0 py-3 text-cream placeholder:text-cream/40 focus:border-gold focus:outline-none focus:ring-0";

const SNAPSHOTS = [
  {
    id: "teams",
    icon: Users,
    title: "Team-Based Play",
    description: "Split into squads, strategize routes, and race for the top spot on the leaderboard.",
    image: MARKETING_IMAGES.qrScan,
    spotLabel: "Teams on location",
  },
  {
    id: "clues",
    icon: Compass,
    title: "Local Clues",
    description: "Riddles rooted in Music City history, music legends, and hidden downtown gems.",
    image: MARKETING_IMAGES.ryman,
    spotLabel: "Ryman & downtown landmarks",
  },
  {
    id: "challenges",
    icon: Camera,
    title: "Photo Challenges",
    description: "Capture creative shots at iconic spots—judged for fun, not perfection.",
    image: MARKETING_IMAGES.broadway,
    spotLabel: "Broadway highlights",
  },
  {
    id: "map",
    icon: Map,
    title: "Smart Routing",
    description: "A balanced path through neighborhoods so you see the city, not just screens.",
    image: MARKETING_IMAGES.mapPin,
    spotLabel: "Pinned hunt stops",
  },
  {
    id: "music",
    icon: Music,
    title: "Music City Flavor",
    description: "Broadway energy, honky-tonk lore, and stories only locals usually know.",
    image: MARKETING_IMAGES.skylineRiver,
    spotLabel: "Riverfront & skyline",
  },
  {
    id: "score",
    icon: Trophy,
    title: "Live Scoring",
    description: "Points update as you complete stops—watch your rank climb in real time.",
    image: MARKETING_IMAGES.certificate,
    spotLabel: "Finish-line celebration",
  },
  {
    id: "memories",
    icon: Sparkles,
    title: "Shareable Moments",
    description: "End with highlights, inside jokes, and a story you'll retell for years.",
    image: MARKETING_IMAGES.porch,
    spotLabel: "Music City views",
  },
];

function AdventureInquiryForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          subject: "Book or question — homepage",
          message: message || "Interested in booking or learning more about the hunt.",
        }),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok || !data.success) {
        throw new Error(data.error ?? "Could not send");
      }
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <div className="mt-12 rounded-2xl border border-cream/20 bg-gradient-to-br from-[#141820] via-charcoal to-[#1a2438] p-6 sm:p-8 lg:p-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
        <div className="max-w-md">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Book or contact</p>
          <h3 className="mt-2 font-[family-name:var(--font-bebas)] text-2xl tracking-wide text-cream sm:text-3xl">
            Ready for your hunt?
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-cream/70">
            Reserve online in minutes, or send a quick note—we&apos;ll help with groups, corporate teams, and dates.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Button href="/booking" variant="primary" className="gap-2">
              <CalendarDays className="size-4" aria-hidden />
              Book your hunt
            </Button>
            <Button href="/contact" variant="secondary" className="gap-2">
              <Mail className="size-4" aria-hidden />
              Contact us
            </Button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="w-full max-w-xl flex-1 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="adventure-name" className="text-xs font-medium uppercase tracking-wider text-cream/55">
                Name
              </label>
              <input
                id="adventure-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={LINE_INPUT}
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="adventure-email" className="text-xs font-medium uppercase tracking-wider text-cream/55">
                Email
              </label>
              <input
                id="adventure-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={LINE_INPUT}
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div>
            <label htmlFor="adventure-msg" className="text-xs font-medium uppercase tracking-wider text-cream/55">
              Message <span className="text-cream/40">(optional)</span>
            </label>
            <textarea
              id="adventure-msg"
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={cn(LINE_INPUT, "resize-none")}
              placeholder="Group size, date, or question"
            />
          </div>
          {error && <p className="text-sm text-orange">{error}</p>}
          {status === "success" && (
            <p className="text-sm text-olive">Thanks—we&apos;ll be in touch soon.</p>
          )}
          <Button type="submit" variant="ghost" className="border-b-2 border-gold/50 px-0 text-gold hover:bg-transparent" disabled={status === "loading"}>
            {status === "loading" ? "Sending…" : "Send quick note"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export function AdventureSnapshot() {
  const [active, setActive] = useState<string>("teams");
  const activeItem = SNAPSHOTS.find((s) => s.id === active) ?? SNAPSHOTS[0];

  return (
    <section className="border-y border-cream/10 bg-charcoal section-y">
      <div className="site-x mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="The Adventure"
          title="Your hunt at a glance"
          subtitle="Teams, iconic stops, and live competition—built for Music City, not a generic walking tour."
        />

        <div className="mt-8 grid gap-8 sm:mt-10 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:gap-10">
          <motion.div
            key={activeItem.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="relative aspect-[4/3] overflow-hidden rounded-2xl border-2 border-gold/30 shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
          >
            <Image
              src={activeItem.image.src}
              alt={activeItem.image.alt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 540px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 border-t border-cream/15 bg-charcoal/75 px-4 py-3 backdrop-blur-sm sm:px-5 sm:py-4">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold">
                <MapPin className="size-3.5" aria-hidden />
                {activeItem.spotLabel}
              </p>
              <p className="font-[family-name:var(--font-bebas)] text-xl tracking-wide text-cream sm:text-2xl">
                {activeItem.title}
              </p>
            </div>
          </motion.div>

          <div className="grid gap-3 sm:grid-cols-2">
            {SNAPSHOTS.map((item, index) => {
              const Icon = item.icon;
              const isActive = active === item.id;
              return (
                <motion.button
                  key={item.id}
                  type="button"
                  onClick={() => setActive(item.id)}
                  className={cn("text-left", index === 6 && "sm:col-span-2")}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div
                    className={cn(
                      "h-full rounded-xl border p-4 transition-colors",
                      isActive
                        ? "border-gold/45 bg-denim/15 shadow-[0_0_24px_rgba(201,147,42,0.12)]"
                        : "border-cream/15 bg-charcoal/60 hover:border-cream/25"
                    )}
                  >
                    <Icon
                      className={cn("size-7", isActive ? "text-gold" : "text-cream/45")}
                      aria-hidden
                    />
                    <h3 className="mt-2 font-semibold text-cream">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-cream/65">{item.description}</p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        <AdventureInquiryForm />
      </div>
    </section>
  );
}
