"use client";

import { animate, useInView, useMotionValue, useMotionValueEvent } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { easeBlade } from "./easing";

/** Counts from 0 to `to` the first time it scrolls into view. Renders the final value without JS. */
export function CountUp({ to, prefix = "", suffix = "", duration = 1.8 }: { to: number; prefix?: string; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const value = useMotionValue(0);
  const [display, setDisplay] = useState(to);
  useMotionValueEvent(value, "change", (v) => setDisplay(Math.round(v)));

  useEffect(() => {
    if (!inView) return;
    value.set(0);
    const controls = animate(value, to, { duration, ease: easeBlade });
    return () => controls.stop();
  }, [inView, to, duration, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {display.toLocaleString("en-NG")}
      {suffix}
    </span>
  );
}

/** Smoothly tweens between successive values (for live calculator outputs). */
export function AnimatedNumber({ value, format }: { value: number; format: (n: number) => string }) {
  const mv = useMotionValue(value);
  const [display, setDisplay] = useState(value);
  useMotionValueEvent(mv, "change", setDisplay);
  useEffect(() => {
    const controls = animate(mv, value, { duration: 0.6, ease: easeBlade });
    return () => controls.stop();
  }, [value, mv]);
  return <span className="tabular-nums">{format(display)}</span>;
}
