import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@vertex/ui/motion/reveal";
import { Container } from "@vertex/ui/primitives/container";
import { PageTransition } from "@/components/page-transition";
import { SectionHeading } from "@/components/section-heading";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How Vertex Electric Solutions Limited collects, uses and protects your personal data under the Nigeria Data Protection Act 2023.",
};

// Drafted against the Nigeria Data Protection Act 2023 (NDPA). Have counsel review before launch.
const LAST_UPDATED = "7 October 2026";

const sections: { id: string; title: string; body: React.ReactNode }[] = [
  {
    id: "who",
    title: "Who we are",
    body: (
      <p>
        This website is operated by {site.legalName} (RC {site.rc}), a company registered in Nigeria and a member of ACOB Group
        (&ldquo;Vertex&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;). We are the data controller for personal data collected through this site.
      </p>
    ),
  },
  {
    id: "collect",
    title: "What we collect",
    body: (
      <>
        <p>When you send a request through our forms (price request, viewing, order on request or charging quote), we collect:</p>
        <ul>
          <li>your name, phone or WhatsApp number, and email address if you give one;</li>
          <li>your city and preferred contact method;</li>
          <li>the vehicle you asked about, and any details you add — such as models of interest, budget range, timeline or a preferred viewing day.</li>
        </ul>
        <p>
          If you message us on WhatsApp or call us, we receive the information you share there. Our hosting provider automatically
          records basic technical data (such as IP address, browser type and pages requested) to keep the site running securely.
        </p>
        <p>
          We do not use advertising or tracking cookies. The site stores two small preferences in your own browser: your light/dark
          theme choice, and whether you have already seen the opening animation in this session.
        </p>
      </>
    ),
  },
  {
    id: "use",
    title: "How we use it",
    body: (
      <ul>
        <li>to respond to your request — for example, to send you a price, arrange a viewing, or prepare a quote;</li>
        <li>to take the steps you ask for before buying a vehicle or charging system, and to complete a sale if you go ahead;</li>
        <li>to keep the website secure and working properly.</li>
      </ul>
    ),
  },
  {
    id: "basis",
    title: "Our lawful basis",
    body: (
      <p>
        We process your data because you asked us to (your consent, which you can withdraw at any time), because it is needed to take
        steps at your request before entering into a contract with you, and for our legitimate interest in running a secure website.
        We only process what we need for these purposes.
      </p>
    ),
  },
  {
    id: "share",
    title: "Who we share it with",
    body: (
      <>
        <p>We do not sell your personal data. We share it only where needed to answer your request:</p>
        <ul>
          <li>service providers who host this website and deliver our email, under contracts that require them to protect it;</li>
          <li>Meta (WhatsApp), only if you choose to contact us on WhatsApp;</li>
          <li>our sister company ACOB Lighting, only for solar or home-charging requests, so they can survey and quote;</li>
          <li>authorities, where the law requires it.</li>
        </ul>
      </>
    ),
  },
  {
    id: "transfers",
    title: "Transfers outside Nigeria",
    body: (
      <p>
        Some of our service providers process data on servers outside Nigeria. Where that happens, we rely on the safeguards permitted
        under the Nigeria Data Protection Act 2023 to make sure your data stays protected.
      </p>
    ),
  },
  {
    id: "retention",
    title: "How long we keep it",
    body: (
      <p>
        We keep enquiry details for as long as we need them to deal with your request and any follow-up, and no longer than 24 months
        after our last contact unless you become a customer. Customer records are kept for as long as the law requires (for example, for
        tax and accounting purposes).
      </p>
    ),
  },
  {
    id: "rights",
    title: "Your rights",
    body: (
      <>
        <p>Under the Nigeria Data Protection Act 2023, you have the right to:</p>
        <ul>
          <li>be told how your data is used, and get a copy of it;</li>
          <li>have inaccurate data corrected;</li>
          <li>have your data deleted, or its use restricted;</li>
          <li>object to processing, and withdraw your consent at any time;</li>
          <li>receive your data in a portable format.</li>
        </ul>
        <p>
          To use any of these rights, contact us using the details below. If you are not satisfied with our response, you can complain to
          the Nigeria Data Protection Commission (NDPC).
        </p>
      </>
    ),
  },
  {
    id: "security",
    title: "Security",
    body: (
      <p>
        We use encrypted connections (HTTPS) across the site, limit who can access enquiry data, and work only with providers that meet
        recognised security standards. No system is perfectly secure, but we take reasonable steps to protect your data.
      </p>
    ),
  },
  {
    id: "children",
    title: "Children",
    body: <p>This website is not intended for children under 18, and we do not knowingly collect their data.</p>,
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: <p>We may update this policy. The date at the top shows when it last changed.</p>,
  },
  {
    id: "contact",
    title: "Contact us",
    body: (
      <p>
        For any privacy question or request, contact {site.legalName}
        {site.email && (
          <>
            {" "}
            at{" "}
            <a href={`mailto:${site.email}`} className="text-accent-text underline underline-offset-2">
              {site.email}
            </a>
          </>
        )}
        . You can also reach us through our{" "}
        <Link href="/showroom" className="text-accent-text underline underline-offset-2">
          contact details
        </Link>
        .
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <PageTransition>
      <Container className="py-16 sm:py-24">
        <SectionHeading as="h1" eyebrow="Legal" title="Privacy policy" description={`Last updated ${LAST_UPDATED}`} />
        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-[15rem_minmax(0,1fr)]">
          <nav aria-label="On this page" className="hidden lg:block">
            <ol className="sticky top-24 space-y-2 text-sm">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="flex gap-3 text-muted transition-colors hover:text-fg">
                    <span className="font-mono text-xs">{String(i + 1).padStart(2, "0")}</span>
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="max-w-2xl space-y-12">
            {sections.map((s, i) => (
              <Reveal key={s.id} amount={0.15}>
                <section id={s.id} className="scroll-mt-24">
                  <h2 className="flex items-baseline gap-3 font-display text-2xl font-medium">
                    <span className="font-mono text-sm text-accent-text">{String(i + 1).padStart(2, "0")}</span>
                    {s.title}
                  </h2>
                  <div className="mt-4 space-y-4 text-muted [&_li]:pl-1 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">{s.body}</div>
                </section>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </PageTransition>
  );
}
