import type { ReactNode } from "react";
import { cn } from "../lib/cn";

/** Infinite CSS marquee (two copies, translate -50%). Pauses on hover; static under reduced motion. */
export function Marquee({ children, className, speed = 40 }: { children: ReactNode; className?: string; speed?: number }) {
  return (
    <div className={cn("group/marquee flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]", className)}>
      <div
        className="flex shrink-0 animate-[vx-marquee_var(--speed)_linear_infinite] items-center group-hover/marquee:[animation-play-state:paused] motion-reduce:animate-none"
        style={{ "--speed": `${speed}s` } as React.CSSProperties}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
