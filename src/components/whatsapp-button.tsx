import { MessageCircle } from "lucide-react";
import { whatsappHref } from "@/lib/site";

/** Floating WhatsApp shortcut — the channel most Nigerian buyers reach for first. Hidden when no number is set. */
export function WhatsAppButton() {
  const href = whatsappHref("Hi Vertex, I'd like to know more about your electric vehicles.");
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Vertex on WhatsApp (opens WhatsApp)"
      className="fixed right-4 bottom-4 z-30 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-[#06281a] shadow-[0_8px_30px_-6px_rgb(0_0_0/0.5)] transition-transform hover:-translate-y-0.5 sm:right-6 sm:bottom-6 print:hidden"
    >
      <MessageCircle className="size-5" aria-hidden />
      <span className="hidden sm:inline">WhatsApp us</span>
    </a>
  );
}
