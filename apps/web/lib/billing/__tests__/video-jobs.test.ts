import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { transpileModule, ModuleKind } from "typescript";
import { test } from "node:test";
import { OperationPendingError } from "../operations";

test("checkpoint writes and reads stay inside the actor's running operation", async () => {
  let saved: unknown = null;
  const rows: Record<string, unknown>[] = [];
  const job = {
    provider: "grok-video",
    requestId: "job-1",
    statusUrl: "https://api.x.ai/v1/videos/job-1",
    resultUrl: null,
  };
  const filter = (update?: Record<string, unknown>) => {
    const predicates: Record<string, unknown> = {};
    const query = {
      eq(key: string, value: unknown) {
        predicates[key] = value;
        return query;
      },
      is(key: string, value: unknown) {
        predicates[key] = value;
        return query;
      },
      select() {
        return query;
      },
      async maybeSingle() {
        rows.push({ ...predicates });
        const match =
          predicates.user_id === "user-a" &&
          predicates.reference === "user-a:key" &&
          predicates.state === "running";
        if (!match || (update && saved !== null))
          return { data: null, error: null };
        if (update) {
          assert.equal(predicates.result, null);
          saved = update.result;
        }
        return {
          data: update ? { reference: "user-a:key" } : { result: saved },
          error: null,
        };
      },
    };
    return query;
  };
  const source = readFileSync(
    new URL("../../imagine/video-jobs.ts", import.meta.url),
    "utf8",
  );
  const exports: Record<string, (...args: unknown[]) => Promise<unknown>> = {};
  runInNewContext(
    transpileModule(source, {
      compilerOptions: { module: ModuleKind.CommonJS },
    }).outputText,
    {
      exports,
      require(id: string) {
        if (id === "../billing/operations") return { OperationPendingError };
        if (id === "../supabase/server")
          return {
            createAdminClient: () => ({
              from: () => ({ select: () => filter(), update: filter }),
            }),
          };
        throw Error(id);
      },
    },
  );
  await exports.checkpointVideoJob("user-a", "user-a:key", job);
  assert.deepEqual(await exports.readVideoJob("user-a", "user-a:key"), job);
  await assert.rejects(
    exports.checkpointVideoJob("user-b", "user-a:key", job),
    OperationPendingError,
  );
  await assert.rejects(
    exports.readVideoJob("user-b", "user-a:key"),
    OperationPendingError,
  );
  await assert.rejects(
    exports.checkpointVideoJob("user-a", "user-a:key", {
      ...job,
      requestId: "other",
    }),
    OperationPendingError,
  );
  assert.equal(rows.length, 5);
});
