import { cn } from "../lib/cn";

/** Section divider echoing the logo's angled blade and the blue rule under "RC". */
export function BladeDivider({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("flex items-center gap-3", className)}>
      <span className="h-px flex-1 bg-line" />
      <span className="h-1 w-16 skew-x-[-35deg] bg-(image:--vx-blade)" />
      <span className="h-1 w-3 skew-x-[-35deg] bg-blue-400/60" />
    </div>
  );
}
