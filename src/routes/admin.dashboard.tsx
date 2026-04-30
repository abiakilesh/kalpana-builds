import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LogOut, Search, Trash2, Download, CheckCircle2, Image as ImageIcon, Users, Upload, X, Pencil, UserCircle2 } from "lucide-react";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({ meta: [{ title: "Admin Dashboard — Kalpana Associates" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: Dashboard,
});

interface Lead {
  id: string;
  name: string;
  phone: string;
  location: string | null;
  requirement: string;
  message: string | null;
  source: string | null;
  contacted: boolean;
  created_at: string;
}

interface GalleryRow { id: string; image_url: string; storage_path: string | null; title: string | null }

function Dashboard() {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [tab, setTab] = useState<"leads" | "gallery" | "founder">("leads");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [gallery, setGallery] = useState<GalleryRow[]>([]);
  const [founderUrl, setFounderUrl] = useState<string>("");
  const [founderPath, setFounderPath] = useState<string>("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "new" | "contacted">("all");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { navigate({ to: "/admin" }); return; }
      setAuthChecked(true);
      loadAll();
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate({ to: "/admin" });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const loadAll = async () => {
    const [{ data: l }, { data: g }, { data: s }] = await Promise.all([
      supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(1000),
      supabase.from("gallery_images").select("*").order("created_at", { ascending: false }).limit(500),
      supabase.from("site_settings").select("*").eq("key", "founder_image").maybeSingle(),
    ]);
    if (l) setLeads(l as Lead[]);
    if (g) setGallery(g as GalleryRow[]);
    if (s?.value) {
      setFounderUrl(s.value);
      // try to derive storage path from public URL
      const m = s.value.match(/\/gallery\/(.+)$/);
      setFounderPath(m ? m[1] : "");
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin" });
  };

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      if (filter === "new" && l.contacted) return false;
      if (filter === "contacted" && !l.contacted) return false;
      const q = search.trim().toLowerCase();
      if (!q) return true;
      return [l.name, l.phone, l.location, l.requirement].filter(Boolean).some((v) => v!.toLowerCase().includes(q));
    });
  }, [leads, search, filter]);

  const exportCSV = () => {
    const rows = [
      ["Name", "Phone", "Location", "Requirement", "Source", "Contacted", "Date"],
      ...filtered.map((l) => [
        l.name, l.phone, l.location ?? "", l.requirement, l.source ?? "", l.contacted ? "Yes" : "No",
        new Date(l.created_at).toLocaleString(),
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleContacted = async (l: Lead) => {
    const { error } = await supabase.from("leads").update({ contacted: !l.contacted }).eq("id", l.id);
    if (error) return toast.error(error.message);
    setLeads((prev) => prev.map((x) => x.id === l.id ? { ...x, contacted: !l.contacted } : x));
  };

  const deleteLead = async (id: string) => {
    if (!confirm("Delete this lead?")) return;
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setLeads((prev) => prev.filter((x) => x.id !== id));
    toast.success("Lead deleted");
  };

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const t = toast.loading(`Uploading ${files.length} image(s)…`);
    for (const file of files) {
      const ext = file.name.split(".").pop();
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("gallery").upload(path, file, { upsert: false });
      if (upErr) { toast.error(upErr.message); continue; }
      const { data: pub } = supabase.storage.from("gallery").getPublicUrl(path);
      const { error: insErr } = await supabase.from("gallery_images").insert({
        image_url: pub.publicUrl, storage_path: path, title: file.name.replace(/\.[^.]+$/, ""),
      });
      if (insErr) toast.error(insErr.message);
    }
    toast.dismiss(t);
    toast.success("Upload complete");
    e.target.value = "";
    loadAll();
  };

  const deleteImage = async (img: GalleryRow) => {
    if (!confirm("Delete this image?")) return;
    if (img.storage_path) await supabase.storage.from("gallery").remove([img.storage_path]);
    const { error } = await supabase.from("gallery_images").delete().eq("id", img.id);
    if (error) return toast.error(error.message);
    setGallery((prev) => prev.filter((x) => x.id !== img.id));
    toast.success("Image deleted");
  };

  if (!authChecked) return <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground">Loading…</div>;

  return (
    <section className="min-h-screen bg-muted/30 py-8">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-navy">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage leads & project gallery</p>
          </div>
          <button onClick={logout} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-navy text-primary-foreground text-sm font-medium hover:bg-navy/90">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-card rounded-xl p-4 border border-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-gold flex items-center justify-center"><Users className="h-5 w-5 text-navy" /></div>
            <div>
              <div className="text-2xl font-bold text-navy">{leads.length}</div>
              <div className="text-xs text-muted-foreground">Total leads</div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-royal/10 flex items-center justify-center"><ImageIcon className="h-5 w-5 text-royal" /></div>
            <div>
              <div className="text-2xl font-bold text-navy">{gallery.length}</div>
              <div className="text-xs text-muted-foreground">Gallery images</div>
            </div>
          </div>
        </div>

        <div className="flex gap-1 mb-4 bg-card border border-border rounded-lg p-1 w-fit">
          {(["leads", "gallery"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize ${tab === t ? "bg-navy text-primary-foreground" : "text-foreground/70 hover:bg-muted"}`}>{t}</button>
          ))}
        </div>

        {tab === "leads" && (
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="p-4 flex flex-wrap gap-2 items-center justify-between border-b border-border">
              <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, phone, location…" className="flex-1 bg-transparent text-sm focus:outline-none" />
              </div>
              <div className="flex gap-1">
                {(["all", "new", "contacted"] as const).map((f) => (
                  <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize ${filter === f ? "bg-navy text-primary-foreground" : "bg-muted text-foreground/70 hover:bg-muted/70"}`}>{f}</button>
                ))}
              </div>
              <button onClick={exportCSV} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-gradient-gold text-navy text-xs font-semibold shadow-gold">
                <Download className="h-3.5 w-3.5" /> Export CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="text-left px-4 py-3">Name</th>
                    <th className="text-left px-4 py-3">Phone</th>
                    <th className="text-left px-4 py-3">Location</th>
                    <th className="text-left px-4 py-3">Requirement</th>
                    <th className="text-left px-4 py-3">Source</th>
                    <th className="text-left px-4 py-3">Date</th>
                    <th className="text-right px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr><td colSpan={7} className="text-center py-12 text-muted-foreground">No leads yet.</td></tr>
                  )}
                  {filtered.map((l) => (
                    <tr key={l.id} className={`border-t border-border ${l.contacted ? "bg-muted/20 text-muted-foreground" : ""}`}>
                      <td className="px-4 py-3 font-medium">{l.name}</td>
                      <td className="px-4 py-3"><a href={`tel:${l.phone}`} className="text-royal hover:text-gold">{l.phone}</a></td>
                      <td className="px-4 py-3">{l.location ?? "—"}</td>
                      <td className="px-4 py-3">{l.requirement}</td>
                      <td className="px-4 py-3 text-xs">{l.source ?? "—"}</td>
                      <td className="px-4 py-3 text-xs">{new Date(l.created_at).toLocaleString()}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex gap-1">
                          <button onClick={() => toggleContacted(l)} title={l.contacted ? "Mark new" : "Mark contacted"} className={`p-1.5 rounded ${l.contacted ? "text-gold" : "text-muted-foreground hover:text-gold"}`}>
                            <CheckCircle2 className="h-4 w-4" />
                          </button>
                          <button onClick={() => deleteLead(l.id)} title="Delete" className="p-1.5 rounded text-muted-foreground hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "gallery" && (
          <div className="space-y-4">
            <div className="bg-card rounded-2xl border border-border p-5">
              <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl p-8 cursor-pointer hover:border-gold/40 hover:bg-muted/30 transition">
                <Upload className="h-8 w-8 text-gold" />
                <span className="font-semibold text-navy">Upload Images</span>
                <span className="text-xs text-muted-foreground">Multiple files supported · JPG, PNG, WebP</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={onUpload} />
              </label>
            </div>
            <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {gallery.length === 0 && (
                <div className="col-span-full text-center text-muted-foreground py-12 bg-card rounded-2xl border border-border">No images uploaded yet.</div>
              )}
              {gallery.map((g) => (
                <div key={g.id} className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-border bg-card">
                  <img src={g.image_url} alt={g.title ?? "Gallery"} loading="lazy" className="h-full w-full object-cover" />
                  <button onClick={() => deleteImage(g)} className="absolute top-2 right-2 p-1.5 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition">
                    <X className="h-4 w-4" />
                  </button>
                  {g.title && <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-navy/90 to-transparent text-white text-xs p-2 truncate">{g.title}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
