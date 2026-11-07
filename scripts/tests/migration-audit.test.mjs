import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import {
  fingerprint,
  maskSqlComments,
  scanPaths,
  scanSql,
} from "../../scripts/audit-migrations.mjs";

const ROOT = process.cwd();

test("the auditor catches the failure modes that matter", () => {
  const bad = `
create table public.notes (id uuid primary key);
create policy "everyone" on public.notes for select using (true);
grant select on public.notes to anon;
create or replace function public.do_thing() returns void
  language plpgsql security definer as $$ begin return; end; $$;
drop table public.old_notes;
`;
  const rules = new Set(scanSql(bad, "bad.sql").map((finding) => finding.rule));
  assert.ok(rules.has("table-without-rls"));
  assert.ok(rules.has("policy-allows-everyone"));
  assert.ok(rules.has("grant-to-anon"));
  assert.ok(rules.has("security-definer-no-search-path"));
  assert.ok(rules.has("destructive-statement"));
});

test("a definer function with a pinned search_path and RLS is accepted", () => {
  const good = `
begin;
create table public.notes (id uuid primary key);
alter table public.notes enable row level security;
create function public.note_count() returns int
  language sql security definer set search_path = public as $$ select 1; $$;
commit;
`;
  assert.deepEqual(scanSql(good, "good.sql"), []);
});

test("comments cannot prove RLS or hide a grant", () => {
  const commented = `
-- alter table public.notes enable row level security;
create table public.notes (id uuid primary key);
/* grant select on public.notes to anon; */
`;
  const rules = new Set(
    scanSql(commented, "comments.sql").map((finding) => finding.rule),
  );
  assert.ok(rules.has("table-without-rls"));
  assert.equal(rules.has("grant-to-anon"), false);
  assert.equal(maskSqlComments("select 1 -- note\n+ 1").split("\n").length, 2);
});

test("a rule name containing -- inside a string is not a comment", () => {
  const withString = `
create table public.notes (id uuid primary key);
alter table public.notes enable row level security;
insert into public.notes values ('https://example.test/a--b');
`;
  assert.deepEqual(scanSql(withString, "literal.sql"), []);
});

test("ALTER POLICY with true is caught, and the policy name is reported", () => {
  const findings = scanSql(
    `alter policy "public read" on public.notes using (true);`,
    "alter.sql",
  );
  assert.equal(findings.length, 1);
  assert.match(findings[0].message, /public read/);
});

test("a permissive clause is found anywhere in the policy statement", () => {
  const longColumns = Array.from(
    { length: 40 },
    (_, index) => `column_${index} text`,
  ).join(", ");
  const sql = `
create table public.notes (${longColumns});
alter table public.notes enable row level security;
create policy "wide" on public.notes for select to authenticated using (true);
`;
  const findings = scanSql(sql, "wide.sql");
  assert.equal(
    findings.filter((finding) => finding.rule === "policy-allows-everyone")
      .length,
    1,
  );
});

test("a view grant is reported unless the migration carries the review marker", () => {
  const marked = `
-- audit: public-view public_notes
create view public.public_notes as select id from public.notes;
grant select on public.public_notes to anon;
`;
  assert.deepEqual(scanSql(marked, "marked.sql"), []);

  const unmarked = `
create view public.public_notes as select id from public.notes;
grant select on public.public_notes to anon;
`;
  assert.equal(
    scanSql(unmarked, "unmarked.sql").filter(
      (finding) => finding.rule === "grant-to-anon",
    ).length,
    1,
  );
});

test("a DO-block exemption requires the loop body to enable RLS", () => {
  const real = `
do $$
declare table_name text;
begin
  foreach table_name in array array['first', 'second']
  loop
    execute format('alter table public.%I enable row level security', table_name);
  end loop;
end $$;
`;
  assert.equal(
    scanSql(real, "loop.sql").filter(
      (finding) => finding.rule === "table-without-rls",
    ).length,
    0,
  );

  const claimed = `
do $$
declare table_name text;
begin
  foreach table_name in array array['first', 'second']
  loop
    raise notice '%', table_name;
  end loop;
end $$;
create table public.first (id uuid primary key);
`;
  const findings = scanSql(claimed, "claimed.sql");
  assert.equal(
    findings.filter((finding) => finding.rule === "table-without-rls").length,
    1,
  );
});

test("ALTER TABLE DROP COLUMN and DROP CONSTRAINT are destructive", () => {
  const findings = scanSql(
    `alter table public.notes drop column body;`,
    "drop-column.sql",
  );
  assert.equal(
    findings.filter((finding) => finding.rule === "destructive-statement")
      .length,
    1,
  );
  const constraint = scanSql(
    `alter table public.notes drop constraint notes_body_check;`,
    "drop-constraint.sql",
  );
  assert.equal(
    constraint.filter((finding) => finding.rule === "destructive-statement")
      .length,
    1,
  );
});

test("tagged dollar quotes delimit a function body", () => {
  const tagged = `
create function public.f() returns void
  language plpgsql security definer
  as $fn$ begin perform 1; end $fn$;
`;
  const findings = scanSql(tagged, "tagged.sql");
  assert.equal(
    findings.filter(
      (finding) => finding.rule === "security-definer-no-search-path",
    ).length,
    1,
  );

  const pinned = `
create function public.g() returns void
  language plpgsql security definer set search_path = public, pg_temp
  as $fn$ begin perform 1; end $fn$;
`;
  assert.deepEqual(scanSql(pinned, "pinned.sql"), []);
});

