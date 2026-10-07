import { Container } from "@vertex/ui/primitives/container";

export default function Loading() {
  return (
    <Container className="py-10 sm:py-14" aria-busy="true" aria-label="Loading vehicle">
      <div className="h-4 w-28 animate-pulse rounded bg-surface-2" />
      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="aspect-[4/3] animate-pulse rounded-(--vx-radius-lg) bg-surface-2" />
        <div className="space-y-4">
          <div className="h-6 w-32 animate-pulse rounded-full bg-surface-2" />
          <div className="h-10 w-3/4 animate-pulse rounded bg-surface-2" />
          <div className="h-80 animate-pulse rounded-(--vx-radius-lg) bg-surface-2" />
        </div>
      </div>
    </Container>
  );
}
