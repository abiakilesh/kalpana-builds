import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LogOut, Search, Trash2, Download, CheckCircle2, Image as ImageIcon, Users, Upload, X, Pencil, UserCircle2, Eye, Phone, MapPin, Clock, MessageSquare, Tag } from "lucide-react";

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
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

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
    const q = search.trim().toLowerCase();
    const matched = leads.filter((l) => {
      if (filter === "new" && l.contacted) return false;
      if (filter === "contacted" && !l.contacted) return false;
      if (!q) return true;
      return [l.name, l.phone, l.location, l.requirement, l.message]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(q));
    });
    if (!q) return matched;
    // Prioritize: message matches first, then others. Stable order preserved within groups.
    const score = (l: Lead) => (l.message && l.message.toLowerCase().includes(q) ? 0 : 1);
    return [...matched].sort((a, b) => score(a) - score(b));
  }, [leads, search, filter]);

  const exportCSV = () => {
    const rows = [
      ["Name", "Phone", "Location", "Requirement", "Message", "Source", "Contacted", "Date"],
      ...filtered.map((l) => [
        l.name, l.phone, l.location ?? "", l.requirement, l.message ?? "", l.source ?? "", l.contacted ? "Yes" : "No",
        new Date(l.created_at).toLocaleString(),
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `leads-${filter}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleContacted = async (l: Lead) => {
    const next = !l.contacted;
    const { error } = await supabase.from("leads").update({ contacted: next }).eq("id", l.id);
    if (error) return toast.error(error.message);
    setLeads((prev) => prev.map((x) => x.id === l.id ? { ...x, contacted: next } : x));
    setSelectedLead((curr) => curr && curr.id === l.id ? { ...curr, contacted: next } : curr);
    toast.success(next ? "Marked as contacted" : "Marked as new");
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

  const renameImage = async (img: GalleryRow) => {
    const next = prompt("New title:", img.title ?? "");
    if (next === null) return;
    const { error } = await supabase.from("gallery_images").update({ title: next }).eq("id", img.id);
    if (error) return toast.error(error.message);
    setGallery((prev) => prev.map((x) => x.id === img.id ? { ...x, title: next } : x));
    toast.success("Title updated");
  };

  const onFounderUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const t = toast.loading("Uploading founder image…");
    // remove old file if existed
    if (founderPath) await supabase.storage.from("gallery").remove([founderPath]);
    const ext = file.name.split(".").pop();
    const path = `founder-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("gallery").upload(path, file, { upsert: true });
    if (upErr) { toast.dismiss(t); return toast.error(upErr.message); }
    const { data: pub } = supabase.storage.from("gallery").getPublicUrl(path);
    const { error: usErr } = await supabase.from("site_settings").upsert({
      key: "founder_image", value: pub.publicUrl, updated_at: new Date().toISOString(),
    });
    toast.dismiss(t);
    if (usErr) return toast.error(usErr.message);
    setFounderUrl(pub.publicUrl);
    setFounderPath(path);
    toast.success("Founder image updated");
    e.target.value = "";
  };

  const deleteFounder = async () => {
    if (!confirm("Remove founder image and revert to default?")) return;
    if (founderPath) await supabase.storage.from("gallery").remove([founderPath]);
    const { error } = await supabase.from("site_settings").delete().eq("key", "founder_image");
    if (error) return toast.error(error.message);
    setFounderUrl("");
    setFounderPath("");
    toast.success("Founder image removed");
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
          {(["leads", "gallery", "founder"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize ${tab === t ? "bg-navy text-primary-foreground" : "text-foreground/70 hover:bg-muted"}`}>{t}</button>
          ))}
        </div>

        {tab === "leads" && (
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="p-4 flex flex-wrap gap-2 items-center justify-between border-b border-border">
              <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, phone, location, message…" className="flex-1 bg-transparent text-sm focus:outline-none" />
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
                    <th className="text-left px-4 py-3">Message</th>
                    <th className="text-left px-4 py-3">Source</th>
                    <th className="text-left px-4 py-3">Date</th>
                    <th className="text-right px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr><td colSpan={8} className="text-center py-12 text-muted-foreground">No leads yet.</td></tr>
                  )}
                  {filtered.map((l) => {
                    const msgMatches = !!(search.trim() && l.message && l.message.toLowerCase().includes(search.trim().toLowerCase()));
                    return (
                    <tr key={l.id} className={`border-t border-border ${l.contacted ? "bg-muted/20 text-muted-foreground" : ""} ${msgMatches ? "bg-gold/5" : ""}`}>
                      <td className="px-4 py-3 font-medium">
                        <HL text={l.name} query={search} />
                        {!l.contacted && <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-gold" title="New" />}
                      </td>
                      <td className="px-4 py-3"><a href={`tel:${l.phone}`} className="text-royal hover:text-gold"><HL text={l.phone} query={search} /></a></td>
                      <td className="px-4 py-3"><HL text={l.location ?? "—"} query={search} /></td>
                      <td className="px-4 py-3"><HL text={l.requirement} query={search} /></td>
                      <td className="px-4 py-3 max-w-[260px] whitespace-pre-wrap text-foreground/80">
                        {l.message ? <HL text={l.message} query={search} /> : <span className="text-muted-foreground">—</span>}
                      </td>
                      <td className="px-4 py-3 text-xs">{l.source ?? "—"}</td>
                      <td className="px-4 py-3 text-xs">{new Date(l.created_at).toLocaleString()}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex gap-1 items-center">
                          <button onClick={() => setSelectedLead(l)} title="View details" className="p-1.5 rounded text-muted-foreground hover:text-royal">
                            <Eye className="h-4 w-4" />
                          </button>
                          {l.contacted ? (
                            <button onClick={() => toggleContacted(l)} title="Mark as new" className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gold/15 text-gold text-[11px] font-semibold">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Contacted
                            </button>
                          ) : (
                            <button onClick={() => toggleContacted(l)} title="Mark as contacted" className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-navy text-primary-foreground text-[11px] font-semibold hover:bg-navy/90">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Mark Contacted
                            </button>
                          )}
                          <button onClick={() => deleteLead(l.id)} title="Delete" className="p-1.5 rounded text-muted-foreground hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    );
                  })}
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
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button onClick={() => renameImage(g)} title="Edit title" className="p-1.5 rounded-full bg-navy text-white">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => deleteImage(g)} title="Delete" className="p-1.5 rounded-full bg-destructive text-destructive-foreground">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  {g.title && <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-navy/90 to-transparent text-white text-xs p-2 truncate">{g.title}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "founder" && (
          <div className="bg-card rounded-2xl border border-border p-6 max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <UserCircle2 className="h-5 w-5 text-gold" />
              <h2 className="font-display text-xl font-bold text-navy">Founder Image</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-5">Shown on the About page. Recommended: square or 4:5 portrait, &gt; 800px.</p>

            {founderUrl ? (
              <div className="relative w-48 h-60 rounded-xl overflow-hidden border border-border mb-5 shadow-sm">
                <img src={founderUrl} alt="Current founder" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-48 h-60 rounded-xl border-2 border-dashed border-border flex items-center justify-center text-xs text-muted-foreground mb-5">
                Default image in use
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-gold text-navy text-sm font-semibold shadow-gold cursor-pointer">
                <Upload className="h-4 w-4" /> {founderUrl ? "Replace Image" : "Upload Image"}
                <input type="file" accept="image/*" className="hidden" onChange={onFounderUpload} />
              </label>
              {founderUrl && (
                <button onClick={deleteFounder} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-destructive text-destructive-foreground text-sm font-semibold">
                  <Trash2 className="h-4 w-4" /> Remove
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <LeadDetailsModal
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
        onToggleContacted={toggleContacted}
        onDelete={async (id) => { await deleteLead(id); setSelectedLead(null); }}
      />
    </section>
  );
}

function HL({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (!q) return <>{text}</>;
  const lower = text.toLowerCase();
  const ql = q.toLowerCase();
  const parts: React.ReactNode[] = [];
  let i = 0;
  let idx = lower.indexOf(ql, i);
  let key = 0;
  while (idx !== -1) {
    if (idx > i) parts.push(<span key={key++}>{text.slice(i, idx)}</span>);
    parts.push(<mark key={key++} className="bg-gold/40 text-navy rounded px-0.5">{text.slice(idx, idx + q.length)}</mark>);
    i = idx + q.length;
    idx = lower.indexOf(ql, i);
  }
  if (i < text.length) parts.push(<span key={key++}>{text.slice(i)}</span>);
  return <>{parts}</>;
}

function LeadDetailsModal({
  lead, onClose, onToggleContacted, onDelete,
}: {
  lead: Lead | null;
  onClose: () => void;
  onToggleContacted: (l: Lead) => void;
  onDelete: (id: string) => void;
}) {
  if (!lead) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-4 bg-navy/60 backdrop-blur-sm animate-float-in" onClick={onClose}>
      <div className="relative w-full max-w-lg rounded-2xl bg-card shadow-premium overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} aria-label="Close" className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-background/80 hover:bg-background text-foreground/70">
          <X className="h-4 w-4" />
        </button>

        <div className="bg-gradient-hero text-white px-6 pt-7 pb-5">
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${lead.contacted ? "bg-gold/95 text-navy" : "bg-white/20 text-white"}`}>
              {lead.contacted ? <><CheckCircle2 className="h-3 w-3" /> Contacted</> : "New Lead"}
            </span>
            {lead.source && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/15 text-white/90">
                <Tag className="h-3 w-3" /> {lead.source}
              </span>
            )}
          </div>
          <h3 className="font-display text-2xl font-bold leading-tight">{lead.name}</h3>
          <p className="text-white/75 text-xs mt-1 flex items-center gap-1.5"><Clock className="h-3 w-3" /> {new Date(lead.created_at).toLocaleString()}</p>
        </div>

        <div className="p-6 space-y-4">
          <Field icon={<Phone className="h-4 w-4 text-gold" />} label="Phone">
            <a href={`tel:${lead.phone}`} className="text-royal hover:text-gold font-medium">{lead.phone}</a>
          </Field>
          <Field icon={<MapPin className="h-4 w-4 text-gold" />} label="Location">
            <span>{lead.location ?? "—"}</span>
          </Field>
          <Field icon={<Tag className="h-4 w-4 text-gold" />} label="Requirement">
            <span className="font-medium text-navy">{lead.requirement}</span>
          </Field>
          <Field icon={<MessageSquare className="h-4 w-4 text-gold" />} label="Message">
            {lead.message ? (
              <p className="whitespace-pre-wrap text-foreground/85">{lead.message}</p>
            ) : (
              <span className="text-muted-foreground italic">No message provided</span>
            )}
          </Field>

          <div className="flex flex-wrap gap-2 pt-3 border-t border-border">
            <button
              onClick={() => onToggleContacted(lead)}
              className={`flex-1 min-w-[160px] inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-sm font-semibold ${
                lead.contacted ? "bg-muted text-foreground hover:bg-muted/70" : "bg-gradient-gold text-navy shadow-gold"
              }`}
            >
              <CheckCircle2 className="h-4 w-4" /> {lead.contacted ? "Mark as New" : "Mark as Contacted"}
            </button>
            <a
              href={`tel:${lead.phone}`}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-sm font-semibold bg-navy text-primary-foreground hover:bg-navy/90"
            >
              <Phone className="h-4 w-4" /> Call
            </a>
            <button
              onClick={() => onDelete(lead.id)}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-sm font-semibold bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-lg bg-muted flex-shrink-0 flex items-center justify-center">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="text-sm mt-0.5">{children}</div>
      </div>
    </div>
  );
}

