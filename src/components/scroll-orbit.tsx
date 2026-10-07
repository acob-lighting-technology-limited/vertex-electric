"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@vertex/ui/lib/cn";
import { useMotionAllowed } from "@vertex/ui/lib/use-motion-allowed";

type Point = { title: string; body: string };

type Props = {
  frameCount: number;
  /** Frame URL pattern: {w} -> 720 | 1280, {i} -> 1-based index padded to 3 digits. */
  framePattern: string;
  poster: string;
  posterAlt: string;
  eyebrow: string;
  title: string;
  points: Point[];
};

const clamp = (n: number) => Math.min(1, Math.max(0, n));

/**
 * Scroll-driven camera orbit (H3): the section pins while scroll position
 * picks a frame from a pre-rendered sequence drawn to <canvas>. Frames start
 * loading only when the section approaches the viewport. Under reduced motion
 * or Save-Data it renders the poster and the points as a plain list.
 */
export function ScrollOrbit({ frameCount, framePattern, poster, posterAlt, eyebrow, title, points }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const enabled = useMotionAllowed();
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width: 720 | 1280 = window.innerWidth < 768 ? 720 : 1280;
    const frames: (HTMLImageElement | null)[] = Array(frameCount).fill(null);
    let current = -1;
    let raf = 0;
    let started = false;

    const draw = (index: number) => {
      // Fall back to the nearest frame that has loaded.
      let img: HTMLImageElement | null = null;
      for (let d = 0; d < frameCount && !img; d++) img = frames[index - d] ?? frames[index + d] ?? null;
      if (!img) return;
      if (canvas.width !== img.naturalWidth) {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
      }
      ctx.drawImage(img, 0, 0);
      setReady(true);
    };

    const update = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const p = clamp(-rect.top / (rect.height - window.innerHeight));
      setProgress(p);
      const index = Math.round(p * (frameCount - 1));
      if (index !== current) {
        current = index;
        draw(index);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    const load = () => {
      if (started) return;
      started = true;
      for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => {
          frames[i] = img;
          if (i === current || current === -1) update();
        };
        img.src = framePattern.replace("{w}", String(width)).replace("{i}", String(i + 1).padStart(3, "0"));
      }
    };

    const io = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && load(), {
      rootMargin: "100% 0px",
    });
    io.observe(section);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [enabled, frameCount, framePattern]);

  return (
    <section ref={sectionRef} className={cn("relative", enabled ? "h-[300svh]" : "")} aria-labelledby="orbit-title">
      <div className={cn("overflow-hidden bg-[#06080b] text-white", enabled ? "sticky top-0 h-svh" : "py-20")}>
        <div className="relative mx-auto grid h-full max-w-7xl content-center items-center gap-6 px-4 lg:gap-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:px-10">
          <div className="relative z-10 lg:py-10">
            <p className="font-mono text-xs tracking-[0.3em] text-[#5c9dff] uppercase">{eyebrow}</p>
            <h2 id="orbit-title" className="mt-3 font-display text-2xl font-semibold tracking-tight text-balance sm:text-4xl">
              {title}
            </h2>
            <ol className="mt-6 space-y-4 lg:mt-8 lg:space-y-6">
              {points.map((pt, i) => {
                // Each point lights up across its third of the scroll.
                const active = !enabled || (progress >= i / points.length - 0.02 && progress < (i + 1) / points.length + 0.02);
                return (
                  <li
                    key={pt.title}
                    className={cn(
                      "border-l-2 pl-4 transition-[opacity,border-color] duration-500",
                      active ? "border-[#0072fe] opacity-100" : "border-white/15 opacity-40",
                    )}
                  >
                    <p className="font-medium">{pt.title}</p>
                    {/* On phones only the active point shows its body, so the pinned view fits one screen. */}
                    <p className={cn("mt-1 text-white/70", enabled && !active && "hidden lg:block")}>{pt.body}</p>
                  </li>
                );
              })}
            </ol>
          </div>
          <div className="relative order-first aspect-video w-full lg:order-none">
            {/* eslint-disable-next-line @next/next/no-img-element -- poster doubles as the no-JS / reduced-motion fallback */}
            <img
              src={poster}
              alt={posterAlt}
              className={cn("absolute inset-0 size-full object-contain transition-opacity duration-500", ready && "opacity-0")}
              loading="lazy"
            />
            <canvas
              ref={canvasRef}
              aria-hidden
              className={cn("absolute inset-0 size-full object-contain", !enabled && "hidden")}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
