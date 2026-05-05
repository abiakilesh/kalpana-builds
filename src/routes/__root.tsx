import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingCTAs } from "@/components/layout/FloatingCTAs";
import { LeadPopup } from "@/components/LeadPopup";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Kalpana Associates & Construction — Tamil Nadu's First BOQ Construction Company" },
      { name: "description", content: "Premium BOQ-based construction company in Chennai. 100% transparent pricing, on-time delivery, no hidden cost. 20+ years of trust." },
      { name: "author", content: "Kalpana Associates" },
      { property: "og:title", content: "Kalpana Associates & Construction — Tamil Nadu's First BOQ Construction Company" },
      { property: "og:description", content: "Premium BOQ-based construction company in Chennai. 100% transparent pricing, on-time delivery, no hidden cost. 20+ years of trust." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Kalpana Associates & Construction — Tamil Nadu's First BOQ Construction Company" },
      { name: "twitter:description", content: "Premium BOQ-based construction company in Chennai. 100% transparent pricing, on-time delivery, no hidden cost. 20+ years of trust." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/6eebea89-f491-459d-9b60-0ec4cb6cde2b/id-preview-03821689--91880164-840a-43cd-b3ad-94c496dce9a8.lovable.app-1777966717622.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/6eebea89-f491-459d-9b60-0ec4cb6cde2b/id-preview-03821689--91880164-840a-43cd-b3ad-94c496dce9a8.lovable.app-1777966717622.png" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <FloatingCTAs />
      <LeadPopup />
      <Toaster richColors position="top-center" />
    </div>
  );
}
