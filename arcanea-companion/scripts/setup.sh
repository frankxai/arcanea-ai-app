#!/bin/bash
# Arcanea Companion — Setup Script
# Supports: Railway (cloud), Docker, or Local install

set -e

COMPANION_DIR="$(cd "$(dirname "$0")/.." && pwd)"

show_help() {
    echo "Arcanea Companion Setup"
    echo ""
    echo "Usage: ./setup.sh [mode]"
    echo ""
    echo "Modes:"
    echo "  railway   Deploy to Railway (recommended)"
    echo "  docker    Run with Docker Compose locally"
    echo "  local     Install OpenClaw locally + symlink skills"
    echo ""
    echo "No argument = interactive mode"
}

setup_railway() {
    echo "✨ Deploying Arcanea Companion to Railway..."
    echo ""

    # Check for Railway CLI
    if ! command -v railway &>/dev/null; then
        echo "Installing Railway CLI..."
        npm install -g @railway/cli
    fi

    echo "1. Logging into Railway..."
    railway login

    echo ""
    echo "2. Initializing project..."
    cd "$COMPANION_DIR"
    railway init

    echo ""
    echo "3. Adding persistent volume at /data..."
    echo "   (Do this in Railway dashboard: Settings → Volumes → Mount at /data)"

    echo ""
    echo "4. Setting environment variables..."
    echo "   Required variables (set via Railway dashboard or CLI):"
    echo "   - SETUP_PASSWORD"
    echo "   - ANTHROPIC_API_KEY"
    echo "   - PORT=8080"
    echo ""
    read -p "Set SETUP_PASSWORD now? (y/n): " SET_PW
    if [ "$SET_PW" = "y" ]; then
        read -sp "SETUP_PASSWORD: " PW && echo ""
        railway variables set SETUP_PASSWORD="$PW"
    fi
    read -p "Set ANTHROPIC_API_KEY now? (y/n): " SET_KEY
    if [ "$SET_KEY" = "y" ]; then
        read -sp "ANTHROPIC_API_KEY: " KEY && echo ""
        railway variables set ANTHROPIC_API_KEY="$KEY"
    fi
    railway variables set PORT=8080

    echo ""
    echo "5. Deploying..."
    railway up

    echo ""
    echo "✨ Deployed! Access the setup wizard at your Railway domain /setup"
    echo "   Configure Telegram/WhatsApp channels through the web wizard."
    echo ""
    echo "Arcanea skills pre-installed:"
    echo "  /superintelligence, /luminor, /guardian, /starlight, /council"
}

setup_docker() {
    echo "✨ Starting Arcanea Companion with Docker..."
    echo ""

    if ! command -v docker &>/dev/null; then
        echo "Error: Docker not installed. Install: https://docs.docker.com/get-docker/"
        exit 1
    fi

    cd "$COMPANION_DIR"

    # Create .env if missing
    if [ ! -f .env ]; then
        cp .env.example .env
        echo "Created .env from template — edit it with your API keys."
        echo ""
        read -p "Edit .env now? (y/n): " EDIT_ENV
        if [ "$EDIT_ENV" = "y" ]; then
            ${EDITOR:-nano} .env
        fi
    fi

    echo "Building and starting..."
    docker compose up -d --build

    echo ""
    echo "✨ Running! Access: http://localhost:8080/setup"
    echo "   Use SETUP_PASSWORD from .env to authenticate."
}

setup_local() {
    echo "✨ Arcanea Companion — Local Setup"
    echo ""

    NODE_VERSION=$(node -v 2>/dev/null | sed 's/v//' | cut -d. -f1)
    if [ -z "$NODE_VERSION" ] || [ "$NODE_VERSION" -lt 22 ]; then
        echo "Error: Node.js 22+ required. Current: $(node -v 2>/dev/null || echo 'not installed')"
        exit 1
    fi

    echo "1. Installing OpenClaw..."
    npm install -g openclaw@latest

    echo ""
    echo "2. Running OpenClaw onboard..."
    openclaw onboard --install-daemon

    echo ""
    echo "3. Linking Arcanea skills..."
    SKILLS_DIR="$HOME/.openclaw/workspace/skills"
    mkdir -p "$SKILLS_DIR"
    for skill in superintelligence luminor-council guardian starlight council; do
        [ -d "$SKILLS_DIR/$skill" ] && rm -rf "$SKILLS_DIR/$skill"
        ln -sf "$COMPANION_DIR/skills/$skill" "$SKILLS_DIR/$skill"
        echo "   Linked: $skill"
    done

    echo ""
    echo "4. Copying config..."
    OPENCLAW_CONFIG="$HOME/.openclaw/openclaw.json"
    if [ ! -f "$OPENCLAW_CONFIG" ]; then
        cp "$COMPANION_DIR/config/openclaw.json" "$OPENCLAW_CONFIG"
    else
        echo "   Existing config found — manual merge recommended"
    fi

    echo ""
    echo "5. Setting up Starlight vaults..."
    mkdir -p "$HOME/.arcanea/vaults"/{episodic,semantic,procedural,creative,relational,temporal}
    cp "$COMPANION_DIR/config/memory-bridge.yaml" "$HOME/.arcanea/memory-bridge.yaml"

    echo ""
    echo "✨ Ready! Start: openclaw start"
}

# Main
case "${1:-}" in
    railway)  setup_railway ;;
    docker)   setup_docker ;;
    local)    setup_local ;;
    -h|--help) show_help ;;
    *)
        echo "✨ Arcanea Companion Setup"
        echo "========================="
        echo ""
        echo "Choose deployment mode:"
        echo "  1) Railway (cloud, recommended — ~\$5-10/mo)"
        echo "  2) Docker (self-hosted container)"
        echo "  3) Local (install on this machine)"
        echo ""
        read -p "Select [1/2/3]: " MODE
        case "$MODE" in
            1) setup_railway ;;
            2) setup_docker ;;
            3) setup_local ;;
            *) echo "Invalid. Run: ./setup.sh --help" ;;
        esac
        ;;
esac
