import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Lock, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin Login — Kalpana Associates" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("kpmkalpanaassociates@gmail.com");
  const [password, setPassword] = useState("kalpanaassociates");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate({ to: "/admin/dashboard" });
    });
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Welcome back");
    navigate({ to: "/admin/dashboard" });
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-hero py-16 px-4">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-premium overflow-hidden">
        <div className="bg-navy text-white p-7 text-center">
          <div className="w-14 h-14 mx-auto rounded-full bg-gradient-gold flex items-center justify-center shadow-gold mb-3">
            <ShieldCheck className="h-7 w-7 text-navy" />
          </div>
          <h1 className="font-display text-2xl font-bold">Admin Login</h1>
          <p className="text-white/70 text-sm mt-1">Authorized personnel only</p>
        </div>
        <form onSubmit={onSubmit} className="p-7 space-y-4">
          <div>
            <label className="text-xs font-semibold text-navy uppercase tracking-wider">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 w-full px-4 py-2.5 rounded-md border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:outline-none" />
          </div>
          <div>
            <label className="text-xs font-semibold text-navy uppercase tracking-wider">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5 w-full px-4 py-2.5 rounded-md border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:outline-none" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 rounded-md bg-gradient-gold text-navy font-semibold text-sm shadow-gold hover:opacity-95 disabled:opacity-60 flex items-center justify-center gap-2">
            <Lock className="h-4 w-4" /> {loading ? "Signing in…" : "Sign In"}
          </button>
          <p className="text-xs text-muted-foreground text-center pt-2">
            Need access? Ask the site owner to create your admin account in the Cloud Users panel.
          </p>
        </form>
      </div>
    </section>
  );
}
