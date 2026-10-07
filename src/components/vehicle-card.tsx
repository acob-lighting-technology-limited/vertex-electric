import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { bodyTypeLabel, type PublicVehicle, vehicleTitle } from "@/lib/inventory";
import { AvailabilityBadge } from "./availability-badge";

export function VehicleCard({ vehicle, preload = false }: { vehicle: PublicVehicle; preload?: boolean }) {
  const cover = vehicle.photos[0];
  const title = vehicleTitle(vehicle);
  return (
    <Link
      href={`/inventory/${vehicle.slug}`}
      className="group block overflow-hidden rounded-(--vx-radius-lg) border border-line bg-surface transition-[border-color,transform] duration-(--vx-dur) ease-blade hover:-translate-y-0.5 hover:border-line-strong"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-2">
        {cover && (
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-(--vx-dur-slow) ease-blade group-hover:scale-[1.03]"
            preload={preload}
          />
        )}
        <AvailabilityBadge availability={vehicle.availability} className="absolute top-3 left-3" />
      </div>
      <div className="flex items-start justify-between gap-4 p-5">
        <div className="min-w-0">
          <p className="font-mono text-xs tracking-wider text-muted">{vehicle.stockNumber}</p>
          <h3 className="mt-1 truncate font-display text-lg font-medium">{title}</h3>
          <p className="mt-1 text-sm text-muted">
            {[bodyTypeLabel[vehicle.model.bodyType], vehicle.exteriorColour, vehicle.interiorColour && `${vehicle.interiorColour} interior`]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
        <ArrowUpRight
          className="mt-1 size-5 shrink-0 text-muted transition-colors group-hover:text-accent-text"
          aria-hidden
        />
      </div>
    </Link>
  );
}
