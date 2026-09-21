"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Signpost } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";
import { MARKETING_IMAGES } from "@/lib/site/marketingImages";

const NEIGHBORHOODS = [
  {
    name: "Broadway",
    tagline: "Honky-tonk heartbeat",
    detail: "Neon, live music, and clues tucked between legendary stages.",
    image: MARKETING_IMAGES.broadway,
  },
  {
    name: "The Gulch",
    tagline: "Murals & modern edge",
    detail: "Street art, boutique corners, and photo-worthy challenge stops.",
    image: MARKETING_IMAGES.mapPin,
  },
  {
    name: "The Ryman",
    tagline: "Mother Church",
    detail: "Red brick history and music legends steps from the action.",
    image: MARKETING_IMAGES.ryman,
  },
  {
    name: "SoBro",
    tagline: "South of Broadway",
    detail: "Museums, landmarks, and quieter blocks rich with trivia.",
    image: MARKETING_IMAGES.skylineRiver,
  },
  {
    name: "East Nashville",
    tagline: "Creative crossroads",
    detail: "Eclectic vibes and local favorites just across the river.",
    image: MARKETING_IMAGES.porch,
  },
  {
    name: "Local Flavors",
    tagline: "Taste the city",
    detail: "Optional food stops and partner rewards along your route.",
    image: MARKETING_IMAGES.hotChicken,
  },
  {
    name: "Riverfront",
    tagline: "Views & bridges",
    detail: "Skyline panoramas and waterfront clues at golden hour.",
    image: MARKETING_IMAGES.skylineRiver,
  },
];

export function ExploreNashville() {
  return (
    <section id="explore" className="section-surface-light section-y">
      <div className="site-x mx-auto max-w-7xl">
        <SectionHeading
          surface="light"
          eyebrow="Explore Nashville"
          title="Neighborhood signposts"
          subtitle="Promotional examples only—your assigned route appears after booking and game activation."
        />

        <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {NEIGHBORHOODS.map((n, i) => (
            <motion.article
              key={n.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className={cn(
                "overflow-hidden rounded-xl border-4 border-charcoal bg-[#F6E8CB] shadow-[4px_4px_0_#101216]",
                i === 0 && "sm:col-span-2 lg:col-span-2"
              )}
            >
              <div className={cn("relative w-full", i === 0 ? "h-52 sm:h-56" : "h-40")}>
                <Image src={n.image.src} alt={n.image.alt} fill className="object-cover" sizes="400px" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 to-transparent" />
                <Signpost className="absolute right-4 top-4 size-8 text-gold drop-shadow" aria-hidden />
              </div>
              <div className="p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-orange">{n.tagline}</p>
                <h3 className="mt-1 font-[family-name:var(--font-bebas)] text-2xl tracking-wide">{n.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/75">{n.detail}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
