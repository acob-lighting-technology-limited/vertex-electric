import type { ReactNode } from "react";
import { MaskText } from "@vertex/ui/motion/mask-text";
import { Reveal } from "@vertex/ui/motion/reveal";

/** Eyebrow + kinetic title + description. Page titles (h1) play on mount; section titles on scroll. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  as = "h2",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  as?: "h1" | "h2";
}) {
  const isPage = as === "h1";
  return (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div className="max-w-3xl">
        {eyebrow && (
          <Reveal y={12}>
            <p className="flex items-center gap-3 font-mono text-xs tracking-[0.3em] text-accent-text uppercase">
              <span aria-hidden className="h-0.5 w-8 skew-x-[-35deg] bg-(image:--vx-blade)" />
              {eyebrow}
            </p>
          </Reveal>
        )}
        <MaskText
          as={as}
          text={title}
          trigger={isPage ? "mount" : "inView"}
          delay={isPage ? 0.1 : 0}
          className={
            isPage
              ? "mt-4 font-display text-4xl leading-[1.05] font-semibold tracking-tight sm:text-6xl"
              : "mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl"
          }
        />
        {description && (
          <Reveal delay={0.3}>
            <p className="mt-5 max-w-2xl text-lg text-muted">{description}</p>
          </Reveal>
        )}
      </div>
      {action && <Reveal delay={0.35}>{action}</Reveal>}
    </div>
  );
}
