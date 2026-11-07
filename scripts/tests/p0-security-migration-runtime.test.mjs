/**
 * Runtime proof for the P0 security migration.
 *
 * The static contract test can only show what the SQL says. This test applies
 * the real migration to a real Postgres engine (PGlite, Supabase-shaped roles)
 * and switches role, so a grant that looks revoked in the file but is still
 * effective at runtime fails here.
 *
 * It stubs the tables and definer functions the migration touches. It does not
 * connect to Supabase and never touches a live project.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { PGlite } from "@electric-sql/pglite";

const migration = readFileSync(
  new URL(
    "../../supabase/migrations/20261107000001_arcanea_p0_security.sql",
    import.meta.url,
  ),
  "utf8",
).replace(/^\uFEFF/, "");

const STUB = `
  create role anon nologin;
  create role authenticated nologin;
  create role service_role nologin bypassrls;

  create schema auth;
  create function auth.uid() returns uuid language sql stable as $$ select null::uuid $$;

  create table public.profiles (
    id uuid primary key default gen_random_uuid(),
    username text unique,
    display_name text,
    avatar_url text,
    bio text,
    arcanean_id text unique,
    tier text default 'explorer',
    subscription_status text default 'active',
    stripe_customer_id text,
    stripe_subscription_id text,
    subscription_tier text,
    subscription_ends_at timestamptz,
    location text,
    website text,
    preferences jsonb default '{}'::jsonb,
    onboarding_completed boolean default false,
    onboarding_step integer default 0,
    creation_count integer default 0,
    follower_count integer default 0,
    following_count integer default 0,
    is_active boolean default true,
    is_verified boolean default false,
    magic_rank text default 'apprentice',
    gates_open integer default 0,
    active_gate text,
    guardian text,
    academy_house text,
    xp integer default 0,
    level integer default 1,
    streak_days integer default 0,
    metadata jsonb,
    last_active_at timestamptz,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
  );
  alter table public.profiles enable row level security;

  create table public.luminors (
    id uuid primary key default gen_random_uuid(),
    name text,
    is_active boolean default true,
    is_public boolean default true
  );
  alter table public.luminors enable row level security;

  create table public.arcanea_applications (
    id uuid primary key default gen_random_uuid(),
    email text not null,
    work text not null,
    created_at timestamptz default now()
  );
  alter table public.arcanea_applications enable row level security;

  grant usage on schema public to anon, authenticated;
  grant select on public.profiles to anon, authenticated;
  grant select on public.luminors to anon, authenticated;
  grant insert on public.arcanea_applications to anon, authenticated;

  create policy "Public profiles are viewable by everyone"
    on public.profiles for select using (is_active = true);
  create policy "Enable public insert for applications"
    on public.arcanea_applications for insert with check (true);

  create function public.handle_new_user() returns trigger
    language plpgsql security definer as $$ begin return new; end; $$;
  create function public.touch_profile(uuid) returns void
    language plpgsql security definer as $$ begin update public.profiles set updated_at = now() where id = $1; end; $$;
  create function public.touch_profile(uuid, text) returns void
    language plpgsql security definer as $$ begin update public.profiles set display_name = $2 where id = $1; end; $$;
  create function public.already_pinned() returns int
    language sql security definer set search_path = public as $$ select 1 $$;
`;

async function freshDatabase() {
  const db = new PGlite();
  await db.exec(STUB);
  await db.exec(migration);
  return db;
}

async function asRole(db, role, statement) {
  await db.exec("reset role");
  await db.exec(`set role ${role}`);
  try {
    const result = await db.query(statement);
    return { ok: true, rows: result.rows };
  } catch (error) {
    return { ok: false, message: error.message };
  } finally {
    await db.exec("reset role");
  }
}

test("the migration is idempotent on a real engine", async () => {
  const db = await freshDatabase();
  try {
    await db.exec(migration);
    const { rows } = await db.query(
      "select count(*)::int as n from information_schema.views where table_schema = 'public' and table_name = 'public_profiles'",
    );
    assert.equal(rows[0].n, 1, "the view exists exactly once after replay");
  } finally {
    await db.close();
  }
});

test("every SECURITY DEFINER function ends up with a pinned search_path, overloads included", async () => {
  const db = await freshDatabase();
  try {
    const { rows } = await db.query(`
      select
        p.proname,
        pg_get_function_identity_arguments(p.oid) as args,
        coalesce(p.proconfig, '{}'::text[]) as config
      from pg_proc p
      join pg_namespace n on n.oid = p.pronamespace
      where n.nspname = 'public' and p.prosecdef
    `);
    assert.equal(rows.length, 4);
    for (const row of rows) {
      assert.ok(
        row.config.some((entry) => entry.startsWith("search_path=")),
        `${row.proname}(${row.args}) has no pinned search_path`,
      );
    }
    assert.equal(
      rows.filter((row) => row.proname === "touch_profile").length,
      2,
    );
  } finally {
    await db.close();
  }
});

test("anonymous callers are denied the profiles table at runtime and keep only the safe view", async () => {
  const db = await freshDatabase();
  try {
    await db.exec(`
      insert into public.profiles (id, username, display_name, bio, arcanean_id, tier,
        subscription_status, stripe_customer_id, location, preferences, is_active)
      values
        ('11111111-1111-4111-8111-111111111111', 'lyra', 'Lyra', 'Worldsmith', 'ARC-000001',
         'creator', 'active', 'cus_secret', 'Amsterdam', '{"private":true}'::jsonb, true),
        ('22222222-2222-4222-8222-222222222222', 'hidden', 'Hidden', 'Gone', 'ARC-000002',
         'explorer', 'canceled', 'cus_hidden', 'Utrecht', '{}'::jsonb, false);
    `);

    const table = await asRole(db, "anon", "select * from public.profiles");
    assert.equal(table.ok, false, "anon SELECT on profiles must fail");
    assert.match(table.message, /permission denied/i);

    const view = await asRole(
      db,
      "anon",
      "select * from public.public_profiles order by username",
    );
    assert.equal(view.ok, true, view.message);
    assert.equal(view.rows.length, 1, "inactive profiles must stay hidden");
    const row = view.rows[0];
    assert.equal(row.display_name, "Lyra");
    for (const forbidden of [
      "stripe_customer_id",
      "stripe_subscription_id",
      "subscription_status",
      "subscription_tier",
      "location",
      "website",
      "preferences",
      "metadata",
    ]) {
      assert.equal(
        forbidden in row,
        false,
        `${forbidden} leaked through the public view`,
      );
    }
  } finally {
    await db.close();
  }
});

test("the intentional anon surfaces keep working and stay minimal", async () => {
  const db = await freshDatabase();
  try {
    const luminors = await asRole(
      db,
      "anon",
      "select count(*)::int as n from public.luminors",
    );
    assert.equal(luminors.ok, true, luminors.message);

    const apply = await asRole(
      db,
      "anon",
      "insert into public.arcanea_applications (email, work) values ('a@example.test', 'writer')",
    );
    assert.equal(apply.ok, true, apply.message);

    const read = await asRole(
      db,
      "anon",
      "select * from public.arcanea_applications",
    );
    assert.equal(read.ok, false, "applications must stay write-only for anon");
    assert.match(read.message, /permission denied/i);
  } finally {
    await db.close();
  }
});

test("rolling back means dropping the view; the table grant stays revoked until re-granted", async () => {
  const db = await freshDatabase();
  try {
    await db.exec("drop view public.public_profiles");
    const { rows } = await db.query(
      "select count(*)::int as n from information_schema.views where table_schema = 'public' and table_name = 'public_profiles'",
    );
    assert.equal(rows[0].n, 0);
    const grant = await db.query(
      "select has_table_privilege('anon', 'public.profiles', 'select') as anon_profiles",
    );
    assert.equal(grant.rows[0].anon_profiles, false);
  } finally {
    await db.close();
  }
});
