import { ArrowRight, ArrowUpRight, Camera, ClipboardCheck, Headset, MessageSquareText, Sun, Zap } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { CountUp } from "@vertex/ui/motion/count-up";
import { Magnetic } from "@vertex/ui/motion/magnetic";
import { MaskText } from "@vertex/ui/motion/mask-text";
import { Reveal, Stagger, StaggerItem } from "@vertex/ui/motion/reveal";
import { SpotlightCard } from "@vertex/ui/motion/spotlight-card";
import { ButtonLink } from "@vertex/ui/primitives/button";
import { Container } from "@vertex/ui/primitives/container";
import { PageHero } from "@/components/page-hero";
import { PageTransition } from "@/components/page-transition";
import { pageImages } from "@/lib/page-media";
import { site, sister } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Vertex",
  description:
    "Vertex Electric Solutions Limited is an ACOB Group company bringing premium electric vehicles from China and beyond to Nigeria — inspected, delivered and supported here.",
};

const principles = [
  { icon: Camera, title: "Real photos, always", body: "Every listing shows the exact car you'll receive — never stock images. Number plates aside, nothing is hidden." },
  { icon: ClipboardCheck, title: "Inspected before it ships", body: "We check each car before it leaves the seller, so problems are found there, not in Lagos." },
  { icon: MessageSquareText, title: "Straight answers", body: "Ask us anything about a car — history, condition, charging, running costs — and get a clear reply." },
  { icon: Headset, title: "Supported here", body: "A Nigerian team that answers the phone after the sale, not just before it." },
];

// ACOB Lighting Technology Limited's published track record (acoblighting.com).
const acobStats = [
  { value: 2016, label: "ACOB Lighting founded, Abuja", plain: true },
  { value: 100, suffix: "+", label: "Solar projects completed" },
  { value: 7, suffix: "MW+", label: "Solar capacity installed" },
  { value: 100, suffix: "+", label: "Communities served" },
];

