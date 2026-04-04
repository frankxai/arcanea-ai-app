# Device Fleet Registry

> Last updated: 2026-04-04

## Computers

### DEV-001 — Lenovo Yoga C940-15IRH (Primary Dev Machine)
| Spec | Value |
|------|-------|
| CPU | Intel Core i7-9750H @ 2.60GHz (6 cores / 12 threads) |
| RAM | 16 GB DDR4 (upgradeable to 64GB — ~100 EUR, best ROI) |
| GPU | NVIDIA GeForce GTX 1650 Max-Q (4GB VRAM) |
| Storage | 512GB NVMe SSD |
| Display | 2 screens: 1536x864 (built-in) + 1920x1080 (external) |
| OS | Windows 11 Home (10.0.26200) |
| Node | v20.20.2 |
| NVIDIA Driver | 595.97 (CUDA 13.2) — updated 2026-04 |
| Status | ACTIVE — primary Arcanea development |

**Typical agent load**: 3-7 Claude Code + 0-4 Codex + Comet autonomous
**Max safe load**: 4 Claude instances (16GB RAM constraint)
**Peak observed**: 15 Claude + 4 Codex + 45 Comet (2026-04-04, running stable)

**PP Score History**:
| Date | Score | Grade | Notes |
|------|-------|-------|-------|
| 2026-03-28 | 55 | D | BSOD from GPU driver |
| 2026-03-31 | 45 | D | LoL GPU crash, 14 Claude instances |
| 2026-04-02 | 61 | C | Node bloat, recovering |
| 2026-04-03 | 68 | C+ | Best score, GPU solved |
| 2026-04-04 | 75 | B+ | Disk cleaned (+10GB), stable all day |

### DEV-002 — Dell Laptop (Secondary)
| Spec | Value |
|------|-------|
| Details | TBD — needs inventory |
| Status | STANDBY |

## Mobile Devices

### MOB-001 — Huawei (Personal)
- Primary personal phone
- Status: ACTIVE

### MOB-002 — Samsung S21 (Oracle Work)
- Oracle corporate device
- Status: ACTIVE

### MOB-003 — Samsung S25 (Oracle / Creative)
- Content creation pipeline: Grok AI → Grok Animate → CapCut → TikTok
- Status: ACTIVE — daily content production

## Software Stack (DEV-001)

### AI Agents
| Agent | Version | Install | Purpose |
|-------|---------|---------|---------|
| Claude Code | Latest | `~/.local/bin/claude` | Primary dev agent |
| Codex CLI | Latest | npm global | Secondary dev agent |
| Comet | Desktop app | Auto-start | Autonomous browser agent |
| Personal-AI | Desktop app | Auto-start | Knowledge base |

### Development
| Tool | Version | Notes |
|------|---------|-------|
| Next.js | 16.1.1 | App Router + React 19 |
| TypeScript | Strict mode | All packages |
| Git | Latest | fsmonitor + untrackedCache enabled |
| VS Code | Latest | Primary editor |
| Windows Terminal | Latest | bellStyle: all |

### Infrastructure
| Service | Account | Purpose |
|---------|---------|---------|
| GitHub | frankxai | 90+ repos |
| Vercel | frankxai | Deployment (arcanea.ai, frankx.ai) |
| Supabase | Project linked | Database + Auth |
| Linear | Team | Sprint tracking |
| Notion | Workspace | Command Center, docs |
| Suno | Account | Music generation |

## Snapshots

Archived at `docs/ops/snapshots/{date}/`:
- `snapshot.json` — system metrics, agent census, PP score
- `screen-{n}-{time}.png` — screenshot per monitor

## Fleet Ops

### Peak Performance Monitoring
```bash
# Run audit from any device
npx tsx packages/peak-performance/src/cli.ts audit

# Compact status for hooks/cron
npx tsx packages/peak-performance/src/cli.ts compact
```

### Snapshot (screenshot + metrics)
```powershell
# PowerShell screenshot capture (built into PP snapshots)
# Saves to docs/ops/snapshots/{date}/
```
