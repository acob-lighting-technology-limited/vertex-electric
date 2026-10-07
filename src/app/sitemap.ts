import type { MetadataRoute } from "next";
import { getVehicles } from "@/lib/inventory";
import { site } from "@/lib/site";

const pages = ["", "/inventory", "/order", "/range-planner", "/charging", "/showroom", "/about", "/faq", "/privacy"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const vehicles = await getVehicles();
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...vehicles.map((v) => ({ url: `${site.url}/inventory/${v.slug}`, changeFrequency: "daily" as const, priority: 0.8 })),
  ];
}
