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

test("video-workflow storeStep and linkStep return expected structures", async () => {
  const inputs: VideoWorkflowInputs = {
    jobId: "job_test_123",
    userId: "user_test_456",
    prompt: "Mythic temple in slow motion",
    operation: "text-to-video",
    duration: 5,
    requestKey: "req_test_789",
  };

  const storeRes = await storeStep(inputs, "https://example.com/video.mp4");
  assert.equal(storeRes.status, "success");
  assert.equal(storeRes.data?.storedUrl, "https://example.com/video.mp4");

  const refundRes = await refundStep(inputs, "debit_123", 75, "Provider error");
  assert.equal(refundRes.status, "success");
  assert.equal(refundRes.data?.refunded, true);
});
