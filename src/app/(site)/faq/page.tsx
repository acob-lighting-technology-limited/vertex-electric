import { MessageCircle } from "lucide-react";
import type { Metadata } from "next";
import { Reveal } from "@vertex/ui/motion/reveal";
import { ButtonLink } from "@vertex/ui/primitives/button";
import { Container } from "@vertex/ui/primitives/container";
import { FaqAccordion } from "@/components/faq-accordion";
import { PageTransition } from "@/components/page-transition";
import { SectionHeading } from "@/components/section-heading";
import { faqGroups } from "@/lib/faq";
import { whatsappHref } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about buying an imported EV in Nigeria with Vertex: prices, photos, shipping and customs, charging, range, outages and ownership.",
};

export default function FaqPage() {
  const wa = whatsappHref("Hi Vertex, I have a question.");
  // schema.org FAQPage so answers can surface in search.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqGroups.flatMap((g) =>
      g.items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
    ),
  };

  return (
    <PageTransition>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Container className="py-16 sm:py-24">
        <SectionHeading as="h1" eyebrow="FAQ" title="Questions, answered." description="Everything people ask us about buying, importing, charging and owning an EV in Nigeria." />
        <div className="mt-16">
          <FaqAccordion groups={faqGroups} />
        </div>
        <Reveal>
          <div className="mt-20 flex flex-col items-start justify-between gap-6 rounded-(--vx-radius-lg) border border-line bg-surface p-8 sm:flex-row sm:items-center">
            <div>
              <p className="font-display text-2xl font-medium">Still have a question?</p>
              <p className="mt-1 text-muted">Ask us directly — we usually reply fastest on WhatsApp.</p>
            </div>
            {wa && (
              <ButtonLink href={wa} target="_blank" rel="noopener noreferrer" size="lg">
                <MessageCircle className="size-4" aria-hidden /> Ask on WhatsApp
              </ButtonLink>
            )}
          </div>
        </Reveal>
      </Container>
    </PageTransition>
  );
}
