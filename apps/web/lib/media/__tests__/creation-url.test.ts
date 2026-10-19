import assert from "node:assert/strict";
import { test } from "node:test";
import {
  creationDocumentUrl,
  creationMediaUrl,
  creationTypeForMime,
  isDefiniteInsertRejection,
  ownedCreationStoragePath,
  ownedCreationStoragePaths,
  previewableCreationUrl,
  safeCreationUrl,
} from "../creation-url";
import {
  maskUnsignedPrivateStageMedia,
  resolveSignedCreationPaths,
} from "../sign-creation-media";
import { mapCreation } from "../creation-library-data";

test("reads the JSON string URL written by the authenticated upload route", () => {
  const uploadedUrl =
    "https://example.supabase.co/storage/v1/object/public/creations/film.mp4";
  assert.equal(creationMediaUrl(uploadedUrl, "video"), uploadedUrl);
});

test("reads the image URL written by the studio save route", () => {
  const imageUrl =
    "https://example.supabase.co/storage/v1/object/public/creations/image.png";
  assert.equal(
    creationMediaUrl({ mode: "image", imageUrl }, "image"),
    imageUrl,
  );
});

test("uses the media-specific URL when a creation has several assets", () => {
  assert.equal(
    creationMediaUrl(
      { imageUrl: "cover.png", audioUrl: "track.mp3", url: "other.mp3" },
      "audio",
    ),
    "track.mp3",
  );
  assert.equal(
    creationMediaUrl({ imageUrl: "still.png", videoUrl: "film.mp4" }, "video"),
    "film.mp4",
  );
});

test("does not infer a preview from missing or non-media content", () => {
  assert.equal(creationMediaUrl(null, "image"), null);
  assert.equal(creationMediaUrl({ prompt: "a city at dawn" }, "image"), null);
});

test("classifies uploaded audio as audio for the media library", () => {
  assert.equal(creationTypeForMime("audio/mpeg"), "audio");
  assert.equal(creationTypeForMime("audio/wav"), "audio");
  assert.equal(creationTypeForMime("video/mp4"), "video");
  assert.equal(creationTypeForMime("image/png"), "image");
});

test("only cleans uploaded files after a definite database rejection", () => {
  assert.equal(isDefiniteInsertRejection("23514"), true);
  assert.equal(isDefiniteInsertRejection("23502"), true);
  assert.equal(isDefiniteInsertRejection("PGRST204"), true);
  assert.equal(isDefiniteInsertRejection("PGRST301"), true);
  assert.equal(isDefiniteInsertRejection("42501"), true);
  assert.equal(isDefiniteInsertRejection("42P01"), true);
  assert.equal(isDefiniteInsertRejection("PGRST116"), false);
  assert.equal(isDefiniteInsertRejection(undefined), false);
});

test("only treats HTTPS or local paths as openable media URLs", () => {
  assert.equal(safeCreationUrl("javascript:alert(1)"), null);
  assert.equal(safeCreationUrl("//evil.example/film.mp4"), null);
  assert.equal(safeCreationUrl("/\t/evil.example/film.mp4"), null);
  assert.equal(safeCreationUrl("/\\evil.example/film.mp4"), null);
  assert.equal(safeCreationUrl("https://arcanea.ai/film\n.mp4"), null);
  assert.equal(safeCreationUrl("/media/film.mp4"), "/media/film.mp4");
  assert.equal(
    previewableCreationUrl("/\t/evil.example/film.mp4", "https://arcanea.ai"),
    null,
  );
});

