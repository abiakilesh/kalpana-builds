import { Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react";
import { PHONE, PHONE_DISPLAY, EMAIL } from "@/lib/contact";
import logo from "@/assets/logo.png";

const offices = [
  {
    title: "Corporate Office",
    lines: [
      "New No: 30 & Old No: 11,",
      "AKR Corniche Center, 2nd Floor,",
      "Second Line Beach, George Town,",
      "Chennai - 600 001.",
      "Landmark: Beach station GT Court Backside",
    ],
  },
  {
    title: "Branch Office — Kanchipuram",
    lines: ["58B, SVN Pillai Street,", "Kanchipuram - 631502"],
  },
  {
    title: "Branch Office — Mangadu",
    lines: ["94/18, Palaneeswarer Koil Street,", "Mangadu, Chennai - 600122."],
  },
];

const socials = [
  { href: "https://www.facebook.com/profile.php?id=61588910314440", label: "Facebook", Icon: Facebook },
  { href: "https://www.instagram.com/kpmkalpanaassociates/", label: "Instagram", Icon: Instagram },
  { href: "https://x.com/Aravindhan81221", label: "Twitter", Icon: Twitter },
];

export function Footer() {
  return (
    <footer className="bg-navy text-primary-foreground mt-auto">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center rounded-lg bg-white/95 p-2.5">
            <img src={logo} alt="Kalpana Associates & Construction" className="h-20 w-auto" />
          </div>
          <p className="text-sm text-white/70 leading-relaxed">
            Tamil Nadu's first BOQ-based construction company. Transparent pricing, branded materials, on-time delivery.
          </p>
          <div className="flex items-center gap-3 pt-2">
            {socials.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-gradient-gold hover:text-navy text-white flex items-center justify-center transition"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-gold mb-4">Explore</h4>
          <ul className="space-y-2 text-sm text-white/75">
            <li><Link to="/services" className="hover:text-gold">Services</Link></li>
            <li><Link to="/pricing" className="hover:text-gold">Pricing</Link></li>
            <li><Link to="/joint-venture" className="hover:text-gold">Joint Venture</Link></li>
            <li><Link to="/gallery" className="hover:text-gold">Gallery</Link></li>
            <li><Link to="/about" className="hover:text-gold">About Founder</Link></li>
            <li><Link to="/contact" className="hover:text-gold">Contact</Link></li>
          </ul>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-gold mt-6 mb-4">Reach Us</h4>
          <ul className="space-y-3 text-sm text-white/75">
            <li className="flex gap-2"><Phone className="h-4 w-4 mt-0.5 text-gold flex-shrink-0" /> <a href={`tel:${PHONE}`}>{PHONE_DISPLAY}</a></li>
            <li className="flex gap-2"><Mail className="h-4 w-4 mt-0.5 text-gold flex-shrink-0" /> <a href={`mailto:${EMAIL}`} className="break-all">{EMAIL}</a></li>
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-gold mb-4">Our Offices</h4>
          <div className="grid sm:grid-cols-2 gap-5 text-sm text-white/75">
            {offices.map((o) => (
              <div key={o.title} className="flex gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-gold flex-shrink-0" />
                <div>
                  <div className="font-semibold text-white">{o.title}</div>
                  {o.lines.map((l) => (
                    <div key={l} className="leading-relaxed">{l}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-white/50 mt-5">Mon – Sat · 9:00 AM – 7:00 PM</p>
          <Link to="/admin" className="mt-3 inline-block text-xs text-white/40 hover:text-white/70">Admin Login</Link>
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
