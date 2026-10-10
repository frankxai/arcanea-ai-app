# Arcanea companion repair

Owning programme: [#276](https://github.com/frankxai/arcanea-ai-app/issues/276). Base: `4441801b5e003499bd70ca25e141fa7986793e58`. Owner: `codex-chat-companion-20261011`. Reader PR560 remains on its separate review branch.

## Task contract

- Scope: make the existing floating companion use the customer's selected provider, key and model; preserve partial replies and drafts; abort on stop, close and identity change; share useful safe errors with full chat.
- Files: `apps/web/components/lumina/{lumina-bubble,companion-chat}.tsx`, `apps/web/components/chat/chat-area.tsx`, `apps/web/lib/chat/error-message.ts`, `packages/design-system/{package.json,src/companion.module.css}`, `scripts/{verify-companion-browser.cjs,tests/chat-error-message.test.cjs}`, `.github/workflows/companion.yml`, this pickup.
- Non-goals: provider or credit rails, durable chat/history integration, image/voice, SDK upgrades, pricing, paid calls, production promotion or brand identity changes.
- Acceptance: explicit send only; missing key preserves draft and gives Settings recovery; existing SDK renders streams; stop/close preserve partial text and drafts; account changes discard prior transcript and abort; keyboard/IME/focus, 44px controls, 375px, reduced motion and forced colors work; raw provider errors are never rendered.
- Verification: pure error tests; compiled hosted browser fixture and source-bound captures; native lint/typecheck/build and security; inspect the exact preview and mobile/desktop captures.
- Rollback: revert this consumer/styles/helper slice. It changes no creation, billing or persistence data.

## Why this change

| Before                                                           | After                                                                                     | Why                                                                             |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Companion sends a fixed model without a provider or customer key | Existing `useProvider` feeds the installed AI SDK transport on each explicit send         | It uses the same BYOK route as full chat                                        |
| Custom stream parser with no request cancellation                | Installed SDK handles the protocol and aborts its request on stop, close and unmount      | Partial replies remain usable and late responses cannot cross account lifetimes |
| Ctrl/Cmd+K opens both companion and command palette              | Existing command palette owns its shortcut                                                | One keystroke opens one interface                                               |
| Missing-key denial becomes “Something went wrong”                | Shared safe error copy points to customer provider settings                               | The customer gets an actionable next step without raw provider details          |
| Arbitrary consumer styling and animated spring toggles           | Canonical design-system CSS, static keyboard interactions, 44px targets and visible focus | Respect the accepted Arcanea palette and repeated-use accessibility             |
| Empty SDK streams finish successfully with no visible answer     | Explicit “No text returned” recovery retains the sent message                             | A completed HTTP stream alone does not establish a usable reply                 |
| Editing a failed prompt could append a duplicate user turn       | The installed SDK replaces the identified failed message                                  | Recovery keeps the conversational context coherent                              |

The named alternative is the existing full chat's SDK transport/provider implementation. Reuse avoids a second protocol implementation. The installed versions are AI SDK `6.0.300` and React bindings `3.0.303`; no package upgrade is included. Current upstream documentation defaults to v7, so installed source remains the implementation reference for this repair.

## Evidence limits and release state

Implementation is a candidate until its checks and rendered captures pass. The hosted browser fixture intercepts provider requests and emits synthetic SDK stream events. Its synthetic Supabase BroadcastChannel event tests the actual AuthProvider's UI lifetime; it does not establish real login, cookies, production RLS or customer outcomes. No real provider calls or production writes are authorized in that fixture.

Retained attempts: run38092654639 at `010c7077afcff4148e256feca38822c2c192efa6` could not locate the opener after five seconds. Run38092934564 at `735399aeaf437d6d7a718d88dd26fae908cad929` retained a failure screenshot and no page errors: the normal first-visit Worlds dialog correctly hides background controls from accessibility navigation. The fixture now dismisses it through its visible Skip button. Increasing the wait alone did not fix the check. Both failed receipts remain available. A separate in-process check of the installed SDK reproduced an empty stream ending `ready` with no error or answer; explicit empty-response recovery was then added.

Cancellation aborts the browser request. The current server chat route's provider cancellation and billing behaviour are outside this scope; already-started work may still be charged. Provider key storage remains the existing browser settings implementation, whose wider account isolation is a separate owned task. Replies are ephemeral in this page and do not transfer into full chat.

Production release requires exact-revision independent review, real provider acceptance and applicable release gates. The full Arcanea programme remains active: Queen/SIS, graphs/memory, private creator workspaces, canvas, reader scenes, academy/community, books/media, developer kits and commerce remain distinct obligations.

Skills applied: Starlight SI routing (one admitted implementation lead), Emil design engineering, Premium Web OS and humanizer. Loading guidance is not proof of runtime enforcement. Machine pressure keeps builds/browser work on the hosted runner; no new local swarm, install or server is started.
