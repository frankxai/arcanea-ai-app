# Arcanea

Arcanea's universe, stories and software live in this app repository. Explore
[arcanea.ai](https://arcanea.ai), or use the map below to find the source you need.

| Start here                                                     | What it contains                                                                  |
| -------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| [apps/web](apps/web/)                                          | Web app, reader and creator interfaces                                            |
| [.arcanea/lore/CANON_LOCKED.md](.arcanea/lore/CANON_LOCKED.md) | Locked Arcanea canon; proposed changes require human approval                     |
| [book](book/)                                                  | Library source material; public releases have separate editorial and rights gates |
| [packages](packages/)                                          | Shared libraries and integration packages                                         |
| [packages/arcanea-skills](packages/arcanea-skills/)            | Proposed curated creator skills, passports and evaluation records                 |
| [packages/arcanea-mcp](packages/arcanea-mcp/)                  | Local MCP package source; confirm its own configuration and release status        |
| [planning-with-files](planning-with-files/)                    | Current task records and integration limits                                       |

## Review creator skills

The curated package has four internal candidates and zero ready skills. Its
installer excludes candidates. Earlier skill roots still exist in this repository;
a repository-wide skills scan is not a curated installation.

From a checkout, using Node from [.nvmrc](.nvmrc):

```sh
node packages/arcanea-skills/scripts/catalog.cjs
node packages/arcanea-skills/bin/install.js --list
node --test packages/arcanea-skills/tests/catalog.test.mjs
```

These checks need no provider keys or web-app setup. See the
[package README](packages/arcanea-skills/README.md) for readiness and installation
rules. Bundle entries should pin this repo, their selected folder and a commit.

## Contribute

Use [CONTRIBUTING.md](CONTRIBUTING.md) for creator feedback, reproducible bugs and
development checks. Follow the [code of conduct](CODE_OF_CONDUCT.md). Report
vulnerabilities using [SECURITY.md](SECURITY.md).

Work on the universe and its releases is tracked in
[issue #276](https://github.com/frankxai/arcanea-ai-app/issues/276). The
[source-consolidation proposal](docs/strategy/arcanea-source-consolidation-2026-10-01.md)
records the proposed repo and bundle boundaries; it is not release approval.

## Rights status

A root LICENSE file is absent. A repository-wide license choice and the rights
review of older skill sources remain open. Package metadata and public visibility
do not establish clearance for every code, lore or media component. Check the
specific component's terms and provenance before reuse. This README adds no license.
See [GitHub's licensing guidance](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository).
