import { createHash } from "node:crypto";
import { NextRequest } from "next/server";
import { z } from "zod";
import { errorResponse, handleApiError, successResponse } from "@/lib/api-utils";
import {
  buildGenesisProofDraft,
  buildRepoExport,
  DRIFT_FACE_IDS,
  MISSION_LANE_IDS,
  type GenesisProofRecord,
} from "@/lib/genesis/proof";

const genesisProofSchema = z.object({
  intent: z.string().trim().min(12).max(1200),
  driftFace: z.enum(DRIFT_FACE_IDS),
  missionLane: z.enum(MISSION_LANE_IDS),
});

function hashPayload(payload: unknown) {
  return createHash("sha256").update(JSON.stringify(payload)).digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const validation = genesisProofSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse("VALIDATION_ERROR", "Invalid Genesis proof input", 400, {
        errors: validation.error.errors,
      });
    }

    const draft = buildGenesisProofDraft(validation.data);
    const createdAt = new Date().toISOString();
    const contentHash = hashPayload({ createdAt, draft });
    const proofId = `arcanea-proof-${contentHash.slice(0, 16)}`;

    const recordBase = {
      proofId,
      createdAt,
      contentHash,
      draft,
    };

    const record: GenesisProofRecord = {
      ...recordBase,
      repoExport: buildRepoExport(recordBase),
    };

    return successResponse({ record }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
