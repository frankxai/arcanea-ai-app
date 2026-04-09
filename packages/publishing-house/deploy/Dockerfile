# Arcanea Publishing House — Multi-stage Docker build
# Node 20 + Python 3.11 + Pandoc for full pipeline support

# ---------------------------------------------------------------------------
# Stage 1: Builder — install deps and compile TypeScript
# ---------------------------------------------------------------------------
FROM node:20-slim AS builder

RUN corepack enable && corepack prepare pnpm@9 --activate

WORKDIR /build

# Copy workspace root for monorepo resolution
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/publishing-house/package.json packages/publishing-house/

# Install production deps only
RUN pnpm install --frozen-lockfile --filter @arcanea/publishing-house

# Copy source and build
COPY packages/publishing-house/ packages/publishing-house/
RUN pnpm --filter @arcanea/publishing-house run build

# ---------------------------------------------------------------------------
# Stage 2: Runner — slim image with runtime dependencies
# ---------------------------------------------------------------------------
FROM node:20-slim AS runner

# Install pandoc (document conversion) and Python 3.11 (ArcaneaClaw compat)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      pandoc \
      python3.11 \
      python3-pip \
      ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@9 --activate

WORKDIR /app

# Copy built output and agent definitions
COPY --from=builder /build/packages/publishing-house/dist/ ./dist/
COPY --from=builder /build/packages/publishing-house/agents/*.json ./agents/
COPY --from=builder /build/packages/publishing-house/package.json ./
COPY --from=builder /build/packages/publishing-house/node_modules/ ./node_modules/

# Data volume for SQLite persistence
RUN mkdir -p /app/data

# Environment variables (values injected at runtime)
ENV NODE_ENV=production
ENV ANTHROPIC_API_KEY=""
ENV SUPABASE_URL=""
ENV SUPABASE_KEY=""
ENV NOTION_TOKEN=""
ENV GEMINI_API_KEY=""
ENV DEEPL_API_KEY=""
ENV STRIPE_API_KEY=""
ENV LEANPUB_API_KEY=""

EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://localhost:8080/health').then(r => process.exit(r.ok ? 0 : 1))" || exit 1

CMD ["node", "dist/orchestrator/maestro.js"]
