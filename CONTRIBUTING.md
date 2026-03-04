# Contributing to Arcanea

Welcome, Creator. This guide outlines the standards and workflows for contributing to the Arcanea ecosystem.

---

## 🛠️ Development Workflow

### 1. Requirements
- **Node.js**: 20.x
- **Package Manager**: `pnpm@8.15.0` (Mandatory)
- **Engine**: Turborepo

### 2. Standard Commands
- `pnpm install`: Install dependencies.
- `pnpm dev`: Start the development server for all apps.
- `pnpm build`: Build all packages.
- `pnpm lint`: Run linting across the workspace.
- `pnpm verify:all`: Run the automated quality gates (build + integration checks).

---

## ✅ Definition of Done (DoD)

A feature or fix is only considered "Done" when:

1.  **Builds & Lints**: `pnpm run build` and `pnpm run lint` pass with zero errors.
2.  **Quality Gates**: `pnpm run verify:all` passes successfully.
3.  **Documentation**:
    - Any new architecture or strategy is documented in the appropriate `/docs` subdirectory.
    - The `DOCS_MAP.md` is updated if new key documents are added.
4.  **Canon Sync**: Any new lore, Guardians, or skills must be registered in `docs/canon/ARCANEA_UNIVERSE_CANON.md` to maintain ecosystem consistency.
5.  **Tests**: New features must include relevant tests (unit or e2e where applicable).

---

## 📚 Documentation Standards

Arcanea is a "documentation-first" project. The "Brain" of the project lives in the `/docs` directory.

- **Strategy**: `/docs/strategy/`
- **Technical/Architecture**: `/docs/technical/`
- **Guides**: `/docs/guides/`
- **Status/Reports**: `/docs/status/` and `/docs/reports/`

**Note**: Never place status or strategy markdown files in the root directory.

---

## 🧙 Lore & AI Standards

- **Guardians**: Maintain the established tone and personality for each Guardian.
- **Frequencies**: Adhere to the canonical Solfeggio frequencies for each Gate.
- **MCP Protocols**: Ensure all new MCP tools follow the unified agent protocol for communication with the web frontend.

---

## 🚀 Quality Gates

Before pushing or opening a PR, always run:
```bash
pnpm run verify:all
```
This script ensures that the build is stable and all integration points (Supabase, AI services, etc.) are correctly configured.

---

*"We build with intention, documented for the future."*