test("permits HTTP media only from the configured loopback Supabase origin", () => {
  const previous = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const previousServer = process.env.SUPABASE_URL;
  const local =
    "http://localhost:54321/storage/v1/object/public/creations/a.png";
  try {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.SUPABASE_URL;
    assert.equal(safeCreationUrl(local), null);
    process.env.NEXT_PUBLIC_SUPABASE_URL = "http://localhost:54321";
    assert.equal(safeCreationUrl(local), local);
    assert.equal(previewableCreationUrl(local, "http://localhost:3000"), local);
    assert.equal(safeCreationUrl("http://localhost:54322/a.png"), null);
    assert.equal(safeCreationUrl("http://example.com/a.png"), null);
  } finally {
    if (previous === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    else process.env.NEXT_PUBLIC_SUPABASE_URL = previous;
    if (previousServer === undefined) delete process.env.SUPABASE_URL;
    else process.env.SUPABASE_URL = previousServer;
  }
});

test("opens document uploads with scalar or metadata-wrapped file URLs", () => {
  const fileUrl =
    "https://example.supabase.co/storage/v1/object/public/creations/file.pdf";
  assert.equal(creationDocumentUrl(fileUrl), fileUrl);
  assert.equal(
    creationDocumentUrl({ fileUrl, transcript: "A recorded note" }),
    fileUrl,
  );
  assert.equal(creationDocumentUrl({ text: "A written note" }), null);
  assert.equal(creationDocumentUrl({ fileUrl: "javascript:alert(1)" }), null);
});

test("preview hosts match the upload caption policy", () => {
  const origin = "https://arcanea.ai";
  assert.equal(
    previewableCreationUrl("https://arcanea.ai/captions/film.vtt", origin),
    "/captions/film.vtt",
  );
  assert.equal(
    previewableCreationUrl("https://project.supabase.co/film.vtt", origin),
    "https://project.supabase.co/film.vtt",
  );
  assert.equal(
    previewableCreationUrl("https://unknown.example/film.vtt", origin),
    null,
  );
});

test("selects only owned objects from the configured creations bucket", () => {
  const project = "https://project.supabase.co";
  const owner = "123e4567-e89b-12d3-a456-426614174000";
  const own = `${project}/storage/v1/object/public/creations/${owner}/film.mp4`;
  const other = `${project}/storage/v1/object/public/creations/other-user/film.mp4`;
  assert.deepEqual(
    ownedCreationStoragePaths(
      { videoUrl: own, imageUrl: other, url: "https://elsewhere.example/a" },
      own,
      owner,
      project,
    ),
    [`${owner}/film.mp4`],
  );
  assert.deepEqual(
    ownedCreationStoragePaths(
      `${project}/storage/v1/object/public/creations/${owner}/../other/file.png`,
      null,
      owner,
      project,
    ),
    [],
  );
  assert.equal(
    ownedCreationStoragePath(own, owner, project),
    `${owner}/film.mp4`,
  );
  assert.equal(ownedCreationStoragePath(other, owner, project), null);
  assert.equal(
    ownedCreationStoragePath(
      `${project}/storage/v1/object/public/creations/${owner}/%2E%2E/other.mp4`,
      owner,
      project,
    ),
    null,
  );
});

test("keeps public previews when signing private media is unavailable", () => {
  const project = "https://project.supabase.co";
  const owner = "123e4567-e89b-12d3-a456-426614174000";
  const privateUrl = `${project}/storage/v1/object/public/creations/${owner}/film.mp4`;
  const publicUrl = `${project}/storage/v1/object/public/arcanea-gallery/still.png`;
  const creations = [
    {
      id: "private",
      title: "Private film",
      type: "video",
      status: "complete",
      fileUrl: privateUrl,
      thumbnailUrl: publicUrl,
    },
    {
      id: "public",
      title: "Public film",
      type: "video",
      status: "complete",
      fileUrl: publicUrl,
      thumbnailUrl: null,
    },
  ];
  const visible = maskUnsignedPrivateStageMedia(creations, owner, project);
  assert.equal(visible[0].fileUrl, null);
  assert.equal(visible[0].thumbnailUrl, publicUrl);
  assert.equal(visible[1].fileUrl, publicUrl);
});

test("keeps owner recovery links available when private previews are masked", () => {
  const project = "https://project.supabase.co";
  const owner = "123e4567-e89b-12d3-a456-426614174000";
  const path = `${project}/storage/v1/object/public/creations/${owner}`;
  const creation = mapCreation({
    id: "film",
    title: "Film",
    type: "video",
    status: "published",
    content: {
      fileUrl: `${path}/film.mp4`,
      captionsUrl: `${path}/film.vtt`,
      transcriptUrl: `${path}/transcript.txt`,
    },
    thumbnail_url: null,
    created_at: "2026-09-27T00:00:00Z",
    ai_model: null,
    ai_prompt: null,
  });
  const [masked] = maskUnsignedPrivateStageMedia([creation], owner, project);
  assert.equal(masked.fileUrl, null);
  assert.equal(masked.captionsUrl, null);
  assert.equal(masked.transcriptUrl, null);
  assert.equal(masked.originalAvailable, true);
  assert.equal(masked.captionsAvailable, true);
  assert.equal(masked.transcriptFileAvailable, true);
});

test("preserves successful private signatures and reports missing batch entries", () => {
  const paths = ["owner/image.png", "owner/film.mp4"];
  const result = resolveSignedCreationPaths(
    paths,
    [
      {
        path: "owner/image.png",
        signedUrl: "/storage/v1/object/sign/creations/owner/image.png?token=a",
      },
    ],
    "https://project.supabase.co",
  );
  assert.equal(
    result.signed.get(paths[0]),
    "https://project.supabase.co/storage/v1/object/sign/creations/owner/image.png?token=a",
  );
  assert.equal(result.signed.get(paths[1]), null);
  assert.equal(result.partialFailure, true);
});

test("matches signed URLs by storage path even when a batch is reordered", () => {
  const paths = ["owner/image.png", "owner/film.mp4"];
  const result = resolveSignedCreationPaths(
    paths,
    [
      { path: paths[1], signedUrl: "/film?token=film" },
      { path: paths[0], signedUrl: "/image?token=image" },
    ],
    "https://project.supabase.co",
  );
  assert.equal(
    result.signed.get(paths[0]),
    "https://project.supabase.co/image?token=image",
  );
  assert.equal(
    result.signed.get(paths[1]),
    "https://project.supabase.co/film?token=film",
  );
  assert.equal(result.partialFailure, false);
});
