import { ArrowRight, ArrowUpRight, PackageSearch, Ship } from "lucide-react";
import Link from "next/link";
import { Magnetic } from "@vertex/ui/motion/magnetic";
import { Marquee } from "@vertex/ui/motion/marquee";
import { MaskText } from "@vertex/ui/motion/mask-text";
import { Reveal, Stagger, StaggerItem } from "@vertex/ui/motion/reveal";
import { SpotlightCard } from "@vertex/ui/motion/spotlight-card";
import { ButtonLink } from "@vertex/ui/primitives/button";
import { Container } from "@vertex/ui/primitives/container";
import { ChargeMeter } from "@/components/charge-meter";
import { Hero } from "@/components/hero";
import { JourneyTimeline } from "@/components/journey-timeline";
import { LagosStory } from "@/components/lagos-story";
import { PageTransition } from "@/components/page-transition";
import { ScrollOrbit } from "@/components/scroll-orbit";
import { VehicleCard } from "@/components/vehicle-card";
import { getFeaturedVehicles } from "@/lib/inventory";
import { storyFrames } from "@/lib/stories";

const reasons = [
  { title: "Lower running costs", body: "Electricity costs far less per kilometre than petrol — and there's no queue at the pump." },
  { title: "Far less maintenance", body: "No oil changes, spark plugs or gearbox servicing. Fewer moving parts, fewer surprises." },
  { title: "Charge on sunshine", body: "Pair your EV with a solar home-charging system installed by our sister company, ACOB Lighting." },
];

const ways = [
  {
    href: "/inventory",
    icon: PackageSearch,
    n: "01",
    title: "Choose from stock",
    body: "Cars already in our showroom or on their way. Real photos of the exact car — then request a price.",
    cta: "Browse inventory",
  },
  {
    href: "/order",
    icon: Ship,
    n: "02",
    title: "Order on request",
    body: "Tell us the model, spec and colour. We source it from China and beyond, inspect it, and bring it home.",
    cta: "Start an order",
  },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <Reveal>
      <p className="flex items-center gap-3 font-mono text-xs tracking-[0.3em] text-accent-text uppercase">
        <span aria-hidden className="h-0.5 w-8 skew-x-[-35deg] bg-(image:--vx-blade)" />
        {children}
      </p>
    </Reveal>
  );
}

