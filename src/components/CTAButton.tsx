import { Link } from "@tanstack/react-router";
import { ArrowRight, Phone } from "lucide-react";

interface CTAButtonProps {
  to?: string;
  href?: string;
  children: React.ReactNode;
  variant?: "gold" | "outline" | "navy";
  external?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export function CTAButton({ to, href, children, variant = "gold", external, icon, className = "" }: CTAButtonProps) {
  const base = "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md font-semibold text-sm transition-all duration-200 hover:scale-[1.02]";
  const styles = {
    gold: "bg-gradient-gold text-navy shadow-gold hover:shadow-premium",
    navy: "bg-navy text-primary-foreground hover:bg-navy/90 shadow-premium",
    outline: "border-2 border-white/80 text-white hover:bg-white hover:text-navy backdrop-blur-sm",
  } as const;
  const cls = `${base} ${styles[variant]} ${className}`;

  if (href) {
    return (
      <a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} className={cls}>
        {icon} {children}
      </a>
    );
  }
  return (
    <Link to={to!} className={cls}>
      {icon} {children} <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

export function CallButton({ phone, label = "Call Now" }: { phone: string; label?: string }) {
  return (
    <a href={`tel:${phone}`} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md font-semibold text-sm bg-white/10 border border-white/30 text-white hover:bg-white/20 backdrop-blur-sm transition">
      <Phone className="h-4 w-4" /> {label}
    </a>
  );
}
