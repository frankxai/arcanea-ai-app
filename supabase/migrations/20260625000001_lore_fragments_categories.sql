-- =====================================================================
-- Reconcile lore_fragments.category CHECK constraint with application code
-- =====================================================================
--
-- The original migration (20250109000000_vector_and_tools.sql) constrained
-- category to ('magic_system','geography','history','character','creature','artifact').
--
-- But the application has since written two categories that the constraint
-- rejects:
--   * 'library_text'  — used by scripts/embed-library.ts and expected by the
--                       LoreCategory type in apps/web/lib/services/vector-search.ts
--   * 'user_creation' — also declared in the LoreCategory type
--
-- Any insert/upsert with those categories fails the CHECK. This migration
-- widens the constraint to match the code, and adds a new 'lore' category for
-- the canon documents under .arcanea/lore/** (ingested via the --lore flag of
-- scripts/embed-library.ts — the Convergent system, Realms, Factions, etc.).
--
-- Idempotent: drops the existing constraint by its default name if present,
-- then re-adds the widened one.
-- =====================================================================

ALTER TABLE public.lore_fragments
    DROP CONSTRAINT IF EXISTS lore_fragments_category_check;

ALTER TABLE public.lore_fragments
    ADD CONSTRAINT lore_fragments_category_check
    CHECK (category IN (
        'magic_system',
        'geography',
        'history',
        'character',
        'creature',
        'artifact',
        'library_text',   -- Library of Arcanea content (book/**)
        'user_creation',  -- user-generated content
        'lore'            -- canon documents (.arcanea/lore/**)
    ));
