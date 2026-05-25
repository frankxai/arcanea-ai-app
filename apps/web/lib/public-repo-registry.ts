import repoConfig from "../../../.arcanea/config/repos.json";

// `visibility` and `publicUrl` are present on some repo entries in
// .arcanea/config/repos.json but not all — JSON-derived union types lose
// optional fields. Widen with explicit optionals so statusFor() / url mapping
// type-check without per-site `in` guards.
type ConfigRepo = (typeof repoConfig.repos)[number] & {
  visibility?: "public" | "private" | "unresolved" | "upstream-public";
  publicUrl?: string | null;
};

export type PublicRepoGroup =
  | "core"
  | "intelligence"
  | "tools"
  | "protocol"
  | "archive"
  | "upstream";

export type PublicRepoStatus =
  | "public"
  | "private"
  | "beta"
  | "unresolved"
  | "upstream";

export interface PublicRepo {
  name: string;
  group: PublicRepoGroup;
  description: string;
  language: string;
  status: PublicRepoStatus;
  url: string | null;
  github: string;
  role: string;
  branch: string;
  packages: string[];
}

const ROLE_GROUP: Record<string, PublicRepoGroup> = {
  production: "core",
  oss: "core",
  product: "core",
  substrate: "intelligence",
  harness: "tools",
  orchestration: "tools",
  "coding-cli": "tools",
  capture: "tools",
  "adoption-kit": "protocol",
  vertical: "protocol",
  "infrastructure-unresolved": "archive",
  "upstream-runtime": "upstream",
};

function titleCase(value: string) {
  return value
    .split(/[-.]/)
    .filter(Boolean)
    .map((part) => part.slice(0, 1).toUpperCase() + part.slice(1))
    .join(" ");
}

function languageFor(repo: ConfigRepo) {
  if (repo.stack.includes("typescript")) return "TypeScript";
  if (repo.stack.includes("markdown")) return "Markdown";
  if (repo.stack.includes("yaml")) return "YAML";
  if (repo.stack.includes("node")) return "Node";
  return titleCase(repo.stack[0] ?? "Mixed");
}

function statusFor(repo: ConfigRepo): PublicRepoStatus {
  if (repo.visibility === "unresolved" || !repo.active) return "unresolved";
  if (repo.visibility === "private") return "private";
  if (repo.visibility === "upstream-public") return "upstream";
  if (repo.branch !== "main") return "beta";
  return "public";
}

export const PUBLIC_REPOS: PublicRepo[] = (repoConfig.repos as ConfigRepo[]).map((repo) => ({
  name: repo.name,
  group: ROLE_GROUP[repo.role] ?? "tools",
  description: repo.description,
  language: languageFor(repo),
  status: statusFor(repo),
  url: repo.publicUrl ?? null,
  github: repo.github,
  role: repo.role,
  branch: repo.branch,
  packages: "publishes" in repo ? repo.publishes ?? [] : [],
}));

export const ARC_REPOS = PUBLIC_REPOS.filter((repo) => repo.group !== "upstream");
export const ACTIVE_ARC_REPOS = ARC_REPOS.filter((repo) => repo.status !== "unresolved");
export const PUBLIC_ARC_REPOS = ACTIVE_ARC_REPOS.filter((repo) => repo.url?.startsWith("https://github.com/"));
export const UNRESOLVED_ARC_REPOS = ARC_REPOS.filter((repo) => repo.status === "unresolved");
export const UPSTREAM_REPOS = PUBLIC_REPOS.filter((repo) => repo.group === "upstream");

export const PUBLIC_REPO_SUMMARY = {
  tracked: ARC_REPOS.length,
  active: ACTIVE_ARC_REPOS.length,
  public: PUBLIC_ARC_REPOS.length,
  private: ACTIVE_ARC_REPOS.filter((repo) => repo.status === "private").length,
  unresolved: UNRESOLVED_ARC_REPOS.length,
  upstream: UPSTREAM_REPOS.length,
  packages: Array.from(new Set(PUBLIC_REPOS.flatMap((repo) => repo.packages))).length,
};

export const PUBLIC_PACKAGE_NAMES = Array.from(
  new Set(PUBLIC_REPOS.flatMap((repo) => repo.packages)),
).sort();
