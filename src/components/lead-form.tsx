"use client";

import {
  ArrowLeft,
  ArrowRight,
  Bus,
  Car,
  CarFront,
  CircleHelp,
  Loader2,
  Lock,
  Mail,
  MessageCircle,
  Phone,
  Plus,
  Truck,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useActionState, useState } from "react";
import { toast } from "sonner";
import { cn } from "@vertex/ui/lib/cn";
import { easeBlade } from "@vertex/ui/motion/easing";
import { submitLead } from "@/app/actions/lead";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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

type Method = "whatsapp" | "call" | "email";

const initial: LeadState = { status: "idle" };

const bodyTypes = [
  { value: "Sedan", icon: CarFront },
  { value: "SUV", icon: Car },
  { value: "MPV", icon: Bus },
  { value: "Pickup", icon: Truck },
  { value: "Not sure yet", icon: CircleHelp },
];
const budgets = ["Under ₦50m", "₦50m – ₦100m", "₦100m – ₦200m", "Above ₦200m", "Prefer to discuss"];
const timelines = ["As soon as possible", "1–3 months", "3–6 months", "Just exploring"];
const methods: { value: Method; label: string; icon: typeof Phone }[] = [
  { value: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { value: "call", label: "Call", icon: Phone },
  { value: "email", label: "Email", icon: Mail },
];
const ORDER_STEPS = ["Your car", "Budget & timing", "Your details"] as const;

/** Card-style single-choice options (shadcn ToggleGroup, arrow-key navigable) backed by a hidden input so the form posts the value. */
function ChoiceGroup({
  name,
  label,
  value,
  onChange,
  options,
  columns = "grid-cols-2 sm:grid-cols-3",
}: {
  name: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label?: string; icon?: typeof Phone }[];
  columns?: string;
}) {
  return (
    <Field>
      <FieldTitle>{label}</FieldTitle>
      <input type="hidden" name={name} value={value} />
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(v) => v && onChange(v)}
        aria-label={label}
        className={cn("grid w-full gap-2", columns)}
      >
        {options.map((o) => (
          <ToggleGroupItem
            key={o.value}
            value={o.value}
            className={cn(
              "h-auto min-h-12 flex-col gap-1.5 rounded-xl border border-line bg-surface-2/50 px-3 py-3 text-sm font-medium text-fg",
              "transition-[background-color,border-color,box-shadow,transform] duration-300 hover:border-line-strong active:scale-[0.98]",
              "data-[state=on]:border-accent data-[state=on]:bg-accent/12 data-[state=on]:text-fg data-[state=on]:shadow-[0_0_0_3px_var(--vx-glow)]",
              o.icon ? "" : "py-2.5",
            )}
          >
            {o.icon && <o.icon className="size-5 text-accent-text" aria-hidden />}
            <span className="text-center leading-tight whitespace-normal">{o.label ?? o.value}</span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </Field>
  );
}

/** Keeps every step mounted (so the form posts all values) and animates the active one in. */
function StepPanel({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <motion.div
      initial={false}
      animate={active ? { opacity: 1, x: 0, display: "block" } : { opacity: 0, x: -20, transitionEnd: { display: "none" } }}
      transition={{ duration: 0.45, ease: easeBlade }}
      aria-hidden={!active}
      inert={!active}
    >
      {children}
    </motion.div>
  );
}

export function LeadForm({ type, stockNumber, vehicleLabel, submitLabel, whatsappHref, phone, className }: Props) {
  const isOrder = type === "order";
  const lastStep = isOrder ? ORDER_STEPS.length - 1 : 0;
  const [step, setStep] = useState(0);
  const [method, setMethod] = useState<Method>("whatsapp");
  const [bodyType, setBodyType] = useState("");
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [localPhone, setLocalPhone] = useState("");
  const [moreOpen, setMoreOpen] = useState(false);

  const [state, action, pending] = useActionState(async (prev: LeadState, fd: FormData) => {
    const result = await submitLead(prev, fd);
    // Required fields live on the last step: jump there so errors are visible.
    if (result.status === "invalid") setStep(lastStep);
    if (result.status === "sent") toast.success("Request sent", { description: "A Vertex advisor will contact you shortly." });
    if (result.status === "error") toast.error("Couldn't send your request", { description: "Please try again, or message us on WhatsApp." });
    return result;
  }, initial);

  const err = state.status === "invalid" ? state.errors : {};
  const val = state.status === "invalid" ? state.values : {};
  // Visitors type a local number; "+234" is shown as a prefix. Numbers already starting with + or 234 pass through.
  const digits = localPhone.replace(/[^\d+]/g, "");
  const fullPhone = digits.startsWith("+") || digits.startsWith("234") ? digits : digits ? `+234${digits.replace(/^0/, "")}` : "";

  if (state.status === "sent") {
    return (
      <motion.div
        role="status"
        initial={{ opacity: 0, scale: 0.96, filter: "blur(6px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.6, ease: easeBlade }}
        className={cn("rounded-2xl border border-line bg-surface p-8 text-center", className)}
      >
        <svg viewBox="0 0 52 52" className="mx-auto size-14" aria-hidden>
          <motion.circle cx="26" cy="26" r="24" fill="none" stroke="var(--vx-accent)" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, ease: easeBlade }} />
          <motion.path
            d="M15 27l7 7 15-16"
            fill="none"
            stroke="var(--vx-accent-text)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.45, delay: 0.45, ease: easeBlade }}
          />
        </svg>
        <p className="mt-5 font-display text-xl font-medium">Thank you — we&apos;ve got it.</p>
        <p className="mt-2 text-muted">A Vertex advisor will contact you shortly{vehicleLabel ? ` about the ${vehicleLabel}` : ""}.</p>
      </motion.div>
    );
  }

  const contactStep = (
    <FieldGroup className="gap-5">
      <Field data-invalid={Boolean(err.name)}>
        <FieldLabel htmlFor={`${type}-name`}>Your name</FieldLabel>
        <Input id={`${type}-name`} name="name" autoComplete="name" placeholder="e.g. Chinedu Okafor" defaultValue={val.name} aria-invalid={Boolean(err.name)} />
        <FieldError>{err.name}</FieldError>
      </Field>

      <Field data-invalid={Boolean(err.phone)}>
        <FieldLabel htmlFor={`${type}-phone`}>Phone / WhatsApp</FieldLabel>
        <input type="hidden" name="phone" value={fullPhone} />
        <InputGroup>
          <InputGroupAddon className="border-r border-line pr-3 text-fg">
            {/* SVG flag: Windows has no flag emoji, so 🇳🇬 would render as "NG". */}
            <svg viewBox="0 0 3 2" className="h-3.5 w-5 rounded-[2px]" aria-hidden>
              <rect width="1" height="2" fill="#008751" />
              <rect x="1" width="1" height="2" fill="#fff" />
              <rect x="2" width="1" height="2" fill="#008751" />
            </svg>
            +234
          </InputGroupAddon>
          <InputGroupInput
            id={`${type}-phone`}
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="803 123 4567"
            value={localPhone}
            onChange={(e) => setLocalPhone(e.target.value)}
            aria-invalid={Boolean(err.phone)}
          />
        </InputGroup>
        <FieldError>{err.phone}</FieldError>
      </Field>

      <ChoiceGroup
        name="contactMethod"
        label="Best way to reach you"
        value={method}
        onChange={(v) => setMethod(v as Method)}
        options={methods.map((m) => ({ value: m.value, label: m.label, icon: m.icon }))}
        columns="grid-cols-3"
      />

      <AnimatePresence initial={false}>
        {method === "email" && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.35, ease: easeBlade }} className="overflow-hidden">
            <Field data-invalid={Boolean(err.email)} className="pt-1">
              <FieldLabel htmlFor={`${type}-email`}>Email</FieldLabel>
              <Input id={`${type}-email`} name="email" type="email" autoComplete="email" placeholder="you@example.com" defaultValue={val.email} aria-invalid={Boolean(err.email)} />
              <FieldError>{err.email}</FieldError>
            </Field>
          </motion.div>
        )}
      </AnimatePresence>

      {type === "viewing" && (
        <Field>
          <FieldLabel htmlFor={`${type}-date`}>Preferred day</FieldLabel>
          <Input id={`${type}-date`} name="preferredDate" type="date" defaultValue={val.preferredDate} />
          <FieldDescription>We&apos;ll confirm the exact time with you.</FieldDescription>
        </Field>
      )}

      {/* Optional extras stay out of the way until asked for. */}
      <div>
        <button
          type="button"
          aria-expanded={moreOpen}
          onClick={() => setMoreOpen((o) => !o)}
          className="inline-flex items-center gap-2 text-sm text-accent-text transition-colors hover:text-fg"
        >
          <motion.span animate={{ rotate: moreOpen ? 45 : 0 }} transition={{ duration: 0.3 }} className="flex">
            <Plus className="size-4" aria-hidden />
          </motion.span>
          {moreOpen ? "Hide extra details" : "Add your city or a note"}
        </button>
        <AnimatePresence initial={false}>
          {moreOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.35, ease: easeBlade }} className="overflow-hidden">
              <FieldGroup className="gap-5 pt-4">
                <Field>
                  <FieldLabel htmlFor={`${type}-city`}>City</FieldLabel>
                  <Input id={`${type}-city`} name="city" autoComplete="address-level2" placeholder="Abuja, Lagos…" defaultValue={val.city} />
                </Field>
                <Field>
                  <FieldLabel htmlFor={`${type}-message`}>Anything else?</FieldLabel>
                  <Textarea id={`${type}-message`} name="message" rows={3} placeholder="Trade-in, financing, colour preference…" defaultValue={val.message} />
                </Field>
              </FieldGroup>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </FieldGroup>
  );

  const submitButton = (
    <button
      type="submit"
      disabled={pending}
      className="group/sub relative inline-flex h-13 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-accent px-6 font-medium text-on-accent shadow-[0_10px_40px_-10px_var(--vx-glow)] transition-[transform,box-shadow] duration-300 hover:shadow-[0_14px_50px_-8px_var(--vx-glow)] active:scale-[0.99] disabled:opacity-70"
    >
      <span aria-hidden className="absolute inset-y-0 -left-1/2 w-[200%] -translate-x-full skew-x-[-35deg] bg-blue-400 transition-transform duration-700 ease-blade group-hover/sub:translate-x-0 motion-reduce:hidden" />
      <span className="relative inline-flex items-center gap-2">
        {pending ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden /> Sending…
          </>
        ) : (
          <>
            {submitLabel}
            <ArrowRight className="size-4 transition-transform group-hover/sub:translate-x-1" aria-hidden />
          </>
        )}
      </span>
    </button>
  );

  return (
    <form action={action} noValidate className={cn("space-y-6", className)}>
      <input type="hidden" name="type" value={type} />
      {stockNumber && <input type="hidden" name="stockNumber" value={stockNumber} />}
      {/* Honeypot, hidden from people and assistive tech */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Company <input name="company" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      {isOrder ? (
        <>
          {/* Progress */}
          <div>
            <div className="flex items-baseline justify-between text-sm">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p key={step} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }} className="font-medium">
                  {ORDER_STEPS[step]}
                </motion.p>
              </AnimatePresence>
              <span className="font-mono text-xs text-muted">
                Step {step + 1} of {ORDER_STEPS.length}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-1.5" aria-hidden>
              {ORDER_STEPS.map((s, i) => (
                <div key={s} className="h-1 overflow-hidden rounded-full bg-surface-2">
                  <motion.div className="h-full rounded-full bg-(image:--vx-blade)" initial={false} animate={{ width: i <= step ? "100%" : "0%" }} transition={{ duration: 0.5, ease: easeBlade }} />
                </div>
              ))}
            </div>
          </div>

          <StepPanel active={step === 0}>
            <FieldGroup className="gap-5">
              <ChoiceGroup name="bodyType" label="What kind of car?" value={bodyType} onChange={setBodyType} options={bodyTypes.map((b) => ({ value: b.value, icon: b.icon }))} />
              <Field>
                <FieldLabel htmlFor="order-models">Models you have in mind</FieldLabel>
                <Input id="order-models" name="models" placeholder="e.g. Xiaomi SU7, BYD Seal" defaultValue={val.models} />
                <FieldDescription>Optional — leave it blank and we&apos;ll suggest options.</FieldDescription>
              </Field>
            </FieldGroup>
          </StepPanel>

          <StepPanel active={step === 1}>
            <FieldGroup className="gap-5">
              <ChoiceGroup name="budget" label="Budget" value={budget} onChange={setBudget} options={budgets.map((b) => ({ value: b }))} columns="grid-cols-2" />
              <ChoiceGroup name="timeline" label="When do you need it?" value={timeline} onChange={setTimeline} options={timelines.map((t) => ({ value: t }))} columns="grid-cols-2" />
            </FieldGroup>
          </StepPanel>

          <StepPanel active={step === 2}>{contactStep}</StepPanel>
        </>
      ) : (
        contactStep
      )}

      <AnimatePresence>
        {state.status === "unconfigured" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: easeBlade }}
            role="status"
            className="rounded-xl border border-line bg-surface-2/60 p-4 text-sm"
          >
            <p className="font-medium">Online enquiries aren&apos;t live yet — your details were not sent.</p>
            {whatsappHref || phone ? (
              <p className="mt-2 flex flex-wrap gap-4 text-accent-text">
                {whatsappHref && (
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 underline-offset-4 hover:underline">
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
          </motion.div>
        )}
      </AnimatePresence>

      {isOrder && step < lastStep ? (
        <div className="flex gap-3">
          {step > 0 && (
            <button type="button" onClick={() => setStep((s) => s - 1)} className="inline-flex h-13 items-center gap-2 rounded-xl border border-line-strong px-5 text-sm font-medium transition-colors hover:border-accent-text">
              <ArrowLeft className="size-4" aria-hidden /> Back
            </button>
          )}
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            className="group/next inline-flex h-13 flex-1 items-center justify-center gap-2 rounded-xl bg-fg font-medium text-bg transition-transform active:scale-[0.99]"
          >
            Continue <ArrowRight className="size-4 transition-transform group-hover/next:translate-x-1" aria-hidden />
          </button>
        </div>
      ) : (
        <div className="flex gap-3">
          {isOrder && (
            <button type="button" onClick={() => setStep((s) => s - 1)} aria-label="Back" className="inline-flex h-13 items-center rounded-xl border border-line-strong px-4 transition-colors hover:border-accent-text">
              <ArrowLeft className="size-4" aria-hidden />
            </button>
          )}
          <div className="flex-1">{submitButton}</div>
        </div>
      )}

      <p className="flex items-center gap-2 text-xs text-muted">
        <Lock className="size-3.5 shrink-0" aria-hidden />
        <span>
          Your details stay with Vertex and are only used to reply.{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-fg">
            Privacy policy
          </Link>
        </span>
      </p>
    </form>
  );
}
