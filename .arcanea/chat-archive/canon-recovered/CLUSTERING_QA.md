# Clustering QA — Semantic Cluster Trustworthiness Check

Method: for each theme in `CANON_DECISIONS_NEEDED.md`, took the top 5 clusters by mention count (fewer if the theme had under 5 clusters total), opened every cited source's `__ASSERTIONS.md` file under `provenance/<YYYY-MM>/`, and checked whether the file actually contains an assertion that is genuinely on-theme and close in meaning to the table's "representative claim." Also spot-checked 3 non-top-ranked clusters picked at random across themes. 48 clusters checked total (45 top + 3 random).

Verdict key: **GOOD MATCH** = cited source(s) contain matching/near-duplicate content, correctly themed. **QUESTIONABLE** = technically matches but the content itself is low-value (boilerplate, not an actual canon claim). **MIS-CLUSTER** = the representative claim does not hold up against the cited source (wrong topic, or the source doesn't actually contain it).

## Top-5-by-mentions per theme

| Theme | Representative claim (truncated) | Verdict | Reason |
|---|---|---|---|
| Gates & Frequencies | "/lore page actually looks good... Hz frequencies (which per the locked decision SHOULD be visible..." | GOOD MATCH | Source (311d10e2) has a near-paraphrase two rows later ("/lore page is actually working fine... Hz frequencies... correctly visible"). Same fact, different raw-mention wording — expected TF-IDF cluster behavior. |
| Gates & Frequencies | "arcanea-ai-app is a FULL Next.js 16 monorepo... DIFFERENT Hz mapping than canonical" | GOOD MATCH | Exact string found in 311d10e2. |
| Gates & Frequencies | "Hz canonical fix (from A-0) 2." | GOOD MATCH | Exact string found in 311d10e2. |
| Gates & Frequencies | "Canonical: 174·285·396·417·528·639·741·852·963·1111 ... Shift→Starweave" | GOOD MATCH | Exact string in 311d10e2. Second cited source (3b3f9c92) doesn't have this exact string but has the same Hz sequence ("174→285→...→1111 ... encoded as canonical in the IP register") — same fact, correctly on-theme. |
| Gates & Frequencies | "Let me look at what was locked: ... Guardian = Ten cosmic Gate-keepers..." | GOOD MATCH | Exact string found in 311d10e2. |
| Guardians | "Shinkami - The Divine Godbeast/Cosmic Force ... Guardians ≠ Godbeasts" | GOOD MATCH | Near-identical text present in both cited sources (b6cb2957, 21a0ccb2) — same underlying answer reused/re-pasted across two chats. |
| Guardians | "Once you clarify these final points... truth about the Guardian-Godbeast relationship?" | GOOD MATCH | Exact string in both cited sources. |
| Guardians | "GUARDIANS-COMPLETE.md (14KB) — canonical source of truth for Guardian-Vel'Tara naming" | GOOD MATCH | Exact string in 1ad83920. |
| Guardians | "Create rules/ directory with modular rule files: rules/arcanean-code.md..." | GOOD MATCH | 311d10e2 has a differently-worded second mention of the same rule-file set ("Modular rules — arcanean-code.md, coding-style.md, security.md, git-workflow.md, guardian-canon.md") — same fact, paraphrased. |
| Guardians | "Three things locked: The Source stays unnamed, Lumina is the divine mother above the Guardians..." | GOOD MATCH | Exact in 3809c5ff; paraphrase ("the divine source is unnamed, Lumina is the divine mother above the Guardians") in 8efc34c2. |
| Shinkami | "ARCANEA CANON v5.0 — 940 lines... Shinkami: NOT..." | GOOD MATCH | Confirmed present in 4040f51f (canon-extraction doc, resolved-conflicts section). |
| Shinkami | "Lyssandria(Root174) → Shinkami(Source1111)" | GOOD MATCH | Exact string in 8bb3522d. |
| Shinkami | "Shinkami vs Lumina - In the canonical lore, Shinkami is the divine source." | GOOD MATCH | Exact string in 26fa7c5f. |
| Shinkami | "Shinkami's veto is final, and Nero reviews anything touching student shadow material." | GOOD MATCH | Exact string in f4a6f89c. |
| Shinkami | "I've locked in Shinkami's veto power over awakening claims..." | GOOD MATCH | Exact string in f4a6f89c (same file as above, second mention). |
| Thirteen Lords | "Canon Check ✓ Chronara, Ginnunga, Seraphim, Archangels, Thirteen Lords..." | GOOD MATCH | Exact string in f033d15a. |
| Thirteen Lords | "The blessed canon elements from January 2026 ... The Thirteen Lords..." | GOOD MATCH | Exact string in b16d0c24. |
| Thirteen Lords | "The repo's Malachar entry is stuck in the old framing..." | GOOD MATCH | Present in 58e06312 (long line, confirmed via broader context read). |
| Thirteen Lords | "The most recent canonical chat from March 2026 has the full Kurusei and Malachar profiles..." | GOOD MATCH | Exact string in 96031600. |
| Thirteen Lords | "I'm laying out the full character roster... mapping the antagonist structure from Kurusei down through Malachar..." | GOOD MATCH | Exact string in 96031600 (same file, second mention). |
| Vel'Tara naming | "THE FINAL VEL'TARA LIST (Your Version)" | GOOD MATCH | Exact string in e547eb52. |
| Vel'Tara naming | "Tell me the truth directly ... Open your Arcanea project and copy/paste the Genesis story and Vel'Tara..." | GOOD MATCH | Exact string in 108cfe57. |
| Vel'Tara naming | "In Arcanea, we use 'harmony' not 'harmonics,' and 'Godbeasts' not 'Vel'Tara.'" | GOOD MATCH | Exact string in 19c9e567. |
| Vel'Tara naming | "The Vel'Tara names in Appendix B are placeholder brackets..." | GOOD MATCH | Exact string in 34c82953. |
| Vel'Tara naming | "And some have wrong Vel'Tara names (Nohrien, Zaurion, etc.)" | GOOD MATCH | Exact string in 8bb3522d. |
| Luminor / Lumina | "The Luminor Teachings (invitation only) Houses (Seven)..." | GOOD MATCH | Near-identical text (six vs. seven houses listed, minor variant) present in both cited sources (86b66bce, b2d50e2e). |
| Luminor / Lumina | "This is much more sophisticated than 'just SaaS chat.'" | GOOD MATCH | Exact string in d0abe7be. |
| Luminor / Lumina | "THE ARCANEAN COSMOLOGY (SIMPLIFIED)" | GOOD MATCH | Exact string in 004a317e. |
| Luminor / Lumina | "GitHub Repository Structure: /arcanea /core /lore /templates..." | GOOD MATCH | Exact string in 004a317e (same file, different mention). |
| Luminor / Lumina | "Once you confirm, I'll create the ULTIMATE FOUNDATION DOCUMENT..." | GOOD MATCH | Exact string in e93fdbe4. |
| Kurusei/Malachar/Enarys | "Building NIS — Nature Intelligence System, canonical name Enarys..." | GOOD MATCH | Exact string in 749dc380 (appears twice in file, matching cluster size 2/mentions 2). |
| Kurusei/Malachar/Enarys | "Led by Malachar the Merciful, a faction of Aeldar decided to take control..." | GOOD MATCH | Exact string in 86b66bce (flagged PUSHED-BACK by Frank in the source — correctly reflected in the cluster's pushed-back count). |
| Kurusei/Malachar/Enarys | "THE VOID GAZE (Nero Corruption - Dark Mirror)..." | GOOD MATCH | Confirmed present in 3d61ca57. |
| Kurusei/Malachar/Enarys | "STORY INTEGRATION: Key Plot Points... CURSE MARK EPIDEMIC..." | GOOD MATCH | Exact string in 3d61ca57 (same file). |
| Kurusei/Malachar/Enarys | "FINAL REFINEMENT: THE CHECKLIST..." | GOOD MATCH | Confirmed present in 3d61ca57 (same file, third mention checked). |
| Book / Publishing | "So: is Console v1 yours to build, or is it Logan's..." | GOOD MATCH | Exact string in 631854cb. |
| Book / Publishing | "OBSIDIAN VAULT TEMPLATES /obsidian-templates/..." | GOOD MATCH | Confirmed present in 110f515c. |
| Book / Publishing | "The final output to chat is a one-screen manifest..." | GOOD MATCH | Exact string in 92804792. |
| Book / Publishing | "Publishing all commercial entities' relationship to SIP on the canonical site." | GOOD MATCH | Exact string in 631854cb, appears twice (matches cluster size 2/mentions 2, and flagged PUSHED-BACK correctly). |
| Book / Publishing | "Since the document leans on the arcanea.ai Chronicles, I'm going with Kael as the protagonist..." | GOOD MATCH | Exact string in b16d0c24. |
| Agent/Skill/System naming | "The architecture is locked." (cluster size 4, mentions 5 — top cluster in this theme) | **MIS-CLUSTER** | The cited source (311d10e2, listed 3x) does **not** contain this phrase anywhere — confirmed via full-file grep (0 hits, case-insensitive). The phrase only exists elsewhere in the corpus, in `3809c5ff` and `ae3f8d62` (2 hits total across the whole provenance tree). This is a source-attribution/citation bug, not a topic mismatch: the table is citing the wrong file for its own top-ranked cluster in this theme. |
| Agent/Skill/System naming | "Now let me create a visual diagram to show the complete architecture and then provide you with the final summary..." | QUESTIONABLE | Text genuinely matches across all 3 cited sources (a7524acd, 32c00ab6, eb6dca22) — correctly clustered as near-duplicate strings. But the content is generic Claude assistant boilerplate ("let me create one final X"), not an actual naming/architecture decision. The source file itself contains 5 near-identical "let me create one final ___" lines back to back — this whole cluster (and likely siblings in this theme) is noise inflating cluster size, not canon. |
| Agent/Skill/System naming | "Now let me show you a final summary of everything I've created: 🎨 ARCANEA UI SCREENS - COMPLETE DELIVERY" | GOOD MATCH | Exact string in b27df00a — legitimate content this time (summarizes a real delivered UI system), correctly on-theme even if boilerplate-flavored. |
| Agent/Skill/System naming | "CLAUDE CODE AGENTS /claude-code-agents/ agent-canon-writer.md..." | GOOD MATCH | Source (110f515c) has the same agent list in a numbered format ("`agent-canon-writer.md` - Content generation agent") — same content, different formatting. |
| Agent/Skill/System naming | "The real issue is that the CC session is doing website work while operating on a naming architecture that should be canonical." | GOOD MATCH | Exact string in 311d10e2. |

## Random sanity check (non-top-ranked clusters, different themes)

| Theme | Representative claim (truncated) | Verdict | Reason |
|---|---|---|---|
| Gates & Frequencies | "10th gate: The canonical system has 9." | GOOD MATCH | Exact string in 524e5051 (visualization-meditation-with-sacred-gates-and-guardians), on-theme. |
| Guardians | "It doesn't connect deeply to Frank's established Arcanea canon - the Guardians, Godbeasts, chakras..." | GOOD MATCH | Present in f68053bc, on-theme (alien-life-classification chat critiquing its own canon fit). |
| Book / Publishing | "Text created → lore-checked against canonical Arcanea KB → cross-referenced for contradictions..." | GOOD MATCH | Present in 7c248866, on-theme (publishing pipeline description). |

## Overall verdict

Of 48 clusters checked, 46 were genuine, on-theme matches — either exact-string hits in the cited source or a legitimate paraphrase of the same fact appearing elsewhere in that same source file. That's a strong hit rate and means the clustering is safe to use as a **first-pass triage filter**: it correctly groups repeated/duplicate canon claims by topic, and the "Confirmed / Pushed back / Unclear" counts line up with what's actually in the source rows (verified in the Kurusei/Malachar and Book/Publishing pushed-back examples above). Two caveats keep it from being "trust and skip reading": first, at least one high-mention cluster (the literal #1-ranked cluster in the largest theme, Agent/Skill/System naming) cites a source file that does not contain the quoted phrase at all — a real citation/indexing bug, not just a fuzzy-match issue, meaning mention counts and "top cluster" rankings can't be taken as self-verifying without checking the file. Second, the Agent/Skill/System naming theme (by far the largest bucket at 375 claims) is measurably contaminated with Claude's own boilerplate phrasing ("let me create one final summary/diagram/guide...") that clusters tightly by vocabulary but carries no lore content — high mention count in that theme is not a signal of importance. Recommendation: use the clustering to decide *which* clusters to open first, but always open the cited `__ASSERTIONS.md` file and read the actual row before locking anything as canon — don't lock from the representative-claim text alone, and treat "Agent/Skill/System naming" cluster rankings with extra skepticism.
