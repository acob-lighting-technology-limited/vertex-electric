"use client";

import { MessageCircle } from "lucide-react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@vertex/ui/lib/cn";
import { easeBlade } from "@vertex/ui/motion/easing";
import { whatsappHref } from "@/lib/site";

/**
 * Floating WhatsApp shortcut — the channel most Nigerian buyers reach for first.
 * On the home page it waits until the visitor scrolls past the hero (which has its
 * own calls to action and a bottom ticker it would cover). Hidden when no number is set.
 */
export function WhatsAppButton() {
  const href = whatsappHref("Hi Vertex, I'd like to know more about your electric vehicles.");
  const pathname = usePathname();
  // Vehicle pages have their own mobile price bar with WhatsApp, so step aside there on phones.
  const onVehicle = pathname.startsWith("/inventory/");
  const onHome = pathname === "/";
  const { scrollY } = useScroll();
  const [pastHero, setPastHero] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setPastHero(y > window.innerHeight * 0.6));

  if (!href) return null;
  const show = !onHome || pastHero;

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          key="wa"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with Vertex on WhatsApp (opens WhatsApp)"
          initial={{ opacity: 0, scale: 0.6, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 16 }}
          transition={{ duration: 0.45, ease: easeBlade }}
          className={cn(
            "fixed right-4 bottom-4 z-30 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-[#06281a] shadow-[0_8px_30px_-6px_rgb(0_0_0/0.5)] transition-transform hover:-translate-y-0.5 sm:right-6 sm:bottom-6 print:hidden",
            onVehicle && "max-lg:hidden",
          )}
        >
          <MessageCircle className="size-5" aria-hidden />
          <span className="hidden sm:inline">WhatsApp us</span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
