"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "../lib/cn";

/**
 * Card with a blue spotlight that follows the pointer and a slight 3D tilt.
 * Touch devices get the static card.
 */
export function SpotlightCard({ children, className, tilt = 4 }: { children: ReactNode; className?: string; tilt?: number }) {
  const mx = useMotionValue(-400);
  const my = useMotionValue(-400);
  const rx = useSpring(0, { stiffness: 160, damping: 20 });
  const ry = useSpring(0, { stiffness: 160, damping: 20 });
  const glow = useMotionTemplate`radial-gradient(420px circle at ${mx}px ${my}px, var(--vx-glow), transparent 65%)`;

  return (
    <motion.div
      className={cn("group/spot relative isolate", className)}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        const px = e.clientX - r.left;
        const py = e.clientY - r.top;
        mx.set(px);
        my.set(py);
        rx.set(((py / r.height) - 0.5) * -tilt);
        ry.set(((px / r.width) - 0.5) * tilt);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
        mx.set(-400);
        my.set(-400);
      }}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        style={{ background: glow }}
      />
      {children}
    </motion.div>
  );
}
