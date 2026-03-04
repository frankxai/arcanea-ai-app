#!/bin/bash
set -e

echo "✨ Arcanea Companion starting..."
echo "   Persona: Shinkami (Source Gate, 1111 Hz)"
echo "   Skills: superintelligence, luminor-council, guardian, starlight, council"
echo ""

# Ensure vault directories exist
mkdir -p /data/.arcanea/vaults/{episodic,semantic,procedural,creative,relational,temporal}

# Link skills into OpenClaw workspace
SKILLS_DIR="$OPENCLAW_WORKSPACE_DIR/skills"
mkdir -p "$SKILLS_DIR"
for skill in superintelligence luminor-council guardian starlight council; do
    if [ -d "/data/workspace/skills/$skill" ] && [ ! -L "$SKILLS_DIR/$skill" ]; then
        ln -sf "/data/workspace/skills/$skill" "$SKILLS_DIR/$skill" 2>/dev/null || true
    fi
done

# Start OpenClaw gateway
exec openclaw gateway --port "${PORT:-8080}"
