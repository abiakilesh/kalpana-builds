import { Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin } from "lucide-react";
import { PHONE, PHONE_DISPLAY, EMAIL } from "@/lib/contact";

export function Footer() {
  return (
    <footer className="bg-navy text-primary-foreground mt-auto">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-14 grid gap-10 md:grid-cols-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gradient-gold">
              <span className="font-display text-lg font-bold text-navy">K</span>
            </div>
            <div className="leading-tight">
              <div className="font-display text-base font-bold">Kalpana Associates</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-white/60">& Construction</div>
            </div>
          </div>
          <p className="text-sm text-white/70 leading-relaxed">
            Tamil Nadu's first BOQ-based construction company. Transparent pricing, branded materials, on-time delivery.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-gold mb-4">Explore</h4>
          <ul className="space-y-2 text-sm text-white/75">
            <li><Link to="/services" className="hover:text-gold">Services</Link></li>
            <li><Link to="/joint-venture" className="hover:text-gold">Joint Venture</Link></li>
            <li><Link to="/gallery" className="hover:text-gold">Gallery</Link></li>
            <li><Link to="/about" className="hover:text-gold">About Founder</Link></li>
            <li><Link to="/contact" className="hover:text-gold">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-gold mb-4">Reach Us</h4>
          <ul className="space-y-3 text-sm text-white/75">
            <li className="flex gap-2"><Phone className="h-4 w-4 mt-0.5 text-gold" /> <a href={`tel:${PHONE}`}>{PHONE_DISPLAY}</a></li>
            <li className="flex gap-2"><Mail className="h-4 w-4 mt-0.5 text-gold" /> <a href={`mailto:${EMAIL}`} className="break-all">{EMAIL}</a></li>
            <li className="flex gap-2"><MapPin className="h-4 w-4 mt-0.5 text-gold" /> Chennai · Kanchipuram · Mangadu</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-gold mb-4">Office Hours</h4>
          <p className="text-sm text-white/75">Mon – Sat<br />9:00 AM – 7:00 PM</p>
          <Link to="/admin" className="mt-4 inline-block text-xs text-white/40 hover:text-white/70">Admin Login</Link>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-5 text-xs text-white/50 flex flex-wrap items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} Kalpana Associates & Construction. All rights reserved.</span>
          <span>Built with care · Chennai, India</span>
        </div>
      </div>
    </footer>
  );
}
