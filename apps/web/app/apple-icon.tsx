import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  const mark = readFileSync(
    join(process.cwd(), "assets/brand/arcanea-mark.jpg"),
  );
  const base64 = Buffer.from(mark).toString("base64");

  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a1020",
          borderRadius: 42,
          border: "2px solid rgba(0,188,212,0.22)",
        }}
      >
        <img
          src={`data:image/jpeg;base64,${base64}`}
          width={168}
          height={168}
          style={{ borderRadius: 34 }}
        />
      </div>
    ),
    { ...size },
  );
}
