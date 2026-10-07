"use server";

import { Resend } from "resend";
import { formatLead, leadSchema, leadTypeLabel, type LeadState } from "@/lib/leads";

/**
 * Receives Request price / Book viewing / Order on request submissions.
 * Delivery: email via Resend when RESEND_API_KEY, LEAD_TO_EMAIL and
 * LEAD_FROM_EMAIL are set. Until then the form reports that online
 * enquiries are not live, so nobody believes a message was sent when it wasn't.
 * TODO(phase 2): rate-limit (Upstash) + Turnstile, and push to Zoho CRM.
 */
export async function submitLead(_prev: LeadState, formData: FormData): Promise<LeadState> {
  const raw = Object.fromEntries(
    [...formData.entries()].filter(([, v]) => typeof v === "string") as [string, string][],
  );
  const parsed = leadSchema.safeParse(raw);

  if (!parsed.success) {
    // A filled honeypot means a bot: answer as if sent, deliver nothing.
    if (raw.company) return { status: "sent" };
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      errors[key] ??= issue.message;
    }
    return { status: "invalid", errors, values: raw };
  }

  const lead = parsed.data;
  const { RESEND_API_KEY, LEAD_TO_EMAIL, LEAD_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !LEAD_TO_EMAIL || !LEAD_FROM_EMAIL) return { status: "unconfigured" };

  try {
    const resend = new Resend(RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: LEAD_FROM_EMAIL,
      to: LEAD_TO_EMAIL.split(",").map((s) => s.trim()),
      replyTo: lead.email,
      subject: `${leadTypeLabel[lead.type]}${lead.stockNumber ? ` · ${lead.stockNumber}` : ""} · ${lead.name}`,
      text: formatLead(lead),
    });
    if (error) {
      console.error("[lead] resend error", error.name);
      return { status: "error" };
    }
    return { status: "sent" };
  } catch (e) {
    console.error("[lead] send failed", e instanceof Error ? e.message : e);
    return { status: "error" };
  }
}
