"use client";

import { CheckCircle2, ChevronDown, Info, Route, TriangleAlert } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useId, useMemo, useState } from "react";
import { cn } from "@vertex/ui/lib/cn";
import { AnimatedNumber } from "@vertex/ui/motion/count-up";
import { easeBlade } from "@vertex/ui/motion/easing";
import { ButtonLink } from "@vertex/ui/primitives/button";
import { dailyPresets, naira, nairaRate, plan, runningCostDefaults, tripPresets, vehicleProfiles } from "@/lib/running-costs";

function Segmented<T extends string | number>({
  group,
  value,
  options,
  onChange,
  label,
}: {
  group: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <LayoutGroup id={group}>
      <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-1 rounded-(--vx-radius) border border-line bg-bg/60 p-1">
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={String(o.value)}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(o.value)}
              className={cn("relative flex-1 rounded-[calc(var(--vx-radius)-2px)] px-3 py-2 text-sm whitespace-nowrap transition-colors", active ? "text-on-accent" : "text-muted hover:text-fg")}
            >
              {active && (
                <motion.span layoutId={`seg-${group}`} className="absolute inset-0 rounded-[inherit] bg-accent" transition={{ type: "spring", stiffness: 420, damping: 34 }} />
              )}
              <span className="relative">{o.label}</span>
            </button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}

function Slider({ label, value, min, max, step, unit, onChange }: { label: string; value: number; min: number; max: number; step: number; unit: string; onChange: (v: number) => void }) {
  const id = useId();
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        <span className="font-mono text-sm text-accent-text">
          {value} {unit}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="vx-range mt-3 w-full"
        style={{ "--pct": `${pct}%` } as React.CSSProperties}
      />
    </div>
  );
}

function NumberField({ label, value, onChange, prefix, suffix }: { label: string; value: number; onChange: (v: number) => void; prefix?: string; suffix?: string }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="text-xs text-muted">
        {label}
      </label>
      <div className="mt-1 flex items-center rounded-(--vx-radius) border border-line-strong bg-surface px-3 focus-within:border-accent-text focus-within:shadow-[0_0_0_4px_var(--vx-glow)]">
        {prefix && <span className="text-sm text-muted">{prefix}</span>}
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={0}
          value={value}
          onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
          className="w-full bg-transparent px-2 py-2.5 text-fg outline-none"
        />
        {suffix && <span className="text-xs whitespace-nowrap text-muted">{suffix}</span>}
      </div>
    </div>
  );
}

