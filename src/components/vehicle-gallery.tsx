"use client";

import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@vertex/ui/lib/cn";
import type { VehiclePhoto } from "@/lib/inventory";

const sectionLabel = { exterior: "Exterior", interior: "Interior", tech: "Tech", detail: "Details" } as const;

export function VehicleGallery({ photos, title }: { photos: VehiclePhoto[]; title: string }) {
  const [index, setIndex] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const current = photos[index];
  const go = useCallback((d: number) => setIndex((i) => (i + d + photos.length) % photos.length), [photos.length]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onKey = (e: KeyboardEvent) => {
      if (!dialog.open) return;
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  if (!current) return null;

  return (
    <div className="space-y-3">
      <div className="group relative aspect-[4/3] overflow-hidden rounded-(--vx-radius-lg) bg-surface-2">
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt}
          fill
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-contain"
          preload={index === 0}
        />
        <button
          type="button"
          onClick={() => dialogRef.current?.showModal()}
          className="absolute right-3 bottom-3 inline-flex items-center gap-2 rounded-full bg-black/60 px-3 py-2 text-xs text-white backdrop-blur hover:bg-black/80"
        >
          <Expand className="size-3.5" aria-hidden /> View full screen
        </button>
        <span className="absolute top-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white backdrop-blur">
          {sectionLabel[current.section]} · {index + 1}/{photos.length}
        </span>
        {photos.length > 1 && (
          <>
            <button type="button" aria-label="Previous photo" onClick={() => go(-1)} className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur hover:bg-black/80">
              <ChevronLeft className="size-5" aria-hidden />
            </button>
            <button type="button" aria-label="Next photo" onClick={() => go(1)} className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur hover:bg-black/80">
              <ChevronRight className="size-5" aria-hidden />
            </button>
          </>
        )}
      </div>

      <ul className="flex gap-2 overflow-x-auto pb-1" aria-label={`${title} photos`}>
        {photos.map((p, i) => (
          <li key={p.src} className="shrink-0">
            <button
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show photo ${i + 1}: ${p.alt}`}
              aria-current={i === index}
              className={cn(
                "relative block h-16 w-24 overflow-hidden rounded-(--vx-radius-sm) ring-2 ring-transparent transition",
                i === index ? "ring-accent" : "opacity-70 hover:opacity-100",
              )}
            >
              <Image src={p.src} alt="" fill sizes="96px" className="object-cover" />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label={`${title} — photo viewer`}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-black/95 p-0 text-white backdrop:bg-black/80"
        onClick={(e) => e.target === e.currentTarget && dialogRef.current?.close()}
      >
        <div className="relative flex h-full w-full items-center justify-center p-4 sm:p-12">
          <div className="relative h-full w-full">
            <Image key={`full-${current.src}`} src={current.src} alt={current.alt} fill sizes="100vw" className="object-contain" />
          </div>
          <button type="button" autoFocus aria-label="Close" onClick={() => dialogRef.current?.close()} className="absolute top-4 right-4 rounded-full bg-white/10 p-2 hover:bg-white/20">
            <X className="size-5" aria-hidden />
          </button>
          <button type="button" aria-label="Previous photo" onClick={() => go(-1)} className="absolute left-4 rounded-full bg-white/10 p-3 hover:bg-white/20">
            <ChevronLeft className="size-6" aria-hidden />
          </button>
          <button type="button" aria-label="Next photo" onClick={() => go(1)} className="absolute right-4 rounded-full bg-white/10 p-3 hover:bg-white/20">
            <ChevronRight className="size-6" aria-hidden />
          </button>
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/80">
            {current.alt} · {index + 1}/{photos.length}
          </p>
        </div>
      </dialog>
    </div>
  );
}
