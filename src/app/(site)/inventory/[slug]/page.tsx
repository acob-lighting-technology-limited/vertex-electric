import { ChevronLeft, MessageCircle } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@vertex/ui/primitives/container";
import { Reveal, Stagger, StaggerItem } from "@vertex/ui/motion/reveal";
import { AvailabilityBadge } from "@/components/availability-badge";
import { MobilePriceBar } from "@/components/mobile-price-bar";
import { PageTransition } from "@/components/page-transition";
import { LeadForm } from "@/components/lead-form";
import { VehicleGallery } from "@/components/vehicle-gallery";
import {
  bodyTypeLabel,
  getVehicle,
  getVehicles,
  powertrainLabel,
  type PublicVehicle,
  vehicleTitle,
} from "@/lib/inventory";
import { site, whatsappHref } from "@/lib/site";

export async function generateStaticParams() {
  return (await getVehicles()).map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: PageProps<"/inventory/[slug]">): Promise<Metadata> {
  const v = await getVehicle((await params).slug);
  if (!v) return {};
  const title = `${vehicleTitle(v)} · ${v.stockNumber}`;
  return {
    title,
    description: `${vehicleTitle(v)} (${v.stockNumber}) — real photos of this exact car. Request the price from Vertex.`,
    openGraph: { title, images: v.photos[0] ? [{ url: v.photos[0].src, width: v.photos[0].width, height: v.photos[0].height }] : [] },
  };
}

function specRows(v: PublicVehicle): [string, string][] {
  const s = v.model.specs;
  const rows: [string, string | undefined][] = [
    ["Body", bodyTypeLabel[v.model.bodyType]],
    ["Powertrain", v.model.powertrain && powertrainLabel[v.model.powertrain]],
    ["Year", v.year?.toString()],
    ["Trim", v.trim],
    ["Exterior", v.exteriorColour],
    ["Interior", v.interiorColour],
    ["Mileage", v.mileageKm !== undefined ? `${v.mileageKm.toLocaleString("en-NG")} km` : undefined],
    ["Battery health", v.batteryHealthPct !== undefined ? `${v.batteryHealthPct}% (from battery report)` : undefined],
    ["Battery", s.batteryKwh ? `${s.batteryKwh} kWh` : undefined],
    ["Rated range", s.rangeKm ? `${s.rangeKm} km${s.rangeStandard ? ` (${s.rangeStandard})` : ""}` : undefined],
    ["Power", s.powerKw ? `${s.powerKw} kW` : undefined],
    ["0–100 km/h", s.zeroToHundred ? `${s.zeroToHundred} s` : undefined],
    ["Drive", s.drivetrain],
    ["Seats", s.seats?.toString()],
    ["DC fast charge", s.dcChargeKw ? `${s.dcChargeKw} kW` : undefined],
    ["Charge port", s.chargePort],
  ];
  return rows.filter((r): r is [string, string] => Boolean(r[1]));
}

