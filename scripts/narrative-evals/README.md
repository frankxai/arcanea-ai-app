# Narrative development screen runner

This operator tool runs a separately prepared OpenRouter development experiment.
It helps compare actual creative artifacts while retaining failed and uncertain
attempts. It has no production route, customer credentials or agent-promotion hook.

Inspection is the default and does not read an API credential:

```sh
python scripts/narrative-evals/openrouter-screen.py --plan /absolute/private/plan.json
```

The plan supplies immutable text requests, exact model IDs and price limits, at
most 24 sequential calls, 4,096 maximum output tokens per call and a total cap
of at most US$10. Byte-based input estimates are deliberately conservative;
they are not measured token counts or a billing guarantee. Plans must declare
development-only inputs and exclude reference answers and holdout tasks. The
operator must verify the actual input data; those fields do not inspect or
classify arbitrary prose. Keep manuscripts, references and live outputs private.

Paid execution needs explicit operator-verified founder authority, a separate
approval receipt bound to the plan hash, scope, call count, total cap and expiry,
and an authorized key supplied through `OPENROUTER_API_KEY`. Do not put a key in
chat, the plan, the receipt, source control or command arguments. The local receipt
check validates fields, not signer identity. No key creation, purchase or top-up
is implemented or authorized by this tool.

The key must have a provider-enforced, non-resetting limit no greater than the
approved cap, count BYOK usage and have sufficient remaining credit. The runner
checks that limit before each new request. It fixes the API origin, rejects
authenticated redirects, restricts provider prices and data collection, requires
parameter support and disables provider fallback. Requests contain no tools,
plugins or model fallback. Provider-default sampling and reasoning remain a
recorded experimental limitation.

```sh
python scripts/narrative-evals/openrouter-screen.py --plan /absolute/private/plan.json --execute --approval /absolute/private/approval.json
```

Each reservation is flushed to `attempts.jsonl` before the inference request.
Raw responses and their hashes, returned model/provider, usage, cost and response
latency are retained beside the private plan. Re-running verifies and skips
completed calls. An interrupted reservation, lost response, missing cost, changed
output, model substitution, tool request or truncated output stops further calls.
It preserves uncertain reservations and makes no automatic retry. A human must
reconcile the attempt with the provider before preparing any further authorized
work. The runner never removes a foreign writer lock, including an old lock.

Run the offline checks without model access:

```sh
python -O scripts/tests/narrative-screen.test.py
```

These checks use injected transports and synthetic inputs. They verify local
denial and recovery behavior, not live provider billing, literary quality, model
rankings, filesystem/tenant isolation, harness performance or safe production
self-improvement. Real outputs still need source verification, blind human
preference and repair-effort review. A small development screen cannot close
the full evaluation programme or justify foundation promotion.

Official API references: [model catalog](https://openrouter.ai/api/v1/models),
[provider routing](https://openrouter.ai/docs/guides/routing/provider-selection),
and [key credit limits](https://openrouter.ai/docs/api_reference/limits).
