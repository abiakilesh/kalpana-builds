#!/usr/bin/env bash
# Migration script: TanStack Start → Vite + React Router SPA
# Run from the repo root after cloning from GitHub.
set -euo pipefail

if [ ! -f package.json ] || [ ! -d src/routes ]; then
  echo "Run this from the repo root (must contain package.json and src/routes/)."
  exit 1
fi

echo "==> [1/8] Writing package.json"
cat > package.json <<'JSON'
{
  "name": "kalpana-spa",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@hookform/resolvers": "^5.2.2",
    "@radix-ui/react-accordion": "^1.2.12",
    "@radix-ui/react-alert-dialog": "^1.1.15",
    "@radix-ui/react-aspect-ratio": "^1.1.8",
    "@radix-ui/react-avatar": "^1.1.11",
    "@radix-ui/react-checkbox": "^1.3.3",
    "@radix-ui/react-collapsible": "^1.1.12",
    "@radix-ui/react-context-menu": "^2.2.16",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-dropdown-menu": "^2.1.16",
    "@radix-ui/react-hover-card": "^1.1.15",
    "@radix-ui/react-label": "^2.1.8",
    "@radix-ui/react-menubar": "^1.1.16",
    "@radix-ui/react-navigation-menu": "^1.2.14",
    "@radix-ui/react-popover": "^1.1.15",
    "@radix-ui/react-progress": "^1.1.8",
    "@radix-ui/react-radio-group": "^1.3.8",
    "@radix-ui/react-scroll-area": "^1.2.10",
    "@radix-ui/react-select": "^2.2.6",
    "@radix-ui/react-separator": "^1.1.8",
    "@radix-ui/react-slider": "^1.3.6",
    "@radix-ui/react-slot": "^1.2.4",
    "@radix-ui/react-switch": "^1.2.6",
    "@radix-ui/react-tabs": "^1.1.13",
    "@radix-ui/react-toggle": "^1.1.10",
    "@radix-ui/react-toggle-group": "^1.1.11",
    "@radix-ui/react-tooltip": "^1.2.8",
    "@supabase/supabase-js": "^2.105.1",
    "@tanstack/react-query": "^5.83.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "date-fns": "^4.1.0",
    "embla-carousel-react": "^8.6.0",
    "input-otp": "^1.4.2",
    "lucide-react": "^0.575.0",
    "react": "^19.2.0",
    "react-day-picker": "^9.14.0",
    "react-dom": "^19.2.0",
    "react-hook-form": "^7.71.2",
    "react-resizable-panels": "^4.6.5",
    "react-router-dom": "^7.1.1",
    "recharts": "^2.15.4",
    "sonner": "^2.0.7",
    "tailwind-merge": "^3.5.0",
    "tailwindcss": "^4.2.1",
    "tw-animate-css": "^1.3.4",
    "vaul": "^1.1.2",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.2.1",
    "@types/node": "^22.16.5",
    "@types/react": "^19.2.0",
    "@types/react-dom": "^19.2.0",
    "@vitejs/plugin-react": "^5.0.4",
    "typescript": "^5.8.3",
    "vite": "^7.3.1",
    "vite-tsconfig-paths": "^6.0.2"
  }
}
JSON

echo "==> [2/8] Writing vite.config.ts"
cat > vite.config.ts <<'TS'
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tsconfigPaths(), tailwindcss()],
  server: { port: 5173, host: true },
  build: { outDir: "dist", sourcemap: false },
});
TS

echo "==> [3/8] Writing index.html, main.tsx, App.tsx"
cat > index.html <<'HTML'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Kalpana Associates &amp; Construction</title>
    <meta name="description" content="Premium BOQ-based construction company in Chennai. 100% transparent pricing, on-time delivery, no hidden cost. 20+ years of trust." />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
HTML

cat > src/main.tsx <<'TSX'
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
TSX

cat > src/App.tsx <<'TSX'
import { Routes, Route, Outlet } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingCTAs } from "@/components/layout/FloatingCTAs";
import { LeadPopup } from "@/components/LeadPopup";
import { Toaster } from "@/components/ui/sonner";

import HomePage from "@/routes/index";
import ServicesPage from "@/routes/services";
import PricingPage from "@/routes/pricing";
import JointVenturePage from "@/routes/joint-venture";
import GalleryPage from "@/routes/gallery";
import AboutPage from "@/routes/about";
import ContactPage from "@/routes/contact";
import AdminLogin from "@/routes/admin.index";
import AdminDashboard from "@/routes/admin.dashboard";

function SiteLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1"><Outlet /></main>
      <Footer />
      <FloatingCTAs />
      <LeadPopup />
      <Toaster richColors position="top-center" />
    </div>
  );
}

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 text-center">
      <div>
        <h1 className="text-7xl font-bold">404</h1>
        <p className="mt-4 text-muted-foreground">Page not found</p>
        <a href="/" className="mt-6 inline-block rounded-md bg-primary px-4 py-2 text-primary-foreground">Go home</a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="pricing" element={<PricingPage />} />
        <Route path="joint-venture" element={<JointVenturePage />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="admin" element={<AdminLogin />} />
        <Route path="admin/dashboard" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
TSX

echo "==> [4/8] Writing SPA fallback files"
mkdir -p public
cat > public/_redirects <<'TXT'
/*    /index.html   200
TXT
cat > public/.htaccess <<'HT'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
HT

echo "==> [5/8] Patching shared components (Header / Footer / CTAButton)"
# Header.tsx: replace TanStack imports + useRouterState
python3 - <<'PY'
import re, pathlib
p = pathlib.Path("src/components/layout/Header.tsx")
s = p.read_text()
s = s.replace(
    'import { Link, useRouterState } from "@tanstack/react-router";',
    'import { Link, useLocation } from "react-router-dom";'
)
s = s.replace(
    'const path = useRouterState({ select: (s) => s.location.pathname });',
    'const path = useLocation().pathname;'
)
# Link to=... is identical syntax in react-router-dom; nav items use `to` strings already.
p.write_text(s)

# Footer.tsx
p = pathlib.Path("src/components/layout/Footer.tsx")
s = p.read_text().replace(
    'import { Link } from "@tanstack/react-router";',
    'import { Link } from "react-router-dom";'
)
p.write_text(s)

# CTAButton.tsx
p = pathlib.Path("src/components/CTAButton.tsx")
s = p.read_text().replace(
    'import { Link } from "@tanstack/react-router";',
    'import { Link } from "react-router-dom";'
)
p.write_text(s)
print("  patched components")
PY

echo "==> [6/8] Rewriting route files (strip createFileRoute wrapper)"
python3 - <<'PY'
import re, pathlib

ROUTES = [
    "src/routes/index.tsx",
    "src/routes/about.tsx",
    "src/routes/contact.tsx",
    "src/routes/gallery.tsx",
    "src/routes/joint-venture.tsx",
    "src/routes/pricing.tsx",
    "src/routes/services.tsx",
    "src/routes/admin.index.tsx",
    "src/routes/admin.dashboard.tsx",
]

for path in ROUTES:
    p = pathlib.Path(path)
    s = p.read_text()

    # Pull title out of head() block for document.title
    title_match = re.search(r'\{\s*title:\s*"([^"]+)"', s)
    title = title_match.group(1) if title_match else None
    desc_match = re.search(r'name:\s*"description",\s*content:\s*"([^"]+)"', s)
    desc = desc_match.group(1) if desc_match else None

    # Find component name from `component: X`
    comp_match = re.search(r'component:\s*([A-Za-z0-9_]+)\s*,?\s*\}\s*\)\s*;', s)
    comp = comp_match.group(1) if comp_match else None

    # Remove the entire `export const Route = createFileRoute(...)({ ... });` block
    s = re.sub(
        r'export const Route = createFileRoute\([^)]*\)\(\{[\s\S]*?\}\)\s*;\s*',
        '', s, count=1
    )

    # Rewrite imports from @tanstack/react-router
    def fix_imports(match):
        names = [n.strip() for n in match.group(1).split(",") if n.strip()]
        keep = []
        for n in names:
            if n == "createFileRoute":
                continue
            if n == "Link":
                keep.append("Link")
            elif n == "useNavigate":
                keep.append("useNavigate")
            elif n == "Outlet":
                keep.append("Outlet")
            else:
                keep.append(n)
        if not keep:
            return ""
        return f'import {{ {", ".join(keep)} }} from "react-router-dom";'

    s = re.sub(
        r'import\s*\{\s*([^}]+)\s*\}\s*from\s*"@tanstack/react-router"\s*;',
        fix_imports, s
    )
    # Drop any leftover empty createFileRoute imports
    s = re.sub(r'^\s*\n', '', s, count=1) if s.startswith('\n') else s

    # Convert useNavigate({ to: "/x" }) -> useNavigate()("/x")
    # navigate({ to: "/x" })  =>  navigate("/x")
    s = re.sub(r'navigate\(\s*\{\s*to:\s*("[^"]+")\s*\}\s*\)', r'navigate(\1)', s)

    # Inject title via useEffect inside the component if title found
    if comp and title:
        # Find the component function and add useEffect
        # Ensure useEffect is imported from react
        if "useEffect" not in s:
            s = re.sub(
                r'import\s*\{\s*([^}]+)\s*\}\s*from\s*"react"\s*;',
                lambda m: 'import { ' + ", ".join(sorted(set([n.strip() for n in m.group(1).split(",")] + ["useEffect"]))) + ' } from "react";',
                s, count=1
            )
            if "useEffect" not in s:
                s = 'import { useEffect } from "react";\n' + s

        title_js = title.replace('"', '\\"')
        desc_js = (desc or "").replace('"', '\\"')
        meta_block = f'''  useEffect(() => {{
    document.title = "{title_js}";
    const m = document.querySelector('meta[name="description"]') || (() => {{
      const el = document.createElement("meta"); el.setAttribute("name","description"); document.head.appendChild(el); return el;
    }})();
    m.setAttribute("content", "{desc_js}");
  }}, []);
'''
        # Insert after `function CompName(...) {`
        s = re.sub(
            r'(function\s+' + re.escape(comp) + r'\s*\([^)]*\)\s*\{\s*\n)',
            r'\1' + meta_block,
            s, count=1
        )

    # Add default export
    if comp:
        if f"export default {comp}" not in s:
            s = s.rstrip() + f"\n\nexport default {comp};\n"

    p.write_text(s)
    print(f"  rewrote {path}  (component={comp}, title={'yes' if title else 'no'})")
PY

echo "==> [7/8] Deleting server / SSR / Worker files"
rm -f wrangler.jsonc
rm -f src/router.tsx
rm -f src/routeTree.gen.ts
rm -f src/routes/__root.tsx
rm -f src/routes/admin.tsx
rm -f src/integrations/supabase/client.server.ts
rm -f src/integrations/supabase/auth-middleware.ts

echo "==> [8/8] Cleaning bunfig.toml / prettier / eslint configs (optional, safe to keep)"
# leave them alone

cat <<'DONE'

✅ Migration complete.

Next steps:
  npm install
  npm run build
  ls dist/                 # should show: index.html  assets/  _redirects  .htaccess

Then upload everything inside dist/ to your Hostinger public_html/.

If anything broke:
  - Check that all 9 route files compile (npm run build will tell you).
  - The original files were overwritten in place; recover from git: `git checkout -- src/`
DONE
