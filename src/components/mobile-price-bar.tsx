"use client";

import { MessageCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { easeBlade } from "@vertex/ui/motion/easing";

/**
 * Phone-only bar that slides up once the request panel has scrolled out of view,
 * so "Request price" is always one tap away.
 */
export function MobilePriceBar({ stockNumber, whatsappHref }: { stockNumber: string; whatsappHref?: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const target = document.getElementById("request-price");
    if (!target) return;
    const io = new IntersectionObserver(([e]) => setShow(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(target);
    return () => io.disconnect();
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: "110%" }}
          animate={{ y: 0 }}
          exit={{ y: "110%" }}
          transition={{ duration: 0.45, ease: easeBlade }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/90 p-3 backdrop-blur-xl lg:hidden"
        >
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[11px] text-muted">{stockNumber}</p>
              <p className="truncate text-sm font-medium">Price on request</p>
            </div>
            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ask on WhatsApp"
                className="flex size-11 items-center justify-center rounded-(--vx-radius) bg-[#25D366] text-[#06281a]"
              >
                <MessageCircle className="size-5" aria-hidden />
              </a>
            )}
            <a href="#request-price" className="rounded-(--vx-radius) bg-accent px-5 py-3 text-sm font-medium text-on-accent">
              Request price
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
