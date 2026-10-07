"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { easeBlade } from "@vertex/ui/motion/easing";
import { MaskText } from "@vertex/ui/motion/mask-text";

/** True once the hero may start its entrance — immediately, or after the first-visit intro curtain lifts. */
const Ready = createContext(false);

const INTRO_MS = 1250;

export function HeroStage({ media, children }: { media: ReactNode; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const mediaY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  // Start the entrance as the intro curtain begins to lift. The curtain runs on CSS time
  // from first paint, so follow its real animation events rather than a fixed delay
  // (hydration can land before or after it on slow devices).
  useEffect(() => {
    const curtain = document.querySelector<HTMLElement>(".vx-intro");
    const running = curtain && getComputedStyle(curtain).visibility !== "hidden" && getComputedStyle(curtain).display !== "none";
    if (!running) {
      const t = setTimeout(() => setReady(true), 60);
      return () => clearTimeout(t);
    }
    // Hydrated after the curtain already began lifting: go now.
    const lift = curtain.getAnimations().find((a) => (a as CSSAnimation).animationName === "vx-curtain");
    if (lift && Number(lift.currentTime ?? 0) >= 1150) {
      const t = setTimeout(() => setReady(true), 0);
      return () => clearTimeout(t);
    }
    const onStart = (e: AnimationEvent) => e.animationName === "vx-curtain" && setReady(true);
    curtain.addEventListener("animationstart", onStart);
    const fallback = setTimeout(() => setReady(true), INTRO_MS + 400); // in case the event was missed
    return () => {
      curtain.removeEventListener("animationstart", onStart);
      clearTimeout(fallback);
    };
  }, []);

  return (
    <Ready.Provider value={ready}>
      <section
        ref={ref}
        className="relative isolate -mt-16 flex min-h-svh items-start overflow-hidden bg-[#06080b] pt-16 text-white md:items-center"
      >
        <motion.div className="absolute inset-0 -z-10" style={{ scale: mediaScale, y: mediaY }}>
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.18, opacity: 0.4 }}
            animate={ready ? { scale: 1, opacity: 1 } : undefined}
            transition={{ duration: 2.4, ease: easeBlade }}
          >
            {media}
          </motion.div>
        </motion.div>
        <motion.div className="w-full" style={{ y: contentY, opacity: contentOpacity }}>
          {children}
        </motion.div>
      </section>
    </Ready.Provider>
  );
}

export function HeroHeadline({ text, className }: { text: string; className?: string }) {
  const ready = useContext(Ready);
  return <MaskText as="h1" text={text} className={className} trigger="mount" play={ready} delay={0.15} />;
}

/** Fades content up once the stage is ready, in order. */
export function HeroItem({ children, order = 0, className }: { children: ReactNode; order?: number; className?: string }) {
  const ready = useContext(Ready);
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
      animate={ready ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
      transition={{ duration: 0.9, ease: easeBlade, delay: 0.45 + order * 0.12 }}
    >
      {children}
    </motion.div>
  );
}

/** Eyebrow with a blade rule that draws in before the label. */
export function HeroEyebrow({ children }: { children: ReactNode }) {
  const ready = useContext(Ready);
  return (
    <div className="flex items-center gap-3">
      <motion.span
        aria-hidden
        className="h-0.5 w-10 origin-left skew-x-[-35deg] bg-(image:--vx-blade)"
        initial={{ scaleX: 0 }}
        animate={ready ? { scaleX: 1 } : undefined}
        transition={{ duration: 0.8, ease: easeBlade }}
      />
      <motion.p
        className="font-mono text-xs tracking-[0.3em] text-[#5c9dff] uppercase"
        initial={{ opacity: 0, x: -8 }}
        animate={ready ? { opacity: 1, x: 0 } : undefined}
        transition={{ duration: 0.6, ease: easeBlade, delay: 0.3 }}
      >
        {children}
      </motion.p>
    </div>
  );
}

/** Animated scroll cue at the bottom of the hero. */
export function ScrollCue() {
  const ready = useContext(Ready);
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
      initial={{ opacity: 0 }}
      animate={ready ? { opacity: 1 } : undefined}
      transition={{ delay: 1.4, duration: 0.8 }}
    >
      <span className="font-mono text-[10px] tracking-[0.4em] text-white/50 uppercase">Scroll</span>
      <span className="relative h-12 w-px overflow-hidden bg-white/15">
        <motion.span
          className="absolute inset-x-0 top-0 h-1/2 bg-[#0072fe]"
          animate={{ y: ["-100%", "200%"] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </span>
    </motion.div>
  );
}
