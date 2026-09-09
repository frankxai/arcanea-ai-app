# Font source and license evidence

Scope: existing Arcanea host typography reused by The Weight of Wonders. This release adds no font family, font file, dependency, preload, or font configuration.

The current root-layout source artifact `host-layout-source.tsx` imports `GeistSans` from `geist/font/sans`, `GeistMono` from `geist/font/mono`, and `Instrument_Serif` from `next/font/google`. Instrument Serif is configured at weight 400, normal and italic, with `display: "swap"` and CSS variable `--font-editorial`. The root applies all three font variables to `<html>`.

The existing Arcanea design tokens declare:

- editorial: `"Instrument Serif", "Migra", Georgia, serif`
- body/display: `Geist, "Geist Sans", ... system-ui, sans-serif`
- mono: `"Geist Mono", "JetBrains Mono", "Fira Code", monospace`

Official license sources:

- Geist Sans and Geist Mono: Vercel's official Geist repository and font page state SIL Open Font License 1.1: <https://github.com/vercel/geist-font/blob/main/OFL.txt> and <https://vercel.com/font>.
- Instrument Serif: the official Google Fonts source records copyright 2022 The Instrument Serif Project Authors and SIL Open Font License 1.1: <https://github.com/google/fonts/blob/main/ofl/instrumentserif/OFL.txt>.

This establishes the declared source and license only. It does not prove that the intended files loaded or that computed families, weights, fallback layout, and mobile wrapping are correct; those require browser reports and specimens from the reviewed build.
