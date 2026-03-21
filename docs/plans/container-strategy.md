# ArcaneaClaw Container Strategy

## Overview

ArcaneaClaw is the media processing engine for Arcanea. It scans source assets (images, audio, video), classifies them using Gemini, transforms them into web-optimized variants, and uploads to Supabase/Vercel Blob. It runs as a long-lived daemon, ideally containerized for isolation and reproducibility.

This document compares the three supported runtime options.

## Runtime Comparison

| Feature | Docker | Podman | Native Python |
|---------|--------|--------|---------------|
| Rootless | No (needs daemon as root) | Yes (default) | N/A |
| Sudo needed | Install + daemon startup | Install only | No |
| Daemonless | No (dockerd required) | Yes | N/A |
| WSL2 compatible | Yes | Yes | Yes |
| Resource limits | Yes (cgroups) | Yes (cgroups v2) | No |
| Process isolation | Full container | Full container | None |
| OCI compatible | Yes | Yes | N/A |
| Systemd integration | Needs config | Native (quadlet/generate) | Needs manual unit |
| Image format | OCI / Docker | OCI / Docker | N/A |
| Compose tool | docker compose (v2) | podman-compose | N/A |
| Build file | Dockerfile | Containerfile (also reads Dockerfile) | N/A |
| Disk footprint | ~400MB (daemon + images) | ~200MB (no daemon) | ~50MB (pip deps only) |
| Security hardening | Manual cap-drop | Default rootless + cap-drop | OS-level only |

## Recommendation

### Old Laptop (primary target)
**Use Podman.** Rootless operation means no daemon eating RAM when idle. Daemonless architecture means one less process competing for the 2GB budget. Security is stronger out of the box.

### Dev Machine
**Use native Python** for fast iteration. No container overhead, direct debugger access, instant restarts. Switch to Podman for integration testing.

### CI / Production
Either engine works since both produce OCI images. The `Containerfile` and `Dockerfile` are functionally equivalent.

## File Layout

```
arcanea-claw/
  Dockerfile           # Docker build (original)
  Containerfile        # Podman build (optimized — Node 20 pinned, non-root user)
  docker-compose.yml   # Docker Compose
  podman-compose.yml   # Podman Compose (+ security hardening)
  container-run.sh     # Auto-detect script: Podman > Docker > Native
  install-podman.sh    # One-command Podman setup for WSL2 Ubuntu
  run.sh               # Native Python launcher (no container)
  config.yaml          # Engine configuration
  .env                 # Secrets (gitignored)
  engine/              # Python daemon + pipeline
  skills/              # Processing skills
```

## How to Use

### Quick Start (auto-detect)
```bash
cd /mnt/c/Users/frank/Arcanea/arcanea-claw
bash container-run.sh build
bash container-run.sh start
bash container-run.sh status
bash container-run.sh logs
```

### Install Podman (WSL2 Ubuntu)
```bash
bash install-podman.sh
# Needs sudo for apt install, after that podman runs rootless
```

### Manual Podman Commands
```bash
# Build
podman build -t arcanea-claw -f Containerfile .

# Run standalone (without compose)
podman run -d --name arcanea-claw \
  --cap-drop ALL \
  --security-opt no-new-privileges \
  -p 8080:8080 \
  -v /home/frankx/arcanea-claw/staging:/data/staging \
  -v /home/frankx/arcanea-claw/processed:/data/processed \
  --env-file .env \
  arcanea-claw

# Generate systemd unit (auto-start on boot)
podman generate systemd --name arcanea-claw --files --new
mkdir -p ~/.config/systemd/user/
mv container-arcanea-claw.service ~/.config/systemd/user/
systemctl --user enable container-arcanea-claw.service
systemctl --user start container-arcanea-claw.service
```

## Security Notes

The Podman setup applies these hardening measures by default:

- **Rootless runtime** — container processes run as unprivileged user, never as root
- **`--cap-drop ALL`** — drops all Linux capabilities, re-adds only `NET_BIND_SERVICE`
- **`no-new-privileges`** — prevents privilege escalation inside the container
- **`read_only: true`** — root filesystem is read-only, writes go to tmpfs or mounted volumes
- **Non-root container user** — the Containerfile creates a `claw` user; the daemon never runs as UID 0

## Volume Mounts

| Host Path | Container Path | Mode | Purpose |
|-----------|---------------|------|---------|
| `/mnt/g/My Drive/Arcanea` | `/data/source` | ro | Google Drive source assets |
| `/home/frankx/arcanea-claw/staging` | `/data/staging` | rw | Temporary processing |
| `/home/frankx/arcanea-claw/processed` | `/data/processed` | rw | Final output |
| `.arcanea/lore/CANON_LOCKED.md` | `/app/canon/CANON_LOCKED.md` | ro | Canon validation reference |

Staging and processed dirs live on the Linux FS (`/home/frankx/`) for fast I/O. Source assets come from the NTFS-mounted Google Drive (read-only).
