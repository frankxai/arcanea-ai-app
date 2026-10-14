# Preserved book-review evidence

The original source verifier rejects a retained book review because it also has
chapter notes, an event ledger and an ending assessment. The separate book CLI
accepts that explicit format while reusing the unchanged source verifier. It
preserves the entire valid raw review, including every finding, age claim and
editorial annotation. It never rewrites a quotation, drops a failing finding or
turns an annotation into approved canon.

```sh
python scripts/narrative-evals/verify-book-review.py --manifest /private/manifest.json --review /private/raw-book-review.json --source-root /private/snapshot --output /private/new-book-evidence.json
```

Use the existing `arcanea.narrative-source-evidence.v1` source manifest and binding
described in [the citation rubric](rubric.md). The rich review retains all normal
review fields. It additionally requires these three sections:

- `chapterNotes`: 1–100 objects with exactly `path`, `choice`, `consequence` and
  `unresolved`. The path must belong to the frozen manifest. The other values are
  strings and remain editorial annotations.
- `eventLedger`: 0–100 objects with exactly `event`, `chapter` and `relativeTime`.
  Chapter is a positive integer up to 10,000; booleans are rejected. The event and
  relative time are strings. Their chronology is not verified.
- `endingAssessment`: an object with exactly `paidOff`, `unresolved` and
  `recommendation`, all strings. This assessment is not a quality score or approval.

Annotation strings are limited to 16,384 characters each. Unknown fields and
malformed sections are rejected. To avoid implying additional citation coverage,
chapter-note and event entries cannot carry unrecognized quotation fields. Put
literal evidence in findings or age-ledger claims, where it receives the existing
source-hash, line, uniqueness, priority and declared-authority checks.

The tool explicitly excludes the three named annotation sections from its
internal citation projection. It retains the complete original valid JSON bytes
as `rawReviewUTF8` in the private report, bound to `rawReviewFileSha256`.
Re-encoding that string as UTF-8 reconstructs the original bytes, including JSON
formatting and line endings. The original input remains unchanged. Unknown fields
are never silently stripped. Malformed JSON is refused before preservation in the
report; its input file still remains unchanged.

The report uses `arcanea.book-review-evidence.v1`. `verified-citations` and exit 0
mean the finding and age-ledger citations pass the existing contract. A bad quote
or line returns `rejected-citations` and exit 2; malformed input returns
`rejected-input` and exit 2. A foreign output or an output inside the source
snapshot returns exit 3 without overwriting it. Stdout contains summary fields
only. The report contains private review text and must stay within its authorized
location. Source/review size and citation limits remain those of the source verifier.

Every result keeps `bookAnnotationsVerified`, `semanticClaimsVerified`,
`sourceAuthorityVerified`, `independentReviewVerified`, `promotionAllowed` and
`releaseApproved` false, with human disposition required. A literal citation can
pass even when the interpretation is wrong. This tool makes no model request,
reads no API credential and is not a tenant sandbox.

```sh
python -O scripts/tests/book-review-evidence.test.py
```

The tests execute the real CLI with synthetic reviews, including exact UTF-8/CRLF
preservation, retained findings and age claims, binding/source failures, boolean
lines/chapters, unknown or oversized fields, duplicate/nonfinite JSON, inert
annotation instructions and output recovery. The Linux/Windows workflow also runs
the existing citation-contract regression suite. These are integrity tests, not
creative gold, a measured model ranking or human manuscript acceptance.
