import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const env = readFileSync("apps/web/lib/supabase/env.ts", "utf8");
const health = readFileSync("apps/web/app/api/health/route.ts", "utf8");
const media = readFileSync("apps/web/app/api/media/catalog/route.ts", "utf8");

test("public Supabase reads require one complete non-placeholder pair", () => {
  assert.match(env, /getPublicSupabaseBinding/);
  assert.match(env, /SUPABASE_PUBLIC_BINDING_MISSING/);
  assert.match(env, /SUPABASE_PUBLIC_BINDING_INVALID/);
  assert.match(env, /NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY/);
  assert.match(env, /SUPABASE_PUBLISHABLE_KEY/);
  assert.match(env, /parsedUrl\.protocol !== 'https:'/);
  assert.match(env, /apiKey\.startsWith\('sb_publishable_'\)/);
  assert.match(env, /apiKey\.startsWith\('sb_'\)/);
  assert.match(env, /payload\.role === 'anon'/);
  assert.match(env, /!isSupportedPublicApiKey\(apiKey\)/);

  const publicBinding = env.slice(
    env.indexOf("export function getPublicSupabaseBinding"),
    env.indexOf("export function getSupabaseEnv"),
  );
  assert.doesNotMatch(publicBinding, /SUPABASE_SERVICE_ROLE_KEY/);
});

test("media catalog fails closed without leaking upstream details", () => {
  assert.match(media, /getPublicSupabaseBinding\(\)/);
  assert.match(media, /AbortSignal\.timeout\(CATALOG_READ_TIMEOUT_MS\)/);
  assert.match(media, /status:\s*503/);
  assert.match(media, /'Retry-After': '30'/);
  assert.match(media, /'Cache-Control': 'no-store'/);
  assert.match(media, /MEDIA_CATALOG_UNAVAILABLE/);
  assert.match(media, /public, s-maxage=60, stale-while-revalidate=300/);
  assert.doesNotMatch(media, /details:/);
  assert.doesNotMatch(media, /SERVICE_ROLE/);
  assert.doesNotMatch(media, /Authorization:/);
});

test("health reports readiness instead of unconditional success", () => {
  assert.match(health, /checkPublicDataReadiness\(\)/);
  assert.match(health, /rest\/v1\/media_catalog\?select=id&limit=1/);
  assert.match(health, /AbortSignal\.timeout\(READINESS_TIMEOUT_MS\)/);
  assert.match(health, /status: publicData\.ready \? 'healthy' : 'degraded'/);
  assert.match(health, /status: publicData\.ready \? 200 : 503/g);
  assert.match(health, /live: true/);
  assert.match(health, /ready: publicData\.ready/);
  assert.doesNotMatch(health, /chat:\s*true/);
  assert.doesNotMatch(health, /imagine:\s*true/);
  assert.doesNotMatch(health, /SERVICE_ROLE/);
  assert.doesNotMatch(health, /Authorization:/);
});
