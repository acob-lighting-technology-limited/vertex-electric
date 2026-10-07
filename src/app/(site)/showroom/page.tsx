import { Clock, MapPin } from "lucide-react";
import type { Metadata } from "next";
import { Container } from "@vertex/ui/primitives/container";
import { LeadForm } from "@/components/lead-form";
import { SectionHeading } from "@/components/section-heading";
import { site, whatsappHref } from "@/lib/site";

export const metadata: Metadata = {
  title: "Showroom",
  description: "Visit the Vertex showroom to see our electric vehicles in person. Book a viewing or test drive.",
};

export default function ShowroomPage() {
  const showroom = site.showroom;
  const wa = whatsappHref("Hi Vertex, I'd like to book a viewing.");
  return (
    <Container className="py-16 sm:py-20">
      <SectionHeading
        as="h1"
        eyebrow="Showroom"
        title={showroom ? "Visit our showroom" : "Our showroom is opening soon"}
        description="See the cars in person, sit inside, and take a test drive with a Vertex advisor."
      />

      <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="space-y-6">
          <div className="flex gap-4">
            <MapPin className="mt-0.5 size-5 shrink-0 text-accent-text" aria-hidden />
            <div>
              <p className="font-medium">Address</p>
              {showroom ? (
                <p className="mt-1 whitespace-pre-line text-muted">{showroom.address}</p>
              ) : (
                <p className="mt-1 text-muted">To be announced. Book below and we&apos;ll confirm the location with you.</p>
              )}
            </div>
          </div>
          <div className="flex gap-4">
            <Clock className="mt-0.5 size-5 shrink-0 text-accent-text" aria-hidden />
            <div>
              <p className="font-medium">Hours</p>
              {showroom?.hours.length ? (
                <ul className="mt-1 text-muted">
                  {showroom.hours.map((h) => (
                    <li key={h.days}>
                      {h.days}: {h.time}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-muted">By appointment while we prepare to open.</p>
              )}
            </div>
          </div>
        </div>

        <div id="book" className="scroll-mt-24 rounded-(--vx-radius-lg) border border-line bg-surface p-6 sm:p-8">
          <h2 className="font-display text-xl font-medium">Book a viewing or test drive</h2>
          <p className="mt-1 text-sm text-muted">Pick a day that suits you and we&apos;ll confirm the time.</p>
          <LeadForm type="viewing" submitLabel="Book viewing" whatsappHref={wa} phone={site.phone} className="mt-6" />
        </div>
      </div>
    </Container>
  );
}
