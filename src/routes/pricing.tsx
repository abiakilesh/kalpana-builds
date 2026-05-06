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
      { label: "Basement Height", values: ["Upto 3' Feet height", "Upto 3.5' Feet height", "Upto 5' Feet height"] },
      { label: "Basement Waterproofing", values: ["Complete Basement", "Complete Basement", "Complete Basement"] },
      { label: "Steel", values: ["Arun / Suryadev / Kamatchi", "ARS / iSteel or Equivalent", "TATA Steel"] },
      { label: "Bricks", values: ["Red Brick 9\" Thickness for main walls & 4.5\" thick inner partition walls", "Red Brick 9\" Thickness for main walls & 4.5\" thick inner partition walls", "Red Brick 9\" Thickness for main walls & 4.5\" thick inner partition walls"] },
      { label: "Cement", values: ["Ramco / Dalmia", "Ramco / Dalmia / Ultratech", "Ramco / Dalmia / Ultratech"] },
      { label: "M Sand", values: ["Block Work & All masonry works", "Block Work & All masonry works", "Block Work & All masonry works"] },
      { label: "Plastering", values: ["P Sand or Gypsum Plastering — Ceiling 12mm & Walls 15mm", "P Sand or Gypsum Plastering — Ceiling 12mm & Walls 15mm", "P Sand or Gypsum Plastering — Ceiling 12mm & Walls 15mm"] },
      { label: "PCC Grade", values: ["M5 — 1:5:10 — 4\" For Footing & 6\" For Flooring", "M7.5 — 1:4:8 — 4\" For Footing", "M10 — 1:3:6 — 4\" For Footing"] },
      { label: "Concrete Grade", values: ["M20 — 1:1.5:3", "M20 — 1:1.5:3", "M25 Grade"] },
      { label: "Ceiling Height", values: ["10' Roof Top", "11' FFL to FFL", "12' FFL to FFL"] },
      { label: "Parapet Wall", values: ["3' Height 4.5\" Thickness", "3' Height 9\" Thickness", "3' Height 9\" Thickness or Toughened Glass if required"] },
      { label: "Antitermite", values: ["Basement", "Basement", "Basement"] },
      { label: "RCC Concrete", values: ["Not Available", "For Base Slab — M20 Grade with 4\" Thickness", "For Base Slab — M20 Grade with 6\" Thickness"] },
    ],
  },
  {
    title: "Plumbing",
    rows: [
      { label: "Wall Tiles", values: ["Upto Ceiling Full Height — 2'x2' Vitrified Tile Upto Rs.50 Per Sq.ft", "Upto Ceiling Full Height — 2'x2' Vitrified Tile Upto Rs.85 Per Sq.ft", "Upto Ceiling Full Height — 2'x2' Vitrified Tile Upto Rs.120 Per Sq.ft"] },
      { label: "Bath Fittings", values: ["Parryware | Upto Rs.20,000 Per Bathroom | Wall Mounted EWC, Wall Mounted Wash Basin, Pillar Tap, Health Faucet, Shower Set, 2 in 1 Wall Mixer", "Jaquar | Upto Rs.30,000 Per Bathroom | Wall Mounted EWC, Wall Mounted Wash Basin, Pillar Tap, Health Faucet, Shower Set, 2 in 1 Wall Mixer", "Kohler | Upto Rs.60,000 Per Bathroom | Wall Mounted EWC, Wall Mounted Wash Basin, Pillar Tap, Health Faucet, Shower Set, 2 in 1 Wall Mixer"] },
      { label: "Pipes", values: ["Inner CPVC Concealed & Outer Pipe PVC | Brand: Ashirvad", "Inner CPVC Concealed & Outer Pipe PVC | Brand: Ashirvad / Finolex", "Inner CPVC Concealed & Outer Pipe PVC | Brand: Ashirvad / Finolex / Jindal"] },
      { label: "Overhead Tank", values: ["2000 Litres Ultratech | 3 Layered | UV Protected | White Colour | With Sensor", "3000 Litres Sintex | UV Protected | White Colour | With Sensor", "RCC Overhead Tank 6000 Litres With Waterproofing"] },
    ],
  },
  {
    title: "Flooring",
    rows: [
      { label: "Living & Bedroom Tiles", values: ["4'x2' | Vitrified Tile upto Rs.50 Per Sq.ft | KAG / Sunheat", "4'x2' | Vitrified Tile upto Rs.50 Per Sq.ft | KAG / Kajaria / Sunheat", "6'x6' | Quartz Tiles Upto Rs.150 Per Sq.ft"] },
      { label: "Balcony Anti-skid Tiles", values: ["2'x2' | Antiskid Upto Rs.40 Per Sq.ft", "2'x2' | Antiskid Upto Rs.60 Per Sq.ft", "2'x2' | Antiskid Upto Rs.80 Per Sq.ft"] },
      { label: "Staircase", values: ["Granite Upto Rs.80 Per Sq.ft", "Granite Upto Rs.120 Per Sq.ft", "Marble Upto Rs.200 Per Sq.ft"] },
      { label: "Parking", values: ["1'x1' | Heavy Duty Tile Upto Rs.45 Per Sq.ft", "Heavy Stone Paver Block Upto Rs.80 Per Sq.ft", "Granite Upto Rs.120 Per Sq.ft"] },
      { label: "Terrace Waterproof Flooring", values: ["Screed Concrete With Waterproofing & Normal Weathering Tile — 1'x1'", "Screed Concrete With Waterproofing | White Cooling Tiles | 1'x1' | Brand: Anuj", "Screed Concrete With Waterproofing | Exterior Grade Vitrified | 2'x2'"] },
    ],
  },
  {
    title: "Kitchen & Dining",
    rows: [
      { label: "Wall Tiles", values: ["2'x2' | Vitrified Tiles Upto Rs.55 Per Sq.ft", "2'x2' | Vitrified Tiles Upto Rs.80 Per Sq.ft", "2'x2' | Vitrified Tiles Upto Rs.120 Per Sq.ft"] },
      { label: "Sink Faucet", values: ["Upto Rs.3,000 Per Nos", "Upto Rs.4,500 Per Nos", "Upto Rs.6,000 Per Nos"] },
      { label: "Kitchen Sink", values: ["Stainless Steel Sink Upto Rs.5,000", "Quartz Sink Upto Rs.7,000", "Multifunction Smart Sink Upto Rs.15,000"] },
      { label: "Dining Wash Basin", values: ["Wall Mounted Wash Basin", "Wash Basin With Granite Counter Top", "Premium Designer Collection Wash Basin With Marble Counter"] },
      { label: "Kitchen Granite", values: ["Upto Rs.100 Per Sq.ft", "Upto Rs.160 Per Sq.ft", "Quartz Stone Upto Rs.350 Per Sq.ft"] },
    ],
  },
  {
    title: "Doors, Windows & Railing",
    rows: [
      { label: "Main Door", values: ["Malaysian Teak Door & Teak Frame — Ready Made | 32mm Thickness | 5\"x3\" Frame | 7'H x 3.5'W | Including Lock — Upto Rs.25,000", "Ghana Teak Door & Teak Frame — Ready Made | 35mm Thickness | 5\"x3\" Frame | 8'H x 4'W | Including Lock — Upto Rs.40,000", "Designer Wood Door 8'x5' (or) Security Steel Door 8'x4.5' Pure Stainless Steel With Digital Lock"] },
      { label: "Room Door", values: ["Flush Door | Mahogany Wood Frame | 7'x2.5' + Flush Door With Laminate | Ghana Wood Frame | 7'x3'", "Flush Door With Laminate | Ghana Wood Frame | 7'x3'", "Flush Door With Laminate | Ghana Wood Frame | 8'x3.5'"] },
      { label: "Bathroom Door", values: ["WPC Door & Frame 7'x2.5'", "WPC Door & Frame 7'x2.5'", "Waterproof Flush Door | 8'x3'"] },
      { label: "Windows", values: ["UPVC Sliding Window | Max 5'x5' | One Per Room | 5mm Glass", "UPVC Sliding Window | No Size/Quantity Restriction | 5mm Clear Glass", "Openable Window | No Size/Quantity Restriction | Toughened Glass"] },
      { label: "Staircase Railing", values: ["SS304 Grade Railing", "SS304 Grade Railing", "SS304 Grade Railing With Toughened Glass"] },
      { label: "Balcony Railing", values: ["SS304 Grade Railing with 8mm Toughened Glass", "SS304 Grade Railing with 10mm Toughened Glass", "10mm Full Toughened Glass With Aluminium Railing"] },
    ],
  },
  {
    title: "Painting",
    rows: [
      { label: "Wall Putty", values: ["2 Coats Of Wall Putty | Asian Paints", "2 Coats Of Wall Putty | Asian Paints", "2 Coats Of Wall Putty | Asian Paints"] },
      { label: "Interior Paint", values: ["1 Coat Primer | 2 Coats Emulsion | Asian Paints", "1 Coat Primer | 2 Coats Premium Emulsion | Asian Paints", "1 Coat Primer | 2 Coats Royal Shyne | Asian Paints"] },
      { label: "Ceiling Paint", values: ["1 Coat Primer | 2 Coats Emulsion | Asian Paints", "1 Coat Primer | 2 Coats Premium Emulsion | Asian Paints", "1 Coat Primer | 2 Coats Royal Shyne | Asian Paints"] },
      { label: "Exterior Paint", values: ["1 Coat Primer | 2 Coats Apex | Asian Paints", "1 Coat Primer | 2 Coats Apex Ultima | Asian Paints", "1 Coat Primer | 2 Coats Apex Ultima Protek | Asian Paints"] },
      { label: "Elevation Putty", values: ["2 Coats Putty For Elevation | Birla Wallseal Waterproof", "2 Coats Putty For 2 Sides Of Elevation | Birla Wallseal Waterproof", "2 Coats Putty For 4 Sides Of Elevation | Birla Wallseal Waterproof"] },
    ],
  },
  {
    title: "Electrical",
    rows: [
      { label: "Wires", values: ["Kundan / Orbit", "Finolex / Havells (FRLS)", "Finolex / Havells (FRLS)"] },
      { label: "Switches", values: ["Legrand / Schneider", "GM", "Touch Switch With Glass Plates"] },
      { label: "Bed Room 1", values: ["3 Switch Box (8 Module) — Entrance, Bedside & Television", "4 Switch Box (8 Module) — Entrance, Bedside, Television & Client Option", "Required Power Points Will Be Provided As Per Client Customization"] },
      { label: "Bed Room 2", values: ["3 Switch Box (8 Module) — Entrance, Bedside & Television", "4 Switch Box (8 Module) — Entrance, Bedside, Television & Client Option", "Required Power Points Will Be Provided As Per Client Customization"] },
      { label: "Bathroom", values: ["1 Switch Box Outer (4 Module) — Heater & Exhaust", "1 Switch Box Outer (4 Module) — Heater & Exhaust", "Required Power Points Will Be Provided As Per Client Customization"] },
      { label: "Living Room", values: ["Upto 4 Switch Box (8 Module)", "Upto 5 Switch Box (8 Module)", "Required Power Points Will Be Provided As Per Client Customization"] },
      { label: "Dining", values: ["1 Switch Box (8 Module)", "1 Switch Box (8 Module)", "Required Power Points Will Be Provided As Per Client Customization"] },
      { label: "Pooja", values: ["1 Switch Box (3 Module)", "2 Switch Box (3 Module)", "Required Power Points Will Be Provided As Per Client Customization"] },
      { label: "Kitchen", values: ["3 Switch Box (6 Module) — Microwave Oven, Chimney & RO", "5 Switch Box (6 Module) — Microwave Oven, Chimney, RO & Two Client Options", "Required Power Points Will Be Provided As Per Client Customization"] },
      { label: "Utility", values: ["1 Switch Box (4 Module)", "2 Switch Box (4 Module)", "Required Power Points Will Be Provided As Per Client Customization"] },
      { label: "Entrance", values: ["1 Switch Box (6 Module)", "1 Switch Box (6 Module)", "Required Power Points Will Be Provided As Per Client Customization"] },
      { label: "Balcony", values: ["1 Switch Box (3 Module)", "1 Switch Box (3 Module)", "Required Power Points Will Be Provided As Per Client Customization"] },
      { label: "AC Points", values: ["1 For Each Bedroom & 1 For Living Room", "1 For Each Bedroom & 1 For Living Room", "Required Power Points Will Be Provided As Per Client Customization"] },
      { label: "Electricity Panel Board", values: ["Single Service With RLCB Exterior Grade", "Two Service With RLCB Exterior Grade", "Three Service With RLCB Exterior Grade"] },
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
