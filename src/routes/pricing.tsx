import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Construction Packages & Pricing — Kalpana Associates Chennai" },
      { name: "description", content: "Transparent per-sqft construction packages: Standard ₹2000, Premium ₹2200, Ultra Luxury ₹2400. Detailed BOQ specifications." },
      { property: "og:title", content: "Construction Packages — Kalpana Associates" },
      { property: "og:description", content: "Standard, Premium and Ultra Luxury packages with full BOQ specs." },
    ],
  }),
  component: PricingPage,
});

type Row = { label: string; values: [string, string, string] };
type Section = { title: string; rows: Row[] };

const sections: Section[] = [
  {
    title: "Structure",
    rows: [
      { label: "Basement Height", values: ["2 ft", "2.5 ft", "3 ft"] },
      { label: "Basement Waterproofing", values: ["Standard coat", "Premium 2 coat", "Crystalline waterproofing"] },
      { label: "Steel", values: ["Arun / Suryadev", "ARS / iSteel", "TATA Steel"] },
      { label: "Bricks (9\" main / 4.5\" partition)", values: ["Chamber bricks", "Wire-cut bricks", "AAC blocks + wire-cut"] },
      { label: "Cement", values: ["Ramco", "Dalmia", "Ultratech"] },
      { label: "M Sand (block work)", values: ["Standard", "Washed", "Premium washed"] },
      { label: "Plastering (12mm ceiling / 15mm walls)", values: ["Standard mix", "Premium mix", "Premium + waterproofing"] },
      { label: "PCC Grade", values: ["M5", "M7.5", "M10"] },
      { label: "Concrete Grade", values: ["M20", "M25", "M25"] },
      { label: "Ceiling Height", values: ["10 ft", "11 ft", "12 ft"] },
      { label: "Parapet Wall", values: ["3 ft brick", "3.5 ft brick + coping", "4 ft RCC + coping"] },
      { label: "RCC Concrete", values: ["Manual mix", "RMC standard", "RMC premium"] },
    ],
  },
  {
    title: "Plumbing",
    rows: [
      { label: "Wall Tiles", values: ["₹50 / sqft", "₹85 / sqft", "₹120 / sqft"] },
      { label: "Bath Fittings", values: ["Parryware", "Jaquar", "Kohler"] },
      { label: "Pipes", values: ["Ashirvad", "Finolex", "Jindal"] },
      { label: "Overhead Tank", values: ["2000 L", "3000 L", "6000 L RCC"] },
    ],
  },
  {
    title: "Flooring",
    rows: [
      { label: "Living & Bedroom Tiles", values: ["Vitrified ₹65", "Vitrified ₹110", "Quartz ₹180"] },
      { label: "Balcony Anti-skid Tiles", values: ["₹45 / sqft", "₹70 / sqft", "₹100 / sqft"] },
      { label: "Staircase", values: ["Granite standard", "Granite premium", "Marble"] },
      { label: "Parking", values: ["Tiles", "Paver blocks", "Granite"] },
      { label: "Terrace Waterproof Flooring", values: ["1 coat", "2 coat APP membrane", "Crystalline + China mosaic"] },
    ],
  },
  {
    title: "Kitchen & Dining",
    rows: [
      { label: "Wall Tiles", values: ["₹50 / sqft", "₹85 / sqft", "₹120 / sqft"] },
      { label: "Sink Faucet", values: ["₹3000", "₹4500", "₹6000"] },
      { label: "Kitchen Sink", values: ["Steel", "Quartz", "Smart sink"] },
      { label: "Dining Wash Basin", values: ["Wall mount", "Counter top", "Designer counter"] },
      { label: "Kitchen Granite", values: ["₹100 / sqft", "₹160 / sqft", "Quartz ₹350 / sqft"] },
    ],
  },
  {
    title: "Doors, Windows & Railing",
    rows: [
      { label: "Main Door", values: ["Malaysian teak", "Ghana teak", "Designer steel door"] },
      { label: "Room Door", values: ["Flush door + laminate", "Membrane door", "Veneer + PU finish"] },
      { label: "Bathroom Door", values: ["PVC", "WPC", "WPC premium"] },
      { label: "Windows", values: ["UPVC standard", "UPVC premium", "Openable toughened glass"] },
      { label: "Railings", values: ["MS painted", "SS304", "SS304 + glass"] },
    ],
  },
  {
    title: "Painting",
    rows: [
      { label: "Wall Putty", values: ["2 coats", "2 coats", "2 coats premium"] },
      { label: "Interior Paint", values: ["Asian Tractor Emulsion", "Asian Premium Emulsion", "Asian Royale"] },
      { label: "Ceiling Paint", values: ["OBD", "Ceiling emulsion", "Premium ceiling emulsion"] },
      { label: "Exterior Paint", values: ["Ace", "Apex", "Apex Ultima"] },
      { label: "Elevation Putty", values: ["2 sides", "3 sides", "4 sides"] },
    ],
  },
  {
    title: "Electrical",
    rows: [
      { label: "Wires", values: ["Kundan", "Finolex", "Havells"] },
      { label: "Switches", values: ["Legrand Britzy", "GM", "Touch glass"] },
      { label: "Bedroom Switch Points", values: ["6 points", "8 points", "10 points + USB"] },
      { label: "Kitchen Switch Points", values: ["6 points", "8 points", "10 points"] },
      { label: "AC Points", values: ["1 point", "2 points", "All bedrooms"] },
      { label: "Panel Board", values: ["Standard MCB", "Havells MCB + RCCB", "Premium MCB + RCCB + SPD"] },
    ],
  },
  {
    title: "What's Not Included",
    rows: [
      { label: "Compound Wall", values: ["₹350 / sqft", "₹350 / sqft", "₹350 / sqft"] },
      { label: "Sump", values: ["₹24 / litre", "₹24 / litre", "₹24 / litre"] },
      { label: "Borewell", values: ["Separate charge", "Separate charge", "Separate charge"] },
      { label: "EB Connection", values: ["Separate charge", "Separate charge", "Separate charge"] },
      { label: "Approvals (CMDA / DTCP)", values: ["Separate charge", "Separate charge", "Separate charge"] },
    ],
  },
  {
    title: "Project Management",
    rows: [
      { label: "Site Visit", values: ["Twice a week", "Twice a week", "Twice a week + dedicated PM"] },
      { label: "CCTV Monitoring", values: ["Optional", "Included", "Included + live feed"] },
      { label: "Architect Support", values: ["Standard", "Premium", "Premium + interior consultation"] },
    ],
  },
  {
    title: "Design",
    rows: [
      { label: "Floor Plan", values: ["Included", "Included + 3D", "Included + 3D walkthrough"] },
      { label: "Structural Drawing", values: ["Included", "Included", "Included"] },
      { label: "Electrical Drawing", values: ["Included", "Included", "Included"] },
      { label: "Plumbing Drawing", values: ["Included", "Included", "Included"] },
    ],
  },
];

