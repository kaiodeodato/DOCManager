import type { PreprocessOptions } from "./preprocess.js";

/**
 * Default preprocess chain (E4.06 calibration winner — gray + normalize + sharpen).
 * Override via env without code changes.
 */
export function loadPreprocessDefaults(
  env: NodeJS.ProcessEnv = process.env,
): Required<Pick<PreprocessOptions, "maxWidth" | "grayscale" | "normalize" | "sharpen" | "trimMargins" | "deskew">> {
  return {
    maxWidth: Number.parseInt(env.OCR_MAX_WIDTH ?? "2000", 10) || 2000,
    grayscale: env.OCR_GRAYSCALE !== "0",
    normalize: env.OCR_NORMALIZE !== "0",
    sharpen: env.OCR_SHARPEN !== "0",
    trimMargins: env.OCR_TRIM_MARGINS === "1",
    deskew: env.OCR_DESKEW === "1",
  };
}
