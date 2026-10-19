// Import only in the owned disposable hosted server. Production never loads this hook.
if (
  process.env.GITHUB_ACTIONS !== "true" ||
  process.env.GITHUB_REPOSITORY !== "frankxai/arcanea-ai-app" ||
  process.env.GITHUB_REF_NAME !== "agent/codex/generation-admission-20261011" ||
  process.env.GENERATION_FIXTURE_ORIGIN !== "http://127.0.0.1:54321" ||
  !/^fixture-[a-f0-9]{64}$/.test(process.env.XAI_API_KEY ?? "")
)
  throw Error(
    "Provider fixture requires the owned local-only hosted acceptance lane",
  );
const transport = globalThis.fetch;
globalThis.fetch = async (input, init) => {
  const url = new URL(input instanceof Request ? input.url : String(input));
  if (
    ["openrouter.ai", "generativelanguage.googleapis.com"].includes(
      url.hostname,
    )
  )
    throw Error("Paid provider access is prohibited in this fixture");
  if (url.hostname !== "api.x.ai") return transport(input, init);
  if (
    input instanceof Request ||
    url.origin !== "https://api.x.ai" ||
    !/^\/v1\/images\/(?:generations|[A-Za-z0-9_-]+)$/.test(url.pathname) ||
    url.search ||
    url.hash ||
    url.username ||
    url.password ||
    new Headers(init?.headers).get("Authorization") !==
      `Bearer ${process.env.XAI_API_KEY}`
  )
    throw Error("Unscoped provider fixture request refused");
  return transport(process.env.GENERATION_FIXTURE_ORIGIN + url.pathname, {
    ...init,
    redirect: "error",
  });
};
