import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import { SpotlightCard } from "@vertex/ui/motion/spotlight-card";
import { bodyTypeLabel, type PublicVehicle, vehicleTitle } from "@/lib/inventory";
import { AvailabilityBadge } from "./availability-badge";

export function VehicleCard({ vehicle, preload = false }: { vehicle: PublicVehicle; preload?: boolean }) {
  const cover = vehicle.photos[0];
  const title = vehicleTitle(vehicle);
  return (
    <SpotlightCard className="h-full rounded-(--vx-radius-lg)">
      <Link
        href={`/inventory/${vehicle.slug}`}
        transitionTypes={["nav-forward"]}
        className="group flex h-full flex-col overflow-hidden rounded-(--vx-radius-lg) border border-line bg-surface transition-colors duration-(--vx-dur) hover:border-line-strong"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-surface-2">
          {cover && (
            // Morphs into the gallery's main image on the vehicle page.
            <ViewTransition name={`vehicle-${vehicle.slug}`} share="morph" default="none">
              <Image
                src={cover.src}
                alt={cover.alt}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-[1.2s] ease-blade group-hover:scale-[1.06]"
                preload={preload}
              />
            </ViewTransition>
          )}
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <AvailabilityBadge availability={vehicle.availability} className="absolute top-3 left-3" />
          <span className="absolute right-3 bottom-3 translate-y-2 rounded-full bg-black/60 px-3 py-1 text-xs text-white opacity-0 backdrop-blur transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            {vehicle.photos.length} photos
          </span>
        </div>
        <div className="flex flex-1 items-start justify-between gap-4 p-5">
          <div className="min-w-0">
            <p className="font-mono text-xs tracking-wider text-muted">{vehicle.stockNumber}</p>
            <h3 className="mt-1 truncate font-display text-lg font-medium">{title}</h3>
            <p className="mt-1 text-sm text-muted">
              {[bodyTypeLabel[vehicle.model.bodyType], vehicle.exteriorColour, vehicle.interiorColour && `${vehicle.interiorColour} interior`]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-line-strong transition-all duration-300 group-hover:rotate-45 group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent">
            <ArrowUpRight className="size-4" aria-hidden />
          </span>
        </div>
      </Link>
    </SpotlightCard>
  );
}
