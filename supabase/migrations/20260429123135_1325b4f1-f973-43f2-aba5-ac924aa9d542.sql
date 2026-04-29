-- Tighten leads INSERT (still public-postable but linter-safe)
DROP POLICY "Anyone can submit a lead" ON public.leads;
CREATE POLICY "Public can submit leads" ON public.leads
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(name) BETWEEN 1 AND 200
    AND char_length(phone) BETWEEN 4 AND 30
    AND char_length(requirement) BETWEEN 1 AND 100
  );

-- Storage: drop broad SELECT (which allowed listing) — public bucket files are still fetchable by URL
DROP POLICY "Anyone can view gallery files" ON storage.objects;

-- Lock down has_role: revoke from API roles; only used inside RLS policies (runs as definer)
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon, authenticated;