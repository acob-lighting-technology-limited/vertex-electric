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
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://vertexevsolutions.com",
  whatsapp: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, ""),
  phone: process.env.NEXT_PUBLIC_PHONE || "",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
  /** Showroom details are not published until Vertex confirms the address and hours. */
  showroom: null as null | { address: string; mapUrl?: string; hours: { days: string; time: string }[] },
};

export function whatsappHref(message: string) {
  if (!site.whatsapp) return undefined;
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const nav = [
  { href: "/inventory", label: "Inventory" },
  { href: "/order", label: "Order on request" },
  { href: "/showroom", label: "Showroom" },
] as const;
