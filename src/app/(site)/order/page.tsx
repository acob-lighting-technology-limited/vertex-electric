import { ClipboardCheck, Search, Ship, Truck } from "lucide-react";
import type { Metadata } from "next";
import { Container } from "@vertex/ui/primitives/container";
import { LeadForm } from "@/components/lead-form";
import { SectionHeading } from "@/components/section-heading";
import { site, whatsappHref } from "@/lib/site";

export const metadata: Metadata = {
  title: "Order on request",
  description: "Tell Vertex the EV you want. We source it from China and beyond, inspect it, ship it and deliver it in Nigeria.",
};

const steps = [
  { icon: Search, title: "Tell us what you want", body: "Model, spec, colour and budget — or just how you'll use it, and we'll suggest options." },
  { icon: ClipboardCheck, title: "We source & inspect", body: "We find the car through our sourcing partners and inspect it before you commit." },
  { icon: Ship, title: "Shipping & clearing", body: "We handle shipping to Lagos and customs clearance, and keep you updated." },
  { icon: Truck, title: "Handover", body: "Collect from our showroom or arrange delivery, with after-sales support from Vertex." },
];

export default function OrderPage() {
  const wa = whatsappHref("Hi Vertex, I'd like to order an EV on request.");
  return (
    <Container className="py-16 sm:py-20">
      <SectionHeading
        as="h1"
        eyebrow="Order on request"
        title="The EV you want, brought home"
        description="Not in stock? We source electric vehicles from China and other markets to your specification."
      />

      <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <ol className="space-y-8">
          {steps.map((s, i) => (
            <li key={s.title} className="flex gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-line-strong">
                <s.icon className="size-4 text-accent-text" aria-hidden />
              </span>
              <div>
                <p className="font-mono text-xs text-muted">Step {i + 1}</p>
                <p className="mt-1 font-medium">{s.title}</p>
                <p className="mt-1 text-muted">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="rounded-(--vx-radius-lg) border border-line bg-surface p-6 sm:p-8">
          <h2 className="font-display text-xl font-medium">Start your order</h2>
          <p className="mt-1 text-sm text-muted">No commitment — we&apos;ll come back with options and a quote.</p>
          <LeadForm type="order" submitLabel="Send request" whatsappHref={wa} phone={site.phone} className="mt-6" />
        </div>
      </div>
    </Container>
  );
}
