"use client";

import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { AnimatePresence, motion, type PanInfo } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, ViewTransition } from "react";
import { cn } from "@vertex/ui/lib/cn";
import { easeBlade } from "@vertex/ui/motion/easing";
import { getLenis } from "@vertex/ui/motion/motion-provider";
import type { VehiclePhoto } from "@/lib/inventory";

const sectionLabel = { exterior: "Exterior", interior: "Interior", tech: "Tech", detail: "Details" } as const;

const slide = {
  enter: (dir: number) => ({ x: dir > 0 ? "12%" : "-12%", opacity: 0, scale: 1.02, filter: "blur(6px)" }),
  center: { x: "0%", opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: (dir: number) => ({ x: dir > 0 ? "-12%" : "12%", opacity: 0, scale: 0.98, filter: "blur(6px)" }),
};

export function VehicleGallery({ photos, title, slug }: { photos: VehiclePhoto[]; title: string; slug: string }) {
  const [[index, dir], setState] = useState<[number, number]>([0, 0]);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const thumbsRef = useRef<HTMLUListElement>(null);
  const current = photos[index];

  const go = useCallback(
    (d: number) => setState(([i]) => [(i + d + photos.length) % photos.length, d]),
    [photos.length],
  );
  const jump = (i: number) => setState(([prev]) => [i, i > prev ? 1 : -1]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60 || info.velocity.x < -400) go(1);
    else if (info.offset.x > 60 || info.velocity.x > 400) go(-1);
  };

  // Keyboard arrows while the viewer is open; keep the active thumbnail in view.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!dialogRef.current?.open) return;
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);
  useEffect(() => {
    thumbsRef.current?.children[index]?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [index]);

  const open = () => {
    getLenis()?.stop();
    dialogRef.current?.showModal();
  };

  if (!current) return null;

  return (
    <div className="space-y-3">
      <ViewTransition name={`vehicle-${slug}`} share="morph" default="none">
        <div className="relative aspect-[4/3] touch-pan-y overflow-hidden rounded-(--vx-radius-lg) bg-surface-2 select-none">
          <AnimatePresence initial={false} custom={dir} mode="popLayout">
            <motion.div
              key={current.src}
              custom={dir}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.55, ease: easeBlade }}
              drag={photos.length > 1 ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={onDragEnd}
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
            >
              <Image
                src={current.src}
                alt={current.alt}
                fill
                draggable={false}
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="pointer-events-none object-contain"
                preload={index === 0}
              />
            </motion.div>
          </AnimatePresence>

          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-3">
            <AnimatePresence mode="wait">
              <motion.span
                key={index}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.25 }}
                className="rounded-full bg-black/60 px-3 py-1 font-mono text-xs text-white backdrop-blur"
              >
                {sectionLabel[current.section]} · {String(index + 1).padStart(2, "0")}/{String(photos.length).padStart(2, "0")}
              </motion.span>
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={open}
            className="absolute right-3 bottom-3 inline-flex items-center gap-2 rounded-full bg-black/60 px-3 py-2 text-xs text-white backdrop-blur transition-colors hover:bg-black/80"
          >
            <Expand className="size-3.5" aria-hidden /> Full screen
          </button>
          {photos.length > 1 && (
            <>
              <button type="button" aria-label="Previous photo" onClick={() => go(-1)} className="absolute top-1/2 left-3 hidden -translate-y-1/2 rounded-full bg-black/50 p-2.5 text-white backdrop-blur transition hover:scale-110 hover:bg-black/80 sm:block">
                <ChevronLeft className="size-5" aria-hidden />
              </button>
              <button type="button" aria-label="Next photo" onClick={() => go(1)} className="absolute top-1/2 right-3 hidden -translate-y-1/2 rounded-full bg-black/50 p-2.5 text-white backdrop-blur transition hover:scale-110 hover:bg-black/80 sm:block">
                <ChevronRight className="size-5" aria-hidden />
              </button>
            </>
          )}
          {/* Progress bar across the bottom edge */}
          <motion.div
            aria-hidden
            className="absolute bottom-0 left-0 h-0.5 bg-(image:--vx-blade)"
            animate={{ width: `${((index + 1) / photos.length) * 100}%` }}
            transition={{ duration: 0.5, ease: easeBlade }}
          />
        </div>
      </ViewTransition>

      <ul ref={thumbsRef} className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]" aria-label={`${title} photos`} data-lenis-prevent>
        {photos.map((p, i) => (
          <li key={p.src} className="shrink-0">
            <button
              type="button"
              onClick={() => jump(i)}
              aria-label={`Show photo ${i + 1}: ${p.alt}`}
              aria-current={i === index}
              className={cn("relative block h-16 w-24 overflow-hidden rounded-(--vx-radius-sm) transition-opacity", i === index ? "opacity-100" : "opacity-55 hover:opacity-100")}
            >
              <Image src={p.src} alt="" fill sizes="96px" className="object-cover" />
              {i === index && (
                <motion.span
                  layoutId={`thumb-ring-${slug}`}
                  className="absolute inset-0 rounded-(--vx-radius-sm) ring-2 ring-accent ring-inset"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label={`${title} — photo viewer`}
        className="vx-dialog m-0 h-dvh max-h-none w-screen max-w-none bg-black/95 p-0 text-white backdrop:bg-black/80"
        onClose={() => getLenis()?.start()}
        onClick={(e) => e.target === e.currentTarget && dialogRef.current?.close()}
      >
        <div className="relative flex h-full w-full items-center justify-center p-4 sm:p-14">
          <div className="relative h-full w-full overflow-hidden">
            <AnimatePresence initial={false} custom={dir} mode="popLayout">
              <motion.div
                key={`full-${current.src}`}
                custom={dir}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: easeBlade }}
                drag={photos.length > 1 ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={onDragEnd}
                className="absolute inset-0"
              >
                <Image src={current.src} alt={current.alt} fill draggable={false} sizes="100vw" className="pointer-events-none object-contain" />
              </motion.div>
            </AnimatePresence>
          </div>
          <button type="button" autoFocus aria-label="Close" onClick={() => dialogRef.current?.close()} className="absolute top-4 right-4 rounded-full bg-white/10 p-2.5 transition hover:rotate-90 hover:bg-white/20">
            <X className="size-5" aria-hidden />
          </button>
          <button type="button" aria-label="Previous photo" onClick={() => go(-1)} className="absolute left-4 rounded-full bg-white/10 p-3 transition hover:bg-white/20">
            <ChevronLeft className="size-6" aria-hidden />
          </button>
          <button type="button" aria-label="Next photo" onClick={() => go(1)} className="absolute right-4 rounded-full bg-white/10 p-3 transition hover:bg-white/20">
            <ChevronRight className="size-6" aria-hidden />
          </button>
          <p className="absolute bottom-4 left-1/2 w-max max-w-[90vw] -translate-x-1/2 text-center text-sm text-white/80">
            {current.alt} · {index + 1}/{photos.length}
          </p>
        </div>
      </dialog>
    </div>
  );
}
