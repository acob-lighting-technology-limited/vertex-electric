import { ViewTransition, type ReactNode } from "react";

/**
 * Route-level transition (React <ViewTransition>, see Next's view-transitions guide).
 * Links tagged nav-forward / nav-back slide directionally; untagged navigations
 * crossfade-and-rise. Must wrap each page (layouts persist, so they never enter/exit).
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition
      enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "page-fade" }}
      exit={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "page-fade" }}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
