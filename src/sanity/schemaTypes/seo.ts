import { defineField, defineType } from "sanity";

// Reused from ACOB-Website (sanity/schemaTypes/seo.ts).
export const seoType = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "metaTitle",
      title: "Meta title",
      type: "string",
      validation: (Rule) => Rule.max(60).warning("Titles over 60 characters may be truncated by search engines."),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(160).warning("Descriptions over 160 characters may be truncated."),
    }),
    defineField({
      name: "shareImage",
      title: "Share image",
      type: "image",
      description: "Shown when the link is shared (1200×630).",
    }),
  ],
});
