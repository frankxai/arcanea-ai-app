import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

/**
 * Migration contract for the Stripe payments mirror.
 *
 * The webhook is the only writer and it runs under the service role, so the
 * failure this test guards against is a future edit that quietly re-opens the
 * tables to browsers or drops the idempotency ledger.
 */

const migration = readFileSync(
  new URL(
    "../../../../../supabase/migrations/20261107000001_payments_mirror.sql",
    import.meta.url,
  ),
  "utf8",
);

const tables = [
  "stripe_customers",
  "stripe_products",
  "stripe_prices",
  "stripe_subscriptions",
  "stripe_processed_events",
];

test("creates every mirror table additively", () => {
  for (const table of tables) {
    assert.match(
      migration,
      new RegExp(`create table if not exists public\\.${table}\\b`),
      table,
    );
  }
  assert.doesNotMatch(migration, /^\s*drop\s/m);
});

test("enables RLS on every mirror table", () => {
  for (const table of tables) {
    assert.match(
      migration,
      new RegExp(`alter table public\\.${table} enable row level security`),
      table,
    );
  }
});

test("browser roles are revoked and only the service role is granted", () => {
  for (const table of tables) {
    assert.match(
      migration,
      new RegExp(`revoke all on table public\\.${table} from anon, authenticated`),
      table,
    );
    assert.match(
      migration,
      new RegExp(
        `grant select, insert, update, delete on table public\\.${table} to service_role`,
      ),
      table,
    );
  }
  assert.doesNotMatch(migration.toLowerCase(), /create policy/);
});

test("subscription mirror stores status and item-level period bounds", () => {
  assert.match(migration, /status text not null/);
  assert.match(migration, /current_period_start timestamptz/);
  assert.match(migration, /current_period_end timestamptz/);
  assert.match(migration, /cancel_at_period_end boolean not null default false/);
});

test("the event ledger is keyed by the Stripe event id", () => {
  assert.match(migration, /create table if not exists public\.stripe_processed_events/);
  assert.match(migration, /id text primary key/);
});
