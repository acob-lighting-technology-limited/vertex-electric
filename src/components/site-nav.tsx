"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@vertex/ui/lib/cn";
import { nav } from "@/lib/site";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DesktopNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Main" className="hidden md:block">
      <ul className="flex items-center gap-1">
        {nav.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
              className="rounded-full px-4 py-2 text-sm text-muted transition-colors hover:text-fg aria-[current=page]:text-fg"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex size-10 items-center justify-center rounded-full border border-line text-fg"
      >
        {open ? <X className="size-4" aria-hidden /> : <Menu className="size-4" aria-hidden />}
      </button>
      <div
        id="mobile-menu"
        hidden={!open}
        className="absolute inset-x-0 top-16 border-b border-line bg-bg/95 px-4 pb-6 backdrop-blur-md"
      >
        <ul className="flex flex-col">
          {nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(pathname, item.href) ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={cn("block border-b border-line py-4 font-display text-lg", isActive(pathname, item.href) && "text-accent-text")}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
