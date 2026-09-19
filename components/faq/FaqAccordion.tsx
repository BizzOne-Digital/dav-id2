"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export type FaqAccordionItem = {
  id: string;
  question: string;
  answer: string;
};

export function FaqAccordion({ items }: { items: FaqAccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <ul className="mt-12 divide-y divide-cream/10 border-y border-cream/10">
      {items.map((item, index) => {
        const open = openIndex === index;
        return (
          <li key={item.id}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
              onClick={() => setOpenIndex(open ? null : index)}
              aria-expanded={open}
            >
              <span className="font-medium text-cream">{item.question}</span>
              <ChevronDown
                className={cn("size-5 shrink-0 text-gold transition-transform", open && "rotate-180")}
              />
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <p className="pb-5 text-cream/75">{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
