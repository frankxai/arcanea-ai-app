/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";
import { cosmic } from "@arcanea/design-system";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  const mark = readFileSync(
    join(process.cwd(), "assets/brand/arcanea-mark.jpg"),
  );
  const base64 = Buffer.from(mark).toString("base64");

  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: cosmic.void,
          borderRadius: 7,
          border: "1px solid rgba(0,188,212,0.25)",
        }}
      >
        <img
          alt="Icon"
          src={`data:image/jpeg;base64,${base64}`}
          width={30}
          height={30}
          style={{ borderRadius: 6 }}
        />
      </div>
    ),
    { ...size },
  );
}