const packages = [
  { name: "Standard Package", price: "₹2000", tag: "Best Value" },
  { name: "Premium Package", price: "₹2200", tag: "Most Popular" },
  { name: "Ultra Luxury Package", price: "₹2400", tag: "Top Tier" },
] as const;

function PackageCard({
  pkgIndex,
  openSection,
  onToggle,
}: {
  pkgIndex: 0 | 1 | 2;
  openSection: string | null;
  onToggle: (title: string) => void;
}) {
  const pkg = packages[pkgIndex];
  return (
    <div className="bg-card rounded-2xl border border-border shadow-premium overflow-hidden flex flex-col">
      <div className="bg-gradient-gold p-6 text-navy text-center">
        <div className="text-[10px] font-bold uppercase tracking-[0.25em] opacity-80">{pkg.tag}</div>
        <h3 className="font-display text-2xl font-bold mt-1">{pkg.name}</h3>
        <div className="mt-3 flex items-baseline justify-center gap-1.5">
          <span className="font-display text-5xl font-extrabold">{pkg.price}</span>
          <span className="text-sm font-medium opacity-80">per sqft</span>
        </div>
      </div>

      <div className="p-4 space-y-2 flex-1">
        {sections.map((s) => {
          const open = openSection === s.title;
          return (
            <div
              key={s.title}
              className={`border rounded-lg transition ${open ? "border-gold bg-gold/5" : "border-border"}`}
            >
              <button
                type="button"
                onClick={() => onToggle(s.title)}
                className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-semibold text-navy hover:bg-muted/60 transition rounded-lg"
              >
                <span>{s.title}</span>
                {open ? (
                  <Minus className="h-4 w-4 text-gold" />
                ) : (
                  <Plus className="h-4 w-4 text-gold" />
                )}
              </button>
              <div
                className={`grid transition-all duration-300 ease-in-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
              >
                <div className="overflow-hidden">
                  <ul className="px-4 pb-3 pt-1 divide-y divide-border/60 text-sm">
                    {s.rows.map((r) => (
                      <li
                        key={r.label}
                        className="py-2 flex justify-between gap-3 hover:bg-muted/40 -mx-2 px-2 rounded transition"
                      >
                        <span className="text-muted-foreground">{r.label}</span>
                        <span className="font-medium text-navy text-right">{r.values[pkgIndex]}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-5 border-t border-border">
        <Link
          to="/contact"
          className="block w-full text-center py-3 rounded-lg bg-gradient-gold text-navy font-semibold text-sm shadow-gold hover:opacity-95 transition"
        >
          GET DETAILED SPECIFICATION
        </Link>
      </div>
    </div>
  );
}

function PricingPage() {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const onToggle = (key: string) => setOpenSection((prev) => (prev === key ? null : key));

  return (
    <>
      <section className="bg-gradient-hero text-white py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6 text-center">
          <div className="text-xs font-bold tracking-[0.25em] uppercase text-gold">Transparent Pricing</div>
          <h1 className="font-display text-4xl md:text-6xl font-bold mt-3">
            Construction <span className="text-gradient-gold">Packages</span>
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto mt-4">
            Choose the package that fits your dream. Every detail listed — no hidden charges, no surprises.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <PackageCard key={i} pkgIndex={i as 0 | 1 | 2} openSection={openSection} onToggle={onToggle} />
            ))}
          </div>

          <p className="text-center text-xs text-muted-foreground mt-8">
            * Prices may vary based on site conditions, customizations and current material rates.
          </p>
        </div>
      </section>
    </>
  );
}