test("a comment inside the body cannot pin a definer function", () => {
  const commented = `
create function public.f() returns void
  language plpgsql security definer
  as $$
  -- TODO: SET search_path = public before enabling this.
  begin perform 1; end;
  $$;
`;
  assert.equal(
    scanSql(commented, "body-comment.sql").filter(
      (finding) => finding.rule === "security-definer-no-search-path",
    ).length,
    1,
  );
});

test("a multi-object grant is exempt only when every object is a reviewed view", () => {
  const mixed = `
-- audit: public-view public_notes
create view public.public_notes as select id from public.notes;
grant select on public.public_notes, public.notes to anon;
`;
  assert.equal(
    scanSql(mixed, "mixed.sql").filter(
      (finding) => finding.rule === "grant-to-anon",
    ).length,
    1,
  );

  const allViews = `
-- audit: public-view public_notes
create view public.public_notes as select id from public.notes;
grant select on public.public_notes to anon;
`;
  assert.equal(
    scanSql(allViews, "views.sql").filter(
      (finding) => finding.rule === "grant-to-anon",
    ).length,
    0,
  );
});

test("RLS enabled on another schema does not protect a public table", () => {
  const sql = `
create table public.notes (id uuid primary key);
alter table private.notes enable row level security;
`;
  const findings = scanSql(sql, "schema.sql");
  assert.equal(
    findings.filter((finding) => finding.rule === "table-without-rls").length,
    1,
  );
});

test("a schema-qualified table is protected by RLS in its own schema", () => {
  const sql = `
create table gencreator.signups (id uuid primary key);
alter table gencreator.signups enable row level security;
`;
  assert.equal(
    scanSql(sql, "own-schema.sql").filter(
      (finding) => finding.rule === "table-without-rls",
    ).length,
    0,
  );
});

test("a destructive statement after another statement on the same line is caught", () => {
  const sql = `create table public.notes (id uuid primary key); drop table public.old_notes;`;
  const findings = scanSql(sql, "inline.sql");
  assert.equal(
    findings.filter((finding) => finding.rule === "destructive-statement")
      .length,
    1,
  );
});

test("a function elevated through ALTER FUNCTION is audited", () => {
  const elevated = `
create function public.member_count() returns int language sql as $$ select 1; $$;
alter function public.member_count() security definer;
`;
  const findings = scanSql(elevated, "elevated.sql");
  assert.equal(
    findings.filter(
      (finding) => finding.rule === "security-definer-no-search-path",
    ).length,
    1,
  );

  const pinned = `
create function public.member_count() returns int language sql as $$ select 1; $$;
alter function public.member_count() security definer set search_path = public, pg_temp;
`;
  assert.equal(
    scanSql(pinned, "pinned-alter.sql").filter(
      (finding) => finding.rule === "security-definer-no-search-path",
    ).length,
    0,
  );
});

test("a string literal is not direct RLS evidence", () => {
  const sql = `
create table public.notes (id uuid primary key);
select 'alter table public.notes enable row level security';
`;
  assert.equal(
    scanSql(sql, "literal-rls.sql").filter(
      (finding) => finding.rule === "table-without-rls",
    ).length,
    1,
  );
});

test("a grant is scanned through its statement boundary", () => {
  const columns = Array.from(
    { length: 60 },
    (_, index) => `column_${index}`,
  ).join(", ");
  const sql = `grant select (${columns}) on public.notes to anon;`;
  assert.equal(
    scanSql(sql, "wide-grant.sql").filter(
      (finding) => finding.rule === "grant-to-anon",
    ).length,
    1,
  );
});

test("only USAGE is exempt on a schema grant", () => {
  assert.equal(
    scanSql(`grant usage on schema public to anon;`, "usage.sql").length,
    0,
  );
  for (const statement of [
    `grant create on schema public to anon;`,
    `grant all on schema public to anon;`,
  ]) {
    assert.equal(
      scanSql(statement, "ddl-grant.sql").filter(
        (finding) => finding.rule === "grant-to-anon",
      ).length,
      1,
      statement,
    );
  }
});

test("RESET search_path on a definer function is a finding", () => {
  const sql = `
create function public.member_count() returns int
  language sql security definer set search_path = public as $$ select 1; $$;
alter function public.member_count() reset search_path;
`;
  const findings = scanSql(sql, "reset.sql");
  assert.equal(
    findings.filter(
      (finding) => finding.rule === "security-definer-no-search-path",
    ).length,
    1,
  );
  assert.match(findings[0].message, /reset/);
});

test("two destructive statements in one file fingerprint separately", () => {
  const sql = `
delete from public.a where id = 1;
delete from public.b where id = 2;
`;
  const prints = scanSql(sql, "two.sql").map(fingerprint);
  assert.equal(new Set(prints).size, 2);
});

test("every current finding is baselined, so the ratchet is actually applied", () => {
  // A baseline generated on Windows once stored backslash paths and silently
  // matched nothing on Linux. Comparing counts catches that class of bug.
  const { findings } = scanPaths([join(ROOT, "supabase/migrations")]);
  const baseline = new Set(
    JSON.parse(
      readFileSync(join(ROOT, "scripts/migration-audit-baseline.json"), "utf8"),
    ).fingerprints,
  );
  assert.ok(
    findings.length > 0,
    "the migration tree should contain findings to ratchet",
  );
  const unbaselined = findings.filter(
    (finding) => !baseline.has(fingerprint(finding)),
  );
  assert.deepEqual(
    unbaselined.map(
      (finding) => `${finding.rule} ${finding.file}:${finding.line}`,
    ),
    [],
  );
});
