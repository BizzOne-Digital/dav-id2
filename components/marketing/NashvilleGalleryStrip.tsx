"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ALL_MARKETING_IMAGES } from "@/lib/site/marketingImages";

export function NashvilleGalleryStrip() {
  const reduceMotion = useReducedMotion();
  const items = [...ALL_MARKETING_IMAGES, ...ALL_MARKETING_IMAGES];

  return (
    <section className="overflow-hidden border-y border-cream/10 bg-charcoal py-4 sm:py-5" aria-label="Nashville hunt gallery">
      <motion.div
        className="flex w-max gap-4 px-4"
        animate={reduceMotion ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
      >
        {items.map((img, i) => (
          <div
            key={`${img.src}-${i}`}
            className="relative h-28 w-44 shrink-0 overflow-hidden rounded-lg border border-gold/20 sm:h-36 sm:w-56 md:h-40 md:w-64"
          >
            <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="288px" />
          </div>
        ))}
      </motion.div>
    </section>
  );
}
