import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({
      name: "showImportStatus",
      title: "Enable import-status tracker",
      type: "boolean",
      description: "Master switch. Off = no car shows its import timeline, whatever its own setting.",
      initialValue: false,
    }),
    defineField({
      name: "contact",
      type: "object",
      fields: [
        defineField({
          name: "whatsapp",
          title: "WhatsApp number",
          type: "string",
          description: "International format without +, e.g. 2348012345678",
        }),
        defineField({ name: "phone", type: "string" }),
        defineField({ name: "email", type: "string" }),
      ],
    }),
    defineField({
      name: "showroom",
      type: "object",
      fields: [
        defineField({ name: "address", type: "text", rows: 3 }),
        defineField({ name: "mapUrl", title: "Map link", type: "url" }),
        defineField({
          name: "hours",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [defineField({ name: "days", type: "string" }), defineField({ name: "time", type: "string" })],
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "runningCosts",
      title: "Running-cost rates (range planner)",
      type: "object",
      fields: [
        defineField({ name: "petrolPerLitreNgn", title: "Petrol pump price (₦/L)", type: "number" }),
        defineField({ name: "electricityPerKwhNgn", title: "Electricity tariff (₦/kWh)", type: "number" }),
        defineField({ name: "updatedAt", type: "date" }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});
