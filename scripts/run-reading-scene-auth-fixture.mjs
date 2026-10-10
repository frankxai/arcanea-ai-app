import { execFileSync, spawn } from "node:child_process";
import { createHash, createHmac, randomBytes } from "node:crypto";
import { createServer, request } from "node:http";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { setTimeout as pause } from "node:timers/promises";

// Disposable hosted acceptance only. The existing Postgres service owns the
// database lifetime; this runner owns two containers, one gateway and app jobs.
const branch = process.env.GITHUB_HEAD_REF || process.env.GITHUB_REF_NAME;
if (
  process.env.GITHUB_ACTIONS !== "true" ||
  process.env.GITHUB_REPOSITORY !== "frankxai/arcanea-ai-app" ||
  branch !== "agent/codex/reading-scene-20261010" ||
  process.env.SUPABASE_SERVICE_ROLE_KEY
)
  throw Error(
    "Real Auth acceptance requires the owned disposable hosted lane.",
  );
const head = execFileSync("git", ["rev-parse", "HEAD"], {
  encoding: "utf8",
}).trim();
if (head !== process.env.READING_SCENE_HEAD)
  throw Error("The fixture must bind the exact checked-out source.");
const password = process.env.READING_SCENE_FIXTURE_PASSWORD;
if (!/^\d+-\d+-fixture$/.test(password || ""))
  throw Error("Only the ephemeral GitHub fixture password is allowed.");
const output = "screenshots/reading-scene-auth";
mkdirSync(output, { recursive: true });
const secret = randomBytes(32).toString("hex");
const mask = (value) => console.log(`::add-mask::${value}`);
mask(secret);
const jwt = (role) => {
  const encode = (v) => Buffer.from(JSON.stringify(v)).toString("base64url");
  const body = `${encode({ alg: "HS256", typ: "JWT" })}.${encode({ role, aud: "authenticated", iss: "supabase", exp: Math.floor(Date.now() / 1000) + 3600 })}`;
  return `${body}.${createHmac("sha256", secret).update(body).digest("base64url")}`;
};
const anon = jwt("anon"),
  admin = jwt("service_role");
mask(anon);
mask(admin);
const redact = (value) =>
  [secret, password, anon, admin]
    .reduce(
      (text, credential) => text.split(credential).join("[redacted]"),
      String(value),
    )
    .replace(
      /eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g,
      "[redacted-jwt]",
    );
const namePrefix = `reading-auth-${process.env.GITHUB_RUN_ID}-${process.env.GITHUB_RUN_ATTEMPT}`;
const containers = [];
const children = new Set();
const configPath = join(
  resolve(process.env.RUNNER_TEMP),
  `${namePrefix}.private.json`,
);
let gateway;
let phase = "bootstrap";
const receipt = {
  head,
  backend: "disposable GoTrue/PostgREST/Postgres",
  productionWrites: 0,
  providerCalls: 0,
  generation: "intercepted synthetic raster; no provider credential supplied",
  passed: false,
};
let cleanupPromise;
async function finish() {
  cleanupPromise ??= (async () => {
    const errors = [];
    for (const child of children) {
      try {
        process.kill(-child.pid, "SIGKILL");
      } catch (error) {
        if (error.code !== "ESRCH")
          errors.push("Owned child termination failed");
      }
    }
    if (gateway) {
      gateway.closeAllConnections();
      await new Promise((done) => gateway.close(done));
    }
    for (const name of containers.slice().reverse()) {
      try {
        execFileSync("docker", ["rm", "-f", name], {
          timeout: 10000,
          stdio: "ignore",
        });
      } catch {
        errors.push(`Owned container removal failed: ${name}`);
      }
    }
    rmSync(configPath, { force: true });
    receipt.sourceHashes = Object.fromEntries(
      [
        "scripts/run-reading-scene-auth-fixture.mjs",
        "scripts/verify-reading-scene-auth-browser.cjs",
        "scripts/fixtures/reading-scene-auth.sql",
        "scripts/fixtures/reading-scene-postgrest.sql",
        "apps/web/app/api/reading-scenes/route.ts",
        "apps/web/lib/supabase/server.ts",
        ".github/workflows/reading-scene.yml",
      ].map((file) => [
        file,
        createHash("sha256").update(readFileSync(file)).digest("hex"),
      ]),
    );
    receipt.cleanup = { attempted: true, errors, privateConfigRemoved: true };
    if (errors.length) {
      receipt.passed = false;
      process.exitCode = 1;
    }
    writeFileSync(
      `${output}/runner-receipt.json`,
      JSON.stringify(receipt, null, 2),
    );
  })();
  return cleanupPromise;
}
for (const signal of ["SIGTERM", "SIGINT"])
  process.once(signal, () => {
    receipt.passed = false;
    receipt.phase = phase;
    receipt.error = `Hosted fixture interrupted by ${signal}`;
    void finish().finally(() => process.exit(signal === "SIGTERM" ? 143 : 130));
  });
