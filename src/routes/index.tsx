import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ShieldCheck, Clock, Wallet, Hammer, Award, Banknote, Home, Wrench, FileCheck2, Sofa, Building2, Castle, CheckCircle2 } from "lucide-react";
import { CTAButton, CallButton } from "@/components/CTAButton";
import { SectionHeader } from "@/components/SectionHeader";
import { PHONE, WHATSAPP_GENERAL } from "@/lib/contact";
import heroVilla from "@/assets/hero-villa.jpg";
import construction from "@/assets/construction-site.jpg";
import interior from "@/assets/interior-luxury.jpg";
import blueprint from "@/assets/blueprint-design.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kalpana Associates — Tamil Nadu's First BOQ Construction Company" },
      { name: "description", content: "Premium BOQ-based construction in Chennai. Transparent pricing from ₹1,900/sqft. 20+ years experience. Get free consultation." },
    ],
  }),
  component: HomePage,
});

const services = [
  { icon: FileCheck2, title: "BOQ Based Construction", desc: "Item-wise transparent estimate. Know exactly what you pay for, with no surprises." },
  { icon: Hammer, title: "Sq.ft Packages", desc: "Fixed packages from ₹1,900 to ₹3,500+ per sq.ft to suit every budget and aspiration." },
  { icon: Building2, title: "Joint Venture Projects", desc: "Turn your land into income. We invest, build, and share — you earn passive returns." },
];

const reasons = [
  { icon: Wallet, t: "Transparent Pricing", d: "Detailed BOQ for every project." },
  { icon: Award, t: "Branded Materials", d: "Ultratech, Tata Steel, Asian Paints & more." },
  { icon: Clock, t: "On-Time Delivery", d: "Schedule-bound milestones." },
  { icon: ShieldCheck, t: "Stage-wise Payment", d: "Pay only as we build." },
  { icon: Banknote, t: "Loan Assistance", d: "Tie-ups with leading banks." },
  { icon: CheckCircle2, t: "Zero Hidden Charges", d: "What you see is what you pay." },
];

const works = [
  { icon: Home, title: "New House Construction", img: villaLink(heroVilla) },
  { icon: Wrench, title: "Renovation & Remodeling", img: villaLink(interior) },
  { icon: FileCheck2, title: "Plan Approval & 3D Design", img: villaLink(blueprint) },
  { icon: Sofa, title: "Interior Works", img: villaLink(interior) },
  { icon: Building2, title: "Commercial Construction", img: villaLink(construction) },
  { icon: Castle, title: "Villa Projects", img: villaLink(heroVilla) },
];

function villaLink(s: string) { return s; }

const packages = [
  { name: "Basic", price: "₹1,900 – ₹2,200", features: ["Standard finish", "Branded cement & steel", "Basic electrical & plumbing", "Vitrified tile flooring"] },
  { name: "Standard", price: "₹2,200 – ₹2,600", features: ["Premium tiles", "Modular kitchen base", "Designer false ceiling", "Better fittings"], popular: true },
  { name: "Premium", price: "₹2,600 – ₹3,200", features: ["Italian marble option", "Smart switches", "Designer doors", "Premium sanitaryware"] },
  { name: "Luxury", price: "₹3,200 – ₹4,500+", features: ["Architectural facade", "Home automation", "Imported finishes", "Landscaped exterior"] },
];

const brands = ["Ultratech", "Ramco", "Tata Steel", "JSW", "Astral", "Ashirvad", "Kajaria", "Asian Paints", "Havells"];

const timeline = [
  "Requirement Analysis", "Planning & Design", "BOQ Estimation", "Agreement", "Construction", "Quality Check", "Handover",
];

const testimonials = [
  { name: "Karthik R.", role: "Mangadu Villa Owner", quote: "BOQ based pricing gave us peace of mind. Project completed exactly on schedule." },
  { name: "Lakshmi Priya", role: "Kanchipuram Resident", quote: "Transparent. Premium quality. The team treated my home like their own." },
  { name: "Suresh M.", role: "JV Landowner", quote: "Their joint venture model turned my idle plot into a steady income source." },
];

