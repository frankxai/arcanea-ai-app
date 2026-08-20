-- 20260816000001 shipped with #265 and has already run on hosted and preview
-- databases. Editing that file corrects only databases built from empty -- a
-- migration runner will not re-run a version it has already recorded, and the
-- policy block there is additionally guarded by IF NOT EXISTS, so an existing
-- policy is left untouched. This migration applies the same two corrections to
-- databases that already ran it.
--
-- Both statements are written to be no-ops where 20260816000001 has not run yet
-- or already produced the corrected shape.

-- 1. Drop the foreign key on world_forks.forked_by.
--    supabase-generated.ts lists only the two world relationships for this table,
--    so the constraint makes a fresh database reject rows production accepts.
--    Dropped by lookup rather than by name: the name is generated and this must
--    hold whatever it was called.
DO $$
DECLARE
  constraint_name TEXT;
BEGIN
  SELECT tc.constraint_name INTO constraint_name
  FROM information_schema.table_constraints tc
  JOIN information_schema.key_column_usage kcu
    ON kcu.constraint_name = tc.constraint_name
   AND kcu.table_schema = tc.table_schema
  WHERE tc.table_schema = 'public'
    AND tc.table_name = 'world_forks'
    AND tc.constraint_type = 'FOREIGN KEY'
    AND kcu.column_name = 'forked_by'
  LIMIT 1;

  IF constraint_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.world_forks DROP CONSTRAINT %I', constraint_name);
  END IF;
END $$;

-- 2. Rebuild forks_insert_own so it binds parent_world_id.
--    The original bound only forked_by and forked_world_id, so owning any world
--    was enough to attach forged lineage to an arbitrary parent whose UUID you
--    knew. forks_readable then exposed that row to anyone able to read either
--    end, and there is no UPDATE/DELETE policy for the real owner to remove it.
--    DROP then CREATE rather than a guarded CREATE, because the point here is to
--    replace a policy that already exists.
DROP POLICY IF EXISTS "forks_insert_own" ON public.world_forks;

CREATE POLICY "forks_insert_own" ON public.world_forks
  FOR INSERT WITH CHECK (
    forked_by = auth.uid()
    AND public.owns_world(forked_world_id)
    AND (parent_world_id IS NULL OR public.can_read_world(parent_world_id))
  );
