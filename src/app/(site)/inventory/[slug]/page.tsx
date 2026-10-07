import { ChevronLeft, MessageCircle } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@vertex/ui/primitives/container";
import { AvailabilityBadge } from "@/components/availability-badge";
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
    <Container className="py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Link href="/inventory" className="inline-flex items-center gap-1 text-sm text-muted hover:text-fg">
        <ChevronLeft className="size-4" aria-hidden /> All inventory
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div>
          <VehicleGallery photos={v.photos} title={title} />
          {v.photoNote && <p className="mt-3 text-sm text-muted">{v.photoNote}</p>}
        </div>

        <div className="space-y-8">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <AvailabilityBadge availability={v.availability} className="bg-surface-2 text-fg" />
              <span className="font-mono text-xs tracking-wider text-muted">{v.stockNumber}</span>
            </div>
            <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
            {!v.model.confirmed && (
              <p className="mt-2 text-sm text-muted">Full model details and specification available on request.</p>
            )}
            {v.model.tagline && <p className="mt-2 text-muted">{v.model.tagline}</p>}
          </div>

          <div className="rounded-(--vx-radius-lg) border border-line bg-surface p-6">
            <h2 className="font-display text-lg font-medium">Request the price</h2>
            <p className="mt-1 text-sm text-muted">We&apos;ll send the full price and availability for {v.stockNumber}.</p>
            {wa && (
              <a
                href={wa}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-(--vx-radius) border border-line-strong px-5 py-3 text-sm font-medium hover:border-accent-text"
              >
                <MessageCircle className="size-4" aria-hidden /> Ask on WhatsApp
              </a>
            )}
            <LeadForm
              type="price"
              stockNumber={v.stockNumber}
              vehicleLabel={title}
              submitLabel="Request price"
              whatsappHref={wa}
              phone={site.phone}
              className="mt-6"
            />
          </div>
        </div>
      </div>

      <div className="mt-14 grid gap-10 lg:grid-cols-2">
        {rows.length > 0 && (
          <section>
            <h2 className="font-display text-xl font-medium">Details</h2>
            <dl className="mt-4 divide-y divide-line border-y border-line">
              {rows.map(([k, val]) => (
                <div key={k} className="grid grid-cols-2 gap-4 py-3 text-sm">
                  <dt className="text-muted">{k}</dt>
                  <dd>{val}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}
        <section className="space-y-8">
          {v.highlights.length > 0 && (
            <div>
              <h2 className="font-display text-xl font-medium">Highlights</h2>
              <ul className="mt-4 space-y-2">
                {v.highlights.map((h) => (
                  <li key={h} className="flex gap-3">
                    <span className="mt-2 h-1 w-3 shrink-0 skew-x-[-35deg] bg-accent" aria-hidden />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {v.conditionNotes && (
            <div>
              <h2 className="font-display text-xl font-medium">Condition</h2>
              <p className="mt-3 text-muted">{v.conditionNotes}</p>
            </div>
          )}
          {v.model.summary && (
            <div>
              <h2 className="font-display text-xl font-medium">About the model</h2>
              <p className="mt-3 text-muted">{v.model.summary}</p>
            </div>
          )}
        </section>
      </div>
    </Container>
  );
}
