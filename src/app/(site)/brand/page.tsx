import type { Metadata } from "next";
import { Logo } from "@vertex/ui/brand/logo";
import { BladeDivider } from "@vertex/ui/primitives/blade-divider";
import { Button } from "@vertex/ui/primitives/button";
import { Container } from "@vertex/ui/primitives/container";

export const metadata: Metadata = {
  title: "Brand system",
  robots: { index: false },
};

const primitives = [
  { name: "blue-400", value: "#0072FE", note: "Blade, bright end" },
  { name: "blue-600", value: "#0050FD", note: "Blade core · primary fill" },
  { name: "blue-900", value: "#00249E", note: "Blade, deep end" },
  { name: "blue-300", value: "#5C9DFF", note: "Accent text on dark" },
  { name: "blue-700", value: "#0046DC", note: "Accent text on light" },
  { name: "ink", value: "#020202", note: "Wordmark" },
  { name: "graphite-950", value: "#06080B", note: "Dark ground" },
  { name: "paper", value: "#F5F7FA", note: "Reversed wordmark" },
];

// Measured with the WCAG 2.2 relative-luminance formula (see src/ui/tokens.css).
const contrast = [
  { pair: "Text on dark ground", ratio: "18.3:1", pass: "AAA" },
  { pair: "Muted text on dark ground", ratio: "8.1:1", pass: "AAA" },
  { pair: "Accent text (blue-300) on dark", ratio: "7.4:1", pass: "AAA" },
  { pair: "White on blue-600 (buttons)", ratio: "5.9:1", pass: "AA" },
  { pair: "blue-600 on dark ground", ratio: "3.4:1", pass: "Large text / icons only" },
  { pair: "Text on light ground", ratio: "18.2:1", pass: "AAA" },
  { pair: "Accent text (blue-700) on light", ratio: "6.7:1", pass: "AA" },
];

const typeScale = [
  { label: "Display", className: "font-display text-5xl font-semibold tracking-tight sm:text-7xl", sample: "Drive electric" },
  { label: "H1", className: "font-display text-4xl font-semibold tracking-tight", sample: "Premium EVs, delivered" },
  { label: "H2", className: "font-display text-2xl font-medium", sample: "Order on request" },
  { label: "Body", className: "text-base text-muted", sample: "Sourced from China and beyond, supported in Nigeria." },
  { label: "Mono / specs", className: "font-mono text-sm tracking-wider", sample: "VX-0001 · 101 kWh · 700 km CLTC" },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-6 py-12">
      <h2 className="font-display text-xl font-medium">{title}</h2>
      {children}
    </section>
  );
}

export default function BrandPage() {
  return (
    <Container className="py-16">
      <p className="font-mono text-xs tracking-[0.3em] text-accent-text uppercase">Phase 0 · Foundations</p>
      <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl">Vertex brand system</h1>
      <p className="mt-4 max-w-2xl text-muted">
        Vector logo traced from the supplied artwork, design tokens sampled from it, and the shared components that
        both Vertex sites will use.
      </p>
      <BladeDivider className="mt-10" />

      <Section title="Logo">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex aspect-[2/1] items-center justify-center rounded-(--vx-radius-lg) bg-white p-8">
            <Logo variant="registration" ink="dark" className="w-full" />
          </div>
          <div className="flex aspect-[2/1] items-center justify-center rounded-(--vx-radius-lg) bg-[#06080b] p-8 ring-1 ring-line">
            <Logo variant="registration" ink="light" className="w-full" />
          </div>
          <div className="flex aspect-[2/1] items-center justify-center rounded-(--vx-radius-lg) bg-surface p-8 ring-1 ring-line">
            <Logo className="w-full" />
          </div>
          <div className="flex aspect-[2/1] items-center justify-center gap-8 rounded-(--vx-radius-lg) bg-surface p-8 ring-1 ring-line">
            <Logo variant="mark" className="size-28" />
            <Logo variant="mark" className="size-12" />
            <Logo variant="mark" className="size-6" />
          </div>
        </div>
        <p className="text-sm text-muted">
          Files: <code className="font-mono">/public/brand/*.svg</code> · React:{" "}
          <code className="font-mono">{"<Logo variant=\"wordmark\" | \"registration\" | \"mark\" />"}</code>
        </p>
      </Section>

      <Section title="Colour primitives">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {primitives.map((c) => (
            <div key={c.name} className="overflow-hidden rounded-(--vx-radius) ring-1 ring-line">
              <div className="h-20" style={{ background: c.value }} />
              <div className="space-y-0.5 bg-surface p-3">
                <p className="font-mono text-sm">{c.name}</p>
                <p className="font-mono text-xs text-muted">{c.value}</p>
                <p className="text-xs text-muted">{c.note}</p>
              </div>
            </div>
          ))}
          <div className="col-span-2 overflow-hidden rounded-(--vx-radius) ring-1 ring-line sm:col-span-4">
            <div className="h-20 bg-(image:--vx-blade)" />
            <p className="bg-surface p-3 font-mono text-sm">--vx-blade · 135° · blue-400 → blue-600 → blue-900</p>
          </div>
        </div>
      </Section>

      <Section title="Contrast">
        <div className="overflow-x-auto rounded-(--vx-radius) ring-1 ring-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-2 text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Pair</th>
                <th className="px-4 py-3 font-medium">Ratio</th>
                <th className="px-4 py-3 font-medium">Use</th>
              </tr>
            </thead>
            <tbody>
              {contrast.map((c) => (
                <tr key={c.pair} className="border-t border-line">
                  <td className="px-4 py-3">{c.pair}</td>
                  <td className="px-4 py-3 font-mono">{c.ratio}</td>
                  <td className="px-4 py-3 text-muted">{c.pass}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Type">
        <div className="space-y-6">
          {typeScale.map((t) => (
            <div key={t.label} className="grid gap-2 border-t border-line pt-4 sm:grid-cols-[140px_1fr]">
              <p className="font-mono text-xs text-muted uppercase">{t.label}</p>
              <p className={t.className}>{t.sample}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Controls">
        <div className="flex flex-wrap items-center gap-4">
          <Button size="lg">Request price</Button>
          <Button variant="ghost" size="lg">
            Book a viewing
          </Button>
          <Button>Order on request</Button>
          <Button disabled>Disabled</Button>
        </div>
        <p className="text-sm text-muted">Hover a button to see the 135° blade sweep (off under reduced motion).</p>
      </Section>
    </Container>
  );
}
