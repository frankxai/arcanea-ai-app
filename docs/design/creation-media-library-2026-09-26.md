# Creation media library

## Scene brief

The live `/creations` page should open with the work itself. A large preview shows a real saved image, film, or audio piece. A compact rail holds recent media, and a quieter list holds the rest of the creator's work. The page is spacious, rounded, image led, and provisional within Arcanea's living codex territory.

| Before                                             | After                                                           | Why                                                           |
| -------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------- |
| Even grid of cards and social counters             | One selected work with a compact media rail                     | The work gains visual priority.                               |
| Mock IP registration                               | No simulated provenance action                                  | The interface stops implying a registration happened.         |
| Signed-out public results labeled as personal work | Clear sign-in path                                              | Ownership stays truthful.                                     |
| Hover-only deletion                                | No deletion control in the library                              | Shared storage objects need a reference-safe deletion design. |
| Only the first 60 records available                | Database-filtered cursor pages with a load-more control         | Older work remains reachable as the collection changes.       |
| Blanket synthetic-content notice                   | Visible notice and AI-origin labels where source is recorded    | Uploads are not mislabeled as generated work.                 |
| Rows without an open action                        | Writing and code on demand; owner-checked links for older media | Saved content can be revisited beyond the stage.              |

## References and decisions

The implementation uses the existing design tokens and Phosphor icons, native media controls, and Next.js Image with explicit responsive sizes. It does not add a template dependency, stock image, generated visual, or decorative animation. Image previews and thumbnails load through the optimizer; audio and video load on demand and never autoplay.

## Data and interaction contract

- The authenticated owner gets two bounded initial queries: up to 18 recent image, video, music, or audio creations for the stage, and 24 creations plus one lookahead row for the list. The list projects metadata and short JSON fields without transferring complete content; writing and code fetch full content only when opened. The selected type is filtered by the database. Later pages use a `(created_at, id)` cursor so inserts before it do not shift the next page. The queries use only columns present in the connected production `creations` table.
- Media rows resolve originals through an authenticated, owner-checked route, including records older than the stage window. Posters are used as originals only for images. Filter controls stay mounted while results load, and a media-query failure does not hide the creation list.
- The page marks AI-generated work when `ai_model` or `ai_prompt` is recorded, or when the known chat-save or studio-image payload identifies an AI source. A visible note explains that uploaded work may have another origin. The existing rows lack a universal provenance field, so this label reflects recorded evidence rather than claiming to classify every historic row.
- Media URLs come from `content`, which may be a JSON string from uploads or an object with `imageUrl`, `videoUrl`, `audioUrl`, `fileUrl`, or `url`. `thumbnail_url` supplies still art when present; image uploads use the original URL as a rail thumbnail fallback.
- The `creations` storage bucket is private in production. Owner-scoped storage paths in the stage are exchanged for 30-minute signed URLs under the user's session. The older-row media route signs on demand and redirects without caching. Signed private images bypass Next Image's shared optimization cache. Supported external previews are root-relative, absolute same-origin, or stored on the existing Supabase, Vercel Blob, Arcanea, and Starlight media hosts. Other safe HTTPS originals remain linkable. Failed loads show an unavailable state and original link.
- Audio is labeled as audio, distinct from music. The shared Music & audio filter includes both types because the current production type constraint admits `audio` but not `music`; uploaded tracks can still be found without calling speech recordings music. The upload route classifies `audio/*` as `audio`; read-only production schema inspection confirmed this type and the supported audio MIME types. A bounded aggregate query found no existing scalar audio uploads misclassified as text by common audio extensions.
- Selection buttons expose `aria-pressed`, the rail has a group label, controls meet a 44 px target, focus is visible, and narrow screens use a horizontal rail. There is no movement transition, so reduced-motion users receive the same calm behavior.
- Video supports an optional captions track with anonymous CORS mode and a direct caption-file link. Upload validation uses the same preview-host policy as playback. Video/audio can expose an optional transcript supplied with upload metadata or already stored in creation content. Historic media with no supplied alternative still needs a transcript; the interface cannot invent one.
- Deletion is withheld from this library until object references can be counted or otherwise owned canonically. The existing API route is unchanged; the proposed cleanup would have deleted files referenced by other creations.
- Uploads return an unavailable response when storage is unconfigured instead of fabricating a successful creation. After a successful upload the response provides a signed URL, falling back to the owner-checked media route. A failed database insert attempts to remove the just-uploaded file. Inline transcripts are capped at 4,000 characters to keep the recent-media query bounded for new uploads; longer transcripts can use a URL.

## Release boundary

Read-only inspection of the connected production Supabase project found `creations` and `chat_sessions`, but no `chat_projects`, `project_docs`, `project_graph_summaries`, or `project_memory_links` tables. The project workspace stage is therefore deferred until its separate database migration and release gate are complete. This change applies no database migration.

The versioned initial `creations` migration does not represent the connected production table: its type constraint excludes `audio` and its required `file_url` shape differs from the live `content` column. Production's checked constraint admits `audio`. Fresh database provisioning needs a separate schema reconciliation before this upload contract can be promised there; this slice targets the verified production database and cleans up blobs when inserts fail.

GitHub CI, CodeQL, provider review, and a Vercel preview must pass on the final head. Review the live desktop and 375 px mobile layouts, empty and error states, keyboard focus, media playback, and console with an owner account before calling visual QA complete. Revert the merge commit if the library or media policy regresses.
