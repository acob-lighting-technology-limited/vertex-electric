import { defineArrayMember, defineField, defineType } from "sanity";

export const BODY_TYPES = [
  { title: "Sedan", value: "sedan" },
  { title: "SUV", value: "suv" },
  { title: "Hatchback", value: "hatchback" },
  { title: "MPV", value: "mpv" },
  { title: "Pickup", value: "pickup" },
  { title: "Coupé", value: "coupe" },
];

/** A make/model (e.g. Xiaomi SU7). Shared specs and licensed imagery live here; stock units reference it. */
export const carModelType = defineType({
  name: "carModel",
  title: "Car model",
  type: "document",
  groups: [
    { name: "general", title: "General", default: true },
    { name: "specs", title: "Specs" },
    { name: "media", title: "Media" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "make", type: "string", group: "general", validation: (Rule) => Rule.required() }),
    defineField({ name: "model", type: "string", group: "general", validation: (Rule) => Rule.required() }),
    defineField({
      name: "slug",
      type: "slug",
      group: "general",
      options: { source: (doc) => `${doc.make ?? ""} ${doc.model ?? ""}`, maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "bodyType",
      type: "string",
      group: "general",
      options: { list: BODY_TYPES },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "availableToOrder",
      title: "Available to order on request",
      type: "boolean",
      group: "general",
      initialValue: true,
    }),
    defineField({ name: "tagline", type: "string", group: "general" }),
    defineField({ name: "summary", type: "text", rows: 4, group: "general" }),

    defineField({
      name: "specs",
      type: "object",
      group: "specs",
      fields: [
        defineField({ name: "batteryKwh", title: "Battery (kWh, usable)", type: "number" }),
        defineField({ name: "rangeKm", title: "Rated range (km)", type: "number" }),
        defineField({
          name: "rangeStandard",
          title: "Range test standard",
          type: "string",
          description: "CLTC figures run well above real-world range. Always record which standard a figure uses.",
          options: { list: ["CLTC", "WLTP", "EPA", "NEDC"] },
        }),
        defineField({ name: "powerKw", title: "Power (kW)", type: "number" }),
        defineField({ name: "zeroToHundred", title: "0–100 km/h (s)", type: "number" }),
        defineField({ name: "drivetrain", type: "string", options: { list: ["RWD", "FWD", "AWD"] } }),
        defineField({ name: "seats", type: "number" }),
        defineField({ name: "acChargeKw", title: "AC charging (kW)", type: "number" }),
        defineField({ name: "dcChargeKw", title: "DC fast charging (kW)", type: "number" }),
        defineField({
          name: "chargePort",
          type: "string",
          description: "e.g. GB/T (China) or CCS2. Matters for charger compatibility in Nigeria.",
        }),
      ],
    }),

    defineField({ name: "heroImage", type: "licensedImage", group: "media" }),
    defineField({
      name: "gallery",
      type: "array",
      group: "media",
      of: [defineArrayMember({ type: "licensedImage" })],
    }),
    defineField({
      name: "spin",
      title: "360° spin frames",
      type: "array",
      group: "media",
      description: "Ordered frames (24–72) for the spin viewer.",
      of: [defineArrayMember({ type: "licensedImage" })],
    }),
    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  preview: {
    select: { make: "make", model: "model", media: "heroImage" },
    prepare: ({ make, model, media }) => ({ title: `${make ?? ""} ${model ?? ""}`.trim(), media }),
  },
});
