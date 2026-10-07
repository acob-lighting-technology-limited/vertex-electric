import { cn } from "@vertex/ui/lib/cn";
import { type Availability, availabilityLabel } from "@/lib/inventory";

const dot: Record<Availability, string> = {
  "in-showroom": "bg-emerald-400",
  arriving: "bg-blue-400",
  reserved: "bg-amber-400",
  sold: "bg-zinc-400",
};

export function AvailabilityBadge({ availability, className }: { availability: Availability; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1 text-xs font-medium text-white backdrop-blur",
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", dot[availability])} aria-hidden />
      {availabilityLabel[availability]}
    </span>
  );
}
