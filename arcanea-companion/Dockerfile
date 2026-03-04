# Arcanea Companion — OpenClaw Cloud Deployment
# Based on official OpenClaw Docker setup with Arcanea Intelligence OS skills

FROM node:22-bookworm-slim AS base

# Install system deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    git curl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd -g 1000 arcanea && useradd -u 1000 -g arcanea -m -s /bin/bash arcanea

# Install OpenClaw globally
RUN npm install -g openclaw@latest

# Set up directories
RUN mkdir -p /data/.openclaw /data/workspace /data/.arcanea/vaults \
    && chown -R arcanea:arcanea /data

# Copy Arcanea skills into workspace
COPY --chown=arcanea:arcanea skills/ /data/workspace/skills/

# Copy configs
COPY --chown=arcanea:arcanea config/openclaw.json /data/.openclaw/openclaw.json
COPY --chown=arcanea:arcanea config/personas.yaml /data/.openclaw/personas.yaml
COPY --chown=arcanea:arcanea config/memory-bridge.yaml /data/.arcanea/memory-bridge.yaml

# Copy entrypoint
COPY --chown=arcanea:arcanea scripts/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

USER arcanea
WORKDIR /data

# Environment defaults
ENV PORT=8080
ENV OPENCLAW_STATE_DIR=/data/.openclaw
ENV OPENCLAW_WORKSPACE_DIR=/data/workspace
ENV NODE_ENV=production

EXPOSE 8080

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
