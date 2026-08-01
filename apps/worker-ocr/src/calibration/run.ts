import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { loadPreprocessDefaults } from "../config.js";
import { preprocessImage, type PreprocessOptions } from "../preprocess.js";

/**
 * E4.06 — calibration harness: try filter combos and score contrast/variance proxy.
 * Invoked via `apps/worker-ocr/calibration/run.mjs` or `npm run calibrate -w @ac/worker-ocr`.
 */
export type CalibrationCombo = { name: string; options: PreprocessOptions };

export const CALIBRATION_COMBOS: CalibrationCombo[] = [
  { name: "baseline", options: { grayscale: false, normalize: false, sharpen: false } },
  { name: "gray", options: { grayscale: true, normalize: false, sharpen: false } },
  { name: "gray-normalize", options: { grayscale: true, normalize: true, sharpen: false } },
  { name: "gray-normalize-sharpen", options: { grayscale: true, normalize: true, sharpen: true } },
  { name: "normalize-sharpen", options: { grayscale: false, normalize: true, sharpen: true } },
  { name: "sharpen-only", options: { grayscale: false, normalize: false, sharpen: true } },
  {
    name: "trim-gray-normalize-sharpen",
    options: { grayscale: true, normalize: true, sharpen: true, trimMargins: true },
  },
  {
    name: "upscale-proxy",
    options: { grayscale: true, normalize: true, sharpen: true, maxWidth: 4000 },
  },
];

export async function syntheticFixture(kind: "invoice" | "angled" | "lowlight" | "shadow"): Promise<Buffer> {
  const backgrounds = {
    invoice: { r: 245, g: 245, b: 245 },
    angled: { r: 220, g: 220, b: 230 },
    lowlight: { r: 40, g: 40, b: 45 },
    shadow: { r: 160, g: 160, b: 170 },
  } as const;

  let img = sharp({
    create: {
      width: 480,
      height: 280,
      channels: 3,
      background: backgrounds[kind],
    },
  });

  if (kind === "angled") {
    img = img.rotate(8, { background: backgrounds.angled });
  }

  return img.png().toBuffer();
}

export async function scoreBuffer(buffer: Buffer): Promise<number> {
  const { data, info } = await sharp(buffer).greyscale().raw().toBuffer({ resolveWithObject: true });
  let sum = 0;
  for (let i = 0; i < data.length; i += 1) sum += data[i] ?? 0;
  const mean = sum / Math.max(data.length, 1);
  let variance = 0;
  for (let i = 0; i < data.length; i += 1) {
    const d = (data[i] ?? 0) - mean;
    variance += d * d;
  }
  variance /= Math.max(data.length, 1);
  return variance + info.width * 0.01;
}

export async function runCalibration(
  fixtures: Array<{ name: string; buffer: Buffer }> = [],
): Promise<{
  generatedAt: string;
  defaults: ReturnType<typeof loadPreprocessDefaults>;
  winner: string | undefined;
  rows: Array<{ fixture: string; combo: string; score: number; bytes: number }>;
}> {
  const set =
    fixtures.length > 0
      ? fixtures
      : await Promise.all(
          (["invoice", "angled", "lowlight", "shadow"] as const).map(async (name) => ({
            name,
            buffer: await syntheticFixture(name),
          })),
        );

  const rows: Array<{ fixture: string; combo: string; score: number; bytes: number }> = [];
  for (const fixture of set) {
    for (const combo of CALIBRATION_COMBOS) {
      const out = await preprocessImage(fixture.buffer, combo.options);
      rows.push({
        fixture: fixture.name,
        combo: combo.name,
        score: await scoreBuffer(out),
        bytes: out.byteLength,
      });
    }
  }

  rows.sort((a, b) => b.score - a.score);
  return {
    generatedAt: new Date().toISOString(),
    defaults: loadPreprocessDefaults(),
    winner: rows[0]?.combo,
    rows,
  };
}

async function main(): Promise<void> {
  const report = await runCalibration();
  const outDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "../../calibration");
  await writeFile(path.join(outDir, "report.json"), JSON.stringify(report, null, 2));
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(report, null, 2));
}

const entry = process.argv[1]?.replace(/\\/g, "/") ?? "";
if (entry.endsWith("/calibration/run.js") || entry.endsWith("/calibration/run.ts")) {
  void main();
}
