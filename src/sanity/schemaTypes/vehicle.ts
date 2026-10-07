import { defineArrayMember, defineField, defineType } from "sanity";

export const AVAILABILITY = [
  { title: "In showroom", value: "in-showroom" },
  { title: "Arriving soon", value: "arriving" },
  { title: "Reserved", value: "reserved" },
  { title: "Sold", value: "sold" },
];

export const IMPORT_STAGES = [
  { title: "Sourced", value: "sourced" },
  { title: "Inspected", value: "inspected" },
  { title: "Shipped", value: "shipped" },
  { title: "At Lagos port", value: "at-port" },
  { title: "Cleared", value: "cleared" },
  { title: "In showroom", value: "in-showroom" },
  { title: "Delivered", value: "delivered" },
];

/** One physical car Vertex holds or is bringing in. */
export const vehicleType = defineType({
  name: "vehicle",
  title: "Stock vehicle",
  type: "document",
  groups: [
    { name: "general", title: "General", default: true },
    { name: "photos", title: "Photos" },
    { name: "import", title: "Import status" },
    { name: "internal", title: "Internal (staff only)" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "stockNumber",
      title: "Stock number",
      type: "string",
      group: "general",
      description: "Format VX-0001. Quoted on every price request.",
      validation: (Rule) => Rule.required().regex(/^VX-\d{4}$/, { name: "VX-0000" }),
    }),
    defineField({
      name: "carModel",
      title: "Model",
      type: "reference",
      to: [{ type: "carModel" }],
      group: "general",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      group: "general",
      options: { source: "stockNumber", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "trim", type: "string", group: "general" }),
    defineField({ name: "year", type: "number", group: "general", validation: (Rule) => Rule.min(2015).max(2030) }),
    defineField({ name: "exteriorColour", type: "string", group: "general" }),
    defineField({ name: "interiorColour", type: "string", group: "general" }),
    defineField({ name: "mileageKm", title: "Mileage (km)", type: "number", group: "general" }),
    defineField({
      name: "batteryHealthPct",
      title: "Battery state of health (%)",
      type: "number",
      group: "general",
      description: "Only from an actual battery report. Leave empty when there is no report.",
      validation: (Rule) => Rule.min(0).max(100),
    }),
    defineField({
      name: "availability",
      type: "string",
      group: "general",
      options: { list: AVAILABILITY, layout: "radio" },
      initialValue: "arriving",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "featured", type: "boolean", group: "general", initialValue: false }),
    defineField({
      name: "highlights",
      type: "array",
      group: "general",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "conditionNotes",
      title: "Condition notes",
      type: "text",
      rows: 3,
      group: "general",
      description: "Be specific about wear. Buyers will inspect the car.",
    }),

    defineField({
      name: "photos",
      type: "array",
      group: "photos",
      description: "Real photos of this exact car only.",
      of: [defineArrayMember({ type: "vehiclePhoto" })],
    }),
    defineField({
      name: "photoNote",
      title: "Photo note",
      type: "string",
      group: "photos",
      description: 'Shown under the gallery, e.g. "Pre-shipment photos, China".',
    }),

    defineField({
      name: "importStatus",
      title: "Import status",
      type: "object",
      group: "import",
      description: "Only shown publicly when enabled in Site settings AND for this car.",
      fields: [
        defineField({ name: "show", title: "Show on this car's page", type: "boolean", initialValue: false }),
        defineField({ name: "stage", type: "string", options: { list: IMPORT_STAGES } }),
        defineField({ name: "eta", title: "Estimated arrival", type: "date" }),
        defineField({ name: "updatedAt", type: "datetime" }),
      ],
    }),

    defineField({
      name: "internal",
      title: "Internal",
      type: "object",
      group: "internal",
      description: "Never sent to the public website. Prices are given only via Request price.",
      fields: [
        defineField({ name: "priceNgn", title: "Price (₦)", type: "number" }),
        defineField({ name: "costNotes", type: "text", rows: 3 }),
        defineField({ name: "vin", title: "VIN", type: "string" }),
      ],
    }),
    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  preview: {
    select: {
      stock: "stockNumber",
      make: "carModel.make",
      model: "carModel.model",
      availability: "availability",
      media: "photos.0",
    },
    prepare: ({ stock, make, model, availability, media }) => ({
      title: `${stock ?? "VX-????"} · ${make ?? ""} ${model ?? ""}`.trim(),
      subtitle: AVAILABILITY.find((a) => a.value === availability)?.title,
      media,
    }),
  },
});
