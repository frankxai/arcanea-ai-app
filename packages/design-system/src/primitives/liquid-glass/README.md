# liquid-glass

Vendored `dashersw/liquid-glass-js` (MIT), wrapped as `<LiquidGlassButton />`. See
`registries/design-assets.json` in `claude-skills-library` for the intake record and
`liquid-glass-button.tsx` for usage notes and known limitations.

## Wiring into a consuming app

This package (`@arcanea/design-system`) only ships the TypeScript component — `tsc`
does not copy the plain-JS/CSS vendor assets into `dist/`. Any app that renders
`<LiquidGlassButton />` must serve these four files at a static path (default
`/vendor/liquid-glass-js/`, override via the `basePath` prop):

```
vendor/container.js
vendor/button.js
vendor/glass.css
bridge.js
```

In `apps/web`, that means copying them into `public/vendor/liquid-glass-js/` (already
done as of the initial intake — re-copy if `vendor/` here is ever re-vendored from
upstream). A future improvement would be a build-time copy step instead of a
manually-kept-in-sync static copy; not built yet — flagged here rather than hidden.
