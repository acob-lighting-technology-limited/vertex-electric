import type { Availability, BodyType, CarModel, Powertrain, PublicVehicle } from "./types";
import { vehicles } from "./seed";

export type * from "./types";

// Data access goes through these functions so the source can move from the
// seed to Sanity (GROQ with explicit projections, never `internal`) without
// touching pages.

export async function getVehicles(): Promise<PublicVehicle[]> {
  return vehicles.filter((v) => v.availability !== "sold");
}

export async function getFeaturedVehicles(limit = 3): Promise<PublicVehicle[]> {
  return (await getVehicles()).filter((v) => v.featured).slice(0, limit);
}

export async function getVehicle(slug: string): Promise<PublicVehicle | undefined> {
  return vehicles.find((v) => v.slug === slug);
}

/** Public display name: unconfirmed models show a descriptive title, never a guessed make/model. */
export function vehicleTitle(v: PublicVehicle) {
  return modelName(v.model) ?? `${v.exteriorColour ?? ""} ${bodyTypeLabel[v.model.bodyType]}`.trim();
}

export function modelName(m: CarModel): string | undefined {
  return m.confirmed ? `${m.make} ${m.model}` : undefined;
}

export const availabilityLabel: Record<Availability, string> = {
  "in-showroom": "In showroom",
  arriving: "Arriving soon",
  reserved: "Reserved",
  sold: "Sold",
};

export const bodyTypeLabel: Record<BodyType, string> = {
  sedan: "Sedan",
  suv: "SUV",
  hatchback: "Hatchback",
  mpv: "MPV",
  pickup: "Pickup",
  coupe: "Coupé",
};

export const powertrainLabel: Record<Powertrain, string> = {
  bev: "Fully electric",
  phev: "Plug-in hybrid",
  erev: "Range-extended electric",
};
