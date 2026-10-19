# Arcanea creative director draft lab

Additive route: `/labs/creative-director/index.html`. This original implementation projects the shared Starlight kernel into Arcanea's current visual direction. It lets a user edit source and node data, inspect typed dependencies and context, move nodes, save/restore in the browser, undo an edit and export a portable JSON or readable plan.

The shared generator is `frankxai/Starlight-Intelligence-System/examples/creative-director/generate-labs.mjs` (PR 309). `provenance.json` pins the actual kernel revision and exact projection digest. Edit the shared inputs and regenerate; do not fork the kernel into a second authority. In CI, the shared proof tests all three projections at 375/768/1440 and verifies keyboard focus, required-context rejection, negative/overspend rejection, invalid edits, save/restore, reload and real JSON downloads.

## Product integration

Accepted world snapshots, creation proof and the existing application graph remain canonical. Reuse worldbuilder, canon-guardian and arcanean-art-director rather than registering another supervisor. The next slice must authenticate scope server-side, read the native accepted revision, persist a proposal through the existing product service and prove refresh/export/recovery with RLS denial tests. Browser-supplied IDs, quotes and review flags are examples.

This lab sends no model, media, payment or publication requests. All records are synthetic, and exports explicitly have identityVerified=false and authorization=null. Local storage is a convenience copy, not durable memory. There is no account-backed save or generated media claim.

## Release evidence

Read the current root AGENTS.md and product release gates. The public homepage screenshots are before-reference evidence for this new route, not a previous version of this lab. The shared workflow supplies generated-code screenshots; exact-source native project preview and after inspection must also pass before promotion. Preserve GenCreator's private-alpha HOLD and Arcanea's locked canon.
