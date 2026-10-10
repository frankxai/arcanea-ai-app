import { spawn, execFileSync } from "node:child_process";
import { createHmac, randomBytes } from "node:crypto";
import { createServer, request } from "node:http";
import { mkdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { setTimeout as pause } from "node:timers/promises";

// This runner owns three disposable containers and a loopback-only gateway.
// Never run against a hosted URL or expose an admin key to the application.
if (
  process.env.GITHUB_ACTIONS !== "true" ||
  process.env.GITHUB_REPOSITORY !== "frankxai/arcanea-ai-app" ||
  process.env.GITHUB_REF_NAME !== "agent/codex/world-creator-recovery-20261010"
)
  throw Error(
    "Disposable world acceptance is restricted to the owned hosted lane.",
  );
const head = execFileSync("git", ["rev-parse", "HEAD"], {
  encoding: "utf8",
}).trim();
if (head !== process.env.GITHUB_SHA)
  throw Error("Acceptance must use the exact checked-out head.");
if (process.env.SUPABASE_SERVICE_ROLE_KEY)
  throw Error("No hosted administrative credential is permitted.");
const output = "screenshots/world-service";
mkdirSync(output, { recursive: true });
const secret = randomBytes(32).toString("hex");
const password = randomBytes(24).toString("hex");
const mask = (value) => console.log(`::add-mask::${value}`);
mask(secret);
mask(password);
if (process.env.WORLD_TEST_API_KEY) mask(process.env.WORLD_TEST_API_KEY);
function jwt(role) {
  const encoded = (x) => Buffer.from(JSON.stringify(x)).toString("base64url");
  const body = `${encoded({ alg: "HS256", typ: "JWT" })}.${encoded({ role, iss: "supabase", iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 3600 })}`;
  return `${body}.${createHmac("sha256", secret).update(body).digest("base64url")}`;
}
const anon = jwt("anon"),
  admin = jwt("service_role");
mask(anon);
mask(admin);
const network = `world-${process.env.GITHUB_RUN_ID}-${process.env.GITHUB_RUN_ATTEMPT}`;
const containers = [];
const children = new Set();
let gateway;
let interruptLocationWrite = true;
const configPath = join(process.env.RUNNER_TEMP, "world-fixture.private.json");
const receipt = {
  head,
  backend: "disposable Supabase Auth/PostgREST/PostgreSQL",
  productionWrites: 0,
  providerCalls: 0,
  scope: "App owner save/reopen; projection fixture is not a production clone",
  passed: false,
};
let phase = "container-admission";
const docker = (args) =>
  execFileSync("docker", args, {
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"],
    timeout: 120000,
  }).trim();
function container(label, image, env, port) {
  const name = `${network}-${label}`;
  const args = [
    "run",
    "--detach",
    "--name",
    name,
    "--network",
    network,
    "--network-alias",
    label,
    "--memory",
    "512m",
    "--cpus",
    "1",
  ];
  if (port) args.push("--publish", `127.0.0.1:${port}`);
  for (const [key, value] of Object.entries(env))
    args.push("--env", `${key}=${value}`);
  args.push(image);
  // Record the name before starting so a partial startup is still cleaned up.
  containers.push(name);
  docker(args);
  receipt.images ??= {};
  receipt.images[label] = docker(["inspect", "--format", "{{.Image}}", name]);
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
async function run(command, args, env, timeoutMs) {
  const child = spawn(command, args, {
    env: { ...process.env, ...env },
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
    child.once("error", reject);
    child.once("exit", done);
  });
  clearTimeout(timer);
  children.delete(child);
  if (code !== 0)
    throw Error(`Fixture command failed: ${command} (exit ${code})`);
}
try {
  docker(["network", "create", network]);
  container("db", "postgres:17", { POSTGRES_PASSWORD: password }, undefined);
  const db = `${network}-db`;
  let available = false;
  for (let i = 0; i < 60; i++) {
    try {
      docker(["exec", db, "pg_isready", "-U", "postgres"]);
      available = true;
      break;
    } catch {
      await pause(500);
    }
  }
  if (!available) throw Error("Fixture database readiness failed.");
  execFileSync(
    "docker",
    [
      "exec",
      "-i",
      db,
      "psql",
      "-U",
      "postgres",
      "-v",
      "ON_ERROR_STOP=1",
      "-v",
      `fixture_password=${password}`,
    ],
    {
      input: readFileSync("supabase/tests/world-creator-service-fixture.sql"),
      stdio: ["pipe", "pipe", "pipe"],
      timeout: 30000,
    },
  );
  container(
    "auth",
    "supabase/gotrue:v2.196.0",
    {
      GOTRUE_API_HOST: "0.0.0.0",
      GOTRUE_API_PORT: "9999",
      API_EXTERNAL_URL: "http://127.0.0.1:54321/auth/v1",
      GOTRUE_DB_DRIVER: "postgres",
      GOTRUE_DB_DATABASE_URL: `postgres://supabase_auth_admin:${password}@db:5432/postgres`,
      GOTRUE_SITE_URL: "http://127.0.0.1:3001",
      GOTRUE_URI_ALLOW_LIST: "http://127.0.0.1:3001/**",
      GOTRUE_DISABLE_SIGNUP: "true",
      GOTRUE_EXTERNAL_EMAIL_ENABLED: "true",
      GOTRUE_EXTERNAL_ANONYMOUS_USERS_ENABLED: "false",
      GOTRUE_MAILER_AUTOCONFIRM: "true",
      GOTRUE_JWT_ADMIN_ROLES: "service_role",
      GOTRUE_JWT_AUD: "authenticated",
      GOTRUE_JWT_DEFAULT_GROUP_NAME: "authenticated",
      GOTRUE_JWT_EXP: "3600",
      GOTRUE_JWT_SECRET: secret,
    },
    "54323:9999",
  );
  phase = "auth-readiness";
  await ready("http://127.0.0.1:54323/health");
  docker([
    "exec",
    db,
    "psql",
    "-U",
    "postgres",
    "-v",
    "ON_ERROR_STOP=1",
    "-c",
    "create or replace function auth.uid() returns uuid language sql stable as $$ select coalesce(nullif(current_setting('request.jwt.claim.sub', true), ''), (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub'))::uuid $$; alter table public.worlds add foreign key(creator_id) references auth.users(id); alter table public.world_creations add foreign key(creator_id) references auth.users(id); alter table public.world_collaborators add foreign key(user_id) references auth.users(id);",
  ]);
  container(
    "rest",
    "postgrest/postgrest:v14.17",
    {
      PGRST_DB_URI: `postgres://authenticator:${password}@db:5432/postgres`,
      PGRST_DB_SCHEMAS: "public",
      PGRST_DB_ANON_ROLE: "anon",
      PGRST_JWT_SECRET: secret,
    },
    "54322:3000",
  );
  gateway = createServer((incoming, response) => {
    const auth = incoming.url?.startsWith("/auth/v1/");
    const rest = incoming.url?.startsWith("/rest/v1/");
    if (!auth && !rest) {
      response.writeHead(404).end();
      return;
    }
    const headers = {
      "access-control-allow-origin": "http://127.0.0.1:3001",
      "access-control-allow-headers":
        "authorization,apikey,content-type,x-client-info,x-supabase-api-version",
      "access-control-allow-methods": "GET,POST,PATCH,PUT,DELETE,OPTIONS",
      vary: "Origin",
    };
    if (incoming.method === "OPTIONS") {
      response.writeHead(204, headers).end();
      return;
    }
    if (
      interruptLocationWrite &&
      incoming.method === "POST" &&
      incoming.url.startsWith("/rest/v1/world_locations")
    ) {
      interruptLocationWrite = false;
      incoming.resume();
      response
        .writeHead(503, { ...headers, "content-type": "application/json" })
        .end('{"message":"Disposable fixture interruption"}');
      return;
    }
    const upstream = request(
      {
        hostname: "127.0.0.1",
        port: auth ? 54323 : 54322,
        path: incoming.url.slice(auth ? 8 : 8),
        method: incoming.method,
        headers: incoming.headers,
        timeout: 10000,
      },
      (res) => {
        response.writeHead(res.statusCode, { ...res.headers, ...headers });
        res.pipe(response);
      },
    );
    upstream.on("timeout", () => upstream.destroy());
    upstream.on("error", () => {
      if (!response.headersSent) response.writeHead(503, headers);
      response.end();
    });
    incoming.on("aborted", () => upstream.destroy());
    incoming.pipe(upstream);
  });
  gateway.requestTimeout = 15000;
  gateway.headersTimeout = 10000;
  await new Promise((done) => gateway.listen(54321, "127.0.0.1", done));
  await ready("http://127.0.0.1:54321/rest/v1/");
  phase = "account-bootstrap";
  const accounts = [];
  for (let i = 0; i < 2; i++) {
    const account = {
      email: `world-${i}@example.invalid`,
      password: randomBytes(24).toString("hex"),
    };
    mask(account.password);
    const res = await fetch("http://127.0.0.1:54321/auth/v1/admin/users", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${admin}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...account, email_confirm: true }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok)
      throw Error(`Disposable account bootstrap failed (${res.status}).`);
    account.id = (await res.json()).id;
    if (!/^[a-f0-9-]{36}$/.test(account.id))
      throw Error("Invalid fixture account identity.");
    docker([
      "exec",
      db,
      "psql",
      "-U",
      "postgres",
      "-v",
      "ON_ERROR_STOP=1",
      "-c",
      `insert into public.profiles(id,username,full_name) values ('${account.id}','fixture-${i}','Fixture ${i}');`,
    ]);
    accounts.push(account);
  }
  writeFileSync(
    configPath,
    JSON.stringify({
      head,
      base: "http://127.0.0.1:3001",
      supabaseUrl: "http://127.0.0.1:54321",
      anon,
      accounts,
      output,
    }),
    { mode: 0o600 },
  );
  const env = {
    NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: anon,
    WORLD_TEST_CONFIG: configPath,
  };
  phase = "compiled-app-build";
  await run(
    "pnpm",
    ["turbo", "run", "build", "--filter=@arcanea/web"],
    env,
    600000,
  );
  await run(
    "pnpm",
    [
      "--dir",
      "apps/web",
      "exec",
      "playwright",
      "install",
      "--with-deps",
      "chromium",
    ],
    env,
    120000,
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
    { env: { ...process.env, ...env }, stdio: "ignore", detached: true },
  );
  children.add(server);
  await ready("http://127.0.0.1:3001/worlds/create?resume=1");
  phase = "browser-acceptance";
  await run("node", ["scripts/verify-world-preview-browser.cjs"], env, 240000);
  receipt.passed = true;
} catch (error) {
  // Docker and authentication errors may include private environment values.
  receipt.failure = "Hosted disposable acceptance did not complete.";
  receipt.failurePhase = phase;
  let message = String(error.message || error).slice(-2400);
  for (const value of [
    secret,
    password,
    anon,
    admin,
    process.env.WORLD_TEST_API_KEY,
  ].filter(Boolean))
    message = message.replaceAll(value, "[redacted]");
  console.error(message);
  // Startup diagnostics only, with every generated credential removed. Do not
  // retain container logs or private configuration in public artifacts.
  if (phase === "auth-readiness") {
    try {
      let log = docker(["logs", "--tail", "15", `${network}-auth`]);
      for (const value of [secret, password, anon, admin])
        log = log.replaceAll(value, "[redacted]");
      console.error(log);
    } catch {}
  }
  console.error(
    "Hosted disposable world acceptance failed; inspect retained safe browser evidence.",
  );
  process.exitCode = 1;
} finally {
  for (const child of children) {
    try {
      process.kill(-child.pid, "SIGKILL");
    } catch {}
  }
  gateway?.closeAllConnections();
  gateway?.close();
  for (const name of containers.reverse()) {
    try {
      docker(["rm", "--force", name]);
    } catch {}
  }
  try {
    docker(["network", "rm", network]);
  } catch {}
  rmSync(configPath, { force: true });
  writeFileSync(
    `${output}/service-receipt.json`,
    JSON.stringify(receipt, null, 2),
  );
}
