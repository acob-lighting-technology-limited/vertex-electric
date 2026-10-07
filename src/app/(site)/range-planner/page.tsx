import type { Metadata } from "next";
import { Container } from "@vertex/ui/primitives/container";
import { PageTransition } from "@/components/page-transition";
import { RangePlanner } from "@/components/range-planner";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Will an EV work for me?",
  description:
    "Plan your EV in Nigeria: see your real-world range, how often you'd charge, and what you'd save on fuel compared with petrol — using today's pump price and NERC tariff.",
};

export default function RangePlannerPage() {
  return (
    <PageTransition>
      <Container className="py-16 sm:py-24">
        <SectionHeading
          as="h1"
          eyebrow="Range planner"
          title="Will an EV work for me?"
          description="Tell us how you drive. We'll show your range, how often you'd charge, and what you'd spend on energy versus petrol."
        />
        <div className="mt-14">
          <RangePlanner />
        </div>
      </Container>
    </PageTransition>
  );
}
