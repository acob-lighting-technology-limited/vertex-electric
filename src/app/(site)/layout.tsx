import { Logo } from "@vertex/ui/brand/logo";
import { MotionProvider } from "@vertex/ui/motion/motion-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Toaster } from "@/components/ui/sonner";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { whatsappHref } from "@/lib/site";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <MotionProvider>
      {/* First-view intro curtain (pure CSS; skipped on later views and under reduced motion). */}
      <div className="vx-intro" aria-hidden>
        <div className="vx-intro__logo">
          <Logo ink="light" className="w-full" />
        </div>
        <div className="vx-intro__bar" />
      </div>

      <div className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-(--vx-radius) focus:bg-accent focus:px-4 focus:py-2 focus:text-on-accent"
        >
          Skip to content
        </a>
        <SiteHeader whatsappHref={whatsappHref("Hi Vertex, I'd like to know more about your electric vehicles.")} />
        <main id="main" className="flex-1 pt-16">
          {children}
        </main>
        <WhatsAppButton />
        <Toaster position="top-center" />
        <SiteFooter />
      </div>
    </MotionProvider>
  );
}
