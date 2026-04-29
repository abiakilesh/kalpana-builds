import { Phone, MessageCircle } from "lucide-react";
import { PHONE, WHATSAPP_GENERAL } from "@/lib/contact";

export function FloatingCTAs() {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 animate-slide-up">
      <a
        href={WHATSAPP_GENERAL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        title="Chat with us"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[oklch(var(--whatsapp))] text-white shadow-premium transition-transform hover:scale-110"
        style={{ background: "var(--whatsapp)" }}
      >
        <span className="absolute inset-0 rounded-full text-[oklch(0.72_0.18_152_/_0.5)] animate-pulse-ring" />
        <MessageCircle className="h-6 w-6" fill="currentColor" />
        <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-md bg-navy px-3 py-1.5 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
          Chat with us
        </span>
      </a>
      <a
        href={`tel:${PHONE}`}
        aria-label="Call us now"
        title="Call now"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-royal text-white shadow-premium transition-transform hover:scale-110"
      >
        <span className="absolute inset-0 rounded-full text-[oklch(0.36_0.14_268_/_0.5)] animate-pulse-ring" />
        <Phone className="h-5 w-5" fill="currentColor" />
        <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-md bg-navy px-3 py-1.5 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
          Call now
        </span>
      </a>
    </div>
  );
}