const docker = (args) =>
  execFileSync("docker", args, {
    encoding: "utf8",
    timeout: 120000,
    stdio: ["pipe", "pipe", "pipe"],
  }).trim();
function container(label, image, env) {
  const name = `${namePrefix}-${label}`;
  containers.push(name);
  const args = [
    "run",
    "--detach",
    "--name",
    name,
    "--network",
    "host",
    "--memory",
    "512m",
    "--cpus",
    "1",
  ];
  for (const [key, value] of Object.entries(env))
    args.push("--env", `${key}=${value}`);
  docker([...args, image]);
  receipt.images ??= {};
  receipt.images[label] = docker(["inspect", "--format", "{{.Image}}", name]);
}
function sql(input) {
  return execFileSync(
    "psql",
    [
      "-h",
      "127.0.0.1",
      "-U",
      "postgres",
      "-d",
      "reading_scene_fixture",
      "-v",
      "ON_ERROR_STOP=1",
    ],
    {
      input,
      encoding: "utf8",
      timeout: 30000,
      env: { ...process.env, PGPASSWORD: password },
      stdio: ["pipe", "pipe", "pipe"],
    },
  );
}
async function ready(url) {
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(url, { signal: AbortSignal.timeout(2000) })).ok) return;
    } catch {}
    await pause(500);
  }
  throw Error(`Fixture readiness failed: ${new URL(url).pathname}`);
}
// Remove provider/admin credentials from all application/build children.
const cleanEnv = Object.fromEntries(
  Object.entries(process.env).filter(
    ([key]) =>
      !/(?:API_KEY|SERVICE_ROLE_KEY|GITHUB_TOKEN|GH_TOKEN|VERCEL_TOKEN)$/.test(
        key,
      ),
  ),
);
async function run(command, args, env, timeoutMs) {
  const child = spawn(command, args, {
    env: { ...cleanEnv, ...env },
    stdio: "inherit",
    detached: true,
  });
  children.add(child);
  const timer = setTimeout(() => {
    try {
      process.kill(-child.pid, "SIGKILL");
    } catch {}
  }, timeoutMs);
  const code = await new Promise((done, reject) => {
    child.once("exit", done);
    child.once("error", reject);
  });
  clearTimeout(timer);
  children.delete(child);
  if (code !== 0)
    throw Error(`Fixture command failed: ${command} (exit ${code})`);
}
try {
  sql(readFileSync("scripts/fixtures/reading-scene-auth.sql", "utf8"));
  container("auth", "supabase/gotrue:v2.196.0", {
    GOTRUE_API_HOST: "127.0.0.1",
    GOTRUE_API_PORT: "3802",
    API_EXTERNAL_URL: "http://127.0.0.1:3803/auth/v1",
    GOTRUE_DB_DRIVER: "postgres",
    GOTRUE_DB_DATABASE_URL: `postgres://supabase_auth_admin:${password}@127.0.0.1:5432/reading_scene_fixture`,
    GOTRUE_SITE_URL: "http://127.0.0.1:3001",
    GOTRUE_DISABLE_SIGNUP: "true",
    GOTRUE_EXTERNAL_EMAIL_ENABLED: "true",
    GOTRUE_EXTERNAL_ANONYMOUS_USERS_ENABLED: "false",
    GOTRUE_MAILER_AUTOCONFIRM: "true",
    GOTRUE_JWT_ADMIN_ROLES: "service_role",
    GOTRUE_JWT_AUD: "authenticated",
    GOTRUE_JWT_DEFAULT_GROUP_NAME: "authenticated",
    GOTRUE_JWT_EXP: "3600",
    GOTRUE_JWT_SECRET: secret,
  });
  phase = "auth-readiness";
  await ready("http://127.0.0.1:3802/health");
  // GoTrue's initial migration replaces auth.uid(); restore the inspected
  // claims-compatible body before permitting any application/database request.
  sql(
    "create or replace function auth.uid() returns uuid language sql stable as $$ select coalesce(nullif(current_setting('request.jwt.claim.sub',true),''),(nullif(current_setting('request.jwt.claims',true),'')::jsonb ->> 'sub'))::uuid $$;",
  );
  container("rest", "postgrest/postgrest:v13.0.7", {
    PGRST_DB_URI: `postgres://authenticator:${password}@127.0.0.1:5432/reading_scene_fixture`,
    PGRST_DB_SCHEMAS: "public",
    PGRST_DB_ANON_ROLE: "anon",
    PGRST_DB_POOL: "2",
    PGRST_SERVER_HOST: "127.0.0.1",
    PGRST_SERVER_PORT: "3801",
    PGRST_JWT_SECRET: secret,
  });
  await ready("http://127.0.0.1:3801/creations");
  gateway = createServer((incoming, response) => {
    const auth = incoming.url?.startsWith("/auth/v1/");
    const rest = incoming.url?.startsWith("/rest/v1/");
    if (!auth && !rest) {
      response.writeHead(404).end();
      return;
    }
    const cors = {
      "access-control-allow-origin": "http://127.0.0.1:3001",
      "access-control-allow-headers":
        "authorization,apikey,content-type,x-client-info,x-supabase-api-version,x-supabase-client-platform,x-supabase-client-platform-version,x-supabase-client-runtime,x-supabase-client-runtime-version",
      "access-control-allow-methods": "GET,POST,PATCH,PUT,DELETE,OPTIONS",
      vary: "Origin",
    };
    if (incoming.method === "OPTIONS") {
      response.writeHead(204, cors).end();
      return;
    }
    const upstream = request(
      {
        hostname: "127.0.0.1",
        port: auth ? 3802 : 3801,
        path: incoming.url.slice(8),
        method: incoming.method,
        headers: incoming.headers,
        timeout: 10000,
      },
      (res) => {
        response.writeHead(res.statusCode, { ...res.headers, ...cors });
        res.pipe(response);
      },
    );
    upstream.on("timeout", () => upstream.destroy());
    upstream.on("error", () => {
      if (!response.headersSent) response.writeHead(503, cors);
      response.end();
    });
    incoming.on("aborted", () => upstream.destroy());
    incoming.pipe(upstream);
  });
  gateway.requestTimeout = 15000;
  gateway.headersTimeout = 10000;
  await new Promise((done, reject) => {
    gateway.once("error", reject);
    gateway.listen(3803, "127.0.0.1", done);
  });
  const accounts = [];
  phase = "account-bootstrap";
  for (let i = 0; i < 2; i++) {
    const account = {
      email: `reading-${i}@example.invalid`,
      password: randomBytes(24).toString("hex"),
    };
    mask(account.password);
    const response = await fetch("http://127.0.0.1:3802/admin/users", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${admin}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...account, email_confirm: true }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok)
      throw Error(`Disposable account bootstrap failed (${response.status}).`);
    account.id = (await response.json()).id;
    if (!/^[a-f0-9-]{36}$/.test(account.id))
      throw Error("Invalid fixture account identity.");
    sql(
      `insert into public.profiles (id,username,full_name) values ('${account.id}','reading-${i}','Reader ${i}');`,
    );
    accounts.push(account);
  }
  const env = {
    NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:3803",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: anon,
    READING_SCENE_HEAD: head,
    READING_SCENE_AUTH_CONFIG: configPath,
    // A dummy local value exercises configuration UI only. The browser intercepts
    // the generation endpoint; this is never a usable provider credential.
    OPENROUTER_API_KEY: "disposable-reading-fixture-not-a-provider-key",
  };
  writeFileSync(
    configPath,
    JSON.stringify({
      head,
      base: "http://127.0.0.1:3001",
      supabaseUrl: env.NEXT_PUBLIC_SUPABASE_URL,
      anon,
      accounts,
      output,
    }),
    { mode: 0o600 },
  );
  phase = "compiled-build";
  await run(
    "pnpm",
    ["--filter", "@arcanea/web...", "--workspace-concurrency=1", "build"],
    env,
    900000,
  );
  const server = spawn(
    "pnpm",
    [
      "--dir",
      "apps/web",
      "exec",
      "next",
      "start",
      "-H",
      "127.0.0.1",
      "-p",
      "3001",
    ],
    { env: { ...cleanEnv, ...env }, stdio: "ignore", detached: true },
  );
  children.add(server);
  await ready(
    "http://127.0.0.1:3001/books/forge-of-ruin/the-forty-seven-names",
  );
  phase = "real-auth-browser";
  await run(
    "node",
    ["scripts/verify-reading-scene-auth-browser.cjs"],
    env,
    180000,
  );
  receipt.passed = true;
} catch (error) {
  // Keep bounded diagnostics without credentials, SQL account rows or headers.
  receipt.phase = phase;
  receipt.error = redact(error.message).slice(0, 1000);
  throw Error(receipt.error);
} finally {
  await finish();
}
