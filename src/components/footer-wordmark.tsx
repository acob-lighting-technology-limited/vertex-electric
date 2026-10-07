"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

/** Oversized wordmark that rises and sharpens as the footer scrolls into view. */
export function FooterWordmark({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], ["40%", "0%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [0, 1]);
  const blur = useTransform(scrollYProgress, [0, 0.8], ["blur(12px)", "blur(0px)"]);

  return (
    <div ref={ref} aria-hidden className="mx-auto mt-16 max-w-7xl px-4 pb-6 sm:px-6 lg:px-10">
      <motion.div style={{ y, opacity, filter: blur }}>{children}</motion.div>
    </div>
  );
}
