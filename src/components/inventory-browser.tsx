"use client";

import { useMemo, useState } from "react";
import { ButtonLink } from "@vertex/ui/primitives/button";
import { cn } from "@vertex/ui/lib/cn";
import { availabilityLabel, type Availability, type BodyType, bodyTypeLabel, type PublicVehicle } from "@/lib/inventory";
import { VehicleCard } from "./vehicle-card";

type Filter<T extends string> = T | "all";

function Chips<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: Filter<T>;
  options: { value: Filter<T>; label: string }[];
  onChange: (v: Filter<T>) => void;
}) {
  return (
    <fieldset className="flex flex-wrap items-center gap-2">
      <legend className="sr-only">{label}</legend>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "rounded-full border px-4 py-2 text-sm transition-colors",
            value === o.value ? "border-accent bg-accent/15 text-fg" : "border-line-strong text-muted hover:text-fg",
          )}
        >
          {o.label}
        </button>
      ))}
    </fieldset>
  );
}

export function InventoryBrowser({ vehicles }: { vehicles: PublicVehicle[] }) {
  const [body, setBody] = useState<Filter<BodyType>>("all");
  const [avail, setAvail] = useState<Filter<Availability>>("all");

  const bodyOptions = useMemo(() => [...new Set(vehicles.map((v) => v.model.bodyType))], [vehicles]);
  const availOptions = useMemo(() => [...new Set(vehicles.map((v) => v.availability))], [vehicles]);
  const shown = vehicles.filter((v) => (body === "all" || v.model.bodyType === body) && (avail === "all" || v.availability === avail));

  return (
    <div className="mt-10">
      <div className="flex flex-col gap-3 border-y border-line py-4 sm:flex-row sm:items-center sm:justify-between">
        <Chips
          label="Body type"
          value={body}
          onChange={setBody}
          options={[{ value: "all", label: "All types" }, ...bodyOptions.map((b) => ({ value: b, label: bodyTypeLabel[b] }))]}
        />
        {availOptions.length > 1 && (
          <Chips
            label="Availability"
            value={avail}
            onChange={setAvail}
            options={[{ value: "all", label: "Any status" }, ...availOptions.map((a) => ({ value: a, label: availabilityLabel[a] }))]}
          />
        )}
      </div>

      <p className="mt-6 text-sm text-muted" aria-live="polite">
        {shown.length} {shown.length === 1 ? "vehicle" : "vehicles"}
      </p>

      {shown.length > 0 ? (
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((v, i) => (
            <VehicleCard key={v.slug} vehicle={v} preload={i < 3} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-(--vx-radius-lg) border border-line bg-surface p-10 text-center">
          <p className="font-display text-lg">Nothing matches those filters right now.</p>
          <p className="mt-2 text-muted">We can source the car you want.</p>
          <ButtonLink href="/order" className="mt-6">
            Order on request
          </ButtonLink>
        </div>
      )}
    </div>
  );
}
