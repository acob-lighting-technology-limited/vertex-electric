/**
 * Defaults for the "Will an EV work for me?" planner. Visitors can override
 * every price. Move these to Sanity siteSettings.runningCosts once it exists.
 *
 * Sources (checked 7 Oct 2026):
 *  - Petrol: ₦1,220–₦1,370/L across Lagos and Abuja in early October 2026
 *    (NNPC and independent retailers; guardian.ng, legit.ng).
 *  - Electricity: NERC Band A ₦209.50/kWh (most DisCos, Sept 2026 schedule).
 */
export const runningCostDefaults = {
  asOf: "October 2026",
  petrolPerLitre: 1300,
  electricityPerKwh: 209.5,
  /** Energy lost between the wall and the battery when charging. */
  chargingLoss: 0.1,
  /** Share of the battery kept in reserve when estimating usable range. */
  rangeBuffer: 0.1,
};

export type VehicleProfile = {
  id: "sedan" | "suv";
  label: string;
  /** kWh per 100 km in mixed city driving. Sedan figure matches the lifetime average on VX-0001's trip screen. */
  kwhPer100: number;
  /** Usable battery, kWh. */
  batteryKwh: number;
  /** Comparable petrol car, litres per 100 km in Nigerian traffic. */
  petrolLPer100: number;
};

export const vehicleProfiles: VehicleProfile[] = [
  { id: "sedan", label: "Electric sedan", kwhPer100: 16, batteryKwh: 75, petrolLPer100: 9 },
  { id: "suv", label: "Electric SUV", kwhPer100: 21, batteryKwh: 90, petrolLPer100: 13 },
];

export const dailyPresets = [
  { label: "City commute", km: 30 },
  { label: "Cross-town", km: 60 },
  { label: "Long commute", km: 100 },
];

/** Approximate one-way road distances. */
export const tripPresets = [
  { label: "Lagos ↔ Ibadan", km: 130 },
  { label: "Abuja ↔ Kaduna", km: 190 },
  { label: "Lagos ↔ Benin", km: 320 },
  { label: "Abuja ↔ Lagos", km: 760 },
];

export type PlannerInput = {
  vehicle: VehicleProfile;
  dailyKm: number;
  daysPerWeek: number;
  tripsPerMonth: number;
  tripKm: number;
  petrolPerLitre: number;
  electricityPerKwh: number;
};

export function plan(i: PlannerInput) {
  const { chargingLoss, rangeBuffer } = runningCostDefaults;
  const rangeKm = Math.round(((i.vehicle.batteryKwh * (1 - rangeBuffer)) / i.vehicle.kwhPer100) * 100);
  const monthlyKm = i.dailyKm * i.daysPerWeek * (52 / 12) + i.tripsPerMonth * i.tripKm * 2;
  const evMonthly = (monthlyKm / 100) * i.vehicle.kwhPer100 * (1 + chargingLoss) * i.electricityPerKwh;
  const petrolMonthly = (monthlyKm / 100) * i.vehicle.petrolLPer100 * i.petrolPerLitre;
  const weeklyKm = monthlyKm / (52 / 12);
  const chargesPerWeek = weeklyKm / rangeKm;
  // Plan legs to arrive with ~10% left rather than empty.
  const tripStops = Math.max(0, Math.ceil(i.tripKm / (rangeKm * 0.9)) - 1);
  const daysPerCharge = weeklyKm > 0 ? Math.max(1, Math.floor(rangeKm / (weeklyKm / 7))) : 0;
  const dailyFits = i.dailyKm <= rangeKm * 0.8;
  return {
    rangeKm,
    monthlyKm: Math.round(monthlyKm),
    evMonthly,
    petrolMonthly,
    yearlySaving: (petrolMonthly - evMonthly) * 12,
    chargesPerWeek,
    tripStops,
    daysPerCharge,
    dailyFits,
  };
}

export const naira = (n: number) => `₦${Math.round(n).toLocaleString("en-NG")}`;
/** Keeps kobo for small unit prices like ₦209.50/kWh. */
export const nairaRate = (n: number) =>
  `₦${n.toLocaleString("en-NG", { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 })}`;
