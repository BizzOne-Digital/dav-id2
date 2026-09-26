"use client";

import { motion } from "framer-motion";

type AnimatedClueTextProps = {
  text: string;
  className?: string;
};

export function AnimatedClueText({ text, className }: AnimatedClueTextProps) {
  const words = text.split(/\s+/).filter(Boolean);

  return (
    <p className={className} aria-label={text}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="mr-[0.25em] inline-block"
          initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.04 * i, duration: 0.35, ease: "easeOut" }}
        >
          {word}
        </motion.span>
      ))}
    </p>
  );
}
