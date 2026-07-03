/**
 * Small adapter (authored here, not vendored) that exposes the classic-script
 * `Container`/`Button` bindings from ./vendor/container.js + ./vendor/button.js
 * as real `window` properties, so module-scoped React code can reach them.
 *
 * Must load AFTER vendor/container.js and vendor/button.js, as a classic
 * (non-module) script in the same document -- see liquid-glass-button.tsx.
 */
window.__LiquidGlassJS = { Container, Button };
