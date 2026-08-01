import Tesseract from "tesseract.js";

export type OcrResult = {
  text: string;
  confidence: number;
};

export type OcrEngine = (image: Buffer, lang?: string) => Promise<OcrResult>;

/** E4.02 — Tesseract OCR over a preprocessed image buffer. */
export const tesseractEngine: OcrEngine = async (image, lang = "por+eng") => {
  const result = await Tesseract.recognize(image, lang, {
    logger: () => undefined,
  });
  const confidence = (result.data.confidence ?? 0) / 100;
  return {
    text: (result.data.text ?? "").trim(),
    confidence: Math.min(1, Math.max(0, confidence)),
  };
};

let activeEngine: OcrEngine = tesseractEngine;

/** Test hook — swap engine without network/WASM (E4.05). */
export function setOcrEngine(engine: OcrEngine): void {
  activeEngine = engine;
}

export function resetOcrEngine(): void {
  activeEngine = tesseractEngine;
}

export async function runOcr(image: Buffer, lang = "por+eng"): Promise<OcrResult> {
  return activeEngine(image, lang);
}
