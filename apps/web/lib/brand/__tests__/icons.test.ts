import assert from "node:assert/strict";
import test from "node:test";
import sharp from "sharp";
import { GET } from "@/app/brand-icon/[size]/route";
import manifest from "@/app/manifest";

test("every install icon and shortcut resolves to a PNG at its declared size", async () => {
  const data = manifest();
  const icons = [
    ...(data.icons ?? []),
    ...(data.shortcuts ?? []).flatMap((shortcut) => shortcut.icons ?? []),
  ];
  const unique = new Map(icons.map((icon) => [icon.src, icon]));
  assert.deepEqual([...unique.keys()].sort(), [
    "/brand-icon/192",
    "/brand-icon/512",
  ]);

  for (const [path, icon] of unique) {
    const size = path.split("/").at(-1)!;
    const response = await GET(new Request(`http://localhost${path}`), {
      params: Promise.resolve({ size }),
    });
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("content-type"), "image/png");
    assert.match(response.headers.get("cache-control")!, /max-age=0(?:,|$)/);
    assert.doesNotMatch(response.headers.get("cache-control")!, /immutable/);
    const metadata = await sharp(
      Buffer.from(await response.arrayBuffer()),
    ).metadata();
    assert.equal(`${metadata.width}x${metadata.height}`, icon.sizes);
  }

  assert.match(data.background_color!, /^#[0-9a-f]{6}$/i);
  assert.match(data.theme_color!, /^#[0-9a-f]{6}$/i);
});

test("unsupported sizes do not allocate an image response", async () => {
  for (const size of ["0", "4096", "192px", "0192"]) {
    const response = await GET(
      new Request("http://localhost/brand-icon/test"),
      {
        params: Promise.resolve({ size }),
      },
    );
    assert.equal(response.status, 404);
  }
});
