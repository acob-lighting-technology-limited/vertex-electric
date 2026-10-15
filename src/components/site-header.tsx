"use client";

import { ArrowUpRight } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Logo } from "@vertex/ui/brand/logo";
import { cn } from "@vertex/ui/lib/cn";
import { easeBlade } from "@vertex/ui/motion/easing";
import { getLenis } from "@vertex/ui/motion/motion-provider";
import { Container } from "@vertex/ui/primitives/container";
import { ThemeToggle } from "@vertex/ui/theme/theme-toggle";
import { nav, sister } from "@/lib/site";

/** Pages whose first section is a dark, full-bleed image (Hero / PageHero). */
const HERO_ROUTES = new Set(["/", "/about", "/charging"]);

const isActive = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);

const noopSubscribe = () => () => {};

export function SiteHeader({ whatsappHref }: { whatsappHref?: string }) {
  const pathname = usePathname();
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    // Hide while reading downwards, reveal on any upward scroll.
    setHidden(y > 240 && y > prev && !menuOpen);
  });

  // Freeze page scroll behind the open menu.
  useEffect(() => {
    if (!menuOpen) return;
    const lenis = getLenis();
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  // Transparent while sitting over a full-bleed photo hero (the nav pill keeps its glass);
  // solid on scroll and on pages that start with plain content.
  const clear = HERO_ROUTES.has(pathname) && !scrolled && !menuOpen;
  const activeHref = nav.find((n) => isActive(pathname, n.href))?.href ?? null;
  const pillTarget = hovered ?? activeHref;

  return (
    <motion.header
      style={{ viewTransitionName: "site-header" }}
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: 0.45, ease: easeBlade }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-500",
        clear
          ? "border-transparent bg-transparent"
          : "border-line bg-bg/70 backdrop-blur-xl",
      )}
    >
      <Container className="relative flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          aria-label="Vertex home"
          className="relative z-10 block shrink-0"
          onClick={() => setMenuOpen(false)}
        >
          <Logo className="h-6 w-auto sm:h-7" ink={clear ? "light" : "theme"} />
        </Link>

        <nav
          aria-label="Main"
          className="hidden md:block"
          onPointerLeave={() => setHovered(null)}
        >
          <ul
            className={cn(
              "flex items-center gap-1 rounded-full border p-1",
              clear
                ? "border-white/10 bg-black/20 backdrop-blur-md"
                : "border-line bg-surface/60",
            )}
          >
            {nav.map((item) => (
              <li key={item.href} className="relative">
                {pillTarget === item.href && (
                  <motion.span
                    layoutId="nav-pill"
                    className={cn(
                      "absolute inset-0 rounded-full",
                      clear ? "bg-white/10" : "bg-surface-2",
                    )}
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <Link
                  href={item.href}
                  onPointerEnter={() => setHovered(item.href)}
                  aria-current={activeHref === item.href ? "page" : undefined}
                  className={cn(
                    "relative block rounded-full px-4 py-2 text-sm transition-colors",
                    clear
                      ? "text-white/75 hover:text-white aria-[current=page]:text-white"
                      : "text-muted hover:text-fg aria-[current=page]:text-fg",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="relative z-10 flex items-center gap-2">
          <a
            href={sister.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${sister.name}: ${sister.blurb} (opens in a new tab)`}
            className={cn(
              "group hidden h-10 items-center gap-2 rounded-full border px-4 text-sm transition-colors lg:inline-flex",
              clear
                ? "border-white/15 bg-black/20 text-white/80 backdrop-blur-md hover:border-white/40 hover:text-white"
                : "border-line text-muted hover:border-line-strong hover:text-fg",
            )}
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full rounded-full opacity-60 group-hover:animate-ping motion-reduce:animate-none" style={{ background: sister.dot }} />
              <span className="relative inline-flex size-2 rounded-full" style={{ background: sister.dot }} />
            </span>
            {sister.short}
            <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
          </a>
          <ThemeToggle
            className={cn(
              clear && "border-white/20 text-white hover:bg-white/10",
            )}
          />
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
            className={cn(
              "relative inline-flex size-10 items-center justify-center rounded-full border md:hidden",
              clear ? "border-white/20 text-white" : "border-line text-fg",
            )}
          >
            <motion.span
              className="absolute h-px w-4 bg-current"
              animate={menuOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -4 }}
              transition={{ duration: 0.35, ease: easeBlade }}
            />
            <motion.span
              className="absolute h-px w-4 bg-current"
              animate={menuOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 4 }}
              transition={{ duration: 0.35, ease: easeBlade }}
            />
          </button>
        </div>
      </Container>

      {/* Portalled to <body>: the header's transform and backdrop-filter make it the containing
          block for fixed children, which collapsed this full-screen panel to 0px tall. */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                id="mobile-menu"
                key="menu"
                initial={{ clipPath: "inset(0 0 100% 0)" }}
                animate={{ clipPath: "inset(0 0 0% 0)" }}
                exit={{
                  clipPath: "inset(0 0 100% 0)",
                  transition: {
                    duration: 0.45,
                    ease: [0.76, 0, 0.24, 1],
                    delay: 0.1,
                  },
                }}
                transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                className="fixed inset-x-0 top-16 bottom-0 z-40 bg-bg md:hidden"
              >
                <Container className="flex h-full flex-col justify-between pt-8 pb-10">
                  <motion.ul
                    initial="hidden"
                    animate="show"
                    exit="hidden"
                    variants={{
                      show: {
                        transition: {
                          staggerChildren: 0.07,
                          delayChildren: 0.2,
                        },
                      },
                      hidden: {
                        transition: {
                          staggerChildren: 0.03,
                          staggerDirection: -1,
                        },
                      },
                    }}
                  >
                    {[{ href: "/", label: "Home" }, ...nav].map((item, i) => (
                      <li
                        key={item.href}
                        className="overflow-hidden border-b border-line"
                      >
                        <motion.div
                          variants={{
                            hidden: {
                              y: "100%",
                              opacity: 0,
                              transition: { duration: 0.25, ease: easeBlade },
                            },
                            show: {
                              y: "0%",
                              opacity: 1,
                              transition: { duration: 0.7, ease: easeBlade },
                            },
                          }}
                        >
                          <Link
                            href={item.href}
                            onClick={() => setMenuOpen(false)}
                            aria-current={
                              pathname === item.href ||
                              (item.href !== "/" &&
                                isActive(pathname, item.href))
                                ? "page"
                                : undefined
                            }
                            className="flex items-baseline justify-between py-5 font-display text-3xl font-medium aria-[current=page]:text-accent-text"
                          >
                            {item.label}
                            <span className="font-mono text-xs text-muted">
                              0{i + 1}
                            </span>
                          </Link>
                        </motion.div>
                      </li>
                    ))}
                  </motion.ul>
                  <div className="space-y-3">
                  <motion.a
                    href={sister.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.45, duration: 0.6, ease: easeBlade } }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-between rounded-(--vx-radius-lg) border border-dashed border-line-strong p-5"
                  >
                    <span>
                      <span className="flex items-center gap-2 text-sm text-muted">
                        <span className="size-2 rounded-full" style={{ background: sister.dot }} />
                        Sister site · {sister.blurb}
                      </span>
                      <span className="font-display text-lg">{sister.name}</span>
                    </span>
                    <ArrowUpRight className="size-5 text-accent-text" aria-hidden />
                  </motion.a>
                  {whatsappHref && (
                    <motion.a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        transition: {
                          delay: 0.55,
                          duration: 0.6,
                          ease: easeBlade,
                        },
                      }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-between rounded-(--vx-radius-lg) border border-line bg-surface p-5"
                    >
                      <span>
                        <span className="block text-sm text-muted">
                          Fastest response
                        </span>
                        <span className="font-display text-lg">
                          Chat on WhatsApp
                        </span>
                      </span>
                      <ArrowUpRight
                        className="size-5 text-accent-text"
                        aria-hidden
                      />
                    </motion.a>
                  )}
                  </div>
                </Container>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </motion.header>
  );
}
