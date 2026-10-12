# Author Council

The existing council builds craft-analysis prompts and review candidates. Its agent seats are analytical profiles, not endorsements or independent human reviewers. A machine critique never approves a manuscript, canon change, rights clearance or publication.

## Use your harness model

`build_author_prompts` returns the selected seats and their prompts without making provider calls. The host can execute them with its explicitly chosen eligible model, including models reached through OpenRouter. Keep the host's permission, privacy, payer and budget rules. The council does not change a Codex or OpenCode model selection.

## Direct provider execution

`deliberate` supports the existing OpenAI and Anthropic adapters. It requires all four choices below and the selected provider's credential in the server environment. No credential is accepted through manuscript text or tool arguments.

| Environment variable                    | Required choice                                            |
| --------------------------------------- | ---------------------------------------------------------- |
| `ARCANEA_COUNCIL_PROVIDER`              | `openai` or `anthropic`                                    |
| `ARCANEA_COUNCIL_MODEL`                 | Your selected provider model ID; there is no default model |
| `ARCANEA_COUNCIL_MAX_CALLS`             | Integer 1–24 for the entire council attempt                |
| `ARCANEA_COUNCIL_MAX_OUTPUT_TOKENS`     | Integer 1–4096 per request                                 |
| `ARCANEA_COUNCIL_TIMEOUT_MS`            | Optional integer 1–60000; default 30000                    |
| `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` | Only the selected provider's key                           |

Choose an eligible model that supports this adapter's request format. Unsupported requests fail rather than changing models or downgrading the format. OpenAI uses JSON mode with runtime shape validation and `max_completion_tokens`; Anthropic uses Messages with `max_tokens`. These caps do not establish a dollar budget or reconcile a provider invoice. Use separately authorized, provider-limited funding for live execution.

Each request retains its selected provider/model, call/output limits, response identity, returned model, available usage and response hash. Returned model aliases are recorded; they are not a claim of independent model verification. No hidden retry, provider fallback or mock critique exists. A failed parallel seat waits for already-dispatched seats to settle and retains their valid partial critiques. Transport failures remain uncertain and require reconciliation before another attempt. Refused, truncated, malformed or wrongly attributed responses cannot become successful critiques. Structural checks do not verify citation truth or literary quality.

The selected credential is redacted if a provider echoes it into retained text or response identity. The response hash remains bound to the original response bytes.

## Review a book chapter

Use the existing `arcanea-orchestrator author-council` command with the book's `.author-council.yaml` and an already-installed trusted council MCP JavaScript entry:

```sh
arcanea-orchestrator author-council ./my-book chapters/01.md --mcp-entry /absolute/installed/author-council/dist/mcp/bin.js
```

The monorepo default resolves the existing sibling build. `--mcp-entry` supports an explicit installed entry without downloading or registering a global server. It is an operator-controlled executable path, never a value loaded from chapter text or book configuration. The command forwards only the selected provider credential and the council choices.

Each run saves a distinct Markdown audit in the book's `council-audits/`, bound to the exact chapter SHA256. Earlier audits and the chapter remain unchanged. Failed attempts return failure after saving their available record; a later retry creates a new audit. Every audit keeps `review_status: human_review_required`, `blocker: true`, `blocker_count: null`, `publication_allowed: false` and `canon_approved: false`. `blocker_threshold` remains recorded configuration; the critique contract has no severity field, so the command cannot infer a passing release gate from it.

Chapter files must be valid UTF-8. BOM and CRLF bytes are retained and included in the file hash; invalid encoding refuses before provider dispatch. The orchestrator launcher forwards selected values without importing a sibling package's build output; the configured server performs the policy validation.

The tool RPC wait covers the configured call cap times the per-call timeout, plus 10 seconds for cleanup. This prevents the SDK's shorter default from cancelling a valid multi-seat run. Invalid limits still refuse in the server and use a bounded launcher timeout.

The current record is retained after an ordinary provider failure. It is not a durable workflow journal for a killed process, disk failure or interrupted financial reconciliation. Those production recovery gates remain separate.

## Verification

Build with the repository's pinned pnpm and Node versions, then run `node --test packages/author-council/tests/*.test.mjs` and `pnpm --filter @arcanea/orchestrator exec tsx --test tests/author-council.test.ts`. The owning workflow runs emitted-package MCP and native stdio/book tests on Linux and Windows. Provider responses are simulated and credentials are fixture values. No paid model call, literary ranking, human approval, tenant isolation or npm publication is proved by these tests.

Request formats were checked against the [OpenAI Chat Completions reference](https://developers.openai.com/api/reference/resources/chat/subresources/completions/methods/create) and [Anthropic Messages reference](https://platform.claude.com/docs/en/api/messages/create) on 13 October 2026.
