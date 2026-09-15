import { NextRequest, NextResponse } from "next/server";

interface CreatureContributionRequest {
  creatureName?: string;
  sourceWorld?: string;
  sourceWork?: string;
  referenceUrl?: string;
  proposedArcaneaVariant?: string;
  notes?: string;
  contributor?: string;
}

export async function GET() {
  return NextResponse.json({
    service: "Arcanea Creature Atlas Contributions",
    status: "review-intake-contract",
    requiredFields: ["creatureName", "sourceWorld", "sourceWork", "notes"],
    reviewLanes: [
      "research",
      "rights-classification",
      "canon-transform",
      "prompt-safety",
      "visual-qa",
      "repo-pr",
    ],
    persistence:
      "This v1 endpoint returns a validated PR payload. Supabase-backed contribution persistence lands with the atlas migration.",
  });
}

export async function POST(req: NextRequest) {
  const body = await readContribution(req);
  const missing = ["creatureName", "sourceWorld", "sourceWork", "notes"].filter(
    (field) => !body[field as keyof CreatureContributionRequest],
  );

  if (missing.length > 0) {
    return NextResponse.json(
      {
        error: "Missing required contribution fields",
        missing,
      },
      { status: 400 },
    );
  }

  const slug = slugify(`${body.sourceWorld}-${body.creatureName}`);
  const now = new Date().toISOString();

  return NextResponse.json(
    {
      status: "queued_for_review",
      contributionId: `atlas-contribution-${Date.now()}`,
      reviewLane: "rights-classification",
      suggestedRepoPath: `creatures/${slug}.md`,
      prPayload: {
        title: `Creature atlas entry: ${body.creatureName}`,
        labels: ["creature-atlas", "rights-review", "canon-transform"],
        body: [
          `Creature: ${body.creatureName}`,
          `Source world: ${body.sourceWorld}`,
          `Source work: ${body.sourceWork}`,
          body.referenceUrl ? `Reference URL: ${body.referenceUrl}` : null,
          body.proposedArcaneaVariant
            ? `Proposed Arcanea variant: ${body.proposedArcaneaVariant}`
            : null,
          "",
          "Notes:",
          body.notes,
          "",
          "Required gates:",
          "- Source/citation check",
          "- Rights tier classification",
          "- Original Arcanea variant prompt",
          "- Visual QA before any generated media is approved",
        ]
          .filter(Boolean)
          .join("\n"),
      },
      receivedAt: now,
      persistence:
        "Not yet written to Supabase. Use this payload to create the canonical GitHub PR or issue.",
    },
    { status: 202 },
  );
}

async function readContribution(req: NextRequest): Promise<CreatureContributionRequest> {
  try {
    const body = (await req.json()) as CreatureContributionRequest;
    return body && typeof body === "object" ? body : {};
  } catch {
    return {};
  }
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