export default async function VehiclePage({ params }: PageProps<"/inventory/[slug]">) {
  const v = await getVehicle((await params).slug);
  if (!v) notFound();

  const title = vehicleTitle(v);
  const wa = whatsappHref(`Hi Vertex, please send me the price of the ${title} (${v.stockNumber}).`);
  const rows = specRows(v);

  // schema.org Car without an Offer price: prices are given on request only.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: title,
    sku: v.stockNumber,
    bodyType: bodyTypeLabel[v.model.bodyType],
    color: v.exteriorColour,
    vehicleInteriorColor: v.interiorColour,
    mileageFromOdometer: v.mileageKm !== undefined ? { "@type": "QuantitativeValue", value: v.mileageKm, unitCode: "KMT" } : undefined,
    image: v.photos.map((p) => new URL(p.src, site.url).toString()),
    ...(v.model.confirmed ? { brand: { "@type": "Brand", name: v.model.make }, model: v.model.model } : {}),
    seller: { "@type": "AutoDealer", name: site.name },
  };

  return (
    <PageTransition>
      <Container className="py-10 sm:py-14">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
        <Link href="/inventory" transitionTypes={["nav-back"]} className="group inline-flex items-center gap-1 text-sm text-muted hover:text-fg">
          <ChevronLeft className="size-4 transition-transform group-hover:-translate-x-1" aria-hidden /> All inventory
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <div>
            <VehicleGallery photos={v.photos} title={title} slug={v.slug} />
            {v.photoNote && <p className="mt-3 text-sm text-muted">{v.photoNote}</p>}
          </div>

          <div className="space-y-8 lg:sticky lg:top-24 lg:self-start">
            <Stagger stagger={0.1}>
              <StaggerItem className="flex flex-wrap items-center gap-3">
                <AvailabilityBadge availability={v.availability} className="bg-surface-2 text-fg" />
                <span className="font-mono text-xs tracking-wider text-muted">{v.stockNumber}</span>
              </StaggerItem>
              <StaggerItem>
                <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
              </StaggerItem>
              <StaggerItem>
                {!v.model.confirmed && <p className="mt-3 text-sm text-muted">Full model details and specification available on request.</p>}
                {v.model.tagline && <p className="mt-3 text-muted">{v.model.tagline}</p>}
              </StaggerItem>
            </Stagger>

            <Reveal delay={0.25}>
              <div id="request-price" className="scroll-mt-24 rounded-(--vx-radius-lg) border border-line bg-surface p-6">
                <h2 className="font-display text-xl font-medium">Request the price</h2>
                <p className="mt-1 text-sm text-muted">We&apos;ll send the full price and availability for {v.stockNumber}.</p>
                {wa && (
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-(--vx-radius) bg-[#25D366] px-5 py-3 text-sm font-semibold text-[#06281a] transition hover:brightness-110"
                  >
                    <MessageCircle className="size-4" aria-hidden /> Ask on WhatsApp — fastest
                  </a>
                )}
                <div className="my-5 flex items-center gap-3 text-xs text-muted">
                  <span className="h-px flex-1 bg-line" /> or send a request <span className="h-px flex-1 bg-line" />
                </div>
                <LeadForm type="price" stockNumber={v.stockNumber} vehicleLabel={title} submitLabel="Request price" whatsappHref={wa} phone={site.phone} />
              </div>
            </Reveal>
          </div>
        </div>

        <div className="mt-20 grid gap-12 lg:grid-cols-2">
          {rows.length > 0 && (
            <Reveal>
              <h2 className="font-display text-2xl font-medium">Details</h2>
              <Stagger as="div" className="mt-5 border-y border-line" stagger={0.05}>
                {rows.map(([k, val]) => (
                  <StaggerItem key={k} className="grid grid-cols-2 gap-4 border-b border-line py-3.5 text-sm last:border-b-0">
                    <span className="text-muted">{k}</span>
                    <span>{val}</span>
                  </StaggerItem>
                ))}
              </Stagger>
            </Reveal>
          )}
          <div className="space-y-10">
            {v.highlights.length > 0 && (
              <Reveal>
                <h2 className="font-display text-2xl font-medium">Highlights</h2>
                <Stagger as="ul" className="mt-5 space-y-3" stagger={0.08}>
                  {v.highlights.map((h) => (
                    <StaggerItem key={h} as="li" className="flex items-center gap-3">
                      <span className="h-1 w-4 shrink-0 skew-x-[-35deg] bg-(image:--vx-blade)" aria-hidden />
                      {h}
                    </StaggerItem>
                  ))}
                </Stagger>
              </Reveal>
            )}
            {v.conditionNotes && (
              <Reveal>
                <h2 className="font-display text-2xl font-medium">Condition</h2>
                <p className="mt-3 text-muted">{v.conditionNotes}</p>
              </Reveal>
            )}
            {v.model.summary && (
              <Reveal>
                <h2 className="font-display text-2xl font-medium">About the model</h2>
                <p className="mt-3 text-muted">{v.model.summary}</p>
              </Reveal>
            )}
          </div>
        </div>
      </Container>
      <MobilePriceBar stockNumber={v.stockNumber} whatsappHref={wa} />
    </PageTransition>
  );
}
