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

        <ol className="mt-12 grid grid-cols-1 gap-6 sm:mt-16 sm:gap-8 lg:grid-cols-2">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const stepImage = ALL_MARKETING_IMAGES[i % ALL_MARKETING_IMAGES.length];
            return (
              <motion.li
                key={step.title}
                className="flex h-full flex-col rounded-2xl border border-cream/10 bg-charcoal/80 p-6 shadow-lg backdrop-blur-sm"
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.04, duration: 0.4 }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-gold bg-charcoal text-gold shadow-[0_0_20px_rgba(242,182,50,0.15)]">
                    <Icon className="size-5" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold uppercase tracking-widest text-gold">
                      Step {i + 1}
                    </span>
                    <h3 className="mt-1 text-lg font-semibold text-cream">{step.title}</h3>
                  </div>
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-cream/70">{step.body}</p>
                <div className="relative mt-5 h-28 overflow-hidden rounded-lg border border-cream/10">
                  <Image src={stepImage.src} alt="" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
