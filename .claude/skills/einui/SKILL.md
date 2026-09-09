---
name: einui
description: Integrate Ein UI components into an existing React or Next.js project using verified upstream source, the project's design tokens, and scoped visual and interaction checks. Use when adding Ein UI, liquid-glass cards, buttons, forms, widgets or blocks, or adapting their themes.
---

# Ein UI integration

Add the smallest useful component and make it work with the product's existing
design language. Preserve routes, custom components, tokens and user decisions.

## Inspect before installing

1. Confirm repository ownership and read its design instructions, package manifest,
   lockfile, component aliases and global styles.
2. Check whether an equivalent component already exists. If it does, adapt it
   unless the requested capability requires a different implementation.
3. Read the current [Ein UI documentation](https://ui.eindev.ir/docs) and the
   relevant component source in [the upstream repository](https://github.com/einui/einui).
   Ein UI distributes component source through a shadcn registry; this skill
   does not bundle that source or certify an installed version.
4. Inspect the selected registry item's files, exports, dependencies, target paths
   and license. Record the source revision or retrieved hash. Component counts,
   import paths and API examples can change.
5. Compare the selected component's actual requirements with the project. Do not
   upgrade Next.js, React, Tailwind or the package manager just because an older
   guide called them prerequisites.

## Add one component

Use the project's pinned CLI and package manager. The upstream
[installation guide](https://ui.eindev.ir/docs/installation) documents the
`@einui/glass-card` namespace. Confirm the registry mapping and selected item
resolve in the intended environment before executing an installation command.

Review the files an installer will write. Preserve existing implementations;
resolve a collision through a scoped adaptation. Add only dependencies the
selected source requires. Do not install every component, page block or peer
package by default.

Read the installed exports and configuration to determine imports, props,
client/server boundaries and CSS requirements. Do not assume an example path
such as `@/components/liquid-glass/` matches this project's aliases.

If the registry cannot be verified, inspect the upstream source and prepare a
scoped implementation or a concrete dependency blocker. Do not report installation
as successful without the resulting files and relevant checks.

## Match the product

Use existing semantic design tokens first. Read the project's brand or taste
files before asking about color. Ask only when a material design decision remains
unresolved; an existing approved palette is sufficient to proceed.

Keep text and controls legible over translucent surfaces. Give focus, hover,
disabled, error and loading states enough distinction. A backdrop blur is a
visual effect, not a substitute for hierarchy or readable contrast.

Use [upstream theming guidance](https://ui.eindev.ir/docs/theming) where relevant,
then adapt it to the product's token system. Do not replace a working theme with
a mandatory seven-color scheme, ban an approved brand color, or assume that a
palette formula proves contrast. Preserve the existing light/dark-mode mechanism.

Limit motion and respect reduced-motion preferences. Keep essential content and
controls usable without animation or transparency. Use sentence case for interface
copy and preserve official names.

## Verify the actual use

- Run the project's relevant type, lint and build gates.
- Exercise keyboard navigation, focus restoration, labels, form errors and
  disabled/loading states for the selected component.
- Inspect the affected page at desktop and mobile sizes, including overflow,
  text contrast and the product's supported themes.
- Verify any registry-generated block's routes and actions before exposing them.
- Inspect the connected preview deployment when the project uses Vercel. Stop
  session-owned local servers after verification.

These checks apply to the rendered product. A Radix dependency or upstream
accessibility claim does not prove that the composed page is accessible.

## Handoff

Report the component and source revision, changed files, integration choices,
completed checks and the actual preview URL when available. Identify any test or
capability that remains unverified.

The older local guide named six reference files, a palette converter and several
examples that were not present in this skill directory. Those names are not
available tools or prerequisites. Use the verified sources above and the current
project's code.
