DROP POLICY IF EXISTS skills_read ON public.skills;
CREATE POLICY skills_read ON public.skills
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = skills.user_id
        AND length(btrim(p.name)) > 0
    )
  );