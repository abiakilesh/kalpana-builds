import { useEffect, useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { buildWhatsAppLeadLink } from "@/lib/contact";
import { toast } from "sonner";
import { z } from "zod";

const SESSION_KEY = "ka_lead_popup_shown";

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(100),
  phone: z.string().trim().regex(/^[+\d\s-]{7,20}$/, "Enter a valid phone"),
  location: z.string().trim().min(2, "Enter your location").max(100),
  requirement: z.enum(["Construction", "Joint Venture"]),
});

export function LeadPopup() {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SESSION_KEY)) return;
    const t = setTimeout(() => {
      setOpen(true);
      sessionStorage.setItem(SESSION_KEY, "1");
    }, 3000);
    return () => clearTimeout(t);
  }, []);

  if (!open) return null;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = {
      name: String(fd.get("name") || ""),
      phone: String(fd.get("phone") || ""),
      location: String(fd.get("location") || ""),
      requirement: String(fd.get("requirement") || "Construction"),
    };
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("leads").insert({
      name: parsed.data.name,
      phone: parsed.data.phone,
      location: parsed.data.location,
      requirement: parsed.data.requirement,
      source: "popup",
    });
    setSubmitting(false);
    if (error) {
      toast.error("Could not submit. Please try calling us.");
      return;
    }
    setDone(true);
    toast.success("Thanks! We will contact you shortly.");
    const url = buildWhatsAppLeadLink(parsed.data);
    setTimeout(() => window.open(url, "_blank"), 600);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-navy/60 backdrop-blur-sm animate-float-in">
      <div className="relative w-full max-w-md rounded-2xl bg-card shadow-premium overflow-hidden">
        <button
          onClick={() => setOpen(false)}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-background/80 hover:bg-background text-foreground/70"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="bg-gradient-hero text-white px-6 pt-7 pb-5">
          <div className="inline-block px-2.5 py-1 rounded-full bg-gold/95 text-navy text-[10px] font-bold uppercase tracking-wider mb-2.5">Free Consultation</div>
          <h3 className="font-display text-2xl font-bold leading-tight">Build Your Dream Home with Confidence</h3>
          <p className="text-white/80 text-sm mt-1.5">Tell us about your project — we'll get back within 24 hours.</p>
        </div>

        {done ? (
          <div className="p-6 text-center">
            <div className="mx-auto w-14 h-14 rounded-full bg-gradient-gold flex items-center justify-center mb-3">
              <svg className="w-7 h-7 text-navy" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h4 className="font-display text-xl font-bold">Thank you!</h4>
            <p className="text-sm text-muted-foreground mt-1">We've received your details and will contact you shortly.</p>
            <button onClick={() => setOpen(false)} className="mt-5 w-full py-2.5 rounded-md bg-navy text-primary-foreground font-medium">Close</button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="p-6 space-y-3">
            <input name="name" placeholder="Your Name *" required className="w-full px-4 py-2.5 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            <input name="phone" placeholder="Phone Number *" required type="tel" className="w-full px-4 py-2.5 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            <input name="location" placeholder="Location *" required className="w-full px-4 py-2.5 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            <select name="requirement" className="w-full px-4 py-2.5 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="Construction">Construction</option>
              <option value="Joint Venture">Joint Venture</option>
            </select>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-md bg-gradient-gold text-navy font-semibold text-sm hover:opacity-95 disabled:opacity-60 shadow-gold transition"
            >
              {submitting ? "Submitting…" : "Get Free Consultation"}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-full py-2 text-xs text-muted-foreground hover:text-foreground"
            >
              Skip for now
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
