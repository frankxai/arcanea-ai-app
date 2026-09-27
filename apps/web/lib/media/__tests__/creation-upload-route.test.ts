import assert from "node:assert/strict";
import { test } from "node:test";
import { NextRequest } from "next/server";
import { POST, creationUploadDeps } from "@/app/api/creations/upload/route";

const owner = "123e4567-e89b-12d3-a456-426614174000";

function uploadRequest() {
  const form = new FormData();
  form.set(
    "file",
    new File(["audio"], "recording.mp3", { type: "audio/mpeg" }),
  );
  return new NextRequest("https://arcanea.ai/api/creations/upload", {
    method: "POST",
    body: form,
  });
}

function uploadClient(
  code: string | null,
  removed: string[][],
  signError?: Error,
) {
  let uploadedPath = "";
  const bucket = {
    upload: async (path: string) => {
      uploadedPath = path;
      return { error: null };
    },
    getPublicUrl: () => ({
      data: {
        publicUrl: `https://project.supabase.co/storage/v1/object/public/creations/${uploadedPath}`,
      },
    }),
    remove: async (paths: string[]) => {
      removed.push(paths);
      return { error: null };
    },
    createSignedUrl: async () => {
      if (signError) throw signError;
      return {
        data: {
          signedUrl:
            "https://project.supabase.co/storage/v1/object/sign/creations/recording.mp3?token=test",
        },
      };
    },
  };
  const result = {
    data: code
      ? null
      : {
          id: "123e4567-e89b-12d3-a456-426614174002",
          title: "recording.mp3",
          type: "audio",
          created_at: "2026-09-27T00:00:00Z",
        },
    error: code ? { code, message: "Simulated insert failure" } : null,
  };
  return {
    auth: { getUser: async () => ({ data: { user: { id: owner } } }) },
    storage: { from: () => bucket },
    from: () => ({
      insert: () => ({ select: () => ({ single: async () => result }) }),
    }),
  } as never;
}

test("creation upload keeps media when the insert outcome is uncertain", async (t) => {
  const originalClient = creationUploadDeps.createClient;
  const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const originalKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://project.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
  t.after(() => {
    creationUploadDeps.createClient = originalClient;
    if (originalUrl === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    else process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl;
    if (originalKey === undefined)
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    else process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = originalKey;
  });

  await t.test(
    "removes the new object after a definite constraint rejection",
    async () => {
      const removed: string[][] = [];
      creationUploadDeps.createClient = async () =>
        uploadClient("23514", removed);
      const response = await POST(uploadRequest());
      assert.equal(response.status, 500);
      assert.equal(removed.length, 1);
      assert.match(removed[0][0], new RegExp(`^${owner}/.*\\.mp3$`));
    },
  );

  await t.test(
    "retains the object after an ambiguous response error",
    async () => {
      const removed: string[][] = [];
      creationUploadDeps.createClient = async () =>
        uploadClient("PGRST116", removed);
      const response = await POST(uploadRequest());
      assert.equal(response.status, 500);
      assert.equal(removed.length, 0);
    },
  );

  await t.test(
    "returns an accessible signed URL after a successful audio insert",
    async () => {
      const removed: string[][] = [];
      creationUploadDeps.createClient = async () => uploadClient(null, removed);
      const response = await POST(uploadRequest());
      const payload = (await response.json()) as {
        data: { type: string; url: string };
      };
      assert.equal(response.status, 200);
      assert.equal(payload.data.type, "audio");
      assert.match(payload.data.url, /\/object\/sign\/creations\//);
      assert.equal(removed.length, 0);
    },
  );

  await t.test(
    "reports a successful insert when post-insert signing throws",
    async () => {
      const removed: string[][] = [];
      creationUploadDeps.createClient = async () =>
        uploadClient(
          null,
          removed,
          new Error("storage temporarily unavailable"),
        );
      const response = await POST(uploadRequest());
      const payload = (await response.json()) as { data: { url: string } };
      assert.equal(response.status, 200);
      assert.equal(
        payload.data.url,
        "/api/creations/123e4567-e89b-12d3-a456-426614174002/media",
      );
      assert.equal(removed.length, 0);
    },
  );
});
