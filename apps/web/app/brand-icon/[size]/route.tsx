/* eslint-disable @next/next/no-img-element -- ImageResponse renders embedded image bytes; next/image cannot run inside it. */
import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { cosmic } from "@arcanea/design-system";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ size: string }> },
) {
  const { size: requestedSize } = await params;
  if (requestedSize !== "192" && requestedSize !== "512") {
    return new Response("Unsupported icon size", { status: 404 });
  }

  const size = Number(requestedSize);
  const mark = readFileSync(
    join(process.cwd(), "assets/brand/arcanea-mark.jpg"),
  ).toString("base64");

  return new ImageResponse(
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        background: cosmic.void,
      }}
    >
      <img
        alt=""
        src={`data:image/jpeg;base64,${mark}`}
        width={size}
        height={size}
        style={{ objectFit: "cover" }}
      />
    </div>,
    {
      width: size,
      height: size,
      headers: {
        "Cache-Control":
          "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
      },
    },
  );
}
