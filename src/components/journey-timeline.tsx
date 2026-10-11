"use client";

import { ClipboardCheck, KeyRound, Search, Ship, Stamp } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { easeBlade } from "@vertex/ui/motion/easing";

const steps = [
  { icon: Search, title: "Sourced", body: "We find the right car through our partners in China and beyond." },
  { icon: ClipboardCheck, title: "Inspected", body: "Checked before it ships, so there are no surprises on arrival." },
  { icon: Ship, title: "Shipped", body: "Sea freight to Lagos, tracked end to end." },
  { icon: Stamp, title: "Cleared", body: "Customs and port clearance handled by our team." },
  { icon: KeyRound, title: "Delivered", body: "Hand-over at our showroom or to your door, with support after." },
];

/** Import journey with a blade-blue progress line that draws as the section scrolls through. */
export function JourneyTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] });
  const progress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={ref} className="relative mt-14">
      {/* Track + animated fill: horizontal on desktop, vertical on mobile */}
      <div aria-hidden className="absolute top-6 right-0 left-0 hidden h-px bg-line lg:block">
        <motion.div className="h-full origin-left bg-(image:--vx-blade)" style={{ scaleX: progress }} />
      </div>
      <div aria-hidden className="absolute top-0 bottom-0 left-6 w-px bg-line lg:hidden">
        <motion.div className="h-full w-full origin-top bg-(image:--vx-blade)" style={{ scaleY: progress }} />
      </div>

      <ol className="grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-6">
        {steps.map((s, i) => (
          <motion.li
            key={s.title}
            className="relative flex gap-5 lg:block"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.8, ease: easeBlade, delay: i * 0.08 }}
          >
            <span className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full border border-line-strong bg-bg">
              <s.icon className="size-5 text-accent-text" aria-hidden />
            </span>
            <div className="lg:mt-6">
              <p className="font-mono text-xs text-muted">0{i + 1}</p>
              <p className="mt-1 font-display text-lg font-medium">{s.title}</p>
              <p className="mt-2 text-sm text-muted">{s.body}</p>
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
