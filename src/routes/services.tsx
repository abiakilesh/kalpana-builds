import { createFileRoute, Link } from "@tanstack/react-router";
import { FileCheck2, Hammer, Home, Wrench, FileText, Banknote } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { CTAButton } from "@/components/CTAButton";
import construction from "@/assets/construction-site.jpg";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Kalpana Associates Construction Chennai" },
      { name: "description", content: "BOQ construction, sq.ft packages, residential & commercial projects, renovation, plan approval, loan assistance." },
    ],
  }),
  component: ServicesPage,
});

const items = [
  { icon: FileCheck2, title: "BOQ Construction", desc: "Item-wise Bill of Quantities with material specs, brand names and quantities. Total transparency from day one — no hidden charges, no surprises." },
  { icon: Hammer, title: "Sq.ft Construction", desc: "Fixed per-sq.ft packages from ₹1,900 to ₹4,500+. Choose Basic, Standard, Premium, or Luxury — each with branded materials and quality assurance." },
  { icon: Home, title: "Residential Projects", desc: "Independent homes, duplex villas and apartment buildings. We handle architecture, structural design, MEP and finishing." },
  { icon: Wrench, title: "Renovation & Remodeling", desc: "Modernize existing homes — from kitchen and bathroom upgrades to full structural remodels and façade improvements." },
  { icon: FileText, title: "Plan Approval", desc: "End-to-end plan approval through CMDA, DTCP and local panchayats. We coordinate documentation, drawings and submissions." },
  { icon: Banknote, title: "Loan Assistance", desc: "Tie-ups with leading banks. We help with documentation, valuation reports and disbursement coordination." },
];

function ServicesPage() {
  return (
    <>
      <section className="relative bg-gradient-hero text-white py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-20"><img src={construction} alt="" className="h-full w-full object-cover" /></div>
        <div className="relative mx-auto max-w-7xl px-4 md:px-6 text-center space-y-4">
          <div className="text-xs font-bold tracking-[0.25em] uppercase text-gold">Our Services</div>
          <h1 className="font-display text-4xl md:text-6xl font-bold">Six Services. <span className="text-gradient-gold">One Promise.</span></h1>
          <p className="text-white/80 max-w-2xl mx-auto">Whether you're building your first home or your tenth project, we deliver with the same standard of transparency.</p>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-2">
            {items.map((s, i) => (
              <div key={s.title} className="bg-card rounded-2xl p-8 border border-border hover:border-gold/40 hover:shadow-premium transition animate-float-in" style={{ animationDelay: `${i * 70}ms` }}>
                <div className="w-14 h-14 rounded-xl bg-gradient-gold flex items-center justify-center mb-5 shadow-gold">
                  <s.icon className="h-7 w-7 text-navy" />
                </div>
                <h3 className="font-display text-2xl font-bold text-navy">{s.title}</h3>
                <p className="text-muted-foreground mt-3 leading-relaxed">{s.desc}</p>
                <Link to="/contact" className="mt-5 inline-block text-sm font-semibold text-royal hover:text-gold">Get a quote →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-navy text-white">
        <div className="mx-auto max-w-4xl px-4 md:px-6 text-center space-y-4">
          <SectionHeader eyebrow="Ready?" title={<>Let's plan your <span className="text-gradient-gold">project</span></>} light />
          <CTAButton to="/contact" variant="gold">Book Free Consultation</CTAButton>
        </div>
      </section>
    </>
  );
}
