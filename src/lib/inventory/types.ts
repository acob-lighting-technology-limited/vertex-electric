/**
 * Public inventory types. These are what pages receive. They deliberately have
 * no price or internal fields: Vertex does not publish prices, so the public
 * shape cannot carry one by accident.
 */

export type Availability = "in-showroom" | "arriving" | "reserved" | "sold";
export type BodyType = "sedan" | "suv" | "hatchback" | "mpv" | "pickup" | "coupe";
/** BEV = battery electric. PHEV/EREV carry a petrol engine and must be labelled as such. */
export type Powertrain = "bev" | "phev" | "erev";
export type PhotoSection = "exterior" | "interior" | "tech" | "detail";

export type VehiclePhoto = {
  src: string;
  width: number;
  height: number;
  alt: string;
  section: PhotoSection;
};

export type ModelSpecs = {
  batteryKwh?: number;
  rangeKm?: number;
  rangeStandard?: "CLTC" | "WLTP" | "EPA" | "NEDC";
  powerKw?: number;
  zeroToHundred?: number;
  drivetrain?: "RWD" | "FWD" | "AWD";
  seats?: number;
  acChargeKw?: number;
  dcChargeKw?: number;
  chargePort?: string;
};

export type CarModel = {
  slug: string;
  make: string;
  model: string;
  bodyType: BodyType;
  powertrain?: Powertrain;
  /** False until Vertex confirms make/model; unconfirmed names are never shown publicly. */
  confirmed: boolean;
  availableToOrder: boolean;
  tagline?: string;
  summary?: string;
  specs: ModelSpecs;
};

export type ImportStage = "sourced" | "inspected" | "shipped" | "at-port" | "cleared" | "in-showroom" | "delivered";

export type PublicVehicle = {
  stockNumber: string;
  slug: string;
  model: CarModel;
  trim?: string;
  year?: number;
  exteriorColour?: string;
  interiorColour?: string;
  mileageKm?: number;
  batteryHealthPct?: number;
  availability: Availability;
  featured: boolean;
  highlights: string[];
  conditionNotes?: string;
  photos: VehiclePhoto[];
  photoNote?: string;
  /** Present only when the site-wide tracker AND this car's toggle are on. */
  importStatus?: { stage: ImportStage; eta?: string; updatedAt?: string };
};
