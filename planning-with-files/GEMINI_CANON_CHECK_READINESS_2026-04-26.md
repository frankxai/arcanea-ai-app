# Gemini Full-Manuscript Canon-Check — Readiness

> **Status:** READY-TO-RUN — blocked on Gemini auth + arco routing config.
> **Authored:** 2026-04-26 by Shinkami under Frank's autonomous-execution mandate.
> **Closes:** Priority 5 of `docs/ops/HANDOVER-2026-04-26-las-tierras-council-elevation.md`.

---

## Why this is here

The Las Tierras de Luz manuscript is 12 chapters / ~50,000 words. Council passes have been done in 5-agent Claude dispatches per chapter — each agent reads each chapter independently. **No agent has yet held the entire manuscript + all canon documents in one window simultaneously.** Cross-chapter consistency (a name spelled the same way every time, a relationship beat that resolves in Ch 11 echoing the seed planted in Ch 4, a Veldarín term used identically across chapters) cannot be guaranteed by per-chapter review.

**Gemini 2.5 Pro's 2M-token context window can hold this:**

| Source | Approx tokens |
|---|---|
| 12 chapters of Las Tierras (50K words) | ~75,000 |
| `book/las-tierras-de-luz/BIBLE.md` | ~10,000 |
| `book/las-tierras-de-luz/AUTHORS_NOTE.md` | ~1,000 |
| `book/las-tierras-de-luz/GLOSSARY.md` | ~2,000 |
| `book/las-tierras-de-luz/book.yaml` | ~500 |
| `.arcanea/lore/CANON_LOCKED.md` | ~10,000 |
| `.arcanea/lore/realms/INDEX.md` | ~3,000 |
| `.arcanea/lore/realms/veldoria.md` | ~10,000 |
| `.arcanea/lore/realms/aurevalde.md` | ~6,500 |
| `.arcanea/lore/realms/mar-arcano.md` | ~7,000 |
| `planning-with-files/LAS_TIERRAS_REWRITE_PLAN_2026-04-25.md` | ~13,000 |
| **Total** | **~138,000 tokens** |

Well within Gemini 2.5 Pro's 2M context. A single one-shot pass can verify every cross-document consistency simultaneously — the kind of analysis that 12 separate Claude dispatches structurally cannot perform.

---

## Blockers (current)

### 1. Gemini auth not configured

```bash
$ arco doctor
gemini     unknown              C:\Users\frank\AppData\Roaming\npm\gemini
Auth hints:
    • gemini: Set GOOGLE_API_KEY (or GEMINI_API_KEY) to enable BYOK.
```

