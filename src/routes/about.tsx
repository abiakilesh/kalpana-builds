import { createFileRoute } from "@tanstack/react-router";
import { GraduationCap, Award, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import founderImg from "@/assets/founder.jpg";
import { SectionHeader } from "@/components/SectionHeader";
import { CTAButton } from "@/components/CTAButton";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Founder Aravindhan — Kalpana Associates Construction" },
      { name: "description", content: "Meet Aravindhan (B.E Civil), founder of Kalpana Associates with 13+ years of construction experience and a mission of transparent building." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const [founder, setFounder] = useState<string>(founderImg);

  useEffect(() => {
    supabase.from("site_settings").select("value").eq("key", "founder_image").maybeSingle().then(({ data }) => {
      if (data?.value) setFounder(data.value);
    });
  }, []);

  return (
    <>
      <section className="relative bg-gradient-hero text-white py-20 md:py-28">
        <div className="relative mx-auto max-w-7xl px-4 md:px-6 text-center">
          <div className="text-xs font-bold tracking-[0.25em] uppercase text-gold">About Us</div>
          <h1 className="font-display text-4xl md:text-6xl font-bold mt-3">Built on <span className="text-gradient-gold">Vision & Integrity</span></h1>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-gold rounded-2xl opacity-20 blur-2xl" />
            <div className="relative rounded-2xl overflow-hidden shadow-premium">
              <img
                src={founder}
                alt="Aravindhan, Founder"
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  if (e.currentTarget.src !== founderImg) e.currentTarget.src = founderImg;
                }}
              />
            </div>
            <div className="absolute -bottom-5 -right-5 bg-gradient-gold rounded-xl px-5 py-3 shadow-gold">
              <div className="text-navy font-display text-2xl font-bold leading-tight">13+ Years</div>
              <div className="text-navy/80 text-xs uppercase tracking-wider">Of Experience</div>
            </div>
          </div>
          <div>
            <div className="text-xs font-bold tracking-[0.25em] uppercase text-royal mb-3">Our Founder</div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-navy leading-tight">Aravindhan <span className="text-gradient-gold">B.E Civil</span></h2>
            <p className="mt-5 text-foreground/85 leading-relaxed">
              Aravindhan founded Kalpana Associates with a single conviction: construction in Tamil Nadu deserves to be transparent. Frustrated by hidden margins and unclear pricing across the industry, he pioneered a BOQ-based approach that gives every homeowner clarity over each rupee spent.
            </p>
            <p className="mt-3 text-foreground/85 leading-relaxed">
              With over 13 years of on-site experience and a degree in Civil Engineering, he leads a team that has delivered 200+ residential, commercial and joint-venture projects across Chennai, Kanchipuram and Mangadu.
            </p>
            <div className="mt-7 grid sm:grid-cols-3 gap-4">
              {[
                { icon: GraduationCap, t: "B.E Civil" },
                { icon: Award, t: "13+ Years Exp" },
                { icon: Heart, t: "200+ Projects" },
              ].map((b) => (
                <div key={b.t} className="bg-card border border-border rounded-xl p-4 text-center">
                  <b.icon className="h-6 w-6 text-gold mx-auto mb-1.5" />
                  <div className="text-sm font-semibold text-navy">{b.t}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/40">
        <div className="mx-auto max-w-4xl px-4 md:px-6 text-center">
          <SectionHeader eyebrow="Our Mission" title={<>Transparent. Affordable. <span className="text-gradient-gold">Reliable.</span></>}
            description="To redefine residential construction in Tamil Nadu with honest pricing, branded materials, on-time delivery — and a process every customer can trust."
          />
          <CTAButton to="/contact" variant="navy">Start Your Project</CTAButton>
        </div>
      </section>
    </>
  );
}
