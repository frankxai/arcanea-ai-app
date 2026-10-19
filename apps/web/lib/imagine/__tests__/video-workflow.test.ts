import test from "node:test";
import assert from "node:assert/strict";
import {
  admitStep,
  debitStep,
  storeStep,
  linkStep,
  notifyStep,
  refundStep,
  type VideoWorkflowInputs,
} from "../video-workflow";

test("video-workflow admitStep validates inputs", async () => {
  const invalid: VideoWorkflowInputs = {
    jobId: "",
    userId: "",
    prompt: "",
    requestKey: "k1",
  };
  const res = await admitStep(invalid);
  assert.equal(res.status, "failed");
  assert.equal(res.error, "Invalid workflow inputs");
});

test("video-workflow admitStep refuses image-to-video without imageUrl", async () => {
  const inputs: VideoWorkflowInputs = {
    jobId: "j1",
    userId: "u1",
    prompt: "Animate scene",
    operation: "image-to-video",
    requestKey: "k1",
  };
  const res = await admitStep(inputs);
  assert.equal(res.status, "failed");
  assert.equal(res.error, "Image URL required for image-to-video");
});

test("video-workflow admitStep validates duration bounds and HTTPS imageUrl", async () => {
  const badDuration: VideoWorkflowInputs = {
    jobId: "j1",
    userId: "u1",
    prompt: "Animate scene",
    duration: 45,
    requestKey: "k1",
  };
  const durRes = await admitStep(badDuration);
  assert.equal(durRes.status, "failed");
  assert.match(durRes.error || "", /Duration must be between 3 and 30 seconds/);

  const insecureImage: VideoWorkflowInputs = {
    jobId: "j1",
    userId: "u1",
    prompt: "Animate scene",
    operation: "image-to-video",
    imageUrl: "http://insecure.example.com/frame.png",
    requestKey: "k1",
  };
  const imgRes = await admitStep(insecureImage);
  assert.equal(imgRes.status, "failed");
  assert.match(imgRes.error || "", /Valid HTTPS image URL required/);
});

test("video-workflow notifyStep returns formatted status payload", async () => {
  const inputs: VideoWorkflowInputs = {
    jobId: "j1",
    userId: "u1",
    prompt: "Cinematic dragon",
    requestKey: "k1",
  };
  const res = await notifyStep(inputs, "completed", { videoUrl: "https://cdn.example.com/video.mp4" });
  assert.equal(res.status, "success");
  assert.equal(res.data?.jobStatus, "completed");
  assert.equal(res.data?.videoUrl, "https://cdn.example.com/video.mp4");
});

test("video-workflow debitStep, storeStep, linkStep, and refundStep return expected structures", async () => {
  const inputs: VideoWorkflowInputs = {
    jobId: "job_test_123",
    userId: "user_test_456",
    prompt: "Mythic temple in slow motion",
    operation: "text-to-video",
    duration: 5,
    requestKey: "req_test_789",
  };

  const debitRes = await debitStep(inputs, 75);
  assert.equal(debitRes.status, "success");
  assert.equal(debitRes.data?.debitId, "debit_job_test_123_req_test_789");

  const storeRes = await storeStep(inputs, "https://example.com/video.mp4");
  assert.equal(storeRes.status, "success");
  assert.equal(storeRes.data?.storedUrl, "https://example.com/video.mp4");

  const linkRes = await linkStep(inputs, "https://example.com/video.mp4", "google/veo-3.1-generate-001");
  assert.equal(linkRes.status, "success");
  assert.equal(linkRes.data?.assetId, "asset_job_test_123");

  const refundRes = await refundStep(inputs, "debit_123", 75, "Provider error");
  assert.equal(refundRes.status, "success");
  assert.equal(refundRes.data?.refunded, true);
});
