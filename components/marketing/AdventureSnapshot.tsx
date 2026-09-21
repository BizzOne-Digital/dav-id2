"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Camera,
  Compass,
  Map,
  Music,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { MARKETING_IMAGES } from "@/lib/site/marketingImages";

const SNAPSHOTS = [
  {
    id: "teams",
    icon: Users,
    title: "Team-Based Play",
    description: "Split into squads, strategize routes, and race for the top spot on the leaderboard.",
    image: MARKETING_IMAGES.prizes,
  },
  {
    id: "clues",
    icon: Compass,
    title: "Local Clues",
    description: "Riddles rooted in Nashville history, music legends, and hidden downtown gems.",
    image: MARKETING_IMAGES.ryman,
  },
  {
    id: "challenges",
    icon: Camera,
    title: "Photo Challenges",
    description: "Capture creative shots at iconic spots—judged for fun, not perfection.",
    image: MARKETING_IMAGES.broadway,
  },
  {
    id: "map",
    icon: Map,
    title: "Smart Routing",
    description: "A balanced path through neighborhoods so you see the city, not just screens.",
    image: MARKETING_IMAGES.flatlay,
  },
  {
    id: "music",
    icon: Music,
    title: "Music City Flavor",
    description: "Broadway energy, honky-tonk lore, and stories only locals usually know.",
    image: MARKETING_IMAGES.broadway,
  },
  {
    id: "score",
    icon: Trophy,
    title: "Live Scoring",
    description: "Points update as you complete stops—watch your rank climb in real time.",
    image: MARKETING_IMAGES.certificate,
  },
  {
    id: "memories",
    icon: Sparkles,
    title: "Shareable Moments",
    description: "End with highlights, inside jokes, and a story you'll retell for years.",
    image: MARKETING_IMAGES.porch,
  },
];

export function AdventureSnapshot() {
  const [active, setActive] = useState<string>(SNAPSHOTS[0].id);
  const activeItem = SNAPSHOTS.find((s) => s.id === active) ?? SNAPSHOTS[0];

  return (
    <section className="section-surface-light section-y">
      <div className="site-x mx-auto max-w-7xl">
        <SectionHeading
          surface="light"
          eyebrow="The Adventure"
          title="Your hunt at a glance"
          subtitle="Seven pillars of a Nashville scavenger experience built for groups who want more than a walking tour."
        />

        <div className="mt-8 grid gap-8 sm:mt-10 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:gap-10">
          <motion.div
            key={activeItem.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="relative aspect-[4/3] overflow-hidden rounded-2xl border-4 border-charcoal shadow-[8px_8px_0_#101216]"
          >
            <Image
              src={activeItem.image.src}
              alt={activeItem.image.alt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 540px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 to-transparent" />
            <p className="absolute bottom-4 left-4 right-4 font-[family-name:var(--font-bebas)] text-2xl text-white">
              {activeItem.title}
            </p>
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
                  <Card
                    className={cn(
                      "h-full border-charcoal/10 bg-white/90 p-4 shadow-sm",
                      isActive &&
                        "ring-2 ring-denim/35 shadow-[0_8px_28px_rgba(37,92,133,0.12)]"
                    )}
                  >
                    <Icon
                      className={cn("size-7", isActive ? "text-denim" : "text-charcoal/45")}
                      aria-hidden
                    />
                    <h3 className="mt-2 font-semibold text-charcoal">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-charcoal/65">{item.description}</p>
                  </Card>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
