"use client";

import { CheckCircle2, MessageCircle, Phone } from "lucide-react";
import { useActionState, useId } from "react";
import { Button } from "@vertex/ui/primitives/button";
import { cn } from "@vertex/ui/lib/cn";
import { submitLead } from "@/app/actions/lead";
import type { LeadState, LeadType } from "@/lib/leads";
import { formatPhone } from "@/lib/site";

type Props = {
  type: LeadType;
  stockNumber?: string;
  vehicleLabel?: string;
  submitLabel: string;
  /** Contact fallbacks shown when online delivery isn't configured yet. */
  whatsappHref?: string;
  phone?: string;
  className?: string;
};

const initial: LeadState = { status: "idle" };

const fieldBase =
  "w-full rounded-(--vx-radius) border border-line-strong bg-surface px-3.5 py-2.5 text-fg placeholder:text-muted/70 transition-colors focus:border-accent-text focus:outline-none aria-[invalid=true]:border-red-400";

function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: (props: { id: string; "aria-invalid": boolean; "aria-describedby"?: string }) => React.ReactNode;
}) {
  const id = useId();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      {children({ id, "aria-invalid": Boolean(error), "aria-describedby": describedBy })}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-red-400">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function Select({ options, ...props }: React.ComponentProps<"select"> & { options: string[] }) {
  return (
    <select {...props} className={fieldBase}>
      <option value="">Select…</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

export function LeadForm({ type, stockNumber, vehicleLabel, submitLabel, whatsappHref, phone, className }: Props) {
  const [state, action, pending] = useActionState(submitLead, initial);
  const err = state.status === "invalid" ? state.errors : {};
  const val = state.status === "invalid" ? state.values : {};

  if (state.status === "sent") {
    return (
      <div role="status" className={cn("rounded-(--vx-radius-lg) border border-line bg-surface p-6", className)}>
        <CheckCircle2 className="size-6 text-accent-text" aria-hidden />
        <p className="mt-3 font-display text-lg font-medium">Thank you — we&apos;ve got it.</p>
        <p className="mt-1 text-muted">
          A Vertex advisor will contact you shortly{vehicleLabel ? ` about the ${vehicleLabel}` : ""}.
        </p>
      </div>
    );
  }

  return (
    <form action={action} noValidate className={cn("space-y-4", className)}>
      <input type="hidden" name="type" value={type} />
      {stockNumber && <input type="hidden" name="stockNumber" value={stockNumber} />}
      {/* Honeypot, hidden from people and assistive tech */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Company <input name="company" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      {type === "order" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Body type" error={err.bodyType}>
            {(p) => (
              <Select name="bodyType" defaultValue={val.bodyType} options={["Sedan", "SUV", "MPV", "Pickup", "Not sure yet"]} {...p} />
            )}
          </Field>
          <Field label="Budget" error={err.budget}>
            {(p) => (
              <Select
                name="budget"
                defaultValue={val.budget}
                options={["Under ₦50m", "₦50m – ₦100m", "₦100m – ₦200m", "Above ₦200m", "Prefer to discuss"]}
                {...p}
              />
            )}
          </Field>
          <div className="sm:col-span-2">
            <Field label="Models you're interested in" hint="e.g. Xiaomi SU7, BYD Seal — or leave blank and we'll suggest." error={err.models}>
              {(p) => <input name="models" defaultValue={val.models} className={fieldBase} {...p} />}
            </Field>
          </div>
          <Field label="When do you need it?" error={err.timeline}>
            {(p) => (
              <Select name="timeline" defaultValue={val.timeline} options={["As soon as possible", "1–3 months", "3–6 months", "Just exploring"]} {...p} />
            )}
          </Field>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" error={err.name}>
          {(p) => <input name="name" autoComplete="name" required defaultValue={val.name} className={fieldBase} {...p} />}
        </Field>
        <Field label="Phone / WhatsApp" error={err.phone}>
          {(p) => (
            <input name="phone" type="tel" inputMode="tel" autoComplete="tel" required placeholder="+234…" defaultValue={val.phone} className={fieldBase} {...p} />
          )}
        </Field>
        <Field label="Email (optional)" error={err.email}>
          {(p) => <input name="email" type="email" autoComplete="email" defaultValue={val.email} className={fieldBase} {...p} />}
        </Field>
        <Field label="City" error={err.city}>
          {(p) => <input name="city" autoComplete="address-level2" placeholder="Abuja, Lagos…" defaultValue={val.city} className={fieldBase} {...p} />}
        </Field>
        {type === "viewing" && (
          <Field label="Preferred day" error={err.preferredDate}>
            {(p) => <input name="preferredDate" type="date" defaultValue={val.preferredDate} className={fieldBase} {...p} />}
          </Field>
        )}
      </div>

      <fieldset>
        <legend className="text-sm font-medium">How should we contact you?</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {(["whatsapp", "call", "email"] as const).map((m) => (
            <label
              key={m}
              className="cursor-pointer rounded-full border border-line-strong px-4 py-2 text-sm capitalize has-checked:border-accent has-checked:bg-accent/15 has-focus-visible:outline-2 has-focus-visible:outline-accent-text"
            >
              <input type="radio" name="contactMethod" value={m} defaultChecked={(val.contactMethod ?? "whatsapp") === m} className="sr-only" />
              {m === "whatsapp" ? "WhatsApp" : m}
            </label>
          ))}
        </div>
      </fieldset>

      <Field label="Anything else? (optional)" error={err.message}>
        {(p) => <textarea name="message" rows={3} defaultValue={val.message} className={fieldBase} {...p} />}
      </Field>

      <div aria-live="polite">
        {state.status === "unconfigured" && (
          <div className="rounded-(--vx-radius) border border-line bg-surface-2 p-4 text-sm">
            <p className="font-medium">Online enquiries aren&apos;t live yet — your details were not sent.</p>
            {whatsappHref || phone ? (
              <p className="mt-2 flex flex-wrap gap-4 text-accent-text">
                {whatsappHref && (
                  <a href={whatsappHref} className="inline-flex items-center gap-1.5 underline-offset-4 hover:underline">
                    <MessageCircle className="size-4" aria-hidden /> Message us on WhatsApp
                  </a>
                )}
                {phone && (
                  <a href={`tel:${phone}`} className="inline-flex items-center gap-1.5 underline-offset-4 hover:underline">
                    <Phone className="size-4" aria-hidden /> Call {formatPhone(phone)}
                  </a>
                )}
              </p>
            ) : (
              <p className="mt-1 text-muted">Please check back shortly.</p>
            )}
          </div>
        )}
        {state.status === "error" && (
          <p className="rounded-(--vx-radius) border border-red-400/40 bg-red-400/10 p-4 text-sm">
            Something went wrong sending your request. Please try again{whatsappHref ? " or message us on WhatsApp" : ""}.
          </p>
        )}
      </div>

      <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Sending…" : submitLabel}
      </Button>
      <p className="text-xs text-muted">We only use your details to respond to this request.</p>
    </form>
  );
}
