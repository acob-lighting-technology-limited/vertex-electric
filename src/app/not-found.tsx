import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Logo } from "@vertex/ui/brand/logo";
import { MaskText } from "@vertex/ui/motion/mask-text";
import { Reveal } from "@vertex/ui/motion/reveal";
import { pageImages } from "@/lib/page-media";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

const links = [
  { href: "/", label: "Home" },
  { href: "/inventory", label: "Inventory" },
  { href: "/order", label: "Order on request" },
  { href: "/faq", label: "FAQ" },
];

export default function NotFound() {
  const img = pageImages.abujaSunset;
  return (
    <main className="relative isolate flex min-h-dvh flex-col overflow-hidden bg-[#06080b] text-white">
      <Image src={img.lg} alt="" fill sizes="100vw" className="-z-10 object-cover opacity-60" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-[#06080b] via-[#06080b]/40 to-[#06080b]/70" />

      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-10">
        <Link href="/" aria-label="Vertex home">
          <Logo ink="light" className="h-7 w-auto" />
        </Link>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 pb-24 sm:px-6 lg:px-10">
        <Reveal y={20}>
          <p className="font-mono text-xs tracking-[0.35em] text-[#5c9dff] uppercase">Error 404</p>
        </Reveal>
        <MaskText as="h1" trigger="mount" delay={0.15} text="Looks like a wrong turn." className="mt-5 max-w-3xl font-display text-5xl leading-[1.02] font-semibold tracking-tight sm:text-7xl" />
        <Reveal delay={0.4}>
          <p className="mt-6 max-w-md text-lg text-white/75">The page you&apos;re after has moved or never existed. Let&apos;s get you back on the road.</p>
          <ul className="mt-10 flex flex-wrap gap-3">
            {links.map((l, i) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={
                    i === 0
                      ? "inline-flex h-12 items-center rounded-(--vx-radius) bg-[#0050fd] px-6 font-medium text-white transition hover:bg-[#0072fe]"
                      : "inline-flex h-12 items-center rounded-(--vx-radius) border border-white/25 px-6 text-white transition hover:border-white"
                  }
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <a
        href={img.credit.url}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute right-4 bottom-4 text-[10px] text-white/50 hover:text-white"
      >
        Photo: {img.credit.name} / Unsplash
      </a>
    </main>
  );
}
