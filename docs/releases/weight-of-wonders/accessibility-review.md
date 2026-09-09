# Weight of Wonders — scoped accessibility review

**Scope:** Final 12-entry built collection, dossier, and authoring surfaces represented by artifact `10109069129`, plus the frozen source at `10e8579deaa6aa25e7279f24e5a534282c5c78ca`.  
**Method:** Manual source/DOM semantics review, keyboard interaction checks recorded by the browser harness, desktop/mobile/reduced-motion screenshots, and normal/blocked-font specimens.  
**Finding:** **No serious or critical accessibility issue observed in the tested surfaces.** This is a scoped manual review, not an automated axe scan or exhaustive WCAG conformance audit.

## Evidence reviewed

- Collection and dossier pages have one visible main heading in the tested state, named breadcrumb navigation, structured section headings, and descriptive primary artwork alt text.
- Related-card artwork uses an empty alt inside an already named link, avoiding duplicate accessible text.
- Phase controls are native buttons with `aria-pressed`; the current phase uses a polite live region.
- Outcomes are native radio inputs grouped by `fieldset` and `legend`. Selection has a native checked control and border/background treatment, so it is not conveyed by color alone.
- The harness verifies sequential keyboard focus between phase buttons and native arrow-key radio selection.
- Clipboard status uses `role="status"` and `aria-live="polite"`. Clipboard rejection leaves a labeled, read-only textarea whose complete value is selected on focus.
- Buttons and primary actions use minimum heights of at least 44 CSS pixels; outcome rows provide larger click targets.
- Explicit `:focus-visible` treatment covers actions, cards, phase buttons, radio rows, opening summary, and the manual brief.
- Desktop, 375 px mobile, and blocked-font pages report no horizontal overflow. The normal and fallback authoring specimens remain legible without clipping.
- The reduced-motion state uses no decorative control animation and applies the host’s 0.01 ms transition cutoff.
- Reviewed screenshots show readable primary/secondary text against the dark host surfaces; no text is embedded in interaction controls as the sole label.

## Limits

- No automated axe result is claimed.
- The review does not establish every WCAG success criterion across the broader host application.
- Production assistive-technology behavior remains bounded by the same deployed DOM and must be included in the post-deploy receipt if it differs from the reviewed build.
