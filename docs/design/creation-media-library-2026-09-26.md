# Creation media library

## Scene brief

The live `/creations` page should open with the work itself. A large preview shows a real saved image, film, or audio piece. A compact rail holds recent media, and a quieter list holds the rest of the creator's work. The page is spacious, rounded, image led, and provisional within Arcanea's living codex territory.

| Before                                             | After                                                                  | Why                                                          |
| -------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------ |
| Even grid of cards and social counters             | One selected work with a compact media rail                            | The work gains visual priority.                              |
| Mock IP registration                               | No simulated provenance action                                         | The interface stops implying a registration happened.        |
| Signed-out public results labeled as personal work | Clear sign-in path                                                     | Ownership stays truthful.                                    |
| Hover-only deletion                                | Keyboard-reachable delete control with confirmation and error feedback | The existing action remains available on touch and keyboard. |
| Only the first 60 records available                | Database-filtered cursor pages with a load-more control                | Older work remains reachable as the collection changes.      |
| Blanket synthetic-content notice                   | Visible notice and AI-origin labels where source is recorded           | Uploads are not mislabeled as generated work.                |
| Rows without an open action                        | Readable writing and code; original links for older media              | Saved content can be revisited beyond the stage.             |

## References and decisions

The implementation uses the existing design tokens and Phosphor icons, native media controls, and Next.js Image with explicit responsive sizes. It does not add a template dependency, stock image, generated visual, or decorative animation. Image previews and thumbnails load through the optimizer; audio and video load on demand and never autoplay.

## Data and interaction contract

- The authenticated owner gets two bounded initial queries: up to 18 recent image, video, music, or audio creations for the stage, and 24 creations plus one lookahead row for the list. The selected type is filtered by the database. Later pages use a `(created_at, id)` cursor so inserts and deletes before it do not shift the next page. The queries use only columns present in the connected production `creations` table.
- Every safe media file URL has an original link in its library row, including records older than the stage window. Posters are linked as originals only for images. Writing and code rows open their saved content inline. Filter controls stay mounted while results load, and a media-query failure does not hide the creation list.
- The page marks AI-generated work when `ai_model` or `ai_prompt` is recorded, or when the known chat-save or studio-image payload identifies an AI source. A visible note explains that uploaded work may have another origin. The existing rows lack a universal provenance field, so this label reflects recorded evidence rather than claiming to classify every historic row.
- Media URLs come from `content`, which may be a JSON string from uploads or an object with `imageUrl`, `videoUrl`, `audioUrl`, `fileUrl`, or `url`. `thumbnail_url` supplies still art when present; image uploads use the original URL as a rail thumbnail fallback.
- Supported previews are root-relative, absolute same-origin, or stored on the existing Supabase, Vercel Blob, Arcanea, and Starlight media hosts. Other safe HTTPS originals remain linkable. Failed loads show an unavailable state and original link.
- Audio is labeled as audio, distinct from music. The shared Music & audio filter includes both types because the current production type constraint admits `audio` but not `music`; uploaded tracks can still be found without calling speech recordings music. The upload route classifies `audio/*` as `audio`; read-only production schema inspection confirmed this type and the supported audio MIME types. A bounded aggregate query found no existing scalar audio uploads misclassified as text by common audio extensions.
- Selection buttons expose `aria-pressed`, the rail has a group label, controls meet a 44 px target, focus is visible, and narrow screens use a horizontal rail. There is no movement transition, so reduced-motion users receive the same calm behavior.
- Video supports an optional captions track with anonymous CORS mode and a direct caption-file link. Upload validation uses the same preview-host policy as playback. Video/audio can expose an optional transcript supplied with upload metadata or already stored in creation content. Historic media with no supplied alternative still needs a transcript; the interface cannot invent one.
- The library's delete action calls the authenticated server route. It deletes the owner-scoped row first, then attempts to remove files in that owner's `creations` storage folder; external URLs are left alone. If storage cleanup fails, the response and UI say so and the server logs the affected object paths for operator cleanup. The two operations are not atomic.
- Uploads return an unavailable response when storage is unconfigured instead of fabricating a successful creation.

## Release boundary

Read-only inspection of the connected production Supabase project found `creations` and `chat_sessions`, but no `chat_projects`, `project_docs`, `project_graph_summaries`, or `project_memory_links` tables. The project workspace stage is therefore deferred until its separate database migration and release gate are complete. This change applies no database migration.

GitHub CI, CodeQL, provider review, and a Vercel preview must pass on the final head. Review the live desktop and 375 px mobile layouts, empty and error states, keyboard focus, media playback, and console with an owner account before calling visual QA complete. Revert the merge commit if the library or media policy regresses.
