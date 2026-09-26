"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { MarketingFaqItem } from "@/components/marketing/types";

const DEFAULT_FAQ_ITEMS: MarketingFaqItem[] = [
  {
    question: "How long does a hunt take?",
    answer:
      "Most groups finish in 2–3 hours depending on pace, group size, and how competitive you get. You can pause for snacks or photos anytime.",
  },
  {
    question: "Do we need to download an app?",
    answer:
      "No app required. Players use a mobile browser to join their team and submit answers. We recommend comfortable shoes and a charged phone.",
  },
  {
    question: "What's the minimum group size?",
    answer:
      "Book as a single or couple on one ticket (1–2 players), or bring friends and family—no four-player minimum.",
  },
  {
    question: "Is this weather-dependent?",
    answer:
      "Hunts run rain or shine unless conditions are unsafe. We'll help reschedule if Music City throws a serious storm your way.",
  },
  {
    question: "Can we customize for corporate events?",
    answer:
      "Yes—branding, private start times, and facilitator support are available. Mention corporate needs during booking.",
  },
];

type FaqPreviewProps = {
  items?: MarketingFaqItem[];
};

export function FaqPreview({ items }: FaqPreviewProps) {
  const faqItems = items?.length ? items : DEFAULT_FAQ_ITEMS;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-charcoal section-y">
      <div className="site-x mx-auto max-w-3xl">
        <SectionHeading
          eyebrow="FAQ"
          title="Quick answers"
          subtitle="The essentials before you round up your team."
        />

        <ul className="mt-8 divide-y divide-cream/10 border-y border-cream/10 sm:mt-10">
          {faqItems.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <li key={`${item.question}-${i}`}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span className="font-medium text-cream">{item.question}</span>
                  <ChevronDown
                    className={cn(
                      "size-5 shrink-0 text-gold transition-transform",
                      isOpen && "rotate-180"
                    )}
                    aria-hidden
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 text-sm leading-relaxed text-cream/70">{item.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>

        <p className="mt-8 text-center text-sm text-cream/60">
          More questions?{" "}
          <Link href="/contact" className="font-semibold text-gold hover:underline">
            Contact our team
          </Link>
        </p>
      </div>
    </section>
  );
}
