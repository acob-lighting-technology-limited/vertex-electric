"use client";

import { Plus } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useId, useState } from "react";
import { cn } from "@vertex/ui/lib/cn";
import { easeBlade } from "@vertex/ui/motion/easing";
import type { FaqGroup } from "@/lib/faq";

function Item({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  const id = useId();
  return (
    <div className={cn("border-b border-line transition-colors", open && "border-accent/40")}>
      <h3>
        <button
          type="button"
          id={`${id}-q`}
          aria-expanded={open}
          aria-controls={`${id}-a`}
          onClick={onToggle}
          className="group flex w-full items-center justify-between gap-6 py-6 text-left"
        >
          <span className={cn("font-display text-lg font-medium transition-colors sm:text-xl", open ? "text-fg" : "text-fg/85 group-hover:text-fg")}>{q}</span>
          <motion.span
            animate={{ rotate: open ? 135 : 0 }}
            transition={{ duration: 0.4, ease: easeBlade }}
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-full border transition-colors",
              open ? "border-accent bg-accent text-on-accent" : "border-line-strong group-hover:border-accent-text",
            )}
          >
            <Plus className="size-4" aria-hidden />
          </motion.span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${id}-a`}
            role="region"
            aria-labelledby={`${id}-q`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: easeBlade }}
            className="overflow-hidden"
          >
            <motion.p
              initial={{ y: -8, filter: "blur(4px)" }}
              animate={{ y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.45, ease: easeBlade }}
              className="max-w-2xl pb-7 text-muted"
            >
              {a}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Category tabs (sliding pill) + single-open accordion with animated height. */
export function FaqAccordion({ groups }: { groups: FaqGroup[] }) {
  const [active, setActive] = useState(groups[0]?.id ?? "");
  const [openQ, setOpenQ] = useState<string | null>(groups[0]?.items[0]?.q ?? null);
  const group = groups.find((g) => g.id === active) ?? groups[0];

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <LayoutGroup id="faq-tabs">
        <div role="tablist" aria-label="FAQ topics" className="flex gap-1 overflow-x-auto lg:sticky lg:top-24 lg:flex-col lg:self-start">
          {groups.map((g) => {
            const on = g.id === active;
            return (
              <button
                key={g.id}
                role="tab"
                aria-selected={on}
                type="button"
                onClick={() => {
                  setActive(g.id);
                  setOpenQ(g.items[0]?.q ?? null);
                }}
                className={cn("relative rounded-full px-4 py-2.5 text-left text-sm whitespace-nowrap transition-colors lg:rounded-(--vx-radius)", on ? "text-fg" : "text-muted hover:text-fg")}
              >
                {on && <motion.span layoutId="faq-pill" className="absolute inset-0 rounded-[inherit] bg-surface-2" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
                <span className="relative flex items-center justify-between gap-4">
                  {g.title}
                  <span className="font-mono text-xs text-muted">{g.items.length}</span>
                </span>
              </button>
            );
          })}
        </div>
      </LayoutGroup>

      <AnimatePresence mode="wait">
        <motion.div
          key={group.id}
          role="tabpanel"
          initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
          transition={{ duration: 0.4, ease: easeBlade }}
          className="border-t border-line"
        >
          {group.items.map((item) => (
            <Item key={item.q} q={item.q} a={item.a} open={openQ === item.q} onToggle={() => setOpenQ(openQ === item.q ? null : item.q)} />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
