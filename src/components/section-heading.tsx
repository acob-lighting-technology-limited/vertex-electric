import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  as?: "h1" | "h2";
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        {eyebrow && <p className="font-mono text-xs tracking-[0.3em] text-accent-text uppercase">{eyebrow}</p>}
        <Tag
          className={
            Tag === "h1"
              ? "mt-3 font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl"
              : "mt-3 font-display text-3xl font-semibold tracking-tight text-balance"
          }
        >
          {title}
        </Tag>
        {description && <p className="mt-4 text-lg text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
