---
title: "Family identity security and network protection system"
uuid: 14894dd4-6fd8-4431-8ba9-46793ed96bd1
created: 2026-03-13T19:03:15.667146Z
updated: 2026-03-13T19:03:58.992071Z
source: claude.ai export
---

# Family identity security and network protection system

**Frank**:

New project build for me an family intelligence system - where claude code and set of tools github and other help secure my identity, our network ensure all vpn and stuff, and no one can hack us as well as have sometimes check that no of our accounts, apsswords, credit cords, id is misused. For me but future that I can also help my family with this? Whats price which products compute and more we need? Can calude and mcp or whate githubs do this?

**Claude**:

Frank wants to build a Family Intelligence System (FIS) focused on security, identity protection, and monitoring. Let me think about this architecturally.

Key requirements:
1. Identity security & protection
2. VPN infrastructure
3. Account/password monitoring
4. Credit card & ID misuse detection
5. Family-scalable (him first, then family)
6. Using Claude Code, MCP, GitHub, and other tools

Let me think about what's actually possible vs. what requires paid services, and give him a realistic architecture with pricing.

This is a security infrastructure question. Let me think about the layers:

1. **Password Management** - Bitwarden (self-hosted or cloud), 1Password Family


2. **VPN** - Mullvad, ProtonVPN, or self-hosted WireGuard
3. **Identity Monitoring** - Have I Been Pwned API, credit monitoring services
4. **Account Security Audit** - automated checks for breached credentials
5. **MCP/Claude Code role** - orchestration layer, security dashboards, automated scanning
6. **GitHub** - private repos for config, automation scripts, IaC

Now I need to be realistic about the limitations here. Claude Code can help build the system architecture and automation, but it won't be a continuous 24/7 monitoring service—that's where the paid services come in. MCP servers can integrate with some external services, but the actual monitoring backbone needs to rely on dedicated tools and APIs.

Let me map this out as a tiered architecture with pricing considerations.This is a strong build. Let me decompose it into what's real, what's buildable, and what you should just buy.

## Architecture: Riemer Family Intelligence System (RFIS)

**Three layers, not one:**

**Layer 1 — Commercial Security Stack (buy, don't build)**

| Service | What it does | Cost/mo | Family? |
|---|---|---|---|
| **1Password Families** | Vault, credential monitoring, breach alerts | €5/mo (5 users) | ✅ |
| **Mullvad VPN** | No-log VPN, WireGuard-based, no account needed | €5/device/mo | ✅ |
| **ProtonMail + Proton Pass** | E2EE email, aliases, password manager alt | €13/mo (family) | ✅ |
| **Have I Been Pwned API** | Breach monitoring for all emails/domains | Free (API key) | ✅ |
| **Bitdefender Total Security** | Device-level antivirus + identity protection | ~€7/mo (10 devices) | ✅ |
| **Credit monitoring (EU)** | SCHUFA/BKR alerts for ID misuse | ~€5-10/mo | per-person |

**~€40-50/mo total** covers 90% of what you actually need. No code required.

**Layer 2 — RFIS Orchestration Hub (build with Claude Code + MCP)**

This is where your builder instinct matters. A private GitHub repo (`frankxai/rfis`) with:

```
rfis/
├── agents/
│   ├── breach-scanner.ts      # HIBP API polling per family member
│   ├── vpn-health-check.ts    # Mullvad connection verification
│   ├── password-audit.ts      # 1Password CLI integration - weak/reused
│   └── domain-monitor.ts      # Your domains (frankx.ai, arcanea.ai) cert/DNS watch
├── dashboards/
│   └── family-security.tsx    # React dashboard - status board
├── n8n-workflows/
│   ├── weekly-security-digest.json   # Email/Slack summary
│   └── breach-alert-instant.json     # Immediate notification
├── mcp-servers/
│   └── rfis-mcp/              # Custom MCP server for Claude queries
└── infra/
    └── wireguard/             # Self-hosted VPN config (optional L3 upgrade)
```

**What Claude Code actually does here:**
- Builds the agents, dashboards, n8n workflows
- Creates the MCP server so you can ask Claude "are any family accounts compromised?" and get a live answer
- Automates the audit scripts that run on cron via GitHub Actions or your VPS

**What MCP enables:**
- `rfis-mcp` server connects to 1Password CLI, HIBP API, DNS checkers
- Claude in conversation becomes your security query interface
- "Show me Tien's breach status" → live pull, not static data

**Layer 3 — Future: Self-Hosted Sovereign Stack (when you want full control)**

| Component | Purpose | Infra |
|---|---|---|
| WireGuard VPS | Family VPN you control | Hetzner €4/mo |
| Vaultwarden | Self-hosted Bitwarden | Same VPS |
| Uptime Kuma | Monitor all your domains/services | Same VPS |
| Grafana + alerts | Security dashboard | Same VPS |

One €10-20/mo Hetzner box runs all of this. Full sovereignty. But only build this when Layer 1+2 are stable.

## What You Can't Do With Claude/MCP

Be direct: **Claude cannot be a real-time security monitoring system.** It can:
- ✅ Build the tools
- ✅ Query them in conversation via MCP
- ✅ Run scheduled audits via Claude Code + cron
- ❌ Run 24/7 watching your accounts (use n8n or dedicated monitoring for that)
- ❌ Intercept attacks in real-time
- ❌ Access banking APIs in EU (PSD2 complexity, not worth building)

## Compute & Pricing Summary

| Item | Monthly Cost |
|---|---|
| Commercial security stack | ~€45 |
| Claude Pro (your MCP/Code usage) | ~€20 |
| GitHub (private repos, Actions) | Free tier sufficient |
| Hetzner VPS (Layer 3, optional) | €10-20 |
| **Total** | **€65-85/mo** |

That's the real number. No enterprise bloat.

## My Recommendation: Ship Order

1. **Today** — 1Password Families + Mullvad on all devices. 2 hours.
2. **This week** — `frankxai/rfis` repo, breach scanner agent, n8n weekly digest. Claude Code builds this in one session.
3. **This month** — MCP server so Claude becomes your security interface. Dashboard.
4. **When ready** — Layer 3 Hetzner sovereign stack.

Want me to scaffold the `rfis` repo structure and build the breach scanner + MCP server as the first deliverable?
