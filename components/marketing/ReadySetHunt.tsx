"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MARKETING_IMAGES } from "@/lib/site/marketingImages";
import { BRAND_COPY } from "@/lib/site/brandCopy";

export function ReadySetHunt() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden section-y">
      <Image
        src={MARKETING_IMAGES.skylineRiver.src}
        alt=""
        fill
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-charcoal/85" aria-hidden />
      <motion.div
        className="pointer-events-none absolute -left-20 top-1/2 size-64 rounded-full bg-gold/20 blur-3xl"
        animate={reduceMotion ? undefined : { x: [0, 40, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />

      <div className="site-x relative mx-auto max-w-4xl text-center">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Sparkles className="mx-auto size-10 text-gold" aria-hidden />
          <h2 className="mt-4 font-[family-name:var(--font-bebas)] text-3xl tracking-wide text-cream sm:mt-6 sm:text-4xl md:text-5xl lg:text-6xl">
            Ready. Set. Hunt.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-cream/80">{BRAND_COPY.tagline}</p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button href="/booking" variant="primary" magnetic className="gap-2 hero-cta-primary !text-charcoal">
              {BRAND_COPY.bookCta}
              <ArrowRight className="size-4" aria-hidden />
            </Button>
            <Button href="/#challenge-preview" variant="secondary">
              Try a sample clue
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
