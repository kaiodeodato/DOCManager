import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { clampCropRect, cropImageData, estimateCroppedBytes } from "./crop.ts";

function makeImageData(width: number, height: number): ImageData {
  if (typeof ImageData !== "undefined") {
    return new ImageData(width, height);
  }
  const data = new Uint8ClampedArray(width * height * 4);
  return { width, height, data, colorSpace: "srgb" } as ImageData;
}

describe("crop helper (E13.03)", () => {
  it("clamps crop rect inside image bounds", () => {
    const rect = clampCropRect({ x: -10, y: 5, width: 1000, height: 10 }, 100, 50);
    assert.equal(rect.x, 0);
    assert.equal(rect.y, 5);
    assert.equal(rect.width, 100);
    assert.equal(rect.height, 10);
  });

  it("crops pixel buffer", () => {
    const src = makeImageData(4, 4);
    src.data[0] = 255;
    const out = cropImageData(src, { x: 0, y: 0, width: 2, height: 2 });
    assert.equal(out.width, 2);
    assert.equal(out.height, 2);
    assert.equal(out.data[0], 255);
  });

  it("estimates cropped bytes", () => {
    const bytes = estimateCroppedBytes(100, 100, { x: 0, y: 0, width: 10, height: 10 });
    assert.equal(bytes, 300);
  });
});
