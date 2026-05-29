import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import villa1 from "@/assets/villa-1.jpg";
import villa2 from "@/assets/villa-2.jpg";
import commercial1 from "@/assets/commercial-1.jpg";
import interior from "@/assets/interior-luxury.jpg";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Project Gallery — Kalpana Associates Construction" },
      { name: "description", content: "Browse completed villas, residences, commercial projects and interiors by Kalpana Associates Chennai." },
    ],
  }),
  component: GalleryPage,
});

const fallbackImages = [
  { id: "f1", image_url: villa1, title: "Modern Villa — Mangadu" },
  { id: "f2", image_url: villa2, title: "Duplex Home — Kanchipuram" },
  { id: "f3", image_url: commercial1, title: "Commercial Block — Chennai" },
  { id: "f4", image_url: interior, title: "Premium Interior" },
  { id: "f5", image_url: villa1, title: "Independent Villa" },
  { id: "f6", image_url: villa2, title: "Garden Residence" },
];

interface Img { id: string; image_url: string; title: string | null; category?: string | null }

function GalleryPage() {

  const [images, setImages] = useState<Img[]>([]);
  const [active, setActive] = useState<Img | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      supabase
        .from("gallery_images")
        .select("id, image_url, title, category")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false })
        .then(({ data }) => {
          if (cancelled) return;
          const t = Date.now();
          const withBust = (data && data.length ? data : (fallbackImages as Img[])).map((img) => ({
            ...img,
            image_url: img.image_url.startsWith("http")
              ? `${img.image_url}${img.image_url.includes("?") ? "&" : "?"}t=${t}`
              : img.image_url,
          }));
          setImages(withBust);
          setLoading(false);
        });
    };
    load();

    const channel = supabase
      .channel("gallery_images_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "gallery_images" }, () => load())
      .subscribe();

    const onFocus = () => load();
    window.addEventListener("focus", onFocus);

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  return (
    <>
      <section className="bg-gradient-hero text-white py-20 md:py-24 text-center">
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <div className="text-xs font-bold tracking-[0.25em] uppercase text-gold">Our Work</div>
          <h1 className="font-display text-4xl md:text-6xl font-bold mt-3">Project <span className="text-gradient-gold">Gallery</span></h1>
          <p className="text-white/80 mt-3">A glimpse of homes and commercial spaces we've delivered across Tamil Nadu.</p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActive(img)}
                  className="group relative overflow-hidden rounded-xl bg-card border border-border aspect-[4/3] animate-float-in"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <img src={img.image_url} alt={img.title ?? "Project"} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  {img.category && (
                    <span className="absolute top-3 left-3 inline-flex items-center px-2 py-0.5 rounded-full bg-gold/95 text-navy text-[10px] font-bold uppercase tracking-wider">
                      {img.category}
                    </span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5">
                    <div className="text-white font-display text-lg font-bold">{img.title ?? "Project"}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {active && (
        <div onClick={() => setActive(null)} className="fixed inset-0 z-[70] bg-navy/90 backdrop-blur-md flex items-center justify-center p-4 animate-float-in">
          <button className="absolute top-4 right-4 p-2 text-white/80 hover:text-white" onClick={() => setActive(null)}>
            <X className="h-6 w-6" />
          </button>
          <img src={active.image_url} alt={active.title ?? "Project"} className="max-w-full max-h-full rounded-xl shadow-premium" />
        </div>
      )}
    </>
  );
}
