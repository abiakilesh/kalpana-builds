CREATE POLICY "Admins can update gallery files"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'gallery' AND has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'gallery' AND has_role(auth.uid(), 'admin'));