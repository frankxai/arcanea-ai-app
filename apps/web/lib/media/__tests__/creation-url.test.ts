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