const faqs = [
  { q: "What is BOQ-based construction?", a: "Bill of Quantities — an item-wise breakdown of every material and labour cost. You see exactly what each component costs before construction begins." },
  { q: "How are payments collected?", a: "Stage-wise. You only release payment as each construction stage is completed and inspected." },
  { q: "Do you handle plan approvals?", a: "Yes — we offer end-to-end plan approval and 3D design as part of our service." },
  { q: "Can I get a home loan through you?", a: "Yes, we have tie-ups with leading banks and assist with the entire loan process." },
];

function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroVilla} alt="Modern luxury villa at sunset" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-hero" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 md:px-6 py-24 md:py-36 text-white">
          <div className="max-w-3xl space-y-6 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/95 text-navy text-xs font-bold uppercase tracking-wider shadow-gold">
              <Award className="h-3.5 w-3.5" /> 20+ Years of Trust
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold leading-[1.05] tracking-tight">
              Tamil Nadu's First <span className="text-gradient-gold">BOQ Based</span> Construction Company
            </h1>
            <p className="text-lg md:text-xl text-white/85 max-w-2xl leading-relaxed">
              100% Transparent · No Hidden Cost · On-Time Delivery
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <CTAButton to="/contact" variant="gold">Get Free Consultation</CTAButton>
              <CallButton phone={PHONE} />
            </div>
            <div className="flex flex-wrap gap-6 pt-6 text-sm text-white/80">
              <div><span className="font-display text-2xl font-bold text-gold">200+</span><br />Projects Delivered</div>
              <div><span className="font-display text-2xl font-bold text-gold">13+</span><br />Years Founder Exp.</div>
              <div><span className="font-display text-2xl font-bold text-gold">100%</span><br />On-Time Handover</div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES OVERVIEW */}
      <section className="py-20 md:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionHeader
            eyebrow="What We Offer"
            title={<>Three Ways to <span className="text-gradient-gold">Build Smarter</span></>}
            description="Choose the model that fits your goals — from item-by-item BOQ pricing to fixed sq.ft packages and revenue-sharing joint ventures."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {services.map((s, i) => (
              <div key={s.title} className="group relative bg-card rounded-2xl p-8 border border-border hover:border-gold/40 transition-all hover:shadow-premium animate-float-in" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="w-14 h-14 rounded-xl bg-gradient-gold flex items-center justify-center mb-5 shadow-gold">
                  <s.icon className="h-7 w-7 text-navy" />
                </div>
                <h3 className="font-display text-xl font-bold text-navy mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="py-20 md:py-28 bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionHeader
            eyebrow="Why Choose Us"
            title={<>Built on <span className="text-gradient-gold">Trust & Transparency</span></>}
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {reasons.map((r, i) => (
              <div key={r.t} className="flex gap-4 p-6 bg-card rounded-xl border border-border animate-float-in" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-navy/5 flex items-center justify-center">
                  <r.icon className="h-6 w-6 text-royal" />
                </div>
                <div>
                  <h4 className="font-semibold text-navy">{r.t}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{r.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionHeader eyebrow="What We Do" title={<>End-to-End <span className="text-gradient-gold">Construction Services</span></>} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {works.map((w, i) => (
              <div key={w.title} className="group relative overflow-hidden rounded-2xl bg-card border border-border hover:shadow-premium transition-all animate-float-in" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={w.img} alt={w.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="p-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-gold flex items-center justify-center">
                    <w.icon className="h-5 w-5 text-navy" />
                  </div>
                  <h4 className="font-display text-lg font-bold text-navy">{w.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* JV HIGHLIGHT */}
      <section className="py-20 md:py-28 bg-navy text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <img src={construction} alt="" className="h-full w-full object-cover" loading="lazy" />
        </div>
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="relative mx-auto max-w-5xl px-4 md:px-6 text-center space-y-6">
          <div className="inline-block text-xs font-bold tracking-[0.25em] uppercase text-gold">Joint Venture</div>
          <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight">
            Turn Your Land Into <span className="text-gradient-gold">Steady Income</span>
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Own a plot in Chennai, Kanchipuram, or surroundings? Partner with us. We build, manage and share — you keep ownership and earn passive returns.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <CTAButton to="/joint-venture" variant="gold">Discuss Your Land Today</CTAButton>
            <CallButton phone={PHONE} />
          </div>
        </div>
      </section>

      {/* PACKAGES */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionHeader
            eyebrow="Construction Packages"
            title={<>Pricing for <span className="text-gradient-gold">Every Aspiration</span></>}
            description="Per sq.ft pricing. All packages include branded materials, supervision, and quality assurance."
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {packages.map((p, i) => (
              <div key={p.name} className={`relative rounded-2xl p-7 border-2 transition-all animate-float-in ${p.popular ? "bg-gradient-hero text-white border-gold shadow-premium scale-[1.03]" : "bg-card border-border hover:border-gold/40"}`} style={{ animationDelay: `${i * 70}ms` }}>
                {p.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-gold text-navy text-[10px] font-bold uppercase tracking-wider shadow-gold">Most Popular</div>
                )}
                <h3 className={`font-display text-xl font-bold ${p.popular ? "text-gold" : "text-navy"}`}>{p.name}</h3>
                <div className={`mt-3 font-display text-2xl font-bold ${p.popular ? "text-white" : "text-navy"}`}>{p.price}</div>
                <div className={`text-xs mt-1 ${p.popular ? "text-white/70" : "text-muted-foreground"}`}>per sq.ft</div>
                <ul className="mt-5 space-y-2.5">
                  {p.features.map((f) => (
                    <li key={f} className={`flex gap-2 text-sm ${p.popular ? "text-white/85" : "text-foreground/80"}`}>
                      <CheckCircle2 className={`h-4 w-4 flex-shrink-0 mt-0.5 ${p.popular ? "text-gold" : "text-royal"}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/contact" className={`mt-6 block w-full text-center py-2.5 rounded-md text-sm font-semibold transition ${p.popular ? "bg-gradient-gold text-navy shadow-gold" : "bg-navy text-primary-foreground hover:bg-navy/90"}`}>
                  Get Quote
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MATERIALS */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionHeader eyebrow="Trusted Materials" title={<>Only <span className="text-gradient-gold">Branded</span>, ISI-Marked Materials</>} />
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
            {brands.map((b) => (
              <div key={b} className="px-5 py-3 rounded-full bg-card border border-border text-sm font-semibold text-navy hover:border-gold/40 hover:shadow-gold transition">
                {b}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS TIMELINE */}
      <section className="py-20 md:py-28 bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionHeader eyebrow="Our Process" title={<>Seven Steps to Your <span className="text-gradient-gold">Dream Home</span></>} />
          <div className="relative">
            <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent" />
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
              {timeline.map((step, i) => (
                <div key={step} className="relative text-center animate-float-in" style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="relative mx-auto w-16 h-16 rounded-full bg-gradient-gold flex items-center justify-center font-display text-xl font-bold text-navy shadow-gold">
                    {i + 1}
                  </div>
                  <div className="mt-3 text-sm font-semibold text-navy">{step}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 md:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionHeader eyebrow="Client Voices" title={<>What Our <span className="text-gradient-gold">Homeowners Say</span></>} />
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <div key={t.name} className="bg-card rounded-2xl p-7 border border-border shadow-sm animate-float-in" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="text-gold text-2xl mb-3">★★★★★</div>
                <p className="text-foreground/85 leading-relaxed italic">"{t.quote}"</p>
                <div className="mt-5 pt-4 border-t border-border">
                  <div className="font-semibold text-navy">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <SectionHeader eyebrow="FAQ" title={<>Common <span className="text-gradient-gold">Questions</span></>} />
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <details key={f.q} className="group rounded-xl bg-card border border-border p-5 cursor-pointer animate-float-in" style={{ animationDelay: `${i * 60}ms` }}>
                <summary className="font-semibold text-navy flex justify-between items-center list-none">
                  {f.q}
                  <span className="text-gold text-xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 md:py-24 bg-gradient-hero text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src={interior} alt="" className="h-full w-full object-cover" loading="lazy" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 md:px-6 text-center space-y-5">
          <h2 className="font-display text-3xl md:text-5xl font-bold">Book Your <span className="text-gradient-gold">Free Consultation</span> Today</h2>
          <p className="text-white/85 max-w-2xl mx-auto">No obligations. We'll visit your site, understand your vision, and prepare a transparent BOQ.</p>
          <div className="flex flex-wrap justify-center gap-3 pt-3">
            <CTAButton href={`tel:${PHONE}`} variant="gold">Call Now</CTAButton>
            <CTAButton href={WHATSAPP_GENERAL} external variant="outline">WhatsApp Now</CTAButton>
          </div>
        </div>
      </section>
    </>
  );
}
