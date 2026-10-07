import { ArrowRight } from "lucide-react";
import { Logo } from "@vertex/ui/brand/logo";
import { BladeDivider } from "@vertex/ui/primitives/blade-divider";
import { ButtonLink } from "@vertex/ui/primitives/button";
import { Container } from "@vertex/ui/primitives/container";

// Phase 0 holding page. The cinematic hero (Higgsfield H1/H2) replaces this in Phase 1.
export default function HomePage() {
  return (
    <section className="relative isolate overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_70%_20%,var(--vx-glow),transparent_70%)]"
      />
      <Container className="flex min-h-[calc(100dvh-4rem)] flex-col justify-center gap-10 py-24">
        <p className="font-mono text-xs tracking-[0.3em] text-accent-text uppercase">Premium EVs · Nigeria</p>
        <Logo className="w-full max-w-3xl" />
        <BladeDivider className="max-w-3xl" />
        <p className="max-w-xl text-lg text-muted">
          Electric vehicles sourced from China and beyond, delivered and supported in Nigeria. Our new home is on its
          way.
        </p>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/brand" size="lg">
            View the brand system <ArrowRight className="size-4" aria-hidden />
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
