import { readFileSync } from "node:fs";
import { compile, fixture } from "./rls-initplans.mjs";

const policies = JSON.parse(
  readFileSync(
    new URL("./sql/arcanea-auth-policy-snapshot.json", import.meta.url),
  ),
);
const patch = compile(policies);
const rollback = compile(policies, { rollback: true });
const driftCase = (change, message, restore) => `
${change};
DO $test$
BEGIN
  BEGIN
    EXECUTE $candidate$${patch}$candidate$;
    RAISE EXCEPTION 'drift was not rejected' USING ERRCODE='XX000';
  EXCEPTION WHEN raise_exception THEN
    IF SQLERRM NOT LIKE '${message}%' THEN RAISE; END IF;
  END;
END $test$;
${restore};
`;
const access = `
SAVEPOINT access_case;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000001', true);
SELECT set_config('request.jwt.claim.role', 'authenticated', true);
SET LOCAL ROLE authenticated;
SELECT public.fixture_assert((SELECT count(*) = 1 FROM public.chapter_notes), 'owner reads only own notes');
INSERT INTO public.chapter_notes(id,user_id) VALUES ('00000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000001');
SELECT public.fixture_assert((SELECT count(*) = 2 FROM public.chapter_notes), 'owner inserts own note');
DO $access$
BEGIN
  BEGIN
    INSERT INTO public.chapter_notes(user_id) VALUES ('00000000-0000-0000-0000-000000000002');
    RAISE EXCEPTION 'foreign insert admitted' USING ERRCODE='XX000';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
  BEGIN
    UPDATE public.chapter_notes SET user_id='00000000-0000-0000-0000-000000000002'
      WHERE id='00000000-0000-0000-0000-000000000003';
    RAISE EXCEPTION 'owner reassignment admitted' USING ERRCODE='XX000';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
END $access$;
WITH changed AS (UPDATE public.chapter_notes SET status='edited' WHERE user_id='00000000-0000-0000-0000-000000000002' RETURNING 1)
SELECT public.fixture_assert((SELECT count(*) = 0 FROM changed), 'foreign update denied');
WITH removed AS (DELETE FROM public.chapter_notes WHERE id='00000000-0000-0000-0000-000000000003' RETURNING 1)
SELECT public.fixture_assert((SELECT count(*) = 1 FROM removed), 'owner deletes own note');
RESET ROLE;
SELECT set_config('request.jwt.claim.sub', '', true);
SET LOCAL ROLE anon;
SELECT public.fixture_assert((SELECT count(*) = 0 FROM public.chapter_notes), 'signed-out private reads denied');
SELECT public.fixture_assert((SELECT count(*) = 1 FROM public.book_chapters), 'published chapter remains public');
RESET ROLE;
SELECT set_config('request.jwt.claim.role', 'service_role', true);
SET LOCAL ROLE authenticated;
SELECT public.fixture_assert((SELECT count(*) = 1 FROM public.leaderboard_cache), 'existing role predicate preserved');
RESET ROLE;
ROLLBACK TO SAVEPOINT access_case;
RELEASE SAVEPOINT access_case;
`;

