import { ArrowRight } from "lucide-react";
import { getImageProps } from "next/image";
import { ButtonLink } from "@vertex/ui/primitives/button";
import { Container } from "@vertex/ui/primitives/container";
import { HeroVideo, type HeroVideoSources } from "./hero-video";

const alt = "A graphite electric sedan on a blue-lit bridge at night, Lagos skyline behind";

/** Final Higgsfield loops go here once rendered (H1 desktop / H2 mobile). */
const video: HeroVideoSources | null = null;

export function Hero() {
  const common = { alt, sizes: "100vw", quality: 75 } as const;
  const {
    props: { srcSet: desktop },
  } = getImageProps({ ...common, src: "/media/hero/h1-2400.webp", width: 2400, height: 1357 });
  const {
    props: { srcSet: mobile, ...img },
  } = getImageProps({ ...common, src: "/media/hero/h2-1080.webp", width: 1080, height: 1910, fetchPriority: "high", loading: "eager" });

  return (
    <section className="relative isolate -mt-16 flex min-h-svh items-start overflow-hidden bg-[#06080b] pt-16 text-white md:items-center">
      <div className="absolute inset-0 -z-10">
        <picture>
          <source media="(min-width: 768px)" srcSet={desktop} />
          <img {...img} srcSet={mobile} alt={alt} className="size-full object-cover object-[50%_70%] md:object-[70%_50%]" />
        </picture>
        {video && <HeroVideo sources={video} />}
        {/* Legibility scrims: top on mobile (text sits above the car), left on desktop. */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#06080b]/85 via-[#06080b]/20 to-[#06080b]/70 md:bg-gradient-to-r md:from-[#06080b]/90 md:via-[#06080b]/40 md:to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />
      </div>

      <Container className="py-16 md:py-0">
        <div className="max-w-xl">
          <p className="font-mono text-xs tracking-[0.3em] text-[#5c9dff] uppercase">Premium EVs · Nigeria</p>
          <h1 className="mt-5 font-display text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-6xl">
            Electric, delivered.
          </h1>
          <p className="mt-5 max-w-md text-lg text-white/75">
            Premium electric vehicles sourced from China and beyond — inspected, shipped and supported here in Nigeria.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/inventory" size="lg">
              Browse inventory <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
            <ButtonLink href="/order" size="lg" variant="ghost" className="border-white/30 text-white hover:border-white">
              Order on request
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
