import { ArrowRight, BatteryCharging, CloudSun, Gauge, Plug, PlugZap, Zap } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { MaskText } from "@vertex/ui/motion/mask-text";
import { Reveal, Stagger, StaggerItem } from "@vertex/ui/motion/reveal";
import { SpotlightCard } from "@vertex/ui/motion/spotlight-card";
import { ButtonLink } from "@vertex/ui/primitives/button";
import { Container } from "@vertex/ui/primitives/container";
import { ChargeMeter } from "@/components/charge-meter";
import { LeadForm } from "@/components/lead-form";
import { PageHero } from "@/components/page-hero";
import { PageTransition } from "@/components/page-transition";
import { pageImages } from "@/lib/page-media";
import { site, whatsappHref } from "@/lib/site";

export const metadata: Metadata = {
  title: "Charging",
  description:
    "Charge your EV at home — with optional solar and battery backup from ACOB Lighting so you charge through outages. Public charging from Vertex EV Hub coming soon.",
};

// Range added per hour ≈ charger kW ÷ (kWh per km). At a typical ~16 kWh/100 km:
// 7 kW → ~44 km/h; a 2.3 kW socket → ~14 km/h. Shown as rounded ranges.
const methods = [
  {
    icon: PlugZap,
    tag: "Recommended",
    title: "Home wall charger",
    stat: "≈ 40–45 km",
    statLabel: "of range per hour (7 kW)",
    body: "A dedicated wall box on its own circuit. Plug in when you get home, wake up to a full battery. Installed and tested by our team.",
  },
  {
    icon: Plug,
    tag: "Back-up",
    title: "Standard socket",
    stat: "≈ 10–15 km",
    statLabel: "of range per hour",
    body: "Slow but useful for top-ups or visits. Only use a socket and cable rated for continuous load — we'll check yours.",
  },
  {
    icon: Zap,
    tag: "On the road",
    title: "DC fast charging",
    stat: "Minutes",
    statLabel: "for a large top-up",
    body: "Public fast chargers are still limited in Nigeria. Vertex EV Hub is building a network; until then, plan long trips with us.",
  },
];

