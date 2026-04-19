# Claude Cowork Handoff Template

Reusable template for handing off work from Claude Code (CLI) to Claude Cowork (desktop app with filesystem + browser + MCP). Copy the block below, fill in the `{{}}` placeholders, paste into a fresh Claude Cowork session.

Claude Cowork assumptions: filesystem read/write on the user's machine, browser tool for live verification, Claude's desktop MCP connectors (Canva, Figma, Linear, Notion, GitHub are typical). No Claude Code-specific tools (no TaskCreate, no Skill tool — adapt instructions in plain English).

---

## Template

```
You are a Claude Cowork session picking up from a Claude Code session that shipped foundation work on {{project}}. Verify what's on disk, fill gaps, and enrich — but stay tightly scoped to the files listed.

## Context (read these first)

- **Repo root:** {{absolute repo path, e.g. C:\Users\frank\Arcanea}}
- **Branch on origin:** `{{branch name}}`
- **Spec:** `{{path to spec.md}}`
- **Package:** `{{path to package}}`
- **AGENTS.md section to follow:** `{{section heading}}`

Read in order: AGENTS.md → spec → package README → package source files.

## What was shipped

{{bullet list of concrete files + commits}}

## What needs verification

1. Run `pnpm --filter {{package name}} build` from repo root. Confirm dist/ emits expected files.
2. Open `{{spec path}}` in your browser (via file://) and confirm no TODOs, no placeholders, no contradictions.
3. Browse `{{live URL}}` in your browser tool and confirm the rendered design matches the tokens.

## What to add (do these in order)

1. **{{task 1}}** — {{exact instructions with file paths}}
2. **{{task 2}}** — {{exact instructions with file paths}}
3. **{{task 3}}** — {{exact instructions with file paths}}

## Hard constraints

- Only touch files inside: {{whitelist}}
- Never add Co-Authored-By trailers — Arcanea is sovereign
- Never hardcode hex colors; use `@arcanea/design-system` tokens
- Never default to Inter, Arial, or Space Grotesk for typography (Anthropic frontend-design anti-patterns)
- Never commit `.env*`, never run `git add .`, never force-push
- If a branch switch happens during your session (another agent flipping), stop and report — don't chase

## Verification before claiming done

- `pnpm --filter {{package}} build` exit 0
- `pnpm --dir apps/web build` exit 0
- Git diff covers only whitelisted paths
- Browser loads without console errors
- Screenshot the changed surface and attach it to your report

## Deliverables

1. One git commit on `{{branch}}` with message `{{type(scope): description}}`
2. A one-paragraph report answering: what was missing, what I added, what I'd do differently, what the prior session missed
3. List of any API keys or config I need you (Frank) to set via `setx` before next run
```

---

## When to use this

- Complex multi-file work that benefits from browser verification (live design preview, MCP checks)
- Handover before you (Frank) switch machines or take a break
- Parallel track: Claude Code writes code, Claude Cowork audits + writes docs + browser-verifies
- Any task that wants Canva, Figma, or Notion MCP access (Cowork has those connectors first-class)

## When NOT to use this

- Pure code-edit tasks with no browser step (Claude Code is faster)
- Anything touching more than 2 subsystems (decompose first)
- Anything requiring `/skills` or Claude Code-specific tools
