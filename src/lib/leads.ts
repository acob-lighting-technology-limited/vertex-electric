import { z } from "zod";

export const LEAD_TYPES = ["price", "viewing", "order"] as const;
export type LeadType = (typeof LEAD_TYPES)[number];

export const leadTypeLabel: Record<LeadType, string> = {
  price: "Price request",
  viewing: "Viewing / test drive",
  order: "Order on request",
};

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : undefined));

export const leadSchema = z
  .object({
    type: z.enum(LEAD_TYPES),
    name: z.string().trim().min(2, "Please enter your name.").max(80),
    phone: z
      .string()
      .trim()
      .transform((v) => v.replace(/[\s()-]/g, ""))
      .pipe(z.string().regex(/^\+?\d{7,15}$/, "Please enter a valid phone number.")),
    email: z
      .string()
      .trim()
      .max(120)
      .optional()
      .transform((v) => (v ? v : undefined))
      .pipe(z.email("Please enter a valid email.").optional()),
    city: optionalText(60),
    contactMethod: z.enum(["whatsapp", "call", "email"]).default("whatsapp"),
    stockNumber: z
      .string()
      .regex(/^VX-\d{4}$/)
      .optional(),
    message: optionalText(1000),
    // Order on request
    bodyType: optionalText(40),
    models: optionalText(200),
    budget: optionalText(40),
    timeline: optionalText(40),
    preferredDate: optionalText(40),
    // Honeypot: real people never fill this.
    company: z.string().max(0).optional(),
  })
  .refine((d) => d.contactMethod !== "email" || d.email, {
    message: "Add an email address, or choose WhatsApp or a call.",
    path: ["email"],
  });

export type Lead = z.infer<typeof leadSchema>;

export type LeadState =
  | { status: "idle" }
  | { status: "invalid"; errors: Partial<Record<string, string>>; values: Record<string, string> }
  | { status: "sent" }
  | { status: "unconfigured" }
  | { status: "error" };

/** Plain-text body for the sales inbox. Plain text avoids HTML injection from form input. */
export function formatLead(lead: Lead) {
  const rows: [string, string | undefined][] = [
    ["Type", leadTypeLabel[lead.type]],
    ["Vehicle", lead.stockNumber],
    ["Name", lead.name],
    ["Phone", lead.phone],
    ["Email", lead.email],
    ["City", lead.city],
    ["Preferred contact", lead.contactMethod],
    ["Body type", lead.bodyType],
    ["Models", lead.models],
    ["Budget", lead.budget],
    ["Timeline", lead.timeline],
    ["Preferred date", lead.preferredDate],
    ["Message", lead.message],
  ];
  return rows
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
}
