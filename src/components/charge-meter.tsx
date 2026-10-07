"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

/** A battery that charges up when it scrolls into view, then breathes. Decorative. */
export function ChargeMeter() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });

  return (
    <div ref={ref} aria-hidden className="flex items-center gap-1">
      <div className="relative h-14 w-36 overflow-hidden rounded-xl border-2 border-line-strong p-1.5">
        <motion.div
          className="h-full rounded-md bg-(image:--vx-blade)"
          initial={{ width: "8%" }}
          animate={inView ? { width: ["8%", "100%"] } : undefined}
          transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.div
          className="absolute inset-y-1.5 left-1.5 w-1/3 rounded-md bg-gradient-to-r from-transparent via-white/40 to-transparent"
          animate={inView ? { x: ["-100%", "320%"] } : undefined}
          transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut", delay: 2.2 }}
        />
      </div>
      <div className="h-5 w-1.5 rounded-r-sm bg-line-strong" />
    </div>
  );
}
