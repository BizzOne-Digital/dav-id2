"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";
import { ALL_MARKETING_IMAGES } from "@/lib/site/marketingImages";
import type { MarketingTestimonial } from "@/components/marketing/types";

const FALLBACK_TESTIMONIALS: MarketingTestimonial[] = [
  {
    quote:
      "Best team-building activity we've done in Nashville. Competitive but hilarious—the photo challenges had us crying laughing.",
    name: "Jordan M.",
    groupType: "Corporate off-site",
    rating: 5,
  },
  {
    quote:
      "Our bachelorette crew loved it. We explored streets we'd have walked right past, and we actually learned cool history.",
    name: "Priya S.",
    groupType: "Celebration",
    rating: 5,
  },
  {
    quote:
      "Kids and parents both stayed engaged. Clues were tough but fair, and support responded instantly when we had a question.",
    name: "Chris L.",
    groupType: "Family visit",
    rating: 5,
  },
  {
    quote:
      "The leaderboard kept our friend group ruthless in the best way. Already booked again for next month's reunion.",
    name: "Alex T.",
    groupType: "Friends weekend",
    rating: 5,
  },
];

type TestimonialCarouselProps = {
  testimonials?: MarketingTestimonial[];
};

export function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const list = testimonials?.length ? testimonials : FALLBACK_TESTIMONIALS;
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const bg = ALL_MARKETING_IMAGES[index % ALL_MARKETING_IMAGES.length];

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % list.length);
  }, [list.length]);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + list.length) % list.length);
  }, [list.length]);

  const activeIndex = list.length ? index % list.length : 0;

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(next, 7000);
    return () => clearInterval(id);
  }, [next, reduceMotion]);

  const current = list[activeIndex] ?? list[0];
  const fromAdmin = Boolean(testimonials?.length);

  return (
    <section className="relative overflow-hidden section-y">
      <Image src={bg.src} alt="" fill className="object-cover opacity-30" sizes="100vw" />
      <div className="absolute inset-0 bg-[#0c0e11]/90" aria-hidden />

      <div className="site-x relative mx-auto max-w-4xl">
        <SectionHeading
          eyebrow="Stories"
          title="What hunters are saying"
          subtitle={
            fromAdmin
              ? "Real stories from teams who hunted with us."
              : "Sample testimonials until you add them in admin → Content."
          }
        />

        <div className="relative mt-8 sm:mt-10">
          <Quote className="absolute -top-2 left-0 size-10 text-gold/30" aria-hidden />

          <div className="min-h-[220px] px-2 pt-8 sm:px-12">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={activeIndex}
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
                className="text-center"
              >
                <p className="text-xl leading-relaxed text-cream sm:text-2xl">&ldquo;{current.quote}&rdquo;</p>
                <footer className="mt-8">
                  <p className="font-semibold text-gold">{current.name}</p>
                  <p className="text-sm text-cream/60">{current.groupType}</p>
                  <p
                    className="mt-2 text-sm text-gold/80"
                    aria-label={`${current.rating ?? 5} out of 5 stars`}
                  >
                    {"★".repeat(current.rating ?? 5)}
                  </p>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={prev}
              className="rounded-full border border-cream/20 p-2 text-cream hover:border-gold hover:text-gold"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="size-5" />
            </button>
            <div className="flex gap-2">
              {list.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={cn(
                    "size-2 rounded-full transition-colors",
                    i === activeIndex ? "bg-gold" : "bg-cream/30 hover:bg-cream/50"
                  )}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={next}
              className="rounded-full border border-cream/20 p-2 text-cream hover:border-gold hover:text-gold"
              aria-label="Next testimonial"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