export default function ChargingPage() {
  const wa = whatsappHref("Hi Vertex, I'd like a quote for home charging.");
  return (
    <PageTransition>
      <PageHero
        image={pageImages.homeCharger}
        objectPosition="40% 50%"
        eyebrow="Charging"
        title="Your driveway is the fuel station."
        description="Most EV charging happens at home, overnight. We set you up to do it reliably — even when the grid doesn't."
      />

      {/* Ways to charge */}
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal>
            <p className="font-mono text-xs tracking-[0.3em] text-accent-text uppercase">Three ways to charge</p>
          </Reveal>
          <MaskText text="Fill up without the filling station." className="mt-4 max-w-3xl font-display text-4xl font-semibold tracking-tight sm:text-5xl" />
          <Stagger className="mt-12 grid gap-5 lg:grid-cols-3" stagger={0.12}>
            {methods.map((m) => (
              <StaggerItem key={m.title}>
                <SpotlightCard className="h-full rounded-(--vx-radius-lg)">
                  <div className="flex h-full flex-col rounded-(--vx-radius-lg) border border-line bg-surface p-7">
                    <div className="flex items-center justify-between">
                      <span className="flex size-11 items-center justify-center rounded-full border border-line-strong">
                        <m.icon className="size-5 text-accent-text" aria-hidden />
                      </span>
                      <span className="rounded-full border border-line px-3 py-1 font-mono text-[11px] tracking-wider text-muted uppercase">{m.tag}</span>
                    </div>
                    <p className="mt-8 font-display text-2xl font-medium">{m.title}</p>
                    <p className="mt-4 font-display text-3xl font-semibold text-accent-text">{m.stat}</p>
                    <p className="text-sm text-muted">{m.statLabel}</p>
                    <p className="mt-5 text-sm text-muted">{m.body}</p>
                  </div>
                </SpotlightCard>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal delay={0.1}>
            <p className="mt-6 text-sm text-muted">
              Charging speeds are approximate and depend on the car, the charger and your supply.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Solar */}
      <section className="py-12">
        <Container>
          <div className="grid overflow-hidden rounded-(--vx-radius-lg) border border-line bg-surface lg:grid-cols-2">
            <Reveal className="relative min-h-80">
              <Image src={pageImages.solarDusk.lg} alt={pageImages.solarDusk.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-[#0050fd]/10 mix-blend-color" />
              <a
                href={pageImages.solarDusk.credit.url}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute right-3 bottom-3 rounded-full bg-black/40 px-2.5 py-1 text-[10px] text-white/70 backdrop-blur hover:text-white"
              >
                Photo: {pageImages.solarDusk.credit.name} / Unsplash
              </a>
            </Reveal>
            <div className="p-8 sm:p-12">
              <Reveal>
                <CloudSun className="size-8 text-accent-text" aria-hidden />
                <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Charge through outages.</h2>
                <p className="mt-4 text-muted">
                  Pair your charger with solar panels and battery storage from our sister company, ACOB Lighting — a decade of solar
                  installations across Nigeria. Daylight tops up your battery bank; your car charges from it at night.
                </p>
              </Reveal>
              <Stagger className="mt-8 space-y-4" stagger={0.1}>
                {[
                  { icon: Gauge, text: "Sized to your car and how far you drive — we survey before we quote." },
                  { icon: BatteryCharging, text: "Battery backup keeps charging going when the grid is down." },
                  { icon: Zap, text: "One team for the car, the charger and the solar system." },
                ].map((r) => (
                  <StaggerItem key={r.text} className="flex gap-3">
                    <r.icon className="mt-0.5 size-5 shrink-0 text-accent-text" aria-hidden />
                    <p className="text-sm">{r.text}</p>
                  </StaggerItem>
                ))}
              </Stagger>
              <Reveal delay={0.2}>
                <div className="mt-10">
                  <ChargeMeter />
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* Plug types */}
      <section className="py-24">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:items-start">
          <div>
            <Reveal>
              <p className="font-mono text-xs tracking-[0.3em] text-accent-text uppercase">Good to know</p>
            </Reveal>
            <MaskText text="Plug types matter." className="mt-4 font-display text-4xl font-semibold tracking-tight" />
          </div>
          <Reveal delay={0.1}>
            <div className="space-y-4 text-muted">
              <p>
                Cars built for the Chinese market usually use the <strong className="text-fg">GB/T</strong> charging standard, while many
                other markets use <strong className="text-fg">CCS2</strong> or Type 2. A charger only works with the right connector.
              </p>
              <p>
                Before handover, we confirm your car&apos;s charge port and recommend a compatible home charger — and, where needed, the
                right adapter for the chargers you&apos;re likely to use.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* EV Hub + quote */}
      <section className="py-12">
        <Container className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <div className="h-full rounded-(--vx-radius-lg) border border-dashed border-line-strong p-8">
              <p className="font-mono text-xs tracking-[0.3em] text-muted uppercase">Coming soon</p>
              <h2 className="mt-4 font-display text-3xl font-semibold">Vertex EV Hub</h2>
              <p className="mt-4 text-muted">
                Our sister company is building public charging for Nigerian EV drivers. We&apos;ll share locations and launch dates as soon as
                they&apos;re confirmed.
              </p>
              <ButtonLink href="/range-planner" variant="ghost" className="mt-8" transitionTypes={["nav-forward"]}>
                Plan your range <ArrowRight className="size-4" aria-hidden />
              </ButtonLink>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div id="quote" className="scroll-mt-24 rounded-(--vx-radius-lg) border border-line bg-surface p-6 sm:p-8">
              <h2 className="font-display text-2xl font-medium">Get a home charging quote</h2>
              <p className="mt-1 text-sm text-muted">Tell us where you&apos;ll charge and we&apos;ll arrange a survey.</p>
              <LeadForm type="charging" submitLabel="Request a quote" whatsappHref={wa} phone={site.phone} className="mt-6" />
            </div>
          </Reveal>
        </Container>
      </section>
    </PageTransition>
  );
}
