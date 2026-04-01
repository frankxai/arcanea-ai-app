import { strict as assert } from "node:assert";
import { NextRequest } from "next/server";
import { GET as getGalleryRoute } from "@/app/api/gallery/route";

let passed = 0;
let failed = 0;

async function test(name: string, fn: () => Promise<void> | void) {
  try {
    await fn();
    passed += 1;
    console.log(`PASS  ${name}`);
  } catch (error) {
    failed += 1;
    console.error(`FAIL  ${name}`);
    console.error(error);
  }
}

async function parseJson<T>(response: Response): Promise<T> {
  return response.json() as Promise<T>;
}

type GalleryPayload = {
  images: Array<{
    src: string;
    guardian: string;
    tier: "hero" | "gallery" | "community";
  }>;
  total: number;
};

async function main() {
  await test("GET /api/gallery serves canonical guardian media from local paths", async () => {
    const response = await getGalleryRoute(new NextRequest("http://localhost/api/gallery"));
    const payload = await parseJson<GalleryPayload>(response);

    assert.equal(response.status, 200);
    assert.ok(payload.total > 0);
    assert.ok(
      payload.images.some((image) => image.src === "/guardians/v3/lyssandria-hero-v3.webp"),
      "expected local guardian hero media"
    );
    assert.ok(
      payload.images.every(
        (image) =>
          !image.src.startsWith("https://hcfhyssdzphudaqatxbk.supabase.co/storage/v1/object/public/arcanea-gallery/guardians")
      ),
      "official guardian media should not depend on remote storage paths"
    );
  });

  await test("GET /api/gallery excludes the removed Lyssandria explicit artwork", async () => {
    const response = await getGalleryRoute(new NextRequest("http://localhost/api/gallery"));
    const payload = await parseJson<GalleryPayload>(response);

    assert.equal(response.status, 200);
    assert.ok(
      payload.images.every((image) => !image.src.includes("lyssandria-gallery-2")),
      "removed asset should never be returned"
    );
  });

  await test("GET /api/gallery guardian filter scopes the response", async () => {
    const response = await getGalleryRoute(new NextRequest("http://localhost/api/gallery?guardian=Leyla"));
    const payload = await parseJson<GalleryPayload>(response);

    assert.equal(response.status, 200);
    assert.ok(payload.images.length > 0);
    assert.ok(payload.images.every((image) => image.guardian === "Leyla"));
  });

  console.log(`\n${passed} gallery media contract test(s) passed`);

  if (failed > 0) {
    process.exitCode = 1;
  }
}

void main();
