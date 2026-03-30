"use client";

import { useState } from "react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Endpoint {
  method: "GET" | "POST" | "PATCH" | "DELETE";
  path: string;
  description: string;
  requestBody?: string;
  responseBody: string;
  curl: string;
  typescript: string;
}

interface ApiSection {
  id: string;
  title: string;
  description: string;
  color: string;
  endpoints: Endpoint[];
}

/* ------------------------------------------------------------------ */
/*  Method badge colors                                                */
/* ------------------------------------------------------------------ */

const METHOD_COLORS: Record<string, { bg: string; text: string }> = {
  GET: { bg: "bg-emerald-500/15", text: "text-emerald-400" },
  POST: { bg: "bg-blue-500/15", text: "text-blue-400" },
  PATCH: { bg: "bg-amber-500/15", text: "text-amber-400" },
  DELETE: { bg: "bg-red-500/15", text: "text-red-400" },
};

/* ------------------------------------------------------------------ */
/*  API Data                                                           */
/* ------------------------------------------------------------------ */

const BASE = "https://arcanea.ai";

const API_SECTIONS: ApiSection[] = [
  /* ---- Memory API ---- */
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

  /* ---- Creative API ---- */
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

  /* ---- Agent API ---- */
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

  /* ---- Ops API ---- */
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

/* ------------------------------------------------------------------ */
/*  Sidebar navigation                                                 */
/* ------------------------------------------------------------------ */

const NAV_SECTIONS = [
  { id: "authentication", label: "Authentication" },
  ...API_SECTIONS.map((s) => ({ id: s.id, label: s.title })),
  { id: "rate-limits", label: "Rate Limits" },
  { id: "errors", label: "Error Codes" },
];

/* ------------------------------------------------------------------ */
/*  Code block component                                               */
/* ------------------------------------------------------------------ */

function CodeBlock({
  code,
  language,
}: {
  code: string;
  language: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/[0.02]">
        <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 hover:text-[#7fffd4] transition-colors"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed">
        <code className="font-mono text-neutral-300">{code}</code>
      </pre>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Endpoint card component                                            */
/* ------------------------------------------------------------------ */

function EndpointCard({
  endpoint,
  color,
}: {
  endpoint: Endpoint;
  color: string;
}) {
  const [tab, setTab] = useState<"curl" | "typescript">("curl");
  const methodStyle = METHOD_COLORS[endpoint.method];

  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-white/10 transition-colors">
      {/* Header */}
      <div className="px-6 py-5 border-b border-white/5">
        <div className="flex items-center gap-3 mb-2">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-semibold ${methodStyle.bg} ${methodStyle.text}`}
          >
            {endpoint.method}
          </span>
          <code className="text-sm font-mono text-neutral-200">
            {endpoint.path}
          </code>
        </div>
        <p className="text-sm text-neutral-400">{endpoint.description}</p>
      </div>

      <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/5">
        {/* Left: Request / Response */}
        <div>
          {endpoint.requestBody && (
            <div className="border-b border-white/5">
              <div className="px-6 py-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                  Request Body
                </span>
              </div>
              <pre className="px-6 pb-4 overflow-x-auto text-[13px] leading-relaxed">
                <code className="font-mono text-neutral-300">
                  {endpoint.requestBody}
                </code>
              </pre>
            </div>
          )}
          <div>
            <div className="px-6 py-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                Response
              </span>
            </div>
            <pre className="px-6 pb-4 overflow-x-auto text-[13px] leading-relaxed">
              <code className="font-mono" style={{ color }}>
                {endpoint.responseBody}
              </code>
            </pre>
          </div>
        </div>

        {/* Right: Code examples */}
        <div>
          <div className="flex border-b border-white/5">
            <button
              onClick={() => setTab("curl")}
              className={`flex-1 px-4 py-3 text-xs font-mono uppercase tracking-widest transition-colors ${
                tab === "curl"
                  ? "text-[#7fffd4] border-b-2 border-[#7fffd4] bg-white/[0.02]"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              cURL
            </button>
            <button
              onClick={() => setTab("typescript")}
              className={`flex-1 px-4 py-3 text-xs font-mono uppercase tracking-widest transition-colors ${
                tab === "typescript"
                  ? "text-[#7fffd4] border-b-2 border-[#7fffd4] bg-white/[0.02]"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              TypeScript
            </button>
          </div>
          <CodeBlock
            code={tab === "curl" ? endpoint.curl : endpoint.typescript}
            language={tab === "curl" ? "bash" : "typescript"}
          />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */

export default function ApiDocsPage() {
  const [activeSection, setActiveSection] = useState("authentication");

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#7fffd4]/5 via-transparent to-[#78a6ff]/5" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#7fffd4]/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-[90rem] mx-auto flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto border-r border-white/5 py-8 px-6">
          <Link
            href="/docs"
            className="text-xs font-mono uppercase tracking-widest text-neutral-500 hover:text-[#7fffd4] transition-colors mb-6 block"
          >
            &larr; Back to Docs
          </Link>
          <div className="mb-4">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">
              API Reference
            </span>
          </div>
          <nav className="space-y-1">
            {NAV_SECTIONS.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={() => setActiveSection(section.id)}
                className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeSection === section.id
                    ? "bg-[#7fffd4]/10 text-[#7fffd4]"
                    : "text-neutral-400 hover:text-neutral-200 hover:bg-white/5"
                }`}
              >
                {section.label}
              </a>
            ))}
          </nav>

          <div className="mt-8 pt-6 border-t border-white/5">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 block mb-3">
              Base URL
            </span>
            <code className="text-xs font-mono text-[#7fffd4] break-all">
              {BASE}
            </code>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 px-4 sm:px-8 lg:px-12 py-8 lg:py-12">
          {/* Hero */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#7fffd4]/30 bg-[#7fffd4]/10 mb-6">
              <span className="text-xs font-mono tracking-widest uppercase text-[#7fffd4]">
                API Reference
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4 tracking-tight">
              Arcanea{" "}
              <span className="bg-gradient-to-r from-[#7fffd4] to-[#78a6ff] bg-clip-text text-transparent">
                API
              </span>
            </h1>
            <p className="text-lg text-neutral-400 max-w-2xl leading-relaxed">
              Build with the Creative Superintelligence. Memory, generation,
              agents, and operations — all through a unified REST API.
            </p>
          </div>

          {/* Authentication Section */}
          <section id="authentication" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-3">
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono bg-emerald-500/15 text-emerald-400"
              >
                01
              </span>
              Authentication
            </h2>

            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 mb-6">
              <p className="text-sm text-neutral-300 mb-4">
                All API requests require a Bearer token in the{" "}
                <code className="px-1.5 py-0.5 rounded bg-white/5 text-[#7fffd4] font-mono text-xs">
                  Authorization
                </code>{" "}
                header. API keys are prefixed with{" "}
                <code className="px-1.5 py-0.5 rounded bg-white/5 text-[#7fffd4] font-mono text-xs">
                  arc_
                </code>
                .
              </p>

              <div className="bg-black/40 border border-white/5 rounded-xl overflow-hidden">
                <CodeBlock
                  code={`# Include in every request\ncurl -H "Authorization: Bearer arc_XXXXX" \\\n  ${BASE}/api/memory`}
                  language="bash"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
                <h3 className="font-display font-semibold text-sm mb-2">
                  Get an API Key
                </h3>
                <ol className="text-sm text-neutral-400 space-y-2 list-decimal list-inside">
                  <li>
                    Sign in at{" "}
                    <Link
                      href="/settings"
                      className="text-[#7fffd4] hover:underline"
                    >
                      arcanea.ai/settings
                    </Link>
                  </li>
                  <li>Navigate to Developer &rarr; API Keys</li>
                  <li>Click &quot;Generate New Key&quot;</li>
                  <li>Copy your key (shown only once)</li>
                </ol>
              </div>

              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
                <h3 className="font-display font-semibold text-sm mb-2">
                  Key Types
                </h3>
                <div className="space-y-2 text-sm text-neutral-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <code className="font-mono text-xs text-neutral-300">
                      arc_live_*
                    </code>
                    <span className="text-neutral-500">Production</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <code className="font-mono text-xs text-neutral-300">
                      arc_test_*
                    </code>
                    <span className="text-neutral-500">Development</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    <code className="font-mono text-xs text-neutral-300">
                      arc_agent_*
                    </code>
                    <span className="text-neutral-500">Agent-scoped</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* API Sections */}
          {API_SECTIONS.map((section, sectionIdx) => (
            <section
              key={section.id}
              id={section.id}
              className="mb-16 scroll-mt-24"
            >
              <h2 className="text-2xl font-display font-bold mb-2 flex items-center gap-3">
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono"
                  style={{
                    backgroundColor: `${section.color}15`,
                    color: section.color,
                  }}
                >
                  {String(sectionIdx + 2).padStart(2, "0")}
                </span>
                {section.title}
              </h2>
              <p className="text-sm text-neutral-400 mb-8 max-w-2xl">
                {section.description}
              </p>
              <div className="space-y-6">
                {section.endpoints.map((endpoint) => (
                  <EndpointCard
                    key={`${endpoint.method}-${endpoint.path}`}
                    endpoint={endpoint}
                    color={section.color}
                  />
                ))}
              </div>
            </section>
          ))}

          {/* Rate Limits */}
          <section id="rate-limits" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono bg-amber-500/15 text-amber-400">
                06
              </span>
              Rate Limits
            </h2>

            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-6 py-4 font-mono text-xs uppercase tracking-widest text-neutral-500">
                      Tier
                    </th>
                    <th className="text-left px-6 py-4 font-mono text-xs uppercase tracking-widest text-neutral-500">
                      Requests / min
                    </th>
                    <th className="text-left px-6 py-4 font-mono text-xs uppercase tracking-widest text-neutral-500">
                      Burst
                    </th>
                    <th className="text-left px-6 py-4 font-mono text-xs uppercase tracking-widest text-neutral-500">
                      Daily Limit
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="px-6 py-4 text-neutral-300">Free</td>
                    <td className="px-6 py-4 font-mono text-neutral-400">
                      30
                    </td>
                    <td className="px-6 py-4 font-mono text-neutral-400">
                      5
                    </td>
                    <td className="px-6 py-4 font-mono text-neutral-400">
                      1,000
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-neutral-300">Pro</td>
                    <td className="px-6 py-4 font-mono text-neutral-400">
                      120
                    </td>
                    <td className="px-6 py-4 font-mono text-neutral-400">
                      20
                    </td>
                    <td className="px-6 py-4 font-mono text-neutral-400">
                      10,000
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-neutral-300">Team</td>
                    <td className="px-6 py-4 font-mono text-neutral-400">
                      500
                    </td>
                    <td className="px-6 py-4 font-mono text-neutral-400">
                      50
                    </td>
                    <td className="px-6 py-4 font-mono text-neutral-400">
                      100,000
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-neutral-300">Enterprise</td>
                    <td className="px-6 py-4 font-mono text-neutral-400">
                      Custom
                    </td>
                    <td className="px-6 py-4 font-mono text-neutral-400">
                      Custom
                    </td>
                    <td className="px-6 py-4 font-mono text-neutral-400">
                      Unlimited
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
              <p className="text-sm text-neutral-400">
                Rate limit headers are included in every response:{" "}
                <code className="px-1.5 py-0.5 rounded bg-white/5 text-neutral-300 font-mono text-xs">
                  X-RateLimit-Limit
                </code>
                ,{" "}
                <code className="px-1.5 py-0.5 rounded bg-white/5 text-neutral-300 font-mono text-xs">
                  X-RateLimit-Remaining
                </code>
                ,{" "}
                <code className="px-1.5 py-0.5 rounded bg-white/5 text-neutral-300 font-mono text-xs">
                  X-RateLimit-Reset
                </code>
                . When exceeded, the API returns{" "}
                <code className="px-1.5 py-0.5 rounded bg-white/5 text-red-400 font-mono text-xs">
                  429 Too Many Requests
                </code>{" "}
                with a{" "}
                <code className="px-1.5 py-0.5 rounded bg-white/5 text-neutral-300 font-mono text-xs">
                  Retry-After
                </code>{" "}
                header.
              </p>
            </div>
          </section>

          {/* Error Codes */}
          <section id="errors" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono bg-red-500/15 text-red-400">
                07
              </span>
              Error Codes
            </h2>

            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-6 py-4 font-mono text-xs uppercase tracking-widest text-neutral-500">
                      Code
                    </th>
                    <th className="text-left px-6 py-4 font-mono text-xs uppercase tracking-widest text-neutral-500">
                      Meaning
                    </th>
                    <th className="text-left px-6 py-4 font-mono text-xs uppercase tracking-widest text-neutral-500">
                      Resolution
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    {
                      code: "400",
                      meaning: "Bad Request",
                      resolution: "Check request body and parameters",
                    },
                    {
                      code: "401",
                      meaning: "Unauthorized",
                      resolution:
                        "Verify your API key is valid and included",
                    },
                    {
                      code: "403",
                      meaning: "Forbidden",
                      resolution:
                        "Your key lacks permission for this resource",
                    },
                    {
                      code: "404",
                      meaning: "Not Found",
                      resolution:
                        "Resource does not exist at the given path",
                    },
                    {
                      code: "409",
                      meaning: "Conflict",
                      resolution:
                        "Resource already exists (use PATCH to update)",
                    },
                    {
                      code: "422",
                      meaning: "Unprocessable",
                      resolution:
                        "Valid JSON but invalid field values",
                    },
                    {
                      code: "429",
                      meaning: "Rate Limited",
                      resolution:
                        "Wait for Retry-After header duration",
                    },
                    {
                      code: "500",
                      meaning: "Internal Error",
                      resolution:
                        "Retry with exponential backoff, then contact support",
                    },
                  ].map((err) => (
                    <tr key={err.code}>
                      <td className="px-6 py-4">
                        <code
                          className={`font-mono text-xs px-2 py-1 rounded ${
                            err.code.startsWith("4")
                              ? "bg-amber-500/10 text-amber-400"
                              : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {err.code}
                        </code>
                      </td>
                      <td className="px-6 py-4 text-neutral-300">
                        {err.meaning}
                      </td>
                      <td className="px-6 py-4 text-neutral-400">
                        {err.resolution}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden">
              <div className="px-6 py-3 border-b border-white/5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                  Error Response Shape
                </span>
              </div>
              <pre className="px-6 py-4 overflow-x-auto text-[13px] leading-relaxed">
                <code className="font-mono text-red-400">
                  {`{
  "error": {
    "code": "rate_limit_exceeded",
    "message": "You have exceeded the rate limit of 30 requests/min.",
    "status": 429,
    "retry_after": 12
  }
}`}
                </code>
              </pre>
            </div>
          </section>

          {/* Footer CTA */}
          <div className="bg-gradient-to-br from-[#7fffd4]/10 via-white/5 to-[#78a6ff]/10 border border-white/10 rounded-2xl p-8 text-center mb-12">
            <h3 className="text-xl font-display font-bold mb-3">
              Ready to build?
            </h3>
            <p className="text-sm text-neutral-400 mb-6 max-w-md mx-auto">
              Get your API key and start creating with the Arcanea platform
              in minutes.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/settings"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#7fffd4] text-black font-semibold hover:scale-[1.03] transition-all"
              >
                Get API Key
              </Link>
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:border-[#7fffd4]/30 transition-all"
              >
                Back to Docs
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