export function RangePlanner() {
  const [vehicleId, setVehicleId] = useState<"sedan" | "suv">("sedan");
  const [dailyKm, setDailyKm] = useState(40);
  const [daysPerWeek, setDaysPerWeek] = useState(5);
  const [tripsPerMonth, setTripsPerMonth] = useState(1);
  const [tripKm, setTripKm] = useState(130);
  const [petrol, setPetrol] = useState(runningCostDefaults.petrolPerLitre);
  const [tariff, setTariff] = useState(runningCostDefaults.electricityPerKwh);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const vehicle = vehicleProfiles.find((v) => v.id === vehicleId)!;
  const r = useMemo(
    () => plan({ vehicle, dailyKm, daysPerWeek, tripsPerMonth, tripKm, petrolPerLitre: petrol, electricityPerKwh: tariff }),
    [vehicle, dailyKm, daysPerWeek, tripsPerMonth, tripKm, petrol, tariff],
  );
  const maxBar = Math.max(r.petrolMonthly, r.evMonthly, 1);
  const tripLabel = tripPresets.find((t) => t.km === tripKm)?.label ?? `${tripKm} km trip`;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      {/* Inputs */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: easeBlade, delay: 0.3 }}
        className="space-y-8 rounded-(--vx-radius-lg) border border-line bg-surface p-6 sm:p-8"
      >
        <div className="space-y-3">
          <p className="text-sm font-medium">Your car</p>
          <Segmented group="vehicle" label="Vehicle type" value={vehicleId} onChange={setVehicleId} options={vehicleProfiles.map((v) => ({ value: v.id, label: v.label }))} />
        </div>

        <div className="space-y-4">
          <Slider label="Everyday driving" value={dailyKm} min={5} max={250} step={5} unit="km / day" onChange={setDailyKm} />
          <div className="flex flex-wrap gap-2">
            {dailyPresets.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => setDailyKm(p.km)}
                className={cn("rounded-full border px-3 py-1.5 text-xs transition-colors", dailyKm === p.km ? "border-accent bg-accent/15 text-fg" : "border-line-strong text-muted hover:text-fg")}
              >
                {p.label} · {p.km} km
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium">Days you drive each week</p>
          <Segmented group="days" label="Days per week" value={daysPerWeek} onChange={setDaysPerWeek} options={[1, 2, 3, 4, 5, 6, 7].map((d) => ({ value: d, label: String(d) }))} />
        </div>

        <div className="space-y-4">
          <Slider label="Out-of-town trips" value={tripsPerMonth} min={0} max={8} step={1} unit="/ month" onChange={setTripsPerMonth} />
          <AnimatePresence initial={false}>
            {tripsPerMonth > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: easeBlade }}
                className="overflow-hidden"
              >
                <p className="text-xs text-muted">Typical trip (one way, approx.)</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {tripPresets.map((t) => (
                    <button
                      key={t.label}
                      type="button"
                      onClick={() => setTripKm(t.km)}
                      className={cn(
                        "rounded-(--vx-radius) border px-3 py-2.5 text-left text-xs transition-colors",
                        tripKm === t.km ? "border-accent bg-accent/15 text-fg" : "border-line-strong text-muted hover:text-fg",
                      )}
                    >
                      <span className="block font-medium">{t.label}</span>
                      <span className="font-mono">{t.km} km</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="border-t border-line pt-5">
          <button
            type="button"
            aria-expanded={showAdvanced}
            onClick={() => setShowAdvanced((s) => !s)}
            className="flex w-full items-center justify-between text-sm font-medium"
          >
            Prices used
            <span className="flex items-center gap-2 text-xs font-normal text-muted">
              {nairaRate(petrol)}/L · {nairaRate(tariff)}/kWh
              <motion.span animate={{ rotate: showAdvanced ? 180 : 0 }}>
                <ChevronDown className="size-4" aria-hidden />
              </motion.span>
            </span>
          </button>
          <AnimatePresence initial={false}>
            {showAdvanced && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: easeBlade }}
                className="overflow-hidden"
              >
                <div className="grid gap-4 pt-4 sm:grid-cols-2">
                  <NumberField label="Petrol price" prefix="₦" suffix="/ litre" value={petrol} onChange={setPetrol} />
                  <NumberField label="Electricity tariff" prefix="₦" suffix="/ kWh" value={tariff} onChange={setTariff} />
                </div>
                <p className="mt-3 text-xs text-muted">
                  Defaults: average pump price and NERC Band A tariff, {runningCostDefaults.asOf}. Change them to match yours.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Results */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: easeBlade, delay: 0.45 }}
        className="lg:sticky lg:top-24 lg:self-start"
        aria-live="polite"
      >
        <div className="relative overflow-hidden rounded-(--vx-radius-lg) border border-line bg-surface p-6 sm:p-8">
          <div aria-hidden className="absolute -top-24 -right-24 size-72 rounded-full bg-[radial-gradient(circle,var(--vx-glow),transparent_70%)]" />

          <AnimatePresence mode="wait">
            <motion.div
              key={r.dailyFits ? "fits" : "long"}
              initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
              transition={{ duration: 0.4, ease: easeBlade }}
              className={cn(
                "relative flex items-start gap-3 rounded-(--vx-radius) border p-4",
                r.dailyFits ? "border-emerald-400/30 bg-emerald-400/10" : "border-amber-400/30 bg-amber-400/10",
              )}
            >
              {r.dailyFits ? <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-400" aria-hidden /> : <TriangleAlert className="mt-0.5 size-5 shrink-0 text-amber-400" aria-hidden />}
              <div>
                <p className="font-display text-lg font-medium">{r.dailyFits ? "Yes — an EV fits your driving." : "Your daily distance is long for one charge."}</p>
                <p className="mt-1 text-sm text-muted">
                  {r.dailyFits
                    ? r.daysPerCharge > 1
                      ? `One full charge covers about ${r.daysPerCharge} days of your driving. Most owners simply plug in overnight a few times a week.`
                      : "You'd charge most nights at home — easy with a wall charger — and skip the filling station entirely."
                    : "You'd need to charge most days, and a top-up during the day on some. Talk to us about a longer-range model."}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="relative mt-8 grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted">Real-world range</p>
              <p className="mt-1 font-display text-2xl font-semibold whitespace-nowrap sm:text-3xl">
                <AnimatedNumber value={r.rangeKm} format={(n) => `≈ ${Math.round(n)} km`} />
              </p>
            </div>
            <div>
              <p className="text-sm text-muted">You drive</p>
              <p className="mt-1 font-display text-2xl font-semibold whitespace-nowrap sm:text-3xl">
                <AnimatedNumber value={r.monthlyKm} format={(n) => `${Math.round(n).toLocaleString("en-NG")} km`} />
              </p>
              <p className="text-xs text-muted">per month</p>
            </div>
          </div>

          <div className="relative mt-8 space-y-4">
            <p className="text-sm text-muted">Monthly running cost (energy only)</p>
            {[
              { label: "Petrol car", value: r.petrolMonthly, className: "bg-line-strong" },
              { label: vehicle.label, value: r.evMonthly, className: "bg-(image:--vx-blade)" },
            ].map((b) => (
              <div key={b.label}>
                <div className="flex items-baseline justify-between text-sm">
                  <span>{b.label}</span>
                  <span className="font-mono">
                    <AnimatedNumber value={b.value} format={naira} />
                  </span>
                </div>
                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-bg">
                  <motion.div
                    className={cn("h-full rounded-full", b.className)}
                    animate={{ width: `${(b.value / maxBar) * 100}%` }}
                    transition={{ duration: 0.7, ease: easeBlade }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="relative mt-8 rounded-(--vx-radius) border border-line bg-bg/60 p-5">
            <p className="text-sm text-muted">Estimated yearly saving on energy</p>
            <p className="mt-1 font-display text-3xl font-semibold text-accent-text sm:text-5xl">
              <AnimatedNumber value={Math.max(0, r.yearlySaving)} format={naira} />
            </p>
          </div>

          <AnimatePresence initial={false}>
            {tripsPerMonth > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="relative overflow-hidden"
              >
                <div className="mt-5 flex gap-3 text-sm">
                  <Route className="mt-0.5 size-5 shrink-0 text-accent-text" aria-hidden />
                  <p>
                    <span className="font-medium">{tripLabel}: </span>
                    {r.tripStops === 0
                      ? "done on a single charge each way."
                      : `about ${r.tripStops} charging stop${r.tripStops > 1 ? "s" : ""} each way. Public fast chargers are still limited in Nigeria — we'll help you plan the route.`}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/inventory" transitionTypes={["nav-forward"]}>
              Find a car that fits
            </ButtonLink>
            <ButtonLink href="/charging" variant="ghost" transitionTypes={["nav-forward"]}>
              Home charging
            </ButtonLink>
          </div>
        </div>
        <p className="mt-4 flex gap-2 text-xs text-muted">
          <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          Estimates for planning only. Real consumption depends on speed, traffic, air-con, load and the specific car. Energy costs exclude
          servicing, which is typically lower for EVs too.
        </p>
      </motion.div>
    </div>
  );
}