export default async function HomePage() {
  const featured = await getFeaturedVehicles(3);

  return (
    <PageTransition>
      <div>
        <Hero />

        {/* Kinetic strip */}
        <section aria-label="How Vertex works" className="border-y border-line py-6">
          <Marquee speed={36}>
            {["Sourced", "Inspected", "Shipped", "Cleared", "Delivered", "Supported"].map((w, i) => (
              <span key={w} className="flex items-center">
                <span
                  className={
                    i % 2
                      ? "px-8 font-display text-4xl font-semibold tracking-tight text-transparent [-webkit-text-stroke:1px_var(--vx-muted)] sm:text-6xl"
                      : "px-8 font-display text-4xl font-semibold tracking-tight sm:text-6xl"
                  }
                >
                  {w}
                </span>
                <span aria-hidden className="h-1.5 w-8 skew-x-[-35deg] bg-(image:--vx-blade)" />
              </span>
            ))}
          </Marquee>
        </section>

        {/* Inventory */}
        <section className="py-24 sm:py-32">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <Eyebrow>Inventory</Eyebrow>
                <MaskText text="In stock & arriving" className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-6xl" />
              </div>
              <Reveal delay={0.2}>
                <Link href="/inventory" transitionTypes={["nav-forward"]} className="group inline-flex items-center gap-2 text-sm text-accent-text">
                  <span className="link-underline">View all inventory</span>
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
                </Link>
              </Reveal>
            </div>
            <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.12}>
              {featured.map((v) => (
                <StaggerItem key={v.slug}>
                  <VehicleCard vehicle={v} />
                </StaggerItem>
              ))}
            </Stagger>
          </Container>
        </section>

        {/* Two ways */}
        <section className="py-12 sm:py-20">
          <Container>
            <Eyebrow>How to buy</Eyebrow>
            <MaskText text="Two ways to drive electric" className="mt-4 max-w-3xl font-display text-4xl font-semibold tracking-tight sm:text-6xl" />
            <Stagger className="mt-12 grid gap-6 md:grid-cols-2" stagger={0.15}>
              {ways.map((w) => (
                <StaggerItem key={w.href}>
                  <SpotlightCard className="h-full rounded-(--vx-radius-lg)">
                    <Link
                      href={w.href}
                      transitionTypes={["nav-forward"]}
                      className="group relative flex h-full min-h-80 flex-col justify-between overflow-hidden rounded-(--vx-radius-lg) border border-line bg-surface p-8 transition-colors hover:border-line-strong sm:p-10"
                    >
                      <span aria-hidden className="absolute -top-6 right-4 font-display text-[9rem] leading-none font-semibold text-fg/[0.04]">
                        {w.n}
                      </span>
                      <w.icon className="size-8 text-accent-text" aria-hidden />
                      <div className="relative">
                        <h3 className="font-display text-3xl font-medium">{w.title}</h3>
                        <p className="mt-3 max-w-sm text-muted">{w.body}</p>
                        <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium">
                          {w.cta}
                          <span className="flex size-8 items-center justify-center rounded-full border border-line-strong transition-all duration-300 group-hover:rotate-45 group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent">
                            <ArrowUpRight className="size-4" aria-hidden />
                          </span>
                        </span>
                      </div>
                    </Link>
                  </SpotlightCard>
                </StaggerItem>
              ))}
            </Stagger>
          </Container>
        </section>

        <div className="mt-20">
          <ScrollOrbit
            frameCount={73}
            framePattern="/media/h3/{w}/f-{i}.webp"
            poster="/media/h3/1280/f-001.webp"
            posterAlt="A graphite electric sedan in a dark studio, outlined by a blue rim light"
            eyebrow="Why electric"
            title="Built for how Nigeria drives next"
            points={reasons}
          />
        </div>

        <LagosStory frames={storyFrames} />

        {/* Import journey */}
        <section className="py-24 sm:py-32">
          <Container>
            <Eyebrow>The Vertex process</Eyebrow>
            <MaskText text="From the factory floor to your driveway" className="mt-4 max-w-4xl font-display text-4xl font-semibold tracking-tight sm:text-6xl" />
            <JourneyTimeline />
          </Container>
        </section>

        {/* Charging */}
        <section className="py-12">
          <Container>
            <Reveal>
              <SpotlightCard className="rounded-(--vx-radius-lg)" tilt={1.5}>
                <div className="relative overflow-hidden rounded-(--vx-radius-lg) border border-line bg-surface p-8 sm:p-14">
                  <div aria-hidden className="absolute -top-32 -right-32 size-96 rounded-full bg-[radial-gradient(circle,var(--vx-glow),transparent_70%)]" />
                  <div className="relative grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
                    <div>
                      <ChargeMeter />
                      <h2 className="mt-8 font-display text-4xl font-semibold tracking-tight">Charging, sorted.</h2>
                      <p className="mt-4 max-w-md text-muted">Range anxiety ends at your gate. We set you up to charge at home — through outages.</p>
                    </div>
                    <Stagger className="grid gap-4 sm:grid-cols-2" stagger={0.12}>
                      <StaggerItem className="rounded-(--vx-radius) border border-line bg-bg/60 p-6">
                        <p className="font-mono text-xs tracking-[0.2em] text-accent-text uppercase">Available now</p>
                        <p className="mt-3 font-display text-lg">Home charging + solar</p>
                        <p className="mt-2 text-sm text-muted">
                          Charger installation with optional solar and battery backup from ACOB Lighting.
                        </p>
                      </StaggerItem>
                      <StaggerItem className="rounded-(--vx-radius) border border-dashed border-line-strong p-6">
                        <p className="font-mono text-xs tracking-[0.2em] text-muted uppercase">Coming soon</p>
                        <p className="mt-3 font-display text-lg">Vertex EV Hub</p>
                        <p className="mt-2 text-sm text-muted">A public charging network from our sister company. Launch details soon.</p>
                      </StaggerItem>
                    </Stagger>
                  </div>
                </div>
              </SpotlightCard>
            </Reveal>
          </Container>
        </section>

        {/* Closing CTA */}
        <section className="py-28 sm:py-40">
          <Container className="text-center">
            <Reveal>
              <p className="font-mono text-xs tracking-[0.3em] text-accent-text uppercase">Showroom opening soon</p>
            </Reveal>
            <MaskText
              text="See them in person."
              className="mx-auto mt-6 max-w-4xl font-display text-5xl font-semibold tracking-tight sm:text-7xl"
            />
            <Reveal delay={0.2}>
              <p className="mx-auto mt-6 max-w-lg text-lg text-muted">
                Book a viewing or test drive and we&apos;ll confirm a time with you.
              </p>
              <div className="mt-10 flex justify-center">
                <Magnetic>
                  <ButtonLink href="/showroom" size="lg" transitionTypes={["nav-forward"]}>
                    Book a viewing <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-1" aria-hidden />
                  </ButtonLink>
                </Magnetic>
              </div>
            </Reveal>
          </Container>
        </section>
      </div>
    </PageTransition>
  );
}
