import { ClipboardCheck, Search, Ship, Truck } from "lucide-react";
import type { Metadata } from "next";
import { Reveal, Stagger, StaggerItem } from "@vertex/ui/motion/reveal";
import { Container } from "@vertex/ui/primitives/container";
import { LeadForm } from "@/components/lead-form";
import { PageTransition } from "@/components/page-transition";
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
    <PageTransition>
      <Container className="py-16 sm:py-24">
        <SectionHeading
          as="h1"
          eyebrow="Order on request"
          title="The EV you want, brought home"
          description="Not in stock? We source electric vehicles from China and other markets to your specification."
        />

        <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <Stagger as="ol" className="relative space-y-2" stagger={0.12}>
            <span aria-hidden className="absolute top-6 bottom-6 left-6 w-px bg-line" />
            {steps.map((s, i) => (
              <StaggerItem key={s.title} as="li" className="group relative flex gap-5 rounded-(--vx-radius-lg) p-3 transition-colors hover:bg-surface">
                <span className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full border border-line-strong bg-bg transition-colors group-hover:border-accent">
                  <s.icon className="size-5 text-accent-text" aria-hidden />
                </span>
                <div className="pt-1">
                  <p className="font-mono text-xs text-muted">Step 0{i + 1}</p>
                  <p className="mt-1 font-display text-lg font-medium">{s.title}</p>
                  <p className="mt-1 text-muted">{s.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.35}>
            <div className="rounded-(--vx-radius-lg) border border-line bg-surface p-6 sm:p-8 lg:sticky lg:top-24">
              <h2 className="font-display text-2xl font-medium">Start your order</h2>
              <p className="mt-1 text-sm text-muted">No commitment — we&apos;ll come back with options and a quote.</p>
              <LeadForm type="order" submitLabel="Send request" whatsappHref={wa} phone={site.phone} className="mt-6" />
            </div>
          </Reveal>
        </div>
      </Container>
    </PageTransition>
  );
}
