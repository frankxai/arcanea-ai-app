/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

// TASTE.md Gate 6 / DESIGN_TOKEN_MIGRATION Step 3 — raw hex enforcement.
// Banned in app code: literal "#abcdef" or "#abc". Sources of truth are
// @arcanea/design-system tokens.ts (brand, elements, gold, luminorAccents,
// tierAccents, streamAccents, pillarAccents) and the runtime --arc-* CSS
// variables exposed via tokens.css. Use those imports or var() references.
//
// Currently set to `warn` because ~11 files (personas-showcase,
// luminor-team-preview, integration-grid, sovereignty-pillars,
// world-graph-canvas, guardian-showcase, how-it-works, cta-section, etc.)
// still hold legacy hex literals from before the token migration. Will be
// upgraded to `error` once Step 2 of the migration plan is fully applied
// across all apps/web/components/{premium,landing} files.
const noRawHex = {
  selector: "Literal[value=/^#[0-9a-fA-F]{3,8}$/]",
  message:
    "Raw hex banned per TASTE.md Gate 6. Import from @arcanea/design-system " +
    "(brand / elements / gold / luminorAccents / tierAccents / streamAccents / " +
    "pillarAccents) or use a var(--arc-*) CSS variable from tokens.css.",
};

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    linterOptions: {
      reportUnusedDisableDirectives: false,
    },
    rules: {
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-require-imports': 'warn',
      '@typescript-eslint/no-unsafe-function-type': 'warn',
      '@next/next/no-html-link-for-pages': 'warn',
      'prefer-const': 'warn',
      'react-hooks/immutability': 'warn',
      'react-hooks/preserve-manual-memoization': 'warn',
      'react-hooks/purity': 'warn',
      'react-hooks/refs': 'warn',
      'react-hooks/rules-of-hooks': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/static-components': 'warn',
      'react/no-unescaped-entities': 'warn',
      'no-restricted-syntax': ['warn', noRawHex],
    },
  },
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);
