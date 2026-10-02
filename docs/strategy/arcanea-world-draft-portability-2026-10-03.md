# Carry your world draft between tabs

The existing creator proposal in #496 now exports restorable world JSON and opens
it again through Import draft. The file carries the original concept, draft ID,
world rules/systems, characters/personality, places, founding event, palette and
image prompt. Concept art is separate. This remains an unmerged proposal.

Import is local to the tab, available without sign-in, and makes no AI request or
account write. Save to an account still uses the existing authenticated private
save route. An exported draft has no account ownership or credentials; a file is
not proof of ownership or permission to publish its contents.

Before replacing a different draft, the creator confirms. The previous text stays
available through Restore previous draft, including a changed file using the same
draft ID. Save to the account or export both versions for lasting copies: the tab
has only one previous-draft slot and closing it loses tab recovery.

Older world-only JSON exports also open, retaining their known world fields.
They get a new draft ID and use the world description as a concept fallback;
the original concept was never in that old file. Unknown fields/versions are
refused so an unfamiliar format cannot silently lose story material. Fix that
file separately or keep its source; the importer never edits it.

Invalid JSON, cancellation or a failed storage write leaves the current draft
on screen. If restoring browser records after failure also fails, the UI explains
that recovery is uncertain and asks for an export before leaving. Reopening is
verified with complete synthetic fixtures; actual creator repair time, generated
world quality, account storage and paid demand remain unmeasured.

Use the existing app as the Arcanea creation/continuity surface. Reusable author,
graph, runtime and media systems keep their current owners. This workflow adds no
repo, canon pack, storefront, install promise, rights grant or licence decision.
