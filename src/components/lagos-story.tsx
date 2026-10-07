"use client";

import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import { cn } from "@vertex/ui/lib/cn";
import { easeBlade } from "@vertex/ui/motion/easing";
import { useMotionAllowed } from "@vertex/ui/lib/use-motion-allowed";
import type { StoryFrame } from "@/lib/stories";

/**
 * One photo frame: clip-path wipe + slow scale-in the first time it enters view.
 * The <figure> is what's observed: a clip-path on the observed element itself makes
 * IntersectionObserver report ratio 0, so the clipped layers follow via variants.
 */
function Frame({ frame, index, className }: { frame: StoryFrame; index: number; className?: string }) {
  const portrait = frame.height > frame.width;
  return (
    // Height comes from the caller; the aspect ratio here gives the frame its width.
    <motion.figure
      className={cn("group relative shrink-0", portrait ? "aspect-[3/4]" : "aspect-[4/3] sm:aspect-[3/2]", className)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
    >
      <motion.div
        className="relative h-full w-full overflow-hidden rounded-(--vx-radius-lg) bg-surface-2"
        variants={{
          hidden: { clipPath: "inset(0 0 0 100%)" },
          show: { clipPath: "inset(0 0 0 0%)", transition: { duration: 1.2, ease: easeBlade } },
        }}
      >
        <motion.div
          className="absolute inset-0"
          variants={{ hidden: { scale: 1.25 }, show: { scale: 1, transition: { duration: 1.8, ease: easeBlade } } }}
        >
          <Image
            src={frame.src.lg}
            alt={frame.alt}
            fill
            sizes="(min-width: 768px) 55vw, 85vw"
            className="object-cover transition-transform duration-[1.4s] ease-blade group-hover:scale-[1.04]"
          />
        </motion.div>
        {/* Brand grade: cool shadow at the bottom so captions read on any photo */}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#06080b]/90 via-[#06080b]/10 to-transparent" />
        <div aria-hidden className="absolute inset-0 bg-[#0050fd]/10 mix-blend-color" />

        <figcaption className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7">
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 24 },
              show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: easeBlade, delay: 0.5 } },
            }}
          >
            <p className="flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] text-white/70 uppercase">
              <span className="text-[#5c9dff]">{String(index + 1).padStart(2, "0")}</span>
              <span aria-hidden className="h-px w-5 bg-white/40" />
              {frame.place}
            </p>
            <p className="mt-3 max-w-md font-display text-2xl leading-tight font-semibold sm:text-3xl">{frame.title}</p>
            <p className="mt-2 max-w-md text-sm text-white/75 sm:text-base">{frame.body}</p>
          </motion.div>
        </figcaption>
        <a
          href={frame.credit.url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-3 right-3 rounded-full bg-black/40 px-2.5 py-1 text-[10px] text-white/70 backdrop-blur transition-colors hover:text-white"
        >
          Photo: {frame.credit.name} / Unsplash
        </a>
      </motion.div>
    </motion.figure>
  );
}

function Intro() {
  return (
    <div className="flex w-[min(80vw,30rem)] shrink-0 flex-col justify-center pr-6">
      <p className="flex items-center gap-3 font-mono text-xs tracking-[0.3em] text-accent-text uppercase">
        <span aria-hidden className="h-0.5 w-8 skew-x-[-35deg] bg-(image:--vx-blade)" />
        Life with an EV
      </p>
      <h2 className="mt-5 font-display text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-6xl">
        Made for the way Lagos moves.
      </h2>
      <p className="mt-5 max-w-sm text-lg text-muted">From VI evenings to weekend beach runs — what driving electric looks like here.</p>
      <p aria-hidden className="mt-10 hidden items-center gap-3 font-mono text-xs tracking-[0.25em] text-muted uppercase md:flex">
        Keep scrolling
        <motion.span animate={{ x: [0, 8, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
          →
        </motion.span>
      </p>
    </div>
  );
}

/**
 * Desktop: the section pins and vertical scroll drives the strip sideways.
 * Phones and reduced motion: a native, snap-scrolling horizontal strip.
 */
export function LagosStory({ frames }: { frames: StoryFrame[] }) {
  const motionAllowed = useMotionAllowed();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [pinned, setPinned] = useState(false);

  // Measure how far the track must travel; pin only on wide screens.
  useLayoutEffect(() => {
    const measure = () => {
      const wide = window.matchMedia("(min-width: 768px)").matches;
      setPinned(wide);
      const track = trackRef.current;
      if (track) setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [motionAllowed, pinned]);

  const usePin = pinned && motionAllowed;
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  const x = useTransform(smooth, (p) => -p * distance);
  const [progress, setProgress] = useState(0);
  useMotionValueEvent(smooth, "change", setProgress);

  if (!usePin) {
    return (
      <section ref={sectionRef} aria-label="Life with an EV in Lagos" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <Intro />
        </div>
        <div
          ref={trackRef}
          data-lenis-prevent
          className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:px-6"
        >
          {frames.map((f, i) => (
            <Frame key={f.slug} frame={f} index={i} className="w-[82vw] max-w-sm snap-center aspect-[4/5] sm:aspect-[4/5]" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} aria-label="Life with an EV in Lagos" style={{ height: `calc(100svh + ${distance}px)` }} className="relative">
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <motion.div ref={trackRef} style={{ x }} className="flex h-[72svh] items-stretch gap-6 pr-[8vw] pl-[max(1.5rem,calc((100vw-80rem)/2+2.5rem))] will-change-transform">
          <Intro />
          {frames.map((f, i) => (
            <Frame key={f.slug} frame={f} index={i} className="h-full" />
          ))}
        </motion.div>
        {/* Progress rail */}
        <div className="absolute inset-x-0 bottom-8 mx-auto flex w-[min(80rem,calc(100vw-5rem))] items-center gap-4">
          <span className="font-mono text-xs text-muted">{String(Math.min(frames.length, Math.floor(progress * frames.length) + 1)).padStart(2, "0")}</span>
          <div className="relative h-px flex-1 bg-line">
            <motion.div className="absolute inset-y-0 left-0 w-full origin-left bg-(image:--vx-blade)" style={{ scaleX: smooth }} />
          </div>
          <span className="font-mono text-xs text-muted">{String(frames.length).padStart(2, "0")}</span>
        </div>
      </div>
    </section>
  );
}
