import assert from "node:assert/strict";
import { test } from "node:test";
import { creationMediaUrl, creationTypeForMime } from "../creation-url";

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
