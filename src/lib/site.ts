/**
 * Site-wide facts and contact channels. Contact details come from env so the
 * site never shows a placeholder number. A channel with no value is hidden.
 * These move to Sanity siteSettings once the project exists.
 */
export const site = {
  name: "Vertex Electric Solutions",
  shortName: "Vertex",
  legalName: "Vertex Electric Solutions Limited",
  rc: "9872444",
  parent: "ACOB Group",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://vertexelectricsolutions.com",
  whatsapp: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, ""),
  phone: process.env.NEXT_PUBLIC_PHONE || "",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
  /** Showroom details are not published until Vertex confirms the address and hours. */
  showroom: null as null | { address: string; mapUrl?: string; hours: { days: string; time: string }[] },
};

/** "+2347058786478" -> "+234 705 878 6478" for display; links keep the raw number. */
export function formatPhone(raw: string) {
  const d = raw.replace(/\D/g, "");
  return d.startsWith("234") && d.length === 13 ? `+234 ${d.slice(3, 6)} ${d.slice(6, 9)} ${d.slice(9)}` : raw;
}

export function whatsappHref(message: string) {
  if (!site.whatsapp) return undefined;
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

/** Sister site for public and fleet charging (charging services sit with EV Hub; Vertex sells EVs and chargers). */
export const sister = {
  name: "Vertex EV Hub",
  short: "EV Hub",
  blurb: "Public & fleet charging",
  href: process.env.NEXT_PUBLIC_EV_HUB_URL || "https://www.vertexevhub.com",
  dot: "#ff6a3d",
};

export const nav = [
  { href: "/inventory", label: "Inventory" },
  { href: "/order", label: "Order on request" },
  { href: "/charging", label: "Charging" },
  { href: "/about", label: "About" },
] as const;

export const footerNav = [
  { href: "/inventory", label: "Inventory" },
  { href: "/order", label: "Order on request" },
  { href: "/range-planner", label: "Will an EV work for me?" },
  { href: "/charging", label: "Charging" },
  { href: "/showroom", label: "Showroom" },
  { href: "/about", label: "About Vertex" },
  { href: "/faq", label: "FAQ" },
] as const;
