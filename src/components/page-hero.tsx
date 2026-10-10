"use client";

import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef, type ReactNode } from "react";
import { easeBlade } from "@vertex/ui/motion/easing";
import { MaskText } from "@vertex/ui/motion/mask-text";
import { Container } from "@vertex/ui/primitives/container";
import type { PageImage } from "@/lib/page-media";

/**
 * Full-bleed image header for content pages: the image wipes open and settles,
 * then drifts with scroll; the title rises word by word over a legibility scrim.
 */
export function PageHero({
  image,
  eyebrow,
  title,
  description,
  objectPosition = "50% 50%",
  children,
}: {
  image: PageImage;
  eyebrow: string;
  title: string;
  description?: string;
  objectPosition?: string;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative isolate -mt-16 flex min-h-[78svh] items-end overflow-hidden bg-[#06080b] pt-16 text-white">
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ clipPath: "inset(12% 8% 12% 8% round 24px)", scale: 1.15 }}
        animate={{ clipPath: "inset(0% 0% 0% 0% round 0px)", scale: 1 }}
        transition={{ duration: 1.4, ease: easeBlade }}
      >
        <motion.div className="absolute inset-0" style={{ y }}>
          <Image
            src={image.lg}
            alt={image.alt}
            fill
            preload
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition }}
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#06080b] via-[#06080b]/40 to-[#06080b]/15" />
        <div className="absolute inset-0 bg-[#0050fd]/10 mix-blend-color" />
      </motion.div>

      <Container className="relative pb-16 sm:pb-24">
        <motion.div style={{ opacity: fade }}>
          <motion.p
            className="flex items-center gap-3 font-mono text-xs tracking-[0.3em] text-[#5c9dff] uppercase"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: easeBlade, delay: 0.5 }}
          >
            <span aria-hidden className="h-0.5 w-8 skew-x-[-35deg] bg-(image:--vx-blade)" />
            {eyebrow}
          </motion.p>
          <MaskText
            as="h1"
            text={title}
            trigger="mount"
            delay={0.6}
            className="mt-5 max-w-4xl font-display text-4xl leading-[1.04] font-semibold tracking-tight sm:text-6xl lg:text-7xl"
          />
          {description && (
            <motion.p
              className="mt-6 max-w-xl text-lg text-white/75"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: easeBlade, delay: 1 }}
            >
              {description}
            </motion.p>
          )}
          {children && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: easeBlade, delay: 1.15 }}
            >
              {children}
            </motion.div>
          )}
        </motion.div>
      </Container>

    </section>
  );
}