**Frank action required:** set `GOOGLE_API_KEY` or `GEMINI_API_KEY` in the shell environment. (BYOK only — agents cannot do this; it's a security boundary.)

### 2. arco routing config gap for `world.canon` on `gemini-arcanea`

```bash
$ arco run --task world.canon --surface gemini-arcanea --dry-run "test"
No model resolved for task=world.canon surface=gemini-arcanea.
```

The router spec doesn't yet have a `world.canon → gemini-arcanea` mapping. Two ways to handle:

- **Option A (preferred):** Update `@arcanea/router-spec` to add the mapping. Frank or a future agent can extend `~/.arcanea/config.yaml` or the package source. Pattern: `world.canon` should route to `gemini-2.5-pro` on the `gemini-arcanea` surface (full 2M context). Once the spec is extended, `arco run --task world.canon --surface gemini-arcanea ...` works.
- **Option B (immediate):** Use `research.deep` task class instead, which is already routed for Gemini. The semantic fit is acceptable — full-manuscript canon-check IS cross-source synthesis.

---

## How to run when blockers are clear

### Step 1: Verify auth + routing

```bash
export GOOGLE_API_KEY="..."     # Frank sets
arco doctor                     # confirm gemini → byok
arco run --task research.deep --surface gemini-arcanea --dry-run "ping"
                                # confirm a model resolves
```

### Step 2: Compose the canon-check prompt

Create the prompt as a here-doc that gives Gemini all the source files. Save the canon-check command to a temporary script (the command line is too long for one invocation):

```bash
cat > /tmp/canon-check-las-tierras.sh <<'BASH'
#!/usr/bin/env bash
set -euo pipefail

cd /c/Users/frank/Arcanea

PROMPT="$(cat <<EOF
You are auditing the Las Tierras de Luz manuscript for cross-document
consistency. You have been given the full text of:
- 12 chapters of the novel (book/las-tierras-de-luz/chapters/*.md)
- The book's BIBLE (book/las-tierras-de-luz/BIBLE.md)
- The author's note, glossary, and book manifest
- Arcanea canonical lore (.arcanea/lore/CANON_LOCKED.md)
- The Realms tier canon (.arcanea/lore/realms/*.md)
- The book's rewrite/structure plan
  (planning-with-files/LAS_TIERRAS_REWRITE_PLAN_2026-04-25.md)

Audit for:

1. CHARACTER CONSISTENCY across chapters
   - Name spellings identical every time (Bela, Marisol, Don Emilio, etc.)
   - Physical descriptions consistent (Marisol's age, Bela's appearance)
   - Relationships consistent (who knew whom, when, how)
   - Voice register stable (does Bela sound like Bela in every appearance)

2. WORLD CONSISTENCY
   - Veldarín terms spelled identically (destellos, chispas, oscuro,
     piedra viva, sombraluz, etc.)
   - Geography consistent (the Shoulders are limestone every time;
     Río Claro flows in the same direction; the blue door faces the
     same way)
   - Flora/fauna usage matches the BIBLE entries
   - Time-of-day language (la hora de Nero / Lumina / los destellos)
     used in canonically appropriate contexts

3. SPIRITUAL ARC CONSISTENCY
   - The five beats land where the rewrite plan says they land
     (Distinction Ch 1, Loneliness Ch 2-6, Wrong Move Ch 7-9, First
     Contact Ch 10-11, Sufficiency Ch 12)
   - The 47 — wait, that's the wrong book. For Las Tierras:
   - The three notes (Aurevalde → Bela → Don Emilio → Mira) genealogy
     is consistent; no chapter contradicts the path
   - Mira's voice register stays age-true (11-year-old, not slipping
     into 35-year-old narrator-introspection)
   - Remedios's three pause-with-the-implement moments are present
     and spaced as the BIBLE specifies

4. CANON ALIGNMENT
   - No prose-leak of author-only terms (Arcane, Anima, Lumina, Nero,
     Yggdrasil, Ten Gates, Luminor, Malachar, World Song, 432 Hz,
     528 Hz are AUTHOR-ONLY and must NOT appear in chapter prose,
     except for the specific named exception in the Ch 3 dream)
   - Oscuro is never conflated with Shadow / Malacharian / evil
   - Realm references (Veldoria, Aurevalde, Mar Arcano) match the new
     Realms tier canon (.arcanea/lore/realms/*.md)
   - Settlement Era language consistent — Veldoria is Second Settling

5. DIALOGUE CONVENTION
   - Spanish raya (—) used for ALL dialogue throughout
   - No quotation marks anywhere
   - No bracketed translations
   - No inline English glosses (the locked exception cleanups: Ch 2's
     notebook + Ch 3's "como maíz tostado" — should be cleaned per
     the rewrite plan; verify whether they were)

6. SENSITIVITY PROTOCOL
   - The book's Venezuelan-target-reader engineering: are there places
     where the prose would land wrong to the target reader (28-year-
     old Venezuelan woman in Spain with deep spiritual life)?
   - Cultural texture: is the kitchen labor / food / family rhythm
     pan-Hispanic Romance-family (current intent) or has it slipped
     toward Caribbean specificity that would require deeper
     authentication?
   - Naming any concrete recommendation for the Venezuelan beta reader
     pass.

OUTPUT FORMAT:
- One section per audit area (1-6 above)
- Each finding: chapter + line/passage reference + nature of issue +
  suggested fix
- Severity: BLOCKER (must fix before publication) / ELEVATION
  (recommended improvement) / NOTE (worth knowing)
- Closing summary: total counts by severity, top three priority fixes

BE SPECIFIC. Quote actual passages. Reference actual chapter files.
Do not summarize the book; audit it.

Begin.

---

[GEMINI: All source files follow. Read fully before responding.]

EOF
)"

# Append all source files to the prompt
for f in book/las-tierras-de-luz/chapters/*.md \
         book/las-tierras-de-luz/BIBLE.md \
         book/las-tierras-de-luz/AUTHORS_NOTE.md \
         book/las-tierras-de-luz/GLOSSARY.md \
         book/las-tierras-de-luz/book.yaml \
         .arcanea/lore/CANON_LOCKED.md \
         .arcanea/lore/realms/INDEX.md \
         .arcanea/lore/realms/veldoria.md \
         .arcanea/lore/realms/aurevalde.md \
         .arcanea/lore/realms/mar-arcano.md \
         planning-with-files/LAS_TIERRAS_REWRITE_PLAN_2026-04-25.md; do
  PROMPT+=$'\n\n=========================\n\n'
  PROMPT+="### FILE: $f"
  PROMPT+=$'\n\n'
  PROMPT+="$(cat "$f")"
done

# Dispatch via arco
arco run \
  --task research.deep \
  --surface gemini-arcanea \
  "$PROMPT" \
  > planning-with-files/CANON_CHECK_LAS_TIERRAS_$(date +%Y-%m-%d).md
BASH

chmod +x /tmp/canon-check-las-tierras.sh
```

### Step 3: Run

```bash
bash /tmp/canon-check-las-tierras.sh
```

### Step 4: Review the output

The output lands at `planning-with-files/CANON_CHECK_LAS_TIERRAS_<date>.md`. Review by severity (BLOCKER first), apply fixes through Claude Code agent dispatches per the model-routing discipline:

- **BLOCKER fixes** → Sonnet 4.6 (single-chapter surgical edit; review-class)
- **ELEVATION recommendations** → Logan/FrankX manual judgment (these are not mechanical)
- **NOTES** → record in next handover; do not auto-action

### Step 5: Verify on production

After applying fixes:

```bash
git add book/las-tierras-de-luz/chapters/<changed-files>
git commit -m "..."
git push origin main
# Wait for Vercel deploy
curl -I https://arcanea.ai/books/las-tierras-de-luz/01-el-dia-que-chispa-desperto
# Confirm 200; spot-check the affected chapter URL renders the new prose.
```

---

## Why this matters

The 5-agent council pass on Ch 1-3 (and again on Ch 4-12) was excellent for **register and elevation** — each agent caught what register-level prose work needs to catch. But it cannot catch **cross-chapter inconsistency** because no agent in those passes saw more than one chapter at a time.

The most common Gemini-finds-it-Claude-misses-it failure modes for a literary novel:

- A character described as "small" in Ch 3 and "tall" in Ch 9
- A Veldarín term spelled "destello" in Ch 1 and "destellos" (singular meant) in Ch 8
- A relationship beat introduced in Ch 4 that resolves in Ch 11 but the resolution doesn't quite match the introduction's emotional shape
- A fauna creature behaving slightly differently in two chapters (a perro veldoriano "alerts" in one, "becomes still" in another — those are gato plateado behavior)
- A locked dialogue convention (raya) violated by one stray quotation mark
- A canon term (oscuro) used in slightly different ways across chapters

These are the bugs Gemini's full-context window catches in one shot.

---

## When to run this

**Before** any next major editorial pass on Las Tierras de Luz (e.g., before sending to the Venezuelan beta readers per the sensitivity protocol).

**After** the Realms tier canon (.arcanea/lore/realms/*.md) is locked — so the canon-check has the canonical Realm references to compare manuscript against. (The Realms tier was authored 2026-04-26 in `91b679e1` and extended in `0c8b1ead`. It's ready.)

**Not yet** if Frank wants to wait until Logan and FrankX promote the Realms tier from STAGING to LOCKED, since a STAGING canon-check finding could be invalidated by a LOCKING decision. (Mild concern; the canon-check produces useful findings either way.)

---

## Pattern for other books

This same pattern applies to **every** book in the library when its manuscript reaches a chapter-complete state:

| Book | When ready for Gemini canon-check |
|---|---|
| **Las Tierras de Luz** | NOW (manuscript complete, BIBLE locked, Realms tier shipped) |
| **The Forge of Ruin** | After Logan locks the Realm name + canon questions in BIBLE.md |
| **Tides of Silence** | When chapters reach completion |
| **Heart of Pyrathis** | When chapters reach completion |
| **Song of Van Linh** | When chapters reach completion + sensitivity protocol identified |

Each book uses the same canon-check command pattern — just swap the file paths and book-specific BIBLE.

---

## Provenance

- **Authored 2026-04-26 by Shinkami** under Frank's autonomous-execution mandate, in response to Priority 5 of the Las Tierras council-elevation handover.
- **Tested:** `arco doctor` confirms Gemini installed but auth not configured. `arco run --task world.canon --surface gemini-arcanea --dry-run` returns "No model resolved" — routing config gap.
- **Blockers documented above.** When Frank sets GOOGLE_API_KEY and either extends the router spec or uses `research.deep` instead of `world.canon`, this canon-check is one-shell-script-away.
- **Estimated runtime:** 5-10 minutes for the Gemini call (large context); 10-30 minutes for review and fix-application by Frank.
