import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { PHONE, PHONE_DISPLAY } from "@/lib/contact";

const nav = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/joint-venture", label: "Joint Venture" },
  { to: "/gallery", label: "Gallery" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/85 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gradient-gold shadow-gold">
            <span className="font-display text-lg font-bold text-navy">K</span>
          </div>
          <div className="leading-tight">
            <div className="font-display text-base font-bold text-navy">Kalpana Associates</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">& Construction</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {nav.map((n) => {
            const active = path === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                  active ? "text-navy" : "text-foreground/70 hover:text-navy"
                }`}
              >
                {n.label}
                {active && <span className="block h-0.5 w-6 bg-gradient-gold mt-1 rounded-full" />}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <a href={`tel:${PHONE}`} className="flex items-center gap-2 text-sm font-semibold text-navy">
            <Phone className="h-4 w-4 text-gold" /> {PHONE_DISPLAY}
          </a>
        </div>

        <button
          className="lg:hidden p-2 text-navy"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background animate-float-in">
          <nav className="flex flex-col p-4 gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-muted rounded-md"
              >
                {n.label}
              </Link>
            ))}
            <a href={`tel:${PHONE}`} className="mt-2 flex items-center gap-2 px-3 py-2.5 bg-navy text-primary-foreground rounded-md text-sm font-semibold">
              <Phone className="h-4 w-4" /> Call {PHONE_DISPLAY}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
