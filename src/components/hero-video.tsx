"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type HeroVideoSources = {
  desktop: { av1?: string; h264: string };
  mobile: { av1?: string; h264: string };
};

type NetworkInfo = { saveData?: boolean };

/**
 * Background loop layered over the poster image. The poster stays the LCP
 * element: the video is only attached after the browser is idle, and never
 * under prefers-reduced-motion or Save-Data.
 */
export function HeroVideo({ sources }: { sources: HeroVideoSources }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<{ av1?: string; h264: string } | null>(null);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: NetworkInfo }).connection?.saveData;
    if (reduce || saveData) return;
    const pick = () => setSrc(window.matchMedia("(min-width: 768px)").matches ? sources.desktop : sources.mobile);
    // Safari has no requestIdleCallback; fall back to a short timeout there.
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(pick, { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(pick, 1200);
    return () => clearTimeout(t);
  }, [sources]);

  if (!src) return null;

  return (
    <>
      <video
        ref={ref}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        aria-hidden
        className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-1000 data-[ready=true]:opacity-100"
        onCanPlay={(e) => e.currentTarget.setAttribute("data-ready", "true")}
      >
        {src.av1 && <source src={src.av1} type='video/mp4; codecs="av01.0.08M.08"' />}
        <source src={src.h264} type="video/mp4" />
      </video>
      <button
        type="button"
        onClick={() => {
          const v = ref.current;
          if (!v) return;
          if (v.paused) void v.play();
          else v.pause();
          setPlaying(!v.paused);
        }}
        aria-label={playing ? "Pause background video" : "Play background video"}
        className="absolute right-4 bottom-4 z-10 rounded-full bg-black/50 p-2.5 text-white backdrop-blur hover:bg-black/70"
      >
        {playing ? <Pause className="size-4" aria-hidden /> : <Play className="size-4" aria-hidden />}
      </button>
    </>
  );
}
