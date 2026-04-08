export interface Endpoint {
  method: "GET" | "POST" | "PATCH" | "DELETE";
  path: string;
  description: string;
  requestBody?: string;
  responseBody: string;
  curl: string;
  typescript: string;
}

export interface ApiSection {
  id: string;
  title: string;
  description: string;
  color: string;
  endpoints: Endpoint[];
}

export const METHOD_COLORS: Record<string, { bg: string; text: string }> = {
  GET: { bg: "bg-emerald-500/15", text: "text-emerald-400" },
  POST: { bg: "bg-blue-500/15", text: "text-blue-400" },
  PATCH: { bg: "bg-amber-500/15", text: "text-amber-400" },
  DELETE: { bg: "bg-red-500/15", text: "text-red-400" },
};

export const BASE = "https://arcanea.ai";

export const API_SECTIONS: ApiSection[] = [
  {
    id: "memory",
    title: "Memory API",
    description:
      "AgentDB Cloud — persistent memory for AI agents with semantic search, namespaces, and TTL support.",
    color: "#7fffd4",
    endpoints: [
      {
        method: "POST",
        path: "/api/memory",
        description: "Store a memory with optional namespace, tags, and TTL.",
        requestBody: `{
  "key": "pattern-auth",
  "value": "JWT with rotating refresh tokens",
  "namespace": "patterns",
  "tags": ["auth", "security"],
  "ttl": 86400
}`,
        responseBody: `{
  "success": true,
  "key": "pattern-auth",
  "namespace": "patterns",
  "created_at": "2026-03-29T12:00:00Z"
}`,
        curl: `curl -X POST ${BASE}/api/memory \\
  -H "Authorization: Bearer arc_XXXXX" \\
  -H "Content-Type: application/json" \\
  -d '{
    "key": "pattern-auth",
    "value": "JWT with rotating refresh tokens",
    "namespace": "patterns",
    "tags": ["auth", "security"]
  }'`,
        typescript: `const res = await fetch("${BASE}/api/memory", {
  method: "POST",
  headers: {
    Authorization: "Bearer arc_XXXXX",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    key: "pattern-auth",
    value: "JWT with rotating refresh tokens",
    namespace: "patterns",
    tags: ["auth", "security"],
  }),
});
const data = await res.json();`,
      },
      {
        method: "GET",
        path: "/api/memory",
        description:
          "List memories. Filter by namespace and limit results.",
        responseBody: `{
  "memories": [
    {
      "key": "pattern-auth",
      "value": "JWT with rotating refresh tokens",
      "namespace": "patterns",
      "tags": ["auth", "security"],
      "created_at": "2026-03-29T12:00:00Z"
    }
  ],
  "total": 1,
  "limit": 50,
  "offset": 0
}`,
        curl: `curl "${BASE}/api/memory?namespace=patterns&limit=10" \\
  -H "Authorization: Bearer arc_XXXXX"`,
        typescript: `const res = await fetch(
  "${BASE}/api/memory?namespace=patterns&limit=10",
  { headers: { Authorization: "Bearer arc_XXXXX" } }
);
const data = await res.json();`,
      },
      {
        method: "POST",
        path: "/api/memory/search",
        description:
          "Semantic vector search across stored memories using HNSW indexing.",
        requestBody: `{
  "query": "authentication patterns",
  "namespace": "patterns",
  "limit": 5,
  "threshold": 0.7
}`,
        responseBody: `{
  "results": [
    {
      "key": "pattern-auth",
      "value": "JWT with rotating refresh tokens",
      "score": 0.94,
      "namespace": "patterns"
    }
  ],
  "query": "authentication patterns",
  "total": 1
}`,
        curl: `curl -X POST ${BASE}/api/memory/search \\
  -H "Authorization: Bearer arc_XXXXX" \\
  -H "Content-Type: application/json" \\
  -d '{"query": "authentication patterns", "limit": 5}'`,
        typescript: `const res = await fetch("${BASE}/api/memory/search", {
  method: "POST",
  headers: {
    Authorization: "Bearer arc_XXXXX",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: "authentication patterns",
    limit: 5,
  }),
});
const { results } = await res.json();`,
      },
      {
        method: "GET",
        path: "/api/memory/:key",
        description: "Retrieve a specific memory by key.",
        responseBody: `{
  "key": "pattern-auth",
  "value": "JWT with rotating refresh tokens",
  "namespace": "patterns",
  "tags": ["auth", "security"],
  "created_at": "2026-03-29T12:00:00Z",
  "updated_at": "2026-03-29T12:00:00Z"
}`,
        curl: `curl "${BASE}/api/memory/pattern-auth?namespace=patterns" \\
  -H "Authorization: Bearer arc_XXXXX"`,
        typescript: `const res = await fetch(
  "${BASE}/api/memory/pattern-auth?namespace=patterns",
  { headers: { Authorization: "Bearer arc_XXXXX" } }
);
const memory = await res.json();`,
      },
      {
        method: "DELETE",
        path: "/api/memory/:key",
        description: "Delete a memory by key.",
        responseBody: `{
  "success": true,
  "deleted": "pattern-auth"
}`,
        curl: `curl -X DELETE "${BASE}/api/memory/pattern-auth?namespace=patterns" \\
  -H "Authorization: Bearer arc_XXXXX"`,
        typescript: `const res = await fetch(
  "${BASE}/api/memory/pattern-auth?namespace=patterns",
  {
    method: "DELETE",
    headers: { Authorization: "Bearer arc_XXXXX" },
  }
);
const data = await res.json();`,
      },
      {
        method: "GET",
        path: "/api/memory/stats",
        description:
          "Get usage statistics: total memories, storage used, and namespace breakdown.",
        responseBody: `{
  "total_memories": 1284,
  "total_namespaces": 12,
  "storage_used_mb": 4.2,
  "storage_limit_mb": 100,
  "namespaces": [
    { "name": "patterns", "count": 340 },
    { "name": "coordination", "count": 215 }
  ]
}`,
        curl: `curl "${BASE}/api/memory/stats" \\
  -H "Authorization: Bearer arc_XXXXX"`,
        typescript: `const res = await fetch("${BASE}/api/memory/stats", {
  headers: { Authorization: "Bearer arc_XXXXX" },
});
const stats = await res.json();`,
      },
    ],
  },

  {
    id: "creative",
    title: "Creative API",
    description:
      "Generate images, text, and code through a unified creative interface powered by multi-provider routing.",
    color: "#a855f7",
    endpoints: [
      {
        method: "POST",
        path: "/api/imagine",
        description:
          "Generate images from text prompts. Supports Flux 2, DALL-E 3, Imagen 4, and more.",
        requestBody: `{
  "prompt": "An ancient library floating among aurora-lit clouds",
  "model": "flux-2",
  "width": 1024,
  "height": 1024,
  "style": "fantasy"
}`,
        responseBody: `{
  "id": "img_abc123",
  "url": "https://cdn.arcanea.ai/generations/img_abc123.webp",
  "prompt": "An ancient library floating among aurora-lit clouds",
  "model": "flux-2",
  "width": 1024,
  "height": 1024,
  "created_at": "2026-03-29T12:00:00Z"
}`,
        curl: `curl -X POST ${BASE}/api/imagine \\
  -H "Authorization: Bearer arc_XXXXX" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "An ancient library floating among aurora-lit clouds",
    "model": "flux-2",
    "width": 1024,
    "height": 1024
  }'`,
        typescript: `const res = await fetch("${BASE}/api/imagine", {
  method: "POST",
  headers: {
    Authorization: "Bearer arc_XXXXX",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    prompt: "An ancient library floating among aurora-lit clouds",
    model: "flux-2",
    width: 1024,
    height: 1024,
  }),
});
const image = await res.json();
console.log(image.url);`,
      },
      {
        method: "POST",
        path: "/api/create",
        description:
          "Generate text or code. Supports structured output, system prompts, and temperature control.",
        requestBody: `{
  "prompt": "Write a TypeScript function that validates email addresses",
  "model": "claude-sonnet-4",
  "system": "You are an expert TypeScript developer.",
  "temperature": 0.3,
  "max_tokens": 2048
}`,
        responseBody: `{
  "id": "gen_xyz789",
  "content": "export function validateEmail(email: string): boolean {\\n  const pattern = /^[^\\\\s@]+@[^\\\\s@]+\\\\.[^\\\\s@]+$/;\\n  return pattern.test(email);\\n}",
  "model": "claude-sonnet-4",
  "usage": {
    "prompt_tokens": 42,
    "completion_tokens": 87,
    "total_tokens": 129
  }
}`,
        curl: `curl -X POST ${BASE}/api/create \\
  -H "Authorization: Bearer arc_XXXXX" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Write a TypeScript function that validates email",
    "model": "claude-sonnet-4",
    "temperature": 0.3
  }'`,
        typescript: `const res = await fetch("${BASE}/api/create", {
  method: "POST",
  headers: {
    Authorization: "Bearer arc_XXXXX",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    prompt: "Write a TypeScript function that validates email",
    model: "claude-sonnet-4",
    temperature: 0.3,
  }),
});
const generation = await res.json();
console.log(generation.content);`,
      },
      {
        method: "POST",
        path: "/api/chat",
        description:
          "Chat with AI. Supports streaming, multi-turn conversations, and Luminor personas.",
        requestBody: `{
  "messages": [
    { "role": "system", "content": "You are Lumina, the First Light." },
    { "role": "user", "content": "What are the Five Elements?" }
  ],
  "model": "claude-sonnet-4",
  "stream": true,
  "luminor": "lumina"
}`,
        responseBody: `{
  "id": "chat_def456",
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "The Five Elements are the fundamental forces..."
      },
      "finish_reason": "stop"
    }
  ],
  "model": "claude-sonnet-4",
  "usage": {
    "prompt_tokens": 38,
    "completion_tokens": 256,
    "total_tokens": 294
  }
}`,
        curl: `curl -X POST ${BASE}/api/chat \\
  -H "Authorization: Bearer arc_XXXXX" \\
  -H "Content-Type: application/json" \\
  -d '{
    "messages": [
      {"role": "user", "content": "What are the Five Elements?"}
    ],
    "model": "claude-sonnet-4"
  }'`,
        typescript: `const res = await fetch("${BASE}/api/chat", {
  method: "POST",
  headers: {
    Authorization: "Bearer arc_XXXXX",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    messages: [
      { role: "user", content: "What are the Five Elements?" },
    ],
    model: "claude-sonnet-4",
    stream: true,
  }),
});

// Streaming response
const reader = res.body?.getReader();
const decoder = new TextDecoder();
while (true) {
  const { done, value } = await reader!.read();
  if (done) break;
  console.log(decoder.decode(value));
}`,
      },
    ],
  },

  {
    id: "agents",
    title: "Agent API",
    description:
      "Register, discover, and manage AI agents in the Arcanea ecosystem. Each agent has a profile, skills, and memory.",
    color: "#78a6ff",
    endpoints: [
      {
        method: "POST",
        path: "/api/agents",
        description:
          "Register a new agent with name, type, skills, and configuration.",
        requestBody: `{
  "name": "code-reviewer",
  "type": "reviewer",
  "description": "Reviews PRs for code quality and security",
  "skills": ["typescript", "security-audit", "performance"],
  "config": {
    "model": "claude-sonnet-4",
    "max_tokens": 4096
  }
}`,
        responseBody: `{
  "id": "agent_r1k2m3",
  "name": "code-reviewer",
  "type": "reviewer",
  "status": "active",
  "skills": ["typescript", "security-audit", "performance"],
  "created_at": "2026-03-29T12:00:00Z",
  "api_key": "arc_agent_XXXXX"
}`,
        curl: `curl -X POST ${BASE}/api/agents \\
  -H "Authorization: Bearer arc_XXXXX" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "code-reviewer",
    "type": "reviewer",
    "skills": ["typescript", "security-audit"]
  }'`,
        typescript: `const res = await fetch("${BASE}/api/agents", {
  method: "POST",
  headers: {
    Authorization: "Bearer arc_XXXXX",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "code-reviewer",
    type: "reviewer",
    skills: ["typescript", "security-audit"],
  }),
});
const agent = await res.json();
console.log(agent.id);`,
      },
      {
        method: "GET",
        path: "/api/agents",
        description:
          "Search agents by name, type, skill, or status. Supports pagination.",
        responseBody: `{
  "agents": [
    {
      "id": "agent_r1k2m3",
      "name": "code-reviewer",
      "type": "reviewer",
      "status": "active",
      "skills": ["typescript", "security-audit"]
    }
  ],
  "total": 1,
  "limit": 20,
  "offset": 0
}`,
        curl: `curl "${BASE}/api/agents?type=reviewer&status=active" \\
  -H "Authorization: Bearer arc_XXXXX"`,
        typescript: `const res = await fetch(
  "${BASE}/api/agents?type=reviewer&status=active",
  { headers: { Authorization: "Bearer arc_XXXXX" } }
);
const { agents } = await res.json();`,
      },
      {
        method: "GET",
        path: "/api/agents/:id",
        description:
          "Get full agent profile including configuration, stats, and recent activity.",
        responseBody: `{
  "id": "agent_r1k2m3",
  "name": "code-reviewer",
  "type": "reviewer",
  "status": "active",
  "skills": ["typescript", "security-audit", "performance"],
  "config": {
    "model": "claude-sonnet-4",
    "max_tokens": 4096
  },
  "stats": {
    "tasks_completed": 142,
    "avg_response_ms": 2340,
    "success_rate": 0.97
  },
  "created_at": "2026-03-29T12:00:00Z"
}`,
        curl: `curl "${BASE}/api/agents/agent_r1k2m3" \\
  -H "Authorization: Bearer arc_XXXXX"`,
        typescript: `const res = await fetch("${BASE}/api/agents/agent_r1k2m3", {
  headers: { Authorization: "Bearer arc_XXXXX" },
});
const agent = await res.json();`,
      },
      {
        method: "PATCH",
        path: "/api/agents/:id",
        description: "Update agent configuration, skills, or status.",
        requestBody: `{
  "skills": ["typescript", "security-audit", "performance", "a11y"],
  "config": {
    "max_tokens": 8192
  }
}`,
        responseBody: `{
  "id": "agent_r1k2m3",
  "name": "code-reviewer",
  "updated_fields": ["skills", "config"],
  "updated_at": "2026-03-29T13:00:00Z"
}`,
        curl: `curl -X PATCH "${BASE}/api/agents/agent_r1k2m3" \\
  -H "Authorization: Bearer arc_XXXXX" \\
  -H "Content-Type: application/json" \\
  -d '{"skills": ["typescript", "security-audit", "performance", "a11y"]}'`,
        typescript: `const res = await fetch("${BASE}/api/agents/agent_r1k2m3", {
  method: "PATCH",
  headers: {
    Authorization: "Bearer arc_XXXXX",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    skills: ["typescript", "security-audit", "performance", "a11y"],
  }),
});
const updated = await res.json();`,
      },
      {
        method: "GET",
        path: "/api/agents/discover",
        description:
          "Discover agents by skill or capability. Returns ranked matches.",
        responseBody: `{
  "matches": [
    {
      "id": "agent_r1k2m3",
      "name": "code-reviewer",
      "relevance": 0.95,
      "skills": ["typescript", "security-audit"]
    }
  ],
  "query": "security review",
  "total": 1
}`,
        curl: `curl "${BASE}/api/agents/discover?skill=security-audit" \\
  -H "Authorization: Bearer arc_XXXXX"`,
        typescript: `const res = await fetch(
  "${BASE}/api/agents/discover?skill=security-audit",
  { headers: { Authorization: "Bearer arc_XXXXX" } }
);
const { matches } = await res.json();`,
      },
    ],
  },

  {
    id: "ops",
    title: "Ops API",
    description:
      "Operational health monitoring, repository status, and system diagnostics.",
    color: "#ffd700",
    endpoints: [
      {
        method: "GET",
        path: "/api/ops",
        description:
          "Full repo health dashboard with build status, test coverage, and dependency audit.",
        responseBody: `{
  "status": "healthy",
  "build": {
    "status": "passing",
    "last_build": "2026-03-29T11:30:00Z",
    "duration_ms": 42000
  },
  "tests": {
    "total": 384,
    "passing": 381,
    "failing": 3,
    "coverage": 84.2
  },
  "dependencies": {
    "total": 127,
    "outdated": 4,
    "vulnerable": 0
  }
}`,
        curl: `curl "${BASE}/api/ops" \\
  -H "Authorization: Bearer arc_XXXXX"`,
        typescript: `const res = await fetch("${BASE}/api/ops", {
  headers: { Authorization: "Bearer arc_XXXXX" },
});
const dashboard = await res.json();
console.log(dashboard.status);`,
      },
      {
        method: "GET",
        path: "/api/ops/health",
        description:
          "Quick health check. Returns status and uptime. Ideal for monitoring integrations.",
        responseBody: `{
  "status": "ok",
  "uptime_seconds": 1728000,
  "version": "3.2.0",
  "region": "us-east-1",
  "timestamp": "2026-03-29T12:00:00Z"
}`,
        curl: `curl "${BASE}/api/ops/health"`,
        typescript: `const res = await fetch("${BASE}/api/ops/health");
const health = await res.json();
console.log(health.status); // "ok"`,
      },
    ],
  },
];

export const NAV_SECTIONS = [
  { id: "authentication", label: "Authentication" },
  ...API_SECTIONS.map((s) => ({ id: s.id, label: s.title })),
  { id: "rate-limits", label: "Rate Limits" },
  { id: "errors", label: "Error Codes" },
];

export const ERROR_CODES = [
  {
    code: "400",
    meaning: "Bad Request",
    resolution: "Check request body and parameters",
  },
  {
    code: "401",
    meaning: "Unauthorized",
    resolution: "Verify your API key is valid and included",
  },
  {
    code: "403",
    meaning: "Forbidden",
    resolution: "Your key lacks permission for this resource",
  },
  {
    code: "404",
    meaning: "Not Found",
    resolution: "Resource does not exist at the given path",
  },
  {
    code: "409",
    meaning: "Conflict",
    resolution: "Resource already exists (use PATCH to update)",
  },
  {
    code: "422",
    meaning: "Unprocessable",
    resolution: "Valid JSON but invalid field values",
  },
  {
    code: "429",
    meaning: "Rate Limited",
    resolution: "Wait for Retry-After header duration",
  },
  {
    code: "500",
    meaning: "Internal Error",
    resolution: "Retry with exponential backoff, then contact support",
  },
];