process.stdout.write(`
\\set ON_ERROR_STOP on
BEGIN;
DO $guard$ BEGIN
  IF current_database() <> 'arcanea_auth_initplans_fixture' THEN
    RAISE EXCEPTION 'Run only in the disposable arcanea_auth_initplans_fixture database';
  END IF;
END $guard$;
DO $roles$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname='authenticated') THEN CREATE ROLE authenticated NOLOGIN; END IF;
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname='anon') THEN CREATE ROLE anon NOLOGIN; END IF;
END $roles$;
CREATE SCHEMA auth;
CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
CREATE FUNCTION auth.role() RETURNS text LANGUAGE sql STABLE AS $$ SELECT current_setting('request.jwt.claim.role',true) $$;
GRANT USAGE ON SCHEMA auth TO authenticated, anon;
CREATE FUNCTION public.fixture_assert(passed boolean, message text) RETURNS void LANGUAGE plpgsql AS $$
BEGIN IF passed IS DISTINCT FROM true THEN RAISE EXCEPTION 'Assertion failed: %', message; END IF; END $$;
${fixture(policies)}
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated, anon;
INSERT INTO public.chapter_notes(id,user_id) VALUES
('00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000002');
INSERT INTO public.book_chapters(status) VALUES ('published'),('draft');
INSERT INTO public.leaderboard_cache(status) VALUES ('test');
CREATE TEMP TABLE baseline AS SELECT * FROM pg_policies WHERE schemaname='public';
${access}
${patch}
${access}
${patch}
${access}
SELECT public.fixture_assert(NOT EXISTS (
  SELECT FROM baseline b FULL JOIN pg_policies p USING(schemaname,tablename,policyname)
  WHERE p.schemaname='public' AND (b.policyname IS NULL OR p.policyname IS NULL OR
    b.roles IS DISTINCT FROM p.roles OR b.cmd IS DISTINCT FROM p.cmd OR b.permissive IS DISTINCT FROM p.permissive)
), 'policy identities, grants, commands and modes preserved');
SELECT public.fixture_assert(NOT EXISTS (
  SELECT FROM pg_policies WHERE schemaname='public' AND
  (coalesce(qual,'') || coalesce(with_check,'')) !~ 'SELECT auth\\.(uid|role)\\(\\)'
), 'all 68 policies use scalar identity subqueries');
SELECT public.fixture_assert(NOT EXISTS (
  SELECT FROM baseline b JOIN pg_policies p USING(schemaname,tablename,policyname)
  WHERE regexp_replace(p.qual, '\\(\\s*SELECT auth\\.(uid|role)\\(\\) AS (uid|role)\\s*\\)', 'auth.\\1()', 'g') IS DISTINCT FROM b.qual
    OR regexp_replace(p.with_check, '\\(\\s*SELECT auth\\.(uid|role)\\(\\) AS (uid|role)\\s*\\)', 'auth.\\1()', 'g') IS DISTINCT FROM b.with_check
), 'every predicate is unchanged apart from statement caching');
${rollback}
${access}
SELECT public.fixture_assert(NOT EXISTS (
  (SELECT * FROM baseline EXCEPT SELECT * FROM pg_policies WHERE schemaname='public')
  UNION ALL
  (SELECT * FROM pg_policies WHERE schemaname='public' EXCEPT SELECT * FROM baseline)
), 'rollback restores the exact original catalog');
${driftCase('ALTER POLICY "reviews_insert" ON public.agent_reviews TO authenticated', "Policy grants drifted:", 'ALTER POLICY "reviews_insert" ON public.agent_reviews TO public')}
${driftCase('ALTER POLICY "reviews_insert" ON public.agent_reviews WITH CHECK (false)', "WITH CHECK drifted:", 'ALTER POLICY "reviews_insert" ON public.agent_reviews WITH CHECK (auth.uid() = user_id)')}
${driftCase('ALTER POLICY "reviews_insert" ON public.agent_reviews RENAME TO "fixture_missing_policy"', "Missing policy ", 'ALTER POLICY "fixture_missing_policy" ON public.agent_reviews RENAME TO "reviews_insert"')}
ALTER POLICY "Users can view own analytics" ON public.analytics_events USING (false);
DO $test$
BEGIN
  BEGIN
    EXECUTE $candidate$${patch}$candidate$;
    RAISE EXCEPTION 'drift was not rejected' USING ERRCODE='XX000';
  EXCEPTION WHEN raise_exception THEN
    IF SQLERRM NOT LIKE 'USING drifted:%' THEN RAISE; END IF;
  END;
END $test$;
SELECT public.fixture_assert(NOT EXISTS (
  SELECT FROM pg_policies WHERE schemaname='public' AND
  (coalesce(qual,'') || coalesce(with_check,'')) ~ 'SELECT auth\\.(uid|role)\\(\\)'
), 'a failed patch rolls every preceding policy edit back');
ROLLBACK;
\\echo 'PASS: owner/foreign/anonymous access, statement caching, repeat apply, exact rollback, atomic drift rejection'
`);
