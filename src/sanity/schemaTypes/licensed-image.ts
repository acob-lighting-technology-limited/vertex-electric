import { defineField, defineType } from "sanity";

/**
 * Model-level imagery (studio stills, 360 frames) from a licensed source.
 * Source is mandatory, and third-party images need a licence reference,
 * so nothing unlicensed reaches the site.
 */
export const licensedImageType = defineType({
  name: "licensedImage",
  title: "Licensed image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({ name: "alt", title: "Alt text", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "source",
      title: "Source",
      type: "string",
      options: {
        list: [
          { title: "Licensed provider (e.g. Evox)", value: "licensed-provider" },
          { title: "OEM press kit (dealer use permitted)", value: "oem-press" },
          { title: "Vertex original", value: "vertex" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "licence",
      title: "Licence reference",
      type: "string",
      description: "Contract or licence ID, or the press-kit terms URL.",
      validation: (Rule) =>
        Rule.custom((value, ctx) => {
          const parent = ctx.parent as { source?: string } | undefined;
          return parent?.source && parent.source !== "vertex" && !value
            ? "A licence reference is required for third-party imagery."
            : true;
        }),
    }),
    defineField({ name: "credit", title: "Credit line", type: "string" }),
  ],
});
