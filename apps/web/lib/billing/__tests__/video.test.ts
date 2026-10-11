import assert from "node:assert/strict";
import { test } from "node:test";
import {
  generateVideo as submitVideo,
  resumeVideo,
  videoProvider,
  type VideoJob,
} from "../../imagine/video";
import { OperationPendingError } from "../operations";

const image = "https://images.example.test/frame.png";
const reference = "user-a:request-a";
const wait = async () => {};
const generateVideo = (
  image: string,
  prompt: string,
  reference: string,
  env: Record<string, string | undefined>,
  transport: typeof fetch,
  wait: (ms: number) => Promise<void>,
) =>
  submitVideo(image, prompt, reference, async () => {}, env, transport, wait);
test("recovered video polls its stored request only, even when another provider is configured", async () => {
  const job: VideoJob = {
    provider: "grok-video",
    requestId: "job-1",
    statusUrl: "https://evil.test/ignored",
    resultUrl: null,
  };
  let polls = 0;
  const result = await resumeVideo(
    job,
    reference,
    { XAI_API_KEY: "dummy", FAL_KEY: "dummy" },
    async (url, options) => {
      assert.equal(options?.method, "GET");
      assert.equal(url, "https://api.x.ai/v1/videos/job-1");
      polls++;
      return Response.json({
        status: "done",
        video: { url: "https://vidgen.x.ai/result.mp4" },
      });
    },
    wait,
  );
  assert.equal(result.provider, "grok-video");
  assert.equal(polls, 1);
});
test("checkpoint acknowledgement loss leaves a pending job without polling or another POST", async () => {
  let posts = 0;
  await assert.rejects(
    submitVideo(
      image,
      "private prompt",
      reference,
      async (job) => {
        assert.equal(job.requestId, "job-1");
        assert.equal(JSON.stringify(job).includes("dummy"), false);
        assert.equal(JSON.stringify(job).includes("private prompt"), false);
        throw Error("Database acknowledgement lost");
      },
      { XAI_API_KEY: "dummy" },
      async (_url, options) => {
        assert.equal(options?.method, "POST");
        posts++;
        return Response.json({ request_id: "job-1" });
      },
      wait,
    ),
    OperationPendingError,
  );
  assert.equal(posts, 1);
});
test("video selection happens once; provider absence makes no network request", async () => {
  assert.equal(
    videoProvider({ XAI_API_KEY: "dummy", FAL_KEY: "dummy" }),
    "grok-video",
  );
  let calls = 0;
  await assert.rejects(
    generateVideo(
      image,
      "",
      reference,
      {},
      async () => {
        calls++;
        return Response.json({});
      },
      wait,
    ),
  );
  assert.equal(calls, 0);
});
test("one accepted Grok submission polls to a real video without another paid POST", async () => {
  const requests: string[] = [];
  const transport: typeof fetch = async (url, options) => {
    requests.push(`${options?.method} ${url}`);
    assert.equal(options?.redirect, "error");
    if (options?.method === "POST") {
      const body = JSON.parse(String(options.body));
      assert.equal(body.duration, 5);
      assert.equal(body.image_url, image);
      return Response.json({ request_id: "job-1" });
    }
    return Response.json({
      status: "done",
      video: { url: "https://vidgen.x.ai/result.mp4" },
    });
  };
  assert.deepEqual(
    await generateVideo(
      image,
      "",
      reference,
      { XAI_API_KEY: "dummy", FAL_KEY: "dummy" },
      transport,
      wait,
    ),
    { videoUrl: "https://vidgen.x.ai/result.mp4", provider: "grok-video" },
  );
  assert.equal(requests.filter((r) => r.startsWith("POST")).length, 1);
  assert.ok(
    requests.every(
      (r) => new URL(r.slice(r.indexOf(" ") + 1)).origin === "https://api.x.ai",
    ),
  );
});
test("lost, ambiguous and malformed submission responses cannot launch a fallback", async () => {
  for (const kind of ["lost", "server-error", "malformed", "redirect"]) {
    let calls = 0;
    const transport: typeof fetch = async () => {
      calls++;
      if (kind === "lost")
        throw Error("Provider transport lost after acceptance");
      if (kind === "server-error") return Response.json({}, { status: 502 });
      if (kind === "redirect") return new Response(null, { status: 307 });
      return Response.json({ request_id: "../../private" });
    };
    await assert.rejects(
      generateVideo(
        image,
        "",
        reference,
        { XAI_API_KEY: "dummy", FAL_KEY: "dummy" },
        transport,
        wait,
      ),
      OperationPendingError,
    );
    assert.equal(calls, 1);
  }
});
test("provider-confirmed failed jobs remain definite failures; unknown/expired output stays pending", async () => {
  for (const status of ["failed", "done-invalid", "pending"]) {
    let posts = 0;
    const transport: typeof fetch = async (_url, options) => {
      if (options?.method === "POST") {
        posts++;
        return Response.json({ request_id: "job-1" });
      }
      return Response.json(
        status === "done-invalid"
          ? { status: "done", video: { url: "http://unsafe.test/out.mp4" } }
          : { status },
      );
    };
    await assert.rejects(
      generateVideo(
        image,
        "",
        reference,
        { XAI_API_KEY: "dummy" },
        transport,
        wait,
      ),
      status === "failed"
        ? (error: unknown) =>
            error instanceof Error && !(error instanceof OperationPendingError)
        : OperationPendingError,
    );
    assert.equal(posts, 1);
  }
});
test("fal queue URLs never send the server credential to an untrusted host", async () => {
  let calls = 0;
  await assert.rejects(
    generateVideo(
      image,
      "",
      reference,
      { FAL_KEY: "dummy" },
      async () => {
        calls++;
        return Response.json({
          request_id: "job-1",
          status_url:
            "https://evil.test/fal-ai/kling-video/requests/job-1/status",
          response_url:
            "https://queue.fal.run/fal-ai/kling-video/requests/job-1",
        });
      },
      wait,
    ),
    OperationPendingError,
  );
  assert.equal(calls, 1);
});
test("fal preserves its configured video capability through one bounded queue submission", async () => {
  let posts = 0;
  const transport: typeof fetch = async (url, options) => {
    if (options?.method === "POST") {
      posts++;
      return Response.json({
        request_id: "job-1",
        status_url:
          "https://queue.fal.run/fal-ai/kling-video/requests/job-1/status",
        response_url: "https://queue.fal.run/fal-ai/kling-video/requests/job-1",
      });
    }
    if (String(url).endsWith("/status"))
      return Response.json({ status: "COMPLETED" });
    return Response.json({ video: { url: "https://fal.media/video.mp4" } });
  };
  assert.equal(
    (
      await generateVideo(
        image,
        "",
        reference,
        { FAL_KEY: "dummy" },
        transport,
        wait,
      )
    ).provider,
    "fal-ai",
  );
  assert.equal(posts, 1);
});
