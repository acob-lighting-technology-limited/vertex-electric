import { defineField, defineType } from "sanity";

/** A real photo of a specific stock vehicle. No AI-generated imagery here. */
export const vehiclePhotoType = defineType({
  name: "vehiclePhoto",
  title: "Vehicle photo",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({ name: "alt", title: "Alt text", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "section",
      title: "Section",
      type: "string",
      options: {
        list: [
          { title: "Exterior", value: "exterior" },
          { title: "Interior", value: "interior" },
          { title: "Cabin tech", value: "tech" },
          { title: "Details & wear", value: "detail" },
        ],
        layout: "radio",
      },
      initialValue: "exterior",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "studioBackground",
      title: "Studio background applied",
      type: "boolean",
      description: "Tick if the background was replaced (e.g. Spyne). The car itself must be unedited.",
      initialValue: false,
    }),
    defineField({
      name: "platesObscured",
      title: "Number plates obscured",
      type: "boolean",
      validation: (Rule) =>
        Rule.custom((value) => (value === true ? true : "Blur or remove number plates before publishing.")),
    }),
  ],
});
