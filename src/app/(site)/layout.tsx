import Link from "next/link";
import { Logo } from "@vertex/ui/brand/logo";
import { Container } from "@vertex/ui/primitives/container";
import { ThemeToggle } from "@vertex/ui/theme/theme-toggle";
import { CopyrightYear } from "@/components/copyright-year";
import { DesktopNav, MobileNav } from "@/components/site-nav";
import { nav, site } from "@/lib/site";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-(--vx-radius) focus:bg-accent focus:px-4 focus:py-2 focus:text-on-accent"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-40 border-b border-line bg-bg/75 backdrop-blur-md">
        <Container className="relative flex h-16 items-center justify-between gap-4">
          <Link href="/" aria-label="Vertex home" className="block shrink-0">
            <Logo className="h-6 w-auto sm:h-7" />
          </Link>
          <DesktopNav />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <MobileNav />
          </div>
        </Container>
      </header>

      <main id="main" className="flex-1">
        {children}
      </main>

      <footer className="mt-24 border-t border-line py-14 text-sm">
        <Container className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Logo variant="registration" className="h-12 w-auto" />
            <p className="max-w-xs text-muted">Premium electric vehicles, sourced worldwide and delivered in Nigeria.</p>
          </div>
          <div>
            <p className="font-medium">Explore</p>
            <ul className="mt-3 space-y-2 text-muted">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="hover:text-fg">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-medium">Contact</p>
            <ul className="mt-3 space-y-2 text-muted">
              {site.phone && (
                <li>
                  <a href={`tel:${site.phone}`} className="hover:text-fg">
                    {site.phone}
                  </a>
                </li>
              )}
              {site.email && (
                <li>
                  <a href={`mailto:${site.email}`} className="hover:text-fg">
                    {site.email}
                  </a>
                </li>
              )}
              <li>
                <Link href="/showroom" className="hover:text-fg">
                  Showroom — opening soon
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-1 text-muted">
            <p className="font-medium text-fg">Company</p>
            <p className="pt-2">{site.legalName}</p>
            <p>RC {site.rc}</p>
            <p>An {site.parent} company</p>
          </div>
        </Container>
        <Container className="mt-12 text-xs text-muted">
          © <CopyrightYear /> {site.legalName}. Vehicle names and marks belong to their manufacturers; Vertex is an
          independent importer.
        </Container>
      </footer>
    </div>
  );
}
