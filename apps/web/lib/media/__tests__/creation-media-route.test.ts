import assert from "node:assert/strict";
import { test } from "node:test";
import { NextRequest } from "next/server";
import {
  GET,
  creationMediaRouteDeps,
} from "@/app/api/creations/[id]/media/route";

const owner = "123e4567-e89b-12d3-a456-426614174000";
const other = "123e4567-e89b-12d3-a456-426614174001";
const id = "123e4567-e89b-12d3-a456-426614174002";
const origin = "https://project.supabase.co";
const privateUrl = `${origin}/storage/v1/object/public/creations/${owner}/film.mp4`;

type Row = {
  type: string;
  content: unknown;
  thumbnail_url: string | null;
};

function clientStub(options: {
  userId: string | null;
  row?: Row;
  lookupError?: Error;
  signError?: Error;
}) {
  let requestedId: string | null = null;
  let requestedOwner: string | null = null;
  const query = {
    select: () => query,
    eq: (field: string, value: string) => {
      if (field === "id") requestedId = value;
      if (field === "user_id") requestedOwner = value;
      return query;
    },
    maybeSingle: async () => ({
      data:
        requestedId === id && requestedOwner === owner
          ? (options.row ?? null)
          : null,
      error: options.lookupError ?? null,
    }),
  };
  return {
    auth: {
      getUser: async () => ({
        data: { user: options.userId ? { id: options.userId } : null },
      }),
    },
    from: () => query,
    storage: {
      from: () => ({
        createSignedUrl: async (path: string) => ({
          data: options.signError
            ? null
            : {
                signedUrl: `${origin}/storage/v1/object/sign/creations/${path}?token=short-lived`,
              },
          error: options.signError ?? null,
        }),
      }),
    },
  } as never;
}

function request(field?: string) {
  const suffix = field ? `?field=${field}` : "";
  return GET(
    new NextRequest(`https://arcanea.ai/api/creations/${id}/media${suffix}`),
    { params: Promise.resolve({ id }) },
  );
}

test("creation media redirects require ownership and handle storage failures", async (t) => {
  const originalClient = creationMediaRouteDeps.createClient;
  const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  process.env.NEXT_PUBLIC_SUPABASE_URL = origin;
  t.after(() => {
    creationMediaRouteDeps.createClient = originalClient;
    if (originalUrl === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    else process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl;
  });

  await t.test("rejects malformed IDs before accessing storage", async () => {
    creationMediaRouteDeps.createClient = async () => {
      throw new Error("An invalid ID should not reach the database");
    };
    const response = await GET(
      new NextRequest("https://arcanea.ai/api/creations/not-a-uuid/media"),
      { params: Promise.resolve({ id: "not-a-uuid" }) },
    );
    assert.equal(response.status, 400);
  });

  await t.test("rejects an unsigned-in request", async () => {
    creationMediaRouteDeps.createClient = async () =>
      clientStub({ userId: null });
    assert.equal((await request()).status, 401);
  });

  await t.test("does not resolve another owner's creation", async () => {
    creationMediaRouteDeps.createClient = async () =>
      clientStub({
        userId: other,
        row: { type: "video", content: privateUrl, thumbnail_url: null },
      });
    assert.equal((await request()).status, 404);
    assert.equal((await request("captions")).status, 404);
  });

  await t.test("rejects an unknown media field", async () => {
    assert.equal((await request("unknown")).status, 400);
  });

  await t.test("reports database errors as retryable", async () => {
    creationMediaRouteDeps.createClient = async () =>
      clientStub({
        userId: owner,
        lookupError: new Error("database unavailable"),
      });
    assert.equal((await request()).status, 503);
  });

  await t.test("reports private signing errors as retryable", async () => {
    creationMediaRouteDeps.createClient = async () =>
      clientStub({
        userId: owner,
        row: { type: "video", content: privateUrl, thumbnail_url: null },
        signError: new Error("storage unavailable"),
      });
    assert.equal((await request()).status, 503);
  });

  await t.test(
    "signs an owned private object without caching the redirect",
    async () => {
      creationMediaRouteDeps.createClient = async () =>
        clientStub({
          userId: owner,
          row: { type: "video", content: privateUrl, thumbnail_url: null },
        });
      const response = await request();
      assert.equal(response.status, 307);
      assert.match(
        response.headers.get("location") ?? "",
        /\/object\/sign\/creations\//,
      );
      assert.equal(response.headers.get("cache-control"), "private, no-store");
    },
  );

  await t.test("redirects a safe external original", async () => {
    creationMediaRouteDeps.createClient = async () =>
      clientStub({
        userId: owner,
        row: {
          type: "video",
          content: "https://cdn.example.com/film.mp4",
          thumbnail_url: null,
        },
      });
    const response = await request();
    assert.equal(response.status, 307);
    assert.equal(
      response.headers.get("location"),
      "https://cdn.example.com/film.mp4",
    );
  });

  await t.test("signs an owned private captions file", async () => {
    const captionsUrl = privateUrl.replace("film.mp4", "film.vtt");
    creationMediaRouteDeps.createClient = async () =>
      clientStub({
        userId: owner,
        row: {
          type: "video",
          content: { fileUrl: privateUrl, captionsUrl },
          thumbnail_url: null,
        },
      });
    const response = await request("captions");
    assert.equal(response.status, 307);
    assert.match(response.headers.get("location") ?? "", /film\.vtt/);
    assert.match(response.headers.get("location") ?? "", /\/object\/sign\//);
  });

  await t.test("opens a safe external transcript", async () => {
    const transcriptUrl =
      "https://media.starlightintelligence.org/transcript.txt";
    creationMediaRouteDeps.createClient = async () =>
      clientStub({
        userId: owner,
        row: {
          type: "audio",
          content: { fileUrl: privateUrl, transcriptUrl },
          thumbnail_url: null,
        },
      });
    const response = await request("transcript");
    assert.equal(response.status, 307);
    assert.equal(response.headers.get("location"), transcriptUrl);
  });

  await t.test(
    "does not open missing or non-string accessibility assets",
    async () => {
      creationMediaRouteDeps.createClient = async () =>
        clientStub({
          userId: owner,
          row: {
            type: "video",
            content: { fileUrl: privateUrl, captionsUrl: 42 },
            thumbnail_url: null,
          },
        });
      assert.equal((await request("captions")).status, 404);
      assert.equal((await request("transcript")).status, 404);
    },
  );

  await t.test("opens an image from the public gallery bucket", async () => {
    const galleryUrl = `${origin}/storage/v1/object/public/arcanea-gallery/community/${owner}/art.png`;
    creationMediaRouteDeps.createClient = async () =>
      clientStub({
        userId: owner,
        row: { type: "image", content: null, thumbnail_url: galleryUrl },
      });
    const response = await request();
    assert.equal(response.status, 307);
    assert.equal(response.headers.get("location"), galleryUrl);
  });

  await t.test("refuses an unrecognized same-project storage URL", async () => {
    creationMediaRouteDeps.createClient = async () =>
      clientStub({
        userId: owner,
        row: {
          type: "image",
          content: `${origin}/storage/v1/object/public/unknown/private.png`,
          thumbnail_url: null,
        },
      });
    assert.equal((await request()).status, 503);
  });
});
