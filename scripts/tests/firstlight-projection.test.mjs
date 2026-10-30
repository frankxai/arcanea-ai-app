import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { validateFirstlight } from "../import-firstlight-02.mjs";

const characters = JSON.parse(
  readFileSync(
    new URL(
      "../../apps/web/data/firstlight-02/characters.json",
      import.meta.url,
    ),
  ),
);
function fixture() {
  const assets = characters.characters.flatMap((character, index) =>
    ["sheet", "hero"].map((kind, view) => {
      const sha256 = (index * 2 + view).toString(16).padStart(64, "0");
      const master = (index * 2 + view + 20).toString(16).padStart(64, "0");
      return {
        id: `fl02-${character.slug}-${kind}`,
        character_id: character.id,
        kind,
        sha256,
        master_sha256: master,
        derived_from_sha256: master,
        exhibition_release: {
          state: "approved",
          reviewer: "test-fixture",
          authorization_ref: "synthetic-test-receipt",
          source_sha256: master,
        },
        availability: "registered",
        url: `https://fixture.public.blob.vercel-storage.com/firstlight/${sha256}/${kind}.png`,
        width: 1536,
        height: 1024,
        prompt:
          "Explicitly synthetic test fixture; this prompt is not an actual generated image or published asset. ".repeat(
            2,
          ),
        alt: `Synthetic test fixture for ${character.name} ${kind}.`,
      };
    }),
  );
  return {
    characters: structuredClone(characters),
    assets: { batch_id: characters.batch_id, assets },
  };
}

test("a complete public proposal can compile without promoting canon or granting permissions", () => {
  const x = fixture();
  assert.deepEqual(validateFirstlight(x.characters, x.assets), {
    characters: 10,
    assets: 20,
    categories: { companion: 6, guardian: 2, opponent: 2 },
  });
});
test("exhibition refuses missing images, private lore and silent canon acceptance", () => {
  for (const mutate of [
    (x) => x.assets.assets.pop(),
    (x) => {
      x.assets.assets[0].availability = "pending";
    },
    (x) => {
      x.characters.visibility = "private";
    },
    (x) => {
      x.characters.canon_state = "accepted";
    },
    (x) => {
      x.characters.characters[0].canon_state = "accepted";
    },
  ]) {
    const x = fixture();
    mutate(x);
    assert.throws(() => validateFirstlight(x.characters, x.assets));
  }
});
test("publication refuses hostile URLs and paths not bound to the exact image hash", () => {
  for (const url of [
    "https://evil.example/1.png",
    "https://fixture.public.blob.vercel-storage.com/temporary.png",
    "https://user:pass@fixture.public.blob.vercel-storage.com/image.png",
    "http://fixture.public.blob.vercel-storage.com/image.png",
  ]) {
    const x = fixture();
    x.assets.assets[0].url = url;
    assert.throws(() => validateFirstlight(x.characters, x.assets));
  }
});
test("asset identity, independent image counts and required story evidence survive projection", () => {
  for (const mutate of [
    (x) => {
      x.assets.assets[0].character_id = x.characters.characters[1].id;
    },
    (x) => {
      x.assets.assets[0].sha256 = x.assets.assets[1].sha256;
    },
    (x) => {
      x.assets.assets[0].prompt = "invented";
    },
    (x) => {
      x.assets.assets[0].exhibition_release.state = "pending";
    },
    (x) => {
      x.assets.assets[0].exhibition_release.source_sha256 = "f".repeat(64);
    },
    (x) => {
      x.assets.assets[0].derived_from_sha256 = "f".repeat(64);
    },
    (x) => {
      x.characters.characters[0].teamwork.acceptance_criterion = "";
    },
    (x) => {
      x.characters.authority.canonical_repository = "frankxai/other";
    },
  ]) {
    const x = fixture();
    mutate(x);
    assert.throws(() => validateFirstlight(x.characters, x.assets));
  }
});
