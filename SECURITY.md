# Security Policy

## Reporting Vulnerabilities

Do not open a public issue for a suspected vulnerability.

Report security issues privately to the maintainer through the contact channels
listed in [SUPPORT.md](./SUPPORT.md). Include:

- affected package, route, or workflow
- reproduction steps
- impact assessment
- suggested fix, if known

## Secrets

Never commit API keys, service-role keys, tokens, private customer data, or
credentials. Use local `.env` files and provider dashboards for secret storage.

If a secret is exposed:

1. Revoke it immediately at the provider.
2. Rotate dependent credentials.
3. Open a private security report with the affected paths and commits.

## Supported Scope

Security reports may cover:

- `apps/web`
- public API routes
- MCP servers and tools
- packages under `packages/`
- CI/CD workflows
- authentication, storage, and provenance systems

Historical experiments, archived content, and staging documents may be triaged
lower unless they affect the live product or published packages.
