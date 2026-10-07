import { Clock, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import { Reveal, Stagger, StaggerItem } from "@vertex/ui/motion/reveal";
import { Container } from "@vertex/ui/primitives/container";
import { LeadForm } from "@/components/lead-form";
import { PageTransition } from "@/components/page-transition";
import { SectionHeading } from "@/components/section-heading";
import { formatPhone, site, whatsappHref } from "@/lib/site";

export const metadata: Metadata = {
  title: "Showroom",
  description: "Visit the Vertex showroom to see our electric vehicles in person. Book a viewing or test drive.",
};

function InfoRow({ icon: Icon, title, children }: { icon: typeof MapPin; title: string; children: React.ReactNode }) {
  return (
    <StaggerItem className="flex gap-5 rounded-(--vx-radius-lg) border border-line bg-surface/50 p-5">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-line-strong">
        <Icon className="size-5 text-accent-text" aria-hidden />
      </span>
      <div>
        <p className="font-display text-lg font-medium">{title}</p>
        <div className="mt-1 text-muted">{children}</div>
      </div>
    </StaggerItem>
  );
}

export default function ShowroomPage() {
  const showroom = site.showroom;
  const wa = whatsappHref("Hi Vertex, I'd like to book a viewing.");
  return (
    <PageTransition>
      <Container className="py-16 sm:py-24">
        <SectionHeading
          as="h1"
          eyebrow="Showroom"
          title={showroom ? "Visit our showroom" : "Our showroom is opening soon"}
          description="See the cars in person, sit inside, and take a test drive with a Vertex advisor."
        />

        <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <Stagger className="space-y-4" stagger={0.12}>
            <InfoRow icon={MapPin} title="Address">
              {showroom ? (
                <p className="whitespace-pre-line">{showroom.address}</p>
              ) : (
                <p>To be announced. Book below and we&apos;ll confirm the location with you.</p>
              )}
            </InfoRow>
            {(site.phone || site.email || wa) && (
              <InfoRow icon={Phone} title="Contact">
                <ul className="space-y-1">
                  {site.phone && (
                    <li>
                      <a href={`tel:${site.phone}`} className="link-underline hover:text-fg">
                        {formatPhone(site.phone)}
                      </a>
                    </li>
                  )}
                  {wa && (
                    <li>
                      <a href={wa} target="_blank" rel="noopener noreferrer" className="link-underline hover:text-fg">
                        WhatsApp
                      </a>
                    </li>
                  )}
                  {site.email && (
                    <li>
                      <a href={`mailto:${site.email}`} className="link-underline hover:text-fg">
                        {site.email}
                      </a>
                    </li>
                  )}
                </ul>
              </InfoRow>
            )}
            <InfoRow icon={Clock} title="Hours">
              {showroom?.hours.length ? (
                <ul>
                  {showroom.hours.map((h) => (
                    <li key={h.days}>
                      {h.days}: {h.time}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>By appointment while we prepare to open.</p>
              )}
            </InfoRow>
          </Stagger>

          <Reveal delay={0.35}>
            <div id="book" className="scroll-mt-24 rounded-(--vx-radius-lg) border border-line bg-surface p-6 sm:p-8 lg:sticky lg:top-24">
              <h2 className="font-display text-2xl font-medium">Book a viewing or test drive</h2>
              <p className="mt-1 text-sm text-muted">Pick a day that suits you and we&apos;ll confirm the time.</p>
              <LeadForm type="viewing" submitLabel="Book viewing" whatsappHref={wa} phone={site.phone} className="mt-6" />
            </div>
          </Reveal>
        </div>
      </Container>
    </PageTransition>
  );
}
