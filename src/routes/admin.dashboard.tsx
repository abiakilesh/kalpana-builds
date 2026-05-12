import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LogOut, Search, Trash2, Download, CheckCircle2, Image as ImageIcon, Users, Upload, X, Pencil, UserCircle2, Eye, Phone, MapPin, Clock, MessageSquare, Tag, ChevronLeft, ChevronRight, Loader2, AlertCircle, Save, FileImage } from "lucide-react";

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

interface GalleryRow { id: string; image_url: string; storage_path: string | null; title: string | null; category: string | null; created_at?: string }

type UploadStatus = "pending" | "uploading" | "done" | "failed";
interface UploadItem { id: string; name: string; size: number; status: UploadStatus; error?: string; attempts: number }

const MAX_IMAGES = 300;
const MAX_TOTAL_BYTES = 500 * 1024 * 1024; // 500 MB
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

async function withRetry<T>(fn: () => Promise<T>, max = 3, baseMs = 500): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i < max; i++) {
    try { return await fn(); } catch (e) {
      lastErr = e;
      if (i < max - 1) await new Promise((r) => setTimeout(r, Math.pow(2, i) * baseMs + Math.random() * 200));
    }
  }
  throw lastErr;
}

function Dashboard() {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [tab, setTab] = useState<"leads" | "gallery" | "founder">("leads");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [gallery, setGallery] = useState<GalleryRow[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [founderUrl, setFounderUrl] = useState<string>("");
  const [founderPath, setFounderPath] = useState<string>("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "new" | "contacted">("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [editTarget, setEditTarget] = useState<GalleryRow | null>(null);
  const [uploadQueue, setUploadQueue] = useState<UploadItem[]>([]);

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
    setGalleryLoading(true);
    const [{ data: l }, { data: g }, { data: s }] = await Promise.all([
      supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(1000),
      supabase.from("gallery_images").select("*").order("created_at", { ascending: false }).limit(1000),
      supabase.from("site_settings").select("*").eq("key", "founder_image").maybeSingle(),
    ]);
    if (l) setLeads(l as Lead[]);
    if (g) setGallery(g as GalleryRow[]);
    setGalleryLoading(false);
    if (s?.value) {
      setFounderUrl(s.value);
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

  const [uploading, setUploading] = useState(false);

  const updateQueueItem = (id: string, patch: Partial<UploadItem>) =>
    setUploadQueue((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const files = Array.from(input.files ?? []);
    if (!files.length) return;

    // Pre-validate type and size
    const valid: File[] = [];
    for (const f of files) {
      if (!ALLOWED_TYPES.includes(f.type)) { toast.error(`${f.name}: only JPG, PNG, WebP allowed`); continue; }
      if (f.size > MAX_FILE_BYTES) { toast.error(`${f.name}: exceeds 10MB`); continue; }
      valid.push(f);
    }
    if (!valid.length) { input.value = ""; return; }

    // Enforce gallery image count limit
    const remainingSlots = MAX_IMAGES - gallery.length;
    if (remainingSlots <= 0) {
      toast.error(`Gallery limit reached (${MAX_IMAGES} images). Delete some before uploading more.`);
      input.value = "";
      return;
    }
    let toUpload = valid;
    if (valid.length > remainingSlots) {
      toast.warning(`Only ${remainingSlots} more image(s) can fit — uploading the first ${remainingSlots}.`);
      toUpload = valid.slice(0, remainingSlots);
    }

    // Enforce total storage size (estimate from existing files via storage list)
    try {
      const { data: list } = await supabase.storage.from("gallery").list("", { limit: 1000 });
      const used = (list ?? []).reduce((a, b) => a + (b.metadata?.size ?? 0), 0);
      const incoming = toUpload.reduce((a, b) => a + b.size, 0);
      if (used + incoming > MAX_TOTAL_BYTES) {
        toast.error(`Storage limit would be exceeded (${(MAX_TOTAL_BYTES / 1024 / 1024).toFixed(0)} MB total).`);
        input.value = "";
        return;
      }
    } catch { /* non-fatal */ }

    const queue: UploadItem[] = toUpload.map((f) => ({
      id: crypto.randomUUID(), name: f.name, size: f.size, status: "pending", attempts: 0,
    }));
    setUploadQueue(queue);
    setUploading(true);

    const newRows: GalleryRow[] = [];
    let ok = 0;
    for (let i = 0; i < toUpload.length; i++) {
      const file = toUpload[i];
      const item = queue[i];
      updateQueueItem(item.id, { status: "uploading" });
      try {
        const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
        const path = `${crypto.randomUUID()}.${ext}`;

        const inserted = await withRetry(async () => {
          updateQueueItem(item.id, { attempts: (item.attempts || 0) + 1 });
          const { error: upErr } = await supabase.storage
            .from("gallery")
            .upload(path, file, { upsert: false, contentType: file.type, cacheControl: "3600" });
          if (upErr) throw upErr;

          const { data: pub } = supabase.storage.from("gallery").getPublicUrl(path);
          const title = file.name.replace(/\.[^.]+$/, "");
          const { data: row, error: insErr } = await supabase
            .from("gallery_images")
            .insert({ image_url: pub.publicUrl, storage_path: path, title })
            .select()
            .single();
          if (insErr || !row) {
            await supabase.storage.from("gallery").remove([path]);
            throw insErr ?? new Error("Failed to save image record");
          }
          return row as GalleryRow;
        }, 3, 600);

        ok++;
        newRows.push(inserted);
        updateQueueItem(item.id, { status: "done" });
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        updateQueueItem(item.id, { status: "failed", error: msg });
        toast.error(`${file.name}: ${msg}`);
      }
    }

    setUploading(false);
    input.value = "";

    if (ok > 0) {
      setGallery((prev) => [...newRows, ...prev]);
      toast.success(`${ok} image(s) uploaded`);
      // Auto-clear successful queue entries after a moment, keep failures visible
      setTimeout(() => setUploadQueue((prev) => prev.filter((x) => x.status === "failed")), 2500);
    } else {
      toast.error("No images were uploaded — see errors below.");
    }
  };

  const deleteImage = async (img: GalleryRow) => {
    if (!confirm(`Delete "${img.title ?? "this image"}"? This cannot be undone.`)) return;
    if (img.storage_path) await supabase.storage.from("gallery").remove([img.storage_path]);
    const { error } = await supabase.from("gallery_images").delete().eq("id", img.id);
    if (error) return toast.error(error.message);
    setGallery((prev) => prev.filter((x) => x.id !== img.id));
    setLightboxIdx(null);
    toast.success("Image deleted");
  };

  const saveEdit = async (
    target: GalleryRow,
    next: { title: string; category: string },
    replacement?: File | null,
  ) => {
    try {
      let image_url = target.image_url;
      let storage_path = target.storage_path;

      if (replacement) {
        if (!ALLOWED_TYPES.includes(replacement.type)) throw new Error("Only JPG, PNG, WebP allowed");
        if (replacement.size > MAX_FILE_BYTES) throw new Error("File exceeds 10MB");
        const ext = (replacement.name.split(".").pop() || "jpg").toLowerCase();
        const path = `${crypto.randomUUID()}.${ext}`;
        await withRetry(async () => {
          const { error } = await supabase.storage
            .from("gallery")
            .upload(path, replacement, { upsert: false, contentType: replacement.type, cacheControl: "3600" });
          if (error) throw error;
        }, 3, 600);
        const { data: pub } = supabase.storage.from("gallery").getPublicUrl(path);
        image_url = `${pub.publicUrl}?v=${Date.now()}`;
        // Remove the old file after successful new upload
        if (target.storage_path) await supabase.storage.from("gallery").remove([target.storage_path]);
        storage_path = path;
      }

      const { data: updated, error } = await supabase
        .from("gallery_images")
        .update({ title: next.title || null, category: next.category || null, image_url, storage_path })
        .eq("id", target.id)
        .select()
        .single();
      if (error) throw error;

      setGallery((prev) => prev.map((x) => (x.id === target.id ? (updated as GalleryRow) : x)));
      toast.success("Image updated");
      setEditTarget(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update image");
    }
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
            <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
              <label className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl p-8 transition ${uploading ? "opacity-60 cursor-wait" : "cursor-pointer hover:border-gold/40 hover:bg-muted/30"}`}>
                <Upload className={`h-8 w-8 text-gold ${uploading ? "animate-pulse" : ""}`} />
                <span className="font-semibold text-navy">{uploading ? "Uploading…" : "Upload Images"}</span>
                <span className="text-xs text-muted-foreground">JPG, PNG, WebP · up to 10MB each · {gallery.length}/{MAX_IMAGES} used</span>
                <input type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={uploading} className="hidden" onChange={onUpload} />
              </label>

              {uploadQueue.length > 0 && (
                <UploadProgressList items={uploadQueue} onClear={() => setUploadQueue([])} />
              )}
            </div>

            {galleryLoading ? (
              <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-[4/3] rounded-xl bg-muted animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {gallery.length === 0 && (
                  <div className="col-span-full text-center text-muted-foreground py-12 bg-card rounded-2xl border border-border">No images uploaded yet.</div>
                )}
                {gallery.map((g, idx) => (
                  <div key={g.id} className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-premium transition-shadow">
                    <button type="button" onClick={() => setLightboxIdx(idx)} className="absolute inset-0 w-full h-full">
                      <img src={g.image_url} alt={g.title ?? "Gallery"} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </button>
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button onClick={() => setEditTarget(g)} title="Edit" className="p-1.5 rounded-full bg-navy text-white hover:bg-navy/90">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => deleteImage(g)} title="Delete" className="p-1.5 rounded-full bg-destructive text-destructive-foreground hover:opacity-90">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    {g.category && (
                      <span className="absolute top-2 left-2 inline-flex items-center px-2 py-0.5 rounded-full bg-gold/90 text-navy text-[10px] font-bold uppercase tracking-wider">
                        {g.category}
                      </span>
                    )}
                    {g.title && <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-navy/90 to-transparent text-white text-xs p-2 truncate pointer-events-none">{g.title}</div>}
                  </div>
                ))}
              </div>
            )}
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

      <Lightbox
        images={gallery}
        index={lightboxIdx}
        onClose={() => setLightboxIdx(null)}
        onPrev={() => setLightboxIdx((i) => (i === null ? null : (i - 1 + gallery.length) % gallery.length))}
        onNext={() => setLightboxIdx((i) => (i === null ? null : (i + 1) % gallery.length))}
        onEdit={(g) => { setLightboxIdx(null); setEditTarget(g); }}
        onDelete={deleteImage}
      />

      <EditImageModal
        target={editTarget}
        onClose={() => setEditTarget(null)}
        onSave={saveEdit}
      />
    </section>
  );
}

function UploadProgressList({ items, onClear }: { items: UploadItem[]; onClear: () => void }) {
  const done = items.filter((i) => i.status === "done").length;
  const failed = items.filter((i) => i.status === "failed").length;
  const total = items.length;
  const pct = total ? Math.round(((done + failed) / total) * 100) : 0;
  return (
    <div className="rounded-xl border border-border bg-muted/30 p-3 space-y-2">
      <div className="flex items-center justify-between text-xs font-medium text-foreground/80">
        <span>Uploading {done}/{total}{failed ? ` · ${failed} failed` : ""}</span>
        <button onClick={onClear} className="text-muted-foreground hover:text-foreground">Clear</button>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className="h-full bg-gradient-gold transition-all" style={{ width: `${pct}%` }} />
      </div>
      <ul className="space-y-1 max-h-40 overflow-y-auto">
        {items.map((it) => (
          <li key={it.id} className="flex items-center gap-2 text-xs">
            {it.status === "uploading" && <Loader2 className="h-3.5 w-3.5 animate-spin text-royal" />}
            {it.status === "pending" && <FileImage className="h-3.5 w-3.5 text-muted-foreground" />}
            {it.status === "done" && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />}
            {it.status === "failed" && <AlertCircle className="h-3.5 w-3.5 text-destructive" />}
            <span className="flex-1 truncate">{it.name}</span>
            <span className="text-muted-foreground">{(it.size / 1024 / 1024).toFixed(1)} MB</span>
            {it.status === "failed" && it.error && (
              <span className="text-destructive max-w-[200px] truncate" title={it.error}>{it.error}</span>
            )}
            {it.attempts > 1 && it.status !== "done" && (
              <span className="text-muted-foreground">retry {it.attempts}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Lightbox({
  images, index, onClose, onPrev, onNext, onEdit, onDelete,
}: {
  images: GalleryRow[];
  index: number | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onEdit: (g: GalleryRow) => void;
  onDelete: (g: GalleryRow) => void;
}) {
  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, onClose, onPrev, onNext]);

  if (index === null || !images[index]) return null;
  const g = images[index];
  return (
    <div className="fixed inset-0 z-[80] bg-navy/90 backdrop-blur-md flex items-center justify-center p-4 animate-float-in" onClick={onClose}>
      <button className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20" onClick={onClose} aria-label="Close"><X className="h-5 w-5" /></button>
      {images.length > 1 && (
        <>
          <button className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20" onClick={(e) => { e.stopPropagation(); onPrev(); }} aria-label="Previous"><ChevronLeft className="h-6 w-6" /></button>
          <button className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20" onClick={(e) => { e.stopPropagation(); onNext(); }} aria-label="Next"><ChevronRight className="h-6 w-6" /></button>
        </>
      )}
      <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
        <img src={g.image_url} alt={g.title ?? "Gallery"} className="max-h-[80vh] w-full object-contain rounded-xl shadow-premium" />
        <div className="mt-4 flex items-center justify-between gap-3 bg-card/95 rounded-xl p-3 border border-border">
          <div className="min-w-0">
            <div className="font-semibold text-navy truncate">{g.title ?? "Untitled"}</div>
            <div className="text-xs text-muted-foreground truncate">{g.category ?? "No category"} · {index + 1} / {images.length}</div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onEdit(g)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-navy text-primary-foreground text-xs font-semibold hover:bg-navy/90"><Pencil className="h-3.5 w-3.5" /> Edit</button>
            <button onClick={() => onDelete(g)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-destructive text-destructive-foreground text-xs font-semibold"><Trash2 className="h-3.5 w-3.5" /> Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditImageModal({
  target, onClose, onSave,
}: {
  target: GalleryRow | null;
  onClose: () => void;
  onSave: (target: GalleryRow, next: { title: string; category: string }, replacement?: File | null) => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (target) {
      setTitle(target.title ?? "");
      setCategory(target.category ?? "");
      setFile(null);
    }
  }, [target]);

  if (!target) return null;
  const previewUrl = file ? URL.createObjectURL(file) : target.image_url;
  return (
    <div className="fixed inset-0 z-[85] bg-navy/60 backdrop-blur-sm flex items-center justify-center p-4 animate-float-in" onClick={onClose}>
      <div className="relative w-full max-w-lg rounded-2xl bg-card shadow-premium overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <button className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-background/80 hover:bg-background text-foreground/70" onClick={onClose} aria-label="Close"><X className="h-4 w-4" /></button>
        <div className="bg-gradient-hero text-white px-6 pt-6 pb-4">
          <h3 className="font-display text-xl font-bold">Edit image</h3>
          <p className="text-white/70 text-xs mt-1">Update title, category, or replace the file.</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="aspect-[4/3] w-full rounded-xl overflow-hidden border border-border bg-muted">
            <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-gold/40" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category</label>
            <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Villa, Commercial, Interior" className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-gold/40" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Replace image (optional)</label>
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="block w-full text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-navy file:text-white file:font-semibold file:cursor-pointer" />
            {file && <p className="text-xs text-muted-foreground">{file.name} · {(file.size / 1024 / 1024).toFixed(2)} MB</p>}
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <button onClick={onClose} className="px-3 py-2 rounded-md text-sm font-semibold text-foreground/70 hover:bg-muted">Cancel</button>
            <button
              disabled={saving}
              onClick={async () => { setSaving(true); try { await onSave(target, { title, category }, file); } finally { setSaving(false); } }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-gradient-gold text-navy text-sm font-semibold shadow-gold disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save
            </button>
          </div>
        </div>
      </div>
    </div>
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

