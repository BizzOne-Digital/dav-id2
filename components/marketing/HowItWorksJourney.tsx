"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  CalendarCheck,
  Flag,
  Footprints,
  KeyRound,
  MapPinned,
  Medal,
  Smartphone,
  UsersRound,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ALL_MARKETING_IMAGES } from "@/lib/site/marketingImages";

const STEPS = [
  { icon: CalendarCheck, title: "Book online", body: "Pick your date, group size, and experience type in minutes." },
  { icon: KeyRound, title: "Get your codes", body: "Receive team join codes and a quick-start guide by email." },
  { icon: UsersRound, title: "Form teams", body: "Split into squads—or stay one big crew—and choose a team name." },
  { icon: Smartphone, title: "Open the hunt", body: "Use any phone browser; no app download required." },
  { icon: MapPinned, title: "Follow the route", body: "GPS-guided stops across downtown and signature neighborhoods." },
  { icon: Footprints, title: "Solve & snap", body: "Answer riddles, complete challenges, and earn bonus points." },
  { icon: Medal, title: "Climb the board", body: "Watch scores update live as teams finish each checkpoint." },
  { icon: Flag, title: "Celebrate", body: "Crown a winner, share photos, and keep exploring Music City." },
];

export function HowItWorksJourney() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="how-it-works" className="relative bg-charcoal section-y">
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]" aria-hidden>
        <Image src={ALL_MARKETING_IMAGES[3].src} alt="" fill className="object-cover" />
      </div>

      <div className="site-x relative mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="How it works"
          title="From booking to victory lap"
          subtitle="Eight simple steps from your first click to your last clue on Broadway."
        />

        <ol className="relative mt-16 space-y-0">
          <div
            className="absolute left-[1.65rem] top-4 hidden h-[calc(100%-2rem)] w-0.5 bg-gradient-to-b from-gold via-orange to-gold/30 md:left-1/2 md:block md:-translate-x-1/2"
            aria-hidden
          />
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const alignRight = i % 2 === 1;
            const stepImage = ALL_MARKETING_IMAGES[i % ALL_MARKETING_IMAGES.length];
            return (
              <motion.li
                key={step.title}
                className="relative grid grid-cols-1 gap-6 pb-12 md:grid-cols-2 md:items-center md:gap-12"
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: i * 0.05, duration: 0.45 }}
              >
                <div className={alignRight ? "md:order-2 md:text-left" : "md:text-right"}>
                  <span className="text-xs font-bold uppercase tracking-widest text-gold">
                    Step {i + 1}
                  </span>
                  <h3 className="mt-1 text-xl font-semibold text-cream">{step.title}</h3>
                  <p className="mt-2 text-cream/70">{step.body}</p>
                  <div className="relative mt-4 hidden h-28 overflow-hidden rounded-lg border border-cream/10 md:block">
                    <Image src={stepImage.src} alt="" fill className="object-cover" sizes="320px" />
                  </div>
                </div>
                <div
                  className={`flex items-center gap-4 ${alignRight ? "md:order-1 md:justify-end" : "md:justify-start"}`}
                >
                  <div className="relative z-10 flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-gold bg-charcoal text-gold shadow-[0_0_24px_rgba(242,182,50,0.2)]">
                    <Icon className="size-6" aria-hidden />
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
