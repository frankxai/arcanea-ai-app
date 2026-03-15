# Arcanea Security Rules

## Secrets — ABSOLUTE RULES

- **NEVER** hardcode API keys, tokens, passwords, or connection strings in source
- **NEVER** commit `.env` files — `.env.example` is the committed template
- **NEVER** echo/log secrets in hooks, scripts, or CI output
- `.mcp.json` is UNTRACKED (gitignored) — `.mcp.json.example` is committed
- Pre-commit hook blocks: `sk-*`, `sbp_*`, `sb_secret_*`, `ghp_*`, `eyJ*`

## Input Validation

- Validate ALL user input at system boundaries (API routes, form handlers)
- Sanitize file paths to prevent directory traversal
- Use parameterized queries — never string-concatenate SQL
- Rate limit API endpoints (especially AI chat)

## Authentication

- Supabase Auth is the single auth provider
- Row Level Security (RLS) on ALL user-facing tables
- Session tokens via httpOnly cookies — never localStorage
- BYOK (Bring Your Own Key) for AI — zero stored third-party credentials

## Dependencies

- Audit `pnpm audit` before adding new packages
- Pin major versions in production dependencies
- Review changelogs before upgrading AI SDK packages (breaking changes common)

## Content Security

- Scrub observations before writing (Starlight Vault observe hook)
- No executable code in fragment/instinct files — declarative only
- Sanitize markdown before rendering (XSS prevention)
- CSP headers configured in Next.js middleware

## Deployment

- Vercel environment variables for all secrets
- Separate env vars per environment (preview vs production)
- Never force-push to production branch without review
- Build must be GREEN before considering work complete

## Incident Response

1. Identify scope of exposure
2. Rotate affected credentials immediately
3. Check git history for leaked secrets (`git log -p --all -S 'secret_pattern'`)
4. Update pre-commit hooks to catch the pattern
5. Document in `.arcanea/security/` (not in public docs)