export default function AboutPage() {
  return (
    <PageTransition>
      <PageHero
        image={pageImages.abujaGate}
        objectPosition="50% 35%"
        eyebrow="About Vertex"
        title="Bringing the best of electric mobility home."
        description="Vertex Electric Solutions sources premium electric vehicles from China and other markets and delivers them to drivers across Nigeria."
      />

      {/* Who we are */}
      <section className="py-24 sm:py-32">
        <Container className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center">
          <div>
            <Reveal>
              <p className="font-mono text-xs tracking-[0.3em] text-accent-text uppercase">Who we are</p>
            </Reveal>
            <MaskText
              text="An EV company built for Nigerian roads, power and buyers."
              className="mt-4 font-display text-3xl leading-tight font-semibold tracking-tight sm:text-5xl"
            />
            <Reveal delay={0.2}>
              <div className="mt-8 space-y-5 text-lg text-muted">
                <p>
                  Electric cars are changing how the world drives, and many of the best are now built in China. Vertex exists to bring
                  them to Nigeria properly: the right car, checked before it ships, cleared at the port and handed over with support.
                </p>
                <p>
                  We hold cars in stock for buyers who want to see before they buy, and we source to order for buyers who know exactly
                  what they want.
                </p>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-(--vx-radius-lg)">
              <Image
                src={pageImages.abujaTowers.lg}
                alt={pageImages.abujaTowers.alt}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[#0050fd]/10 mix-blend-color" />
            </div>
            {/* Registration badge */}
            <div className="absolute -bottom-6 -left-4 rounded-(--vx-radius-lg) border border-line bg-surface/90 p-5 shadow-2xl backdrop-blur sm:-left-8">
              <p className="font-mono text-[11px] tracking-[0.2em] text-muted uppercase">Registered in Nigeria</p>
              <p className="mt-2 font-display text-lg font-medium">{site.legalName}</p>
              <p className="mt-1 font-mono text-sm text-accent-text">RC {site.rc}</p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Principles */}
      <section className="py-20">
        <Container>
          <Reveal>
            <p className="font-mono text-xs tracking-[0.3em] text-accent-text uppercase">How we work</p>
          </Reveal>
          <MaskText text="Four promises, every car." className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl" />
          <Stagger className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
            {principles.map((p) => (
              <StaggerItem key={p.title}>
                <SpotlightCard className="h-full rounded-(--vx-radius-lg)">
                  <div className="h-full rounded-(--vx-radius-lg) border border-line bg-surface p-6">
                    <span className="flex size-11 items-center justify-center rounded-full border border-line-strong">
                      <p.icon className="size-5 text-accent-text" aria-hidden />
                    </span>
                    <p className="mt-6 font-display text-lg font-medium">{p.title}</p>
                    <p className="mt-2 text-sm text-muted">{p.body}</p>
                  </div>
                </SpotlightCard>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* ACOB Group */}
      <section className="py-24">
        <Container>
          <Reveal>
            <div className="relative overflow-hidden rounded-(--vx-radius-lg) border border-line bg-surface p-8 sm:p-14">
              <div aria-hidden className="absolute -top-40 -left-32 size-[28rem] rounded-full bg-[radial-gradient(circle,var(--vx-glow),transparent_70%)]" />
              <div className="relative grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
                <div>
                  <p className="font-mono text-xs tracking-[0.3em] text-accent-text uppercase">Part of ACOB Group</p>
                  <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">A decade of clean energy behind every car.</h2>
                  <p className="mt-5 text-muted">
                    Vertex is a member of ACOB Group, home to ACOB Lighting Technology Limited — a renewable-energy company that has been
                    powering homes and communities across Nigeria since 2016. That experience is why we can offer solar home charging that
                    keeps your car topped up through outages.
                  </p>
                </div>
                <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-(--vx-radius) border border-line bg-line">
                  {acobStats.map((s) => (
                    <div key={s.label} className="bg-surface p-6">
                      <dt className="text-sm text-muted">{s.label}</dt>
                      <dd className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
                        {s.plain ? s.value : <CountUp to={s.value} suffix={s.suffix} />}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <Stagger className="relative mt-12 grid gap-4 md:grid-cols-2" stagger={0.12}>
                <StaggerItem className="flex gap-4 rounded-(--vx-radius) border border-line bg-bg/60 p-6">
                  <Sun className="size-6 shrink-0 text-accent-text" aria-hidden />
                  <div>
                    <p className="font-display text-lg">ACOB Lighting</p>
                    <p className="mt-1 text-sm text-muted">Solar and backup power — including home charging systems for Vertex customers.</p>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <a
                    href={sister.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex gap-4 rounded-(--vx-radius) border border-dashed border-line-strong p-6 transition-colors hover:border-accent-text"
                  >
                    <Zap className="size-6 shrink-0 text-accent-text" aria-hidden />
                    <div className="flex-1">
                      <p className="flex items-center gap-2 font-display text-lg">
                        Vertex EV Hub
                        <ArrowUpRight className="size-4 text-accent-text transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                      </p>
                      <p className="mt-1 text-sm text-muted">Public and fleet EV charging, and chargers hosted at partner sites.</p>
                    </div>
                  </a>
                </StaggerItem>
              </Stagger>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-24 text-center">
        <Container>
          <MaskText text="Let's find your EV." className="font-display text-4xl font-semibold tracking-tight sm:text-6xl" />
          <Reveal delay={0.2}>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Magnetic>
                <ButtonLink href="/inventory" size="lg" transitionTypes={["nav-forward"]}>
                  Browse inventory <ArrowRight className="size-4" aria-hidden />
                </ButtonLink>
              </Magnetic>
              <ButtonLink href="/range-planner" size="lg" variant="ghost" transitionTypes={["nav-forward"]}>
                Will an EV work for me?
              </ButtonLink>
            </div>
          </Reveal>
        </Container>
      </section>
    </PageTransition>
  );
}
