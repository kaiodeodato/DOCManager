import sharp from "sharp";
import { loadPreprocessDefaults } from "./config.js";

export type PreprocessOptions = {
  maxWidth?: number;
  grayscale?: boolean;
  normalize?: boolean;
  sharpen?: boolean;
  /** Soft crop via sharp.trim — stub for margin cleanup. */
  trimMargins?: boolean;
  /**
   * Full geometric deskew is not implemented yet.
   * When true, currently a no-op after EXIF `.rotate()` (documented stub).
   */
  deskew?: boolean;
};

/**
 * E4.01 — image preprocess before OCR (sharp).
 * Pipeline: EXIF rotate → optional trim → resize → grayscale → normalize → sharpen.
 */
export async function preprocessImage(
  input: Buffer,
  options: PreprocessOptions = {},
): Promise<Buffer> {
  const defaults = loadPreprocessDefaults();
  const {
    maxWidth = defaults.maxWidth,
    grayscale = defaults.grayscale,
    normalize = defaults.normalize,
    sharpen = defaults.sharpen,
    trimMargins = defaults.trimMargins,
    deskew = defaults.deskew,
  } = options;

  // Honor EXIF orientation; geometric deskew remains a stub (E4.01).
  let pipeline = sharp(input, { failOn: "none" }).rotate();
  if (deskew) {
    pipeline = applyDeskewStub(pipeline);
  }

  if (trimMargins) {
    pipeline = pipeline.trim({ threshold: 16 });
  }

  const meta = await sharp(input, { failOn: "none" }).metadata();
  if (meta.width && meta.width > maxWidth) {
    pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true });
  }
  if (grayscale) pipeline = pipeline.grayscale();
  if (normalize) pipeline = pipeline.normalize();
  if (sharpen) pipeline = pipeline.sharpen();

  return pipeline.png().toBuffer();
}

/** Placeholder for future Hough/projection deskew — keeps API stable. */
function applyDeskewStub(pipeline: sharp.Sharp): sharp.Sharp {
  return pipeline;
}
