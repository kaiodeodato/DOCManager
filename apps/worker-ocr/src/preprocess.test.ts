import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import sharp from "sharp";
import { preprocessImage } from "./preprocess.js";

const fixturesDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "../fixtures");

describe("preprocessImage", () => {
  it("returns a png buffer from a simple fixture", async () => {
    const input = await sharp({
      create: {
        width: 64,
        height: 32,
        channels: 3,
        background: { r: 240, g: 240, b: 240 },
      },
    })
      .png()
      .toBuffer();

    const out = await preprocessImage(input, { maxWidth: 40 });
    const meta = await sharp(out).metadata();
    assert.equal(meta.format, "png");
    assert.ok((meta.width ?? 0) <= 40);
  });

  it("processes invoice / rotated / low-quality fixtures offline", async () => {
    for (const name of ["invoice.png", "rotated.png", "low-quality.png"]) {
      const input = await readFile(path.join(fixturesDir, name));
      const out = await preprocessImage(input, {
        grayscale: true,
        normalize: true,
        sharpen: true,
        maxWidth: 200,
      });
      const meta = await sharp(out).metadata();
      assert.equal(meta.format, "png");
      assert.ok((meta.width ?? 0) > 0);
    }
  });
});
