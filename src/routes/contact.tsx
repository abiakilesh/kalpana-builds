import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { PHONE, PHONE_DISPLAY, EMAIL, buildWhatsAppLeadLink } from "@/lib/contact";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Kalpana Associates Construction Chennai" },
      { name: "description", content: "Reach Kalpana Associates in Chennai, Kanchipuram and Mangadu. Call, WhatsApp, or send your requirement online." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().regex(/^[+\d\s-]{7,20}$/, "Invalid phone"),
  location: z.string().trim().min(2).max(100),
  requirement: z.string().trim().min(2).max(100),
  message: z.string().trim().max(1000).optional(),
});

const offices = [
  {
    city: "Corporate Office — Chennai",
    lines: [
      "New No: 30 & Old No: 11,",
      "AKR Corniche Center, 2nd Floor,",
      "Second Line Beach, George Town,",
      "Chennai - 600 001.",
      "Landmark: Beach station GT Court Backside",
    ],
  },
  {
    city: "Branch Office — Kanchipuram",
    lines: ["58B, SVN Pillai Street,", "Kanchipuram - 631502"],
  },
  {
    city: "Branch Office — Mangadu",
    lines: ["94/18, Palaneeswarer Koil Street,", "Mangadu, Chennai - 600122."],
  },
];

function ContactPage() {
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = {
      name: String(fd.get("name") || ""),
      phone: String(fd.get("phone") || ""),
      location: String(fd.get("location") || ""),
      requirement: String(fd.get("requirement") || ""),
      message: String(fd.get("message") || ""),
    };
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please complete the form");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("leads").insert({
      name: parsed.data.name,
      phone: parsed.data.phone,
      location: parsed.data.location,
      requirement: parsed.data.requirement,
      message: parsed.data.message || null,
      source: "contact",
    });
    setSubmitting(false);
    if (error) {
      toast.error("Could not submit. Please call us directly.");
      return;
    }
    toast.success("Thanks! Redirecting to WhatsApp…");
    window.open(buildWhatsAppLeadLink(parsed.data), "_blank");
    (e.currentTarget as HTMLFormElement).reset();
  };

  return (
    <>
      <section className="bg-gradient-hero text-white py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6 text-center">
          <div className="text-xs font-bold tracking-[0.25em] uppercase text-gold">Get In Touch</div>
          <h1 className="font-display text-4xl md:text-6xl font-bold mt-3">Let's Build <span className="text-gradient-gold">Together</span></h1>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6 grid lg:grid-cols-2 gap-10">
          <div>
            <h2 className="font-display text-2xl font-bold text-navy">Send Your Requirement</h2>
            <p className="text-muted-foreground mt-1 text-sm">We respond within 24 hours. Submit and we'll redirect you to WhatsApp instantly.</p>
            <form onSubmit={onSubmit} className="mt-6 space-y-3 bg-card border border-border rounded-2xl p-6 shadow-sm">
              <input name="name" required placeholder="Your Name *" className="w-full px-4 py-3 rounded-md border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:outline-none" />
              <input name="phone" required type="tel" placeholder="Phone Number *" className="w-full px-4 py-3 rounded-md border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:outline-none" />
              <input name="location" required placeholder="Location *" className="w-full px-4 py-3 rounded-md border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:outline-none" />
              <textarea name="requirement" required placeholder="Your Requirement (BOQ Construction / Joint Venture / Renovation / etc.) *" rows={3} className="w-full px-4 py-3 rounded-md border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:outline-none resize-none" />
              <textarea name="message" placeholder="Additional Message (optional)" rows={3} maxLength={1000} className="w-full px-4 py-3 rounded-md border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:outline-none resize-none" />
              <button type="submit" disabled={submitting} className="w-full py-3 rounded-md bg-gradient-gold text-navy font-semibold text-sm shadow-gold hover:opacity-95 disabled:opacity-60 transition flex items-center justify-center gap-2">
                <MessageCircle className="h-4 w-4" /> {submitting ? "Submitting…" : "Send via WhatsApp"}
              </button>
            </form>
          </div>

          <div className="space-y-5">
            <div className="bg-navy text-white rounded-2xl p-7 shadow-premium">
              <h3 className="font-display text-2xl font-bold">Quick Connect</h3>
              <div className="mt-5 space-y-4">
                <a href={`tel:${PHONE}`} className="flex gap-3 items-center group">
                  <div className="w-11 h-11 rounded-lg bg-gradient-gold flex items-center justify-center"><Phone className="h-5 w-5 text-navy" /></div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-gold">Phone</div>
                    <div className="font-semibold group-hover:text-gold transition">{PHONE_DISPLAY}</div>
                  </div>
                </a>
                <a href={`mailto:${EMAIL}`} className="flex gap-3 items-center group">
                  <div className="w-11 h-11 rounded-lg bg-gradient-gold flex items-center justify-center"><Mail className="h-5 w-5 text-navy" /></div>
                  <div className="min-w-0">
                    <div className="text-xs uppercase tracking-wider text-gold">Email</div>
                    <div className="font-semibold group-hover:text-gold transition break-all text-sm">{EMAIL}</div>
                  </div>
                </a>
              </div>
            </div>

            <div className="space-y-3">
              {offices.map((o) => (
                <div key={o.city} className="bg-card border border-border rounded-xl p-5 flex gap-3">
                  <MapPin className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-navy">{o.city}</div>
                    {o.lines.map((l) => (
                      <div key={l} className="text-sm text-muted-foreground leading-relaxed">{l}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="rounded-2xl overflow-hidden border border-border shadow-premium">
            <iframe
              title="Kalpana Associates location"
              src="https://maps.google.com/maps?q=Kalpana+Associates+%26+Construction&ll=13.0924207,80.2909519&z=17&output=embed"
              width="100%"
              height="380"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  );
}
