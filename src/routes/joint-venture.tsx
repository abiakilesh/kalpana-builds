import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, MapPin, Ruler, TrendingUp, Handshake } from "lucide-react";
import { CTAButton } from "@/components/CTAButton";
import { SectionHeader } from "@/components/SectionHeader";
import villa1 from "@/assets/villa-1.jpg";

export const Route = createFileRoute("/joint-venture")({
  head: () => ({
    meta: [
      { title: "Joint Venture — Turn Your Land Into Income | Kalpana Associates" },
      { name: "description", content: "Joint venture construction in Chennai. We build, you earn. 1–5 grounds land partnerships with transparent revenue sharing." },
    ],
  }),
  component: JVPage,
});

const benefits = [
  { icon: TrendingUp, t: "Passive Income", d: "Earn rental returns or sales share without investing capital." },
  { icon: Handshake, t: "We Invest, You Own", d: "We fund construction; you retain land ownership and your share of the built area." },
  { icon: CheckCircle2, t: "Transparent Agreements", d: "Registered JV agreement with clear ratios, timelines and milestones." },
  { icon: Ruler, t: "Architect-Designed", d: "High-rental-yield layouts designed to maximize value on your land." },
];

function JVPage() {
  return (
    <>
      <section className="relative bg-gradient-hero text-white py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-25"><img src={villa1} alt="" className="h-full w-full object-cover" /></div>
        <div className="relative mx-auto max-w-7xl px-4 md:px-6 text-center space-y-4">
          <div className="text-xs font-bold tracking-[0.25em] uppercase text-gold">Joint Venture</div>
          <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight">Turn Your Land Into <span className="text-gradient-gold">Steady Income</span></h1>
          <p className="text-white/85 max-w-2xl mx-auto">Own land between 1 and 5 grounds in Chennai or surrounding areas? Partner with us — we'll build, you'll earn.</p>
          <div className="pt-2"><CTAButton to="/contact" variant="gold">Partner With Us</CTAButton></div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-6 grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <SectionHeader eyebrow="The JV Model" centered={false} title={<>How it <span className="text-gradient-gold">works</span></>} description="A simple, transparent partnership model that protects landowner interests." />
            <ol className="space-y-4">
              {[
                "You bring the land — we evaluate location, dimensions and feasibility.",
                "We design a high-yield project (apartments / villas / commercial).",
                "We fund 100% of construction, approvals and marketing.",
                "Sale proceeds or rental returns split per the agreed ratio.",
                "Registered legal agreement protects both parties.",
              ].map((step, i) => (
                <li key={step} className="flex gap-4 animate-float-in" style={{ animationDelay: `${i * 70}ms` }}>
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-gold flex items-center justify-center font-bold text-navy text-sm shadow-gold">{i + 1}</div>
                  <p className="text-foreground/85 pt-1">{step}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-premium">
            <img src={villa1} alt="JV villa project" className="w-full h-full object-cover" loading="lazy" />
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionHeader eyebrow="Why Partner" title={<>Benefits for <span className="text-gradient-gold">Landowners</span></>} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b, i) => (
              <div key={b.t} className="bg-card p-6 rounded-xl border border-border animate-float-in" style={{ animationDelay: `${i * 70}ms` }}>
                <div className="w-12 h-12 rounded-lg bg-navy/5 flex items-center justify-center mb-4">
                  <b.icon className="h-6 w-6 text-royal" />
                </div>
                <h4 className="font-semibold text-navy">{b.t}</h4>
                <p className="text-sm text-muted-foreground mt-1.5">{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <SectionHeader eyebrow="Eligibility" title={<>Land <span className="text-gradient-gold">Requirements</span></>} />
          <div className="bg-card border border-border rounded-2xl p-8 space-y-3">
            <div className="flex gap-3"><MapPin className="h-5 w-5 text-gold mt-0.5" /><div><strong className="text-navy">Locations:</strong> Chennai, Kanchipuram, Mangadu and surrounding regions</div></div>
            <div className="flex gap-3"><Ruler className="h-5 w-5 text-gold mt-0.5" /><div><strong className="text-navy">Land size:</strong> 1 to 5 grounds (≈ 2,400 – 12,000 sq.ft)</div></div>
            <div className="flex gap-3"><CheckCircle2 className="h-5 w-5 text-gold mt-0.5" /><div><strong className="text-navy">Title:</strong> Clear, marketable title with no encumbrance</div></div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-navy text-white">
        <div className="mx-auto max-w-4xl px-4 md:px-6 text-center space-y-4">
          <h2 className="font-display text-3xl md:text-4xl font-bold">Ready to <span className="text-gradient-gold">discuss your land?</span></h2>
          <CTAButton to="/contact" variant="gold">Partner With Us</CTAButton>
        </div>
      </section>
    </>
  );
}
