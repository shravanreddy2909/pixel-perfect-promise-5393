ALTER POLICY avatars_read ON storage.objects TO authenticated USING (
  bucket_id = 'avatars'
  AND (SELECT auth.uid()) IS NOT NULL
  AND (
    (storage.foldername(name))[1] = (SELECT auth.uid())::text
    OR EXISTS (
      SELECT 1 FROM public.profiles AS p
      WHERE p.avatar_path = storage.objects.name
        AND p.id::text = (storage.foldername(storage.objects.name))[1]
    )
  )
);
COMMENT ON POLICY avatars_read ON storage.objects IS 'Authenticated members may read only their own uploads or the exact current avatar referenced by its folder owner profile; other avatar objects remain owner-private.';