import { ArrowRight } from "lucide-react";
import { getImageProps } from "next/image";
import { Magnetic } from "@vertex/ui/motion/magnetic";
import { ButtonLink } from "@vertex/ui/primitives/button";
import { Container } from "@vertex/ui/primitives/container";
import { HeroEyebrow, HeroHeadline, HeroItem, HeroStage, ScrollCue } from "./hero-motion";
import { HeroVideo, type HeroVideoSources } from "./hero-video";

const alt = "A graphite electric sedan on a blue-lit bridge at night, Lagos skyline behind";

// H1 (desktop) / H2 (mobile) loops, encoded by scripts/media/encode-hero.sh.
const video: HeroVideoSources = {
  desktop: { av1: "/media/hero/h1-1080.av1.mp4", h264: "/media/hero/h1-1080.h264.mp4" },
  mobile: { av1: "/media/hero/h2-720.av1.mp4", h264: "/media/hero/h2-720.h264.mp4" },
};

const journey = ["Sourced", "Inspected", "Shipped", "Cleared", "Delivered"];

export function Hero() {
  const common = { alt, sizes: "100vw", quality: 75 } as const;
  const {
    props: { srcSet: desktop },
  } = getImageProps({ ...common, src: "/media/hero/h1-2400.webp", width: 2400, height: 1350 });
  const {
    props: { srcSet: mobile, ...img },
  } = getImageProps({ ...common, src: "/media/hero/h2-1080.webp", width: 1080, height: 1920, fetchPriority: "high", loading: "eager" });

  return (
    <HeroStage
      media={
        <>
          <picture>
            <source media="(min-width: 768px)" srcSet={desktop} />
            <img {...img} srcSet={mobile} alt={alt} className="size-full object-cover object-[50%_70%] md:object-[70%_50%]" />
          </picture>
          <HeroVideo sources={video} />
          {/* Legibility scrims: top on mobile (text above the car), left on desktop. */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#06080b]/85 via-[#06080b]/20 to-[#06080b]/80 md:bg-gradient-to-r md:from-[#06080b]/90 md:via-[#06080b]/45 md:to-[#06080b]/10" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-bg via-bg/60 to-transparent" />
        </>
      }
    >
      <Container className="py-16 md:py-0">
        <div className="max-w-2xl">
          <HeroEyebrow>Premium EVs · Nigeria</HeroEyebrow>
          <HeroHeadline
            text="Electric, delivered."
            className="mt-6 font-display text-5xl leading-[1.02] font-semibold tracking-tight sm:text-7xl lg:text-8xl"
          />
          <HeroItem order={0}>
            <p className="mt-6 max-w-md text-lg text-white/75">
              Premium electric vehicles sourced from China and beyond — inspected, shipped and supported here in Nigeria.
            </p>
          </HeroItem>
          <HeroItem order={1} className="mt-9 flex flex-wrap items-center gap-3">
            <Magnetic>
              <ButtonLink href="/inventory" size="lg" transitionTypes={["nav-forward"]}>
                Browse inventory <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-1" aria-hidden />
              </ButtonLink>
            </Magnetic>
            <ButtonLink
              href="/order"
              size="lg"
              variant="ghost"
              className="border-white/25 text-white hover:border-white"
              transitionTypes={["nav-forward"]}
            >
              Order on request
            </ButtonLink>
          </HeroItem>
          <HeroItem order={2} className="mt-14 hidden sm:block">
            <ol className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] tracking-[0.2em] text-white/55 uppercase">
              {journey.map((step, i) => (
                <li key={step} className="flex items-center gap-3">
                  {step}
                  {i < journey.length - 1 && <span aria-hidden className="h-px w-6 bg-white/25" />}
                </li>
              ))}
            </ol>
          </HeroItem>
        </div>
      </Container>
      <ScrollCue />
    </HeroStage>
  );
}
