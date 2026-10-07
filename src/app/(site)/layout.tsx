import Link from "next/link";
import { Logo } from "@vertex/ui/brand/logo";
import { Container } from "@vertex/ui/primitives/container";
import { ThemeToggle } from "@vertex/ui/theme/theme-toggle";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-(--vx-radius) focus:bg-accent focus:px-4 focus:py-2 focus:text-on-accent"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur-md">
        <Container className="flex h-16 items-center justify-between">
          <Link href="/" aria-label="Vertex home" className="block">
            <Logo className="h-6 w-auto sm:h-7" />
          </Link>
          <ThemeToggle />
        </Container>
      </header>

      <main id="main" className="flex-1">
        {children}
      </main>

      <footer className="border-t border-line py-10 text-sm text-muted">
        <Container className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>Vertex Electric Solutions Limited · RC 9872444</p>
          <p>An ACOB Group company</p>
        </Container>
      </footer>
    </div>
  );
}
