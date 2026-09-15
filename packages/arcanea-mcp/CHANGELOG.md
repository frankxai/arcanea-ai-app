# @arcanea/mcp-server

## 1.1.0

### Minor Changes

- WorldPack audit tools: `worldpack_check` (canon, rights and provenance findings with rule id, severity, evidence and fix; your own canon via `canonDocument`), `worldpack_verify` (digest, counts, agent roles and canon binding) and `worldpack_rules` (the rule catalog).
- `@arcanea/world-pack` and Arcanea's `CANON_LOCKED.md` are bundled into `dist/vendor`; the published manifest has no workspace dependencies.
- Server version and the HTTP `/health` tool count now come from `package.json` and the live registry instead of hardcoded values (`0.3.0` / `54`).
- `scripts/consumer-smoke.mjs` installs the packed tarball into an empty directory and talks MCP to the bin before any publish.

## 0.7.0

### Minor Changes

- d37f7bc: New @arcanea/extension-core shared package for browser extensions. Production upgrades across all overlay packages with full canonical content, expanded templates, and install/verify/detect functionality. VS Code extension fully upgraded with Guardian webview panel, Gate progress tracking, Lore explorer, and 7 command implementations. Chrome extension hardened with PNG icons and extension-core integration. Comprehensive test suites added for extension-core, auth, and chrome-extension packages. CI/CD pipeline expanded with VS Code and Chrome extension build jobs.

### Patch Changes

- Updated dependencies [d37f7bc]
  - @arcanea/os@0.7.0

## 0.6.0

### Minor Changes

- d37f7bc: New @arcanea/extension-core shared package for browser extensions. Production upgrades across all overlay packages with full canonical content, expanded templates, and install/verify/detect functionality. VS Code extension fully upgraded with Guardian webview panel, Gate progress tracking, Lore explorer, and 7 command implementations. Chrome extension hardened with PNG icons and extension-core integration. Comprehensive test suites added for extension-core, auth, and chrome-extension packages. CI/CD pipeline expanded with VS Code and Chrome extension build jobs.

### Patch Changes

- Updated dependencies [d37f7bc]
  - @arcanea/os@0.6.0

## 0.5.0

### Minor Changes

- 7b585d6: Add Intelligence Engine tools to MCP server: route_guardian, check_voice, get_design_tokens. Powered by @arcanea/os. Also adds design-tokens and voice-rules resources.

### Patch Changes

- Updated dependencies [7b585d6]
  - @arcanea/os@0.3.0
