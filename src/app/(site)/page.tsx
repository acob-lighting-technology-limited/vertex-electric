import { ArrowRight, BatteryCharging, PackageSearch, Ship } from "lucide-react";
import Link from "next/link";
import { BladeDivider } from "@vertex/ui/primitives/blade-divider";
import { ButtonLink } from "@vertex/ui/primitives/button";
import { Container } from "@vertex/ui/primitives/container";
import { Hero } from "@/components/hero";
import { ScrollOrbit } from "@/components/scroll-orbit";
import { SectionHeading } from "@/components/section-heading";
import { VehicleCard } from "@/components/vehicle-card";
import { getFeaturedVehicles } from "@/lib/inventory";

const reasons = [
  {
    title: "Lower running costs",
    body: "Electricity costs far less per kilometre than petrol — and there's no queue at the pump.",
  },
  {
    title: "Far less maintenance",
    body: "No oil changes, spark plugs or gearbox servicing. Fewer moving parts, fewer surprises.",
  },
  {
    title: "Charge on sunshine",
    body: "Pair your EV with a solar home-charging system installed by our sister company, ACOB Lighting.",
  },
];

export default async function HomePage() {
  const featured = await getFeaturedVehicles(3);

  return (
    <>
      <Hero />

      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Inventory"
            title="In stock & arriving"
            action={
              <Link href="/inventory" className="inline-flex items-center gap-1.5 text-sm text-accent-text hover:underline">
                View all <ArrowRight className="size-4" aria-hidden />
              </Link>
            }
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((v) => (
              <VehicleCard key={v.slug} vehicle={v} />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <SectionHeading eyebrow="How to buy" title="Two ways to drive electric" />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <Link
              href="/inventory"
              className="group relative overflow-hidden rounded-(--vx-radius-lg) border border-line bg-surface p-8 transition-colors hover:border-line-strong"
            >
              <PackageSearch className="size-7 text-accent-text" aria-hidden />
              <h3 className="mt-6 font-display text-2xl font-medium">Choose from stock</h3>
              <p className="mt-3 max-w-sm text-muted">
                Cars already in our showroom or on their way. See real photos of the exact car, then request a price.
              </p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm text-accent-text">
                Browse inventory <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </span>
            </Link>
            <Link
              href="/order"
              className="group relative overflow-hidden rounded-(--vx-radius-lg) border border-line bg-surface p-8 transition-colors hover:border-line-strong"
            >
              <Ship className="size-7 text-accent-text" aria-hidden />
              <h3 className="mt-6 font-display text-2xl font-medium">Order on request</h3>
              <p className="mt-3 max-w-sm text-muted">
                Tell us the model, spec and colour you want. We source it from China and beyond, inspect it, and bring it home.
              </p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm text-accent-text">
                Start an order <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </span>
            </Link>
          </div>
        </Container>
      </section>

      <ScrollOrbit
        frameCount={73}
        framePattern="/media/h3/{w}/f-{i}.webp"
        poster="/media/h3/1280/f-001.webp"
        posterAlt="A graphite electric sedan in a dark studio, outlined by a blue rim light"
        eyebrow="Why electric"
        title="Built for how Nigeria drives next"
        points={reasons.map(({ title, body }) => ({ title, body }))}
      />

      <section className="py-20">
        <Container>
          <div className="relative overflow-hidden rounded-(--vx-radius-lg) border border-line bg-surface p-8 sm:p-12">
            <div
              aria-hidden
              className="absolute -top-24 -right-24 size-72 rounded-full bg-[radial-gradient(circle,var(--vx-glow),transparent_70%)]"
            />
            <BatteryCharging className="size-8 text-accent-text" aria-hidden />
            <h2 className="mt-6 max-w-xl font-display text-3xl font-semibold tracking-tight">Charging, sorted</h2>
            <div className="mt-6 grid gap-8 md:grid-cols-2">
              <div>
                <p className="font-medium">At home — available now</p>
                <p className="mt-2 text-muted">
                  Home charger installation, with optional solar and battery backup from ACOB Lighting, so you charge
                  through outages.
                </p>
              </div>
              <div>
                <p className="font-medium">On the road — Vertex EV Hub, coming soon</p>
                <p className="mt-2 text-muted">Our sister company is building a public charging network. Launch details soon.</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container className="text-center">
          <BladeDivider className="mx-auto max-w-md" />
          <h2 className="mx-auto mt-10 max-w-2xl font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            See them in person
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted">
            Our showroom is opening soon. Book a viewing or test drive and we&apos;ll confirm a time with you.
          </p>
          <div className="mt-8 flex justify-center">
            <ButtonLink href="/showroom" size="lg">
              Book a viewing <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
