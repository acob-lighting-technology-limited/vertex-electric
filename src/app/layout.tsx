import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter, Unbounded } from "next/font/google";
import { ThemeScript } from "@vertex/ui/theme/theme-script";
import "./globals.css";

// Display face: wide and squared, echoing the wordmark. Body: Inter for legibility.
const unbounded = Unbounded({ variable: "--font-unbounded", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vertexelectricsolutions.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Vertex Electric Solutions — Premium EVs in Nigeria",
    template: "%s · Vertex Electric Solutions",
  },
  description:
    "Vertex sources premium electric vehicles from China and beyond and delivers them in Nigeria. Browse stock, order on request, and visit our showroom.",
  applicationName: "Vertex Electric Solutions",
};

export const viewport: Viewport = {
  // Lets content use the full screen on notched phones; safe-area insets keep it clear of the home bar.
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#06080b" },
    { media: "(prefers-color-scheme: light)", color: "#f6f7f9" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-NG"
      data-theme="dark"
      suppressHydrationWarning
      className={`${unbounded.variable} ${inter.variable} ${geistMono.variable} h-full`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
