"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
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
    <section id="explore" className="border-y border-cream/10 bg-charcoal section-y">
      <div className="site-x mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Explore Nashville"
          title="Neighborhood signposts"
          subtitle="Promotional examples only—your assigned route appears after booking and game activation."
        />

        <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {NEIGHBORHOODS.map((n) => (
            <motion.article
              key={n.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -3 }}
              className="min-w-0 overflow-hidden rounded-xl border border-cream/15 bg-gradient-to-b from-[#161b24] to-charcoal shadow-[0_10px_40px_rgba(0,0,0,0.35)] transition-[border-color,box-shadow] hover:border-gold/30 hover:shadow-[0_12px_44px_rgba(201,147,42,0.08)]"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={n.image.src}
                  alt={n.image.alt}
                  fill
                  className="object-cover object-center brightness-[1.08] contrast-[1.03]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/25 to-transparent" />
                <MapPin className="absolute right-3 top-3 size-7 text-gold drop-shadow-md" aria-hidden />
              </div>
              <div className="border-t border-cream/10 px-5 py-4">
                <p className="text-xs font-bold uppercase tracking-widest text-gold">{n.tagline}</p>
                <h3 className="mt-1 font-[family-name:var(--font-bebas)] text-2xl tracking-wide text-cream">
                  {n.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-cream/70">{n.detail}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
