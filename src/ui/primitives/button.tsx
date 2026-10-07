import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "../lib/cn";

type Variant = "primary" | "ghost";
type Size = "md" | "lg";

const base =
  "group/btn relative isolate inline-flex items-center justify-center gap-2 overflow-hidden font-medium tracking-wide transition-[color,border-color,box-shadow] duration-(--vx-dur) ease-blade disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  // White on --vx-blue-600 is 5.9:1. The blade sweep is a brighter blue
  // (white on blue-400 is 4.3:1, still AA for this 16px medium label).
  primary:
    "bg-accent text-on-accent shadow-[0_0_0_1px_var(--vx-blue-600),0_8px_30px_-8px_var(--vx-glow)] hover:shadow-[0_0_0_1px_var(--vx-blue-400),0_10px_40px_-6px_var(--vx-glow)]",
  ghost: "border border-line-strong text-fg hover:border-accent-text",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-sm rounded-(--vx-radius)",
  lg: "h-13 px-7 text-base rounded-(--vx-radius)",
};

/** The angled blade that sweeps across on hover — the logo's 135° stroke. */
function Sweep({ variant }: { variant: Variant }) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-y-0 -left-1/2 -z-10 w-[200%] -translate-x-full skew-x-[-35deg] transition-transform duration-(--vx-dur-slow) ease-blade group-hover/btn:translate-x-0 motion-reduce:hidden",
        variant === "primary" ? "bg-blue-400" : "bg-accent/15",
      )}
    />
  );
}

type Common = { variant?: Variant; size?: Size };

export function Button({ variant = "primary", size = "md", className, children, ...props }: Common & ComponentProps<"button">) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      <Sweep variant={variant} />
      {children}
    </button>
  );
}

export function ButtonLink({ variant = "primary", size = "md", className, children, ...props }: Common & ComponentProps<typeof Link>) {
  return (
    <Link className={cn(base, variants[variant], sizes[size], className)} {...props}>
      <Sweep variant={variant} />
      {children}
    </Link>
  );
}
