# FS Recovery Runbook

## Problem

Current workspace shows intermittent `EIO` errors under WSL on `/mnt/c/Users/frank/Arcanea`.  
This causes random read/write failures, broken `pnpm` access, and blocked automation.

## Fast Recovery Sequence

1. Save any uncommitted work.
2. From Windows PowerShell (Admin), run:
   ```powershell
   wsl --shutdown
   chkdsk C: /scan
   ```
3. Reopen WSL and return to repo:
   ```bash
   cd /mnt/c/Users/frank/Arcanea
   ```
4. Verify core paths:
   ```bash
   ls apps/web packages/arcanea-mcp packages/memory-mcp planning-with-files
   rg --files apps/web >/tmp/rg-web.txt
   ```
5. Rebuild local MCP servers:
   ```bash
   bash scripts/setup-mcp.sh
   ```

## Recovery Done Criteria

- `rg --files apps/web` returns with no `I/O error (os error 5)`.
- `bash scripts/setup-mcp.sh` exits `0`.
- `corepack pnpm -C packages/arcanea-mcp build` exits `0`.
- `corepack pnpm -C packages/memory-mcp build` exits `0`.

## If Errors Persist

1. Move active repo to Linux filesystem (`~/Arcanea`) for heavy builds.
2. Keep `/mnt/c` as sync/export target only.
3. Re-run MCP setup and build/test workflow from Linux filesystem path.
