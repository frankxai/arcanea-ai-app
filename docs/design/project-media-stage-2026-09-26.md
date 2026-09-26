# Project media stage

## Scene brief

The owner project page should open with the work itself. One large, quiet preview shows a real linked image, film, or music track. A compact rail holds the other recent media. The existing project graph, documents, and provenance controls remain available below the stage. This is a provisional expression of Arcanea's living codex territory, not a final brand identity.

## References and decisions

| Reference                                  | Useful pattern                          | Arcanea decision                                                                              |
| ------------------------------------------ | --------------------------------------- | --------------------------------------------------------------------------------------------- |
| Existing shadcn-style and Radix components | Predictable keyboard and focus behavior | Use native buttons, links, and media controls instead of adding a component library.          |
| Next.js Image                              | Responsive sizes and image optimization | Use `fill`, explicit `sizes`, optimized thumbnails, and eager loading for the selected image. |
| Image-led creative workspaces              | Show the work before dashboard metrics  | Place a single media canvas above the graph and remove the five-card count grid.              |

The stage uses existing design tokens and Phosphor icons. It introduces no template dependency, stock image, generated visual, decorative motion, or fabricated content.

## Data and interaction contract

- Query up to 18 recent creations of type image, video, music, or audio, filtered by the authenticated owner and project. Other creation types do not displace media in this query.
- Read media URLs from the existing `content` JSON (`imageUrl`, `videoUrl`, `audioUrl`, `fileUrl`, or `url`) and use `thumbnail_url` for still images and posters. An absent or unsupported asset displays an honest unavailable state and an original link when an HTTPS URL exists. The current generated Supabase type contract does not include a `file_url` column.
- Embed only same-origin assets or the existing Supabase, Vercel Blob, and Starlight media hosts. The page's `media-src` policy admits those hosts for native audio and video.
- The selected asset changes immediately on activation. Native players have controls, load on demand, and never autoplay. The selected image is optimized; thumbnails load lazily.
- The rail is keyboard reachable, uses `aria-pressed`, and scrolls horizontally on small screens. Links and controls have visible focus states and 44 px minimum targets.
- The two actions lead to the existing creation library and the real project attachment controls. The current `/studio/video` and `/studio/audio` routes simulate generation, so this stage does not advertise them as production tools.

## Layout and motion

At desktop width, the media canvas occupies the main column and the rail occupies a narrow side column. At 900 px and below, the rail follows the canvas as a horizontal strip. At 600 px and below, the heading, caption, and actions stack. The interface uses restrained border and background hover feedback on fine pointers only; there is no movement transition. Reduced-motion mode removes the remaining color transition.

## Verification and release

GitHub CI and Vercel preview should run the build, type, lint, and security gates. Review desktop and 375 px mobile layouts with an owner account containing linked image, video, and audio creations; also review the empty state, missing URLs, keyboard focus, native playback, and browser console. Merge to `main` only after the preview and independent review pass. Verify the resulting production deployment and route. Revert the merge commit if the stage or media policy causes a regression.
