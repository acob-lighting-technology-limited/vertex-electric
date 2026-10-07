"use client";

import { motion } from "motion/react";
import { easeBlade } from "./easing";

type MaskTextProps = {
  text: string;
  className?: string;
  /** Seconds before the first word moves. */
  delay?: number;
  /** Play on mount (hero) or when scrolled into view. */
  trigger?: "mount" | "inView";
  as?: "h1" | "h2" | "p" | "span";
  /** With trigger="mount": hold the animation until this turns true. */
  play?: boolean;
};

/**
 * Kinetic headline: each word rises out of its own clipping mask, staggered.
 * Screen readers get the plain sentence via aria-label; the split words are aria-hidden.
 */
export function MaskText({ text, className, delay = 0, trigger = "inView", as = "h2", play: canPlay = true }: MaskTextProps) {
  const Comp = motion[as];
  const words = text.split(" ");
  const play =
    trigger === "mount"
      ? { animate: canPlay ? "show" : "hidden" }
      : { whileInView: "show", viewport: { once: true, amount: 0.6 } };

  return (
    <Comp className={className} aria-label={text} initial="hidden" {...play}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} aria-hidden className="inline-block overflow-hidden pb-[0.12em] align-top">
          <motion.span
            className="inline-block will-change-transform"
            variants={{
              hidden: { y: "110%", rotate: 4 },
              show: { y: "0%", rotate: 0, transition: { duration: 1, ease: easeBlade, delay: delay + i * 0.08 } },
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && " "}
        </span>
      ))}
    </Comp>
  );
}
