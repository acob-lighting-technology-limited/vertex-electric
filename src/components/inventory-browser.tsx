"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useMemo, useState } from "react";
import { cn } from "@vertex/ui/lib/cn";
import { easeBlade } from "@vertex/ui/motion/easing";
import { ButtonLink } from "@vertex/ui/primitives/button";
import { availabilityLabel, type Availability, type BodyType, bodyTypeLabel, type PublicVehicle } from "@/lib/inventory";
import { VehicleCard } from "./vehicle-card";

type Filter<T extends string> = T | "all";

function Chips<T extends string>({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: Filter<T>;
  options: { value: Filter<T>; label: string; count: number }[];
  onChange: (v: Filter<T>) => void;
}) {
  return (
    <fieldset className="flex flex-wrap items-center gap-1 rounded-full border border-line bg-surface/60 p-1">
      <legend className="sr-only">{label}</legend>
      {options.map((o) => {
        const active = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.value)}
            className={cn("relative rounded-full px-4 py-2 text-sm transition-colors", active ? "text-on-accent" : "text-muted hover:text-fg")}
          >
            {active && (
              <motion.span
                layoutId={`chip-${id}`}
                className="absolute inset-0 rounded-full bg-accent"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative">
              {o.label} <span className={cn("ml-1 font-mono text-xs", active ? "text-white/70" : "text-muted/70")}>{o.count}</span>
            </span>
          </button>
        );
      })}
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
    <div className="mt-12">
      <motion.div
        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: easeBlade, delay: 0.3 }}
      >
        <LayoutGroup id="body">
          <Chips
            id="body"
            label="Body type"
            value={body}
            onChange={setBody}
            options={[
              { value: "all", label: "All", count: vehicles.length },
              ...bodyOptions.map((b) => ({ value: b, label: bodyTypeLabel[b], count: vehicles.filter((v) => v.model.bodyType === b).length })),
            ]}
          />
        </LayoutGroup>
        {availOptions.length > 1 && (
          <LayoutGroup id="avail">
            <Chips
              id="avail"
              label="Availability"
              value={avail}
              onChange={setAvail}
              options={[
                { value: "all", label: "Any status", count: vehicles.length },
                ...availOptions.map((a) => ({ value: a, label: availabilityLabel[a], count: vehicles.filter((v) => v.availability === a).length })),
              ]}
            />
          </LayoutGroup>
        )}
      </motion.div>

      <p className="mt-8 font-mono text-xs tracking-[0.2em] text-muted uppercase" aria-live="polite">
        Showing {shown.length} {shown.length === 1 ? "vehicle" : "vehicles"}
      </p>

      <motion.div layout className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {shown.map((v, i) => (
            <motion.div
              key={v.slug}
              layout
              initial={{ opacity: 0, y: 30, scale: 0.96, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.94, filter: "blur(6px)" }}
              transition={{ duration: 0.6, ease: easeBlade, delay: i * 0.06 }}
            >
              <VehicleCard vehicle={v} preload={i < 3} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {shown.length === 0 && (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6 rounded-(--vx-radius-lg) border border-dashed border-line-strong p-12 text-center"
          >
            <p className="font-display text-xl">Nothing matches those filters right now.</p>
            <p className="mt-2 text-muted">We can source the car you want.</p>
            <ButtonLink href="/order" className="mt-6" transitionTypes={["nav-forward"]}>
              Order on request
            </ButtonLink>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
