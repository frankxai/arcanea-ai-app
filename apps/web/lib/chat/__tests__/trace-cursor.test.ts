import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { formatNextTraceCursor, parseTraceCursor } from "../trace-cursor";

describe("trace-cursor validation and pagination", () => {
  it("accepts empty or absent cursors as initial page", () => {
    assert.deepEqual(parseTraceCursor(null), { valid: true, kind: "none" });
    assert.deepEqual(parseTraceCursor(undefined), {
      valid: true,
      kind: "none",
    });
    assert.deepEqual(parseTraceCursor(""), { valid: true, kind: "none" });
  });

  it("builds a composite PostgREST tie-breaker filter for equal-timestamp pagination", () => {
    const cursor =
      "2026-10-11T22:24:42.123456Z_550e8400-e29b-41d4-a716-446655440000";
    const parsed = parseTraceCursor(cursor);
    assert.deepEqual(parsed, {
      valid: true,
      kind: "composite",
      createdAt: "2026-10-11T22:24:42.123456Z",
      id: "550e8400-e29b-41d4-a716-446655440000",
      orFilter:
        "created_at.lt.2026-10-11T22:24:42.123456Z,and(created_at.eq.2026-10-11T22:24:42.123456Z,id.lt.550e8400-e29b-41d4-a716-446655440000)",
    });
  });

  it("supports legacy ISO timestamp-only cursors", () => {
    const parsed = parseTraceCursor("2026-10-11T22:24:42.000+00:00");
    assert.deepEqual(parsed, {
      valid: true,
      kind: "legacy",
      createdAt: "2026-10-11T22:24:42.000+00:00",
    });
  });

  it("rejects malformed cursors and PostgREST filter injection payloads", () => {
    const maliciousCursors = [
      "2026-10-11T22:24:42Z,id.neq.00000000-0000-0000-0000-000000000000",
      "2026-10-11T22:24:42Z_550e8400-e29b-41d4-a716-446655440000),id.gt.0",
      "not-a-timestamp_550e8400-e29b-41d4-a716-446655440000",
      "2026-10-11T22:24:42Z_not-a-uuid",
      "2026-10-11T22:24:42Z_",
      "_550e8400-e29b-41d4-a716-446655440000",
      "2026-13-99T25:99:99Z_550e8400-e29b-41d4-a716-446655440000",
      "2026-10-11T22:24:42Z_550e8400-e29b-41d4-a716-446655440000_extra",
    ];

    for (const bad of maliciousCursors) {
      const result = parseTraceCursor(bad);
      assert.equal(
        result.valid,
        false,
        `Expected cursor "${bad}" to be rejected`,
      );
    }
  });

  it("formats nextCursor only when a full page of rows is returned", () => {
    const rows = [
      {
        created_at: "2026-10-11T22:25:00Z",
        id: "550e8400-e29b-41d4-a716-446655440002",
      },
      {
        created_at: "2026-10-11T22:25:00Z",
        id: "550e8400-e29b-41d4-a716-446655440001",
      },
    ];
    assert.equal(
      formatNextTraceCursor(rows, 2),
      "2026-10-11T22:25:00Z_550e8400-e29b-41d4-a716-446655440001",
    );
    assert.equal(formatNextTraceCursor(rows, 3), null);
    assert.equal(formatNextTraceCursor([], 2), null);
  });
});
