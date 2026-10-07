import type { Metadata } from "next";
import { Container } from "@vertex/ui/primitives/container";
import { InventoryBrowser } from "@/components/inventory-browser";
import { SectionHeading } from "@/components/section-heading";
import { getVehicles } from "@/lib/inventory";

export const metadata: Metadata = {
  title: "Inventory",
  description: "Electric vehicles in the Vertex showroom and arriving soon. Real photos of every car; request a price online.",
};

export default async function InventoryPage() {
  const vehicles = await getVehicles();
  return (
    <Container className="py-16 sm:py-20">
      <SectionHeading
        as="h1"
        eyebrow="Inventory"
        title="In stock & arriving"
        description="Every car is photographed as it is — no stock images. Prices are shared on request."
      />
      <InventoryBrowser vehicles={vehicles} />
    </Container>
  );
}
