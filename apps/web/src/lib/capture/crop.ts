/**
 * Client-side crop helper (E13.03).
 * Pure canvas math — no DOM required for unit tests when ImageData is provided.
 */

export type CropRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function clampCropRect(
  rect: CropRect,
  imageWidth: number,
  imageHeight: number,
): CropRect {
  const x = Math.max(0, Math.min(rect.x, imageWidth - 1));
  const y = Math.max(0, Math.min(rect.y, imageHeight - 1));
  const width = Math.max(1, Math.min(rect.width, imageWidth - x));
  const height = Math.max(1, Math.min(rect.height, imageHeight - y));
  return { x, y, width, height };
}

/**
 * Crop an ImageData region into a new ImageData (Node/browser).
 */
export function cropImageData(source: ImageData, rect: CropRect): ImageData {
  const safe = clampCropRect(rect, source.width, source.height);
  const data = new Uint8ClampedArray(safe.width * safe.height * 4);
  for (let row = 0; row < safe.height; row += 1) {
    for (let col = 0; col < safe.width; col += 1) {
      const srcIdx = ((safe.y + row) * source.width + (safe.x + col)) * 4;
      const dstIdx = (row * safe.width + col) * 4;
      data[dstIdx] = source.data[srcIdx]!;
      data[dstIdx + 1] = source.data[srcIdx + 1]!;
      data[dstIdx + 2] = source.data[srcIdx + 2]!;
      data[dstIdx + 3] = source.data[srcIdx + 3]!;
    }
  }
  if (typeof ImageData !== "undefined") {
    return new ImageData(data, safe.width, safe.height);
  }
  return { width: safe.width, height: safe.height, data, colorSpace: "srgb" } as ImageData;
}

/**
 * Estimate JPEG-ish byte size hint after crop (for UX), not a real encoder.
 */
export function estimateCroppedBytes(
  sourceWidth: number,
  sourceHeight: number,
  rect: CropRect,
  bytesPerPixel = 3,
): number {
  const safe = clampCropRect(rect, sourceWidth, sourceHeight);
  return safe.width * safe.height * bytesPerPixel;
}
