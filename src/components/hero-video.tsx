"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useMotionAllowed } from "@vertex/ui/lib/use-motion-allowed";

export type HeroVideoSources = {
  desktop: { av1?: string; h264: string };
  mobile: { av1?: string; h264: string };
};

type Status = "loading" | "playing" | "paused" | "blocked";

/**
 * Background loop layered over the poster image. The poster stays the LCP
 * element: the video is only attached after the browser is idle, and never
 * under prefers-reduced-motion or Save-Data.
 *
 * The video only becomes visible once it is actually playing. Browsers can refuse
 * autoplay (iOS Low Power Mode, data savers) — then the poster simply stays, instead
 * of showing a frozen frame under Safari's native play button. A blocked video gets
 * one more try on the visitor's first touch or click, which counts as a user gesture.
 */
export function HeroVideo({ sources }: { sources: HeroVideoSources }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<{ av1?: string; h264: string } | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const motionAllowed = useMotionAllowed();

  useEffect(() => {
    if (!motionAllowed) return;
    const pick = () => setSrc(window.matchMedia("(min-width: 768px)").matches ? sources.desktop : sources.mobile);
    // Safari has no requestIdleCallback; fall back to a short timeout there.
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(pick, { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(pick, 1200);
    return () => clearTimeout(t);
  }, [motionAllowed, sources]);

  // Start playback explicitly so a refusal can be detected (autoplay alone fails silently).
  useEffect(() => {
    const v = ref.current;
    if (!v || !src) return;
    // iOS decides autoplay from the muted *attribute*; React only sets the property.
    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute("muted", "");

    let retry: (() => void) | null = null;
    v.play().catch(() => {
      setStatus("blocked");
      retry = () => {
        void v.play().catch(() => {});
        if (retry) {
          window.removeEventListener("pointerdown", retry);
          window.removeEventListener("touchstart", retry);
        }
      };
      window.addEventListener("pointerdown", retry, { once: true, passive: true });
      window.addEventListener("touchstart", retry, { once: true, passive: true });
    });
    return () => {
      if (retry) {
        window.removeEventListener("pointerdown", retry);
        window.removeEventListener("touchstart", retry);
      }
    };
  }, [src]);

  if (!src || !motionAllowed) return null;
  const visible = status === "playing" || status === "paused";

  return (
    <>
      <video
        ref={ref}
        autoPlay
        muted
        loop
        playsInline
        disablePictureInPicture
        disableRemotePlayback
        preload="auto"
        aria-hidden
        tabIndex={-1}
        className={`vx-bg-video absolute inset-0 size-full object-cover object-[50%_70%] transition-opacity duration-1000 md:object-[70%_50%] ${visible ? "opacity-100" : "opacity-0"}`}
        onPlaying={() => setStatus("playing")}
        onPause={() => setStatus((s) => (s === "playing" ? "paused" : s))}
      >
        {src.av1 && <source src={src.av1} type='video/mp4; codecs="av01.0.08M.08"' />}
        <source src={src.h264} type="video/mp4" />
      </video>
      {visible && (
        <button
          type="button"
          onClick={() => {
            const v = ref.current;
            if (!v) return;
            if (v.paused) void v.play();
            else v.pause();
          }}
          aria-label={status === "playing" ? "Pause background video" : "Play background video"}
          className="absolute bottom-4 left-4 z-10 rounded-full bg-black/50 p-2.5 text-white backdrop-blur hover:bg-black/70 max-sm:hidden"
        >
          {status === "playing" ? <Pause className="size-4" aria-hidden /> : <Play className="size-4" aria-hidden />}
        </button>
      )}
    </>
  );
}
