# Arcanea Agent Execution Protocol

> **Date**: 2026-06-19  
> **Status**: Active Rules Plane  
> **Target Audience**: All Coding Agents (Luminor Fleet: Claude, Codex, Grok, Gemini, OpenCode)

This protocol enforces repository-level engineering constraints. All agents MUST read and strictly obey these rules before initiating file writes or code promotions.

---

## 1. Runtime & Package Discipline

1.  **Node.js & pnpm Pinning:** Use Node.js version `20.x` and `pnpm` exclusively. Never run `npm` or `yarn`. Keep `.nvmrc` intact.
2.  **Frozen Lockfile in CI:** Always run `pnpm install --frozen-lockfile` if installing or restoring dependencies.
3.  **Strict Lint & Typecheck Gates:** No pull requests can be merged unless:
    *   `pnpm run lint` passes with 0 warnings.
    *   `pnpm run type-check` (or `tsc --noEmit` inside packages) passes with 0 errors.
    *   `pnpm run build` completes successfully.

---

## 2. Git Branching & Promotion Discipline

1.  **Surgical Write Scopes:** Keep changes focused on the target task. Do not refactor unrelated files unless explicitly asked.
2.  **Dirty Worktree Isolation:** If the git state is dirty, stage only target files. Report unrelated changes to the operator.
3.  **No Direct Commits on Main:** Never push directly to `main` without running verification checks. Use feature branches (`feature/arc-xx`) or isolated git worktrees.

---

## 3. Resource Safety & Concurrency Law

1.  **WSL2 Memory Check:** Before spawning parallel subprocesses or executing concurrent agent nodes, verify free RAM:
    ```bash
    cat /proc/meminfo | grep MemFree
    ```
2.  **Sequential Fallback:** If free RAM is **below 2 GB**, all operations MUST be run sequentially to prevent WSL2/Node process memory crashes.

---

## 4. Verification Command Suite

All agents must run the appropriate local verification command before declaring a task completed:

*   **To verify the Next.js frontend web app:**
    ```bash
    pnpm --dir apps/web type-check
    pnpm --dir apps/web build
    ```
*   **To run the local CLI package verification:**
    ```bash
    pnpm --dir packages/arcanea-cli run build
    ```
*   **To verify the Hermes message bus:**
    ```bash
    pnpm --dir packages/agent-bus run build
    ```
*   **To run monorepo-wide workspace verification:**
    ```bash
    tsx scripts/verify-project-workspaces.ts
    ```
