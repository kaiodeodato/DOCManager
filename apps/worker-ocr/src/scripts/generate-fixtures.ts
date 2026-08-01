/**
 * Generates offline PNG fixtures for OCR unit tests (E4.05).
 * Run: node --import tsx ... or via npm run fixtures after build with compiled JS.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "../../fixtures");

async function main(): Promise<void> {
  await mkdir(dir, { recursive: true });
  await mkdir(path.join(dir, "photos"), { recursive: true });

  const invoice = await sharp({
    create: { width: 320, height: 200, channels: 3, background: { r: 250, g: 250, b: 250 } },
  })
    .png()
    .toBuffer();

  const rotated = await sharp({
    create: { width: 320, height: 200, channels: 3, background: { r: 240, g: 240, b: 255 } },
  })
    .rotate(12, { background: { r: 240, g: 240, b: 255 } })
    .png()
    .toBuffer();

  const lowQuality = await sharp({
    create: { width: 160, height: 100, channels: 3, background: { r: 90, g: 90, b: 90 } },
  })
    .blur(1.2)
    .png()
    .toBuffer();

  await writeFile(path.join(dir, "invoice.png"), invoice);
  await writeFile(path.join(dir, "rotated.png"), rotated);
  await writeFile(path.join(dir, "low-quality.png"), lowQuality);

  // E4.06 photo stand-ins (synthetic) — replace with real phone photos when available.
  for (const [name, bg] of [
    ["good-light.png", { r: 245, g: 245, b: 245 }],
    ["low-light.png", { r: 35, g: 35, b: 40 }],
    ["angle.png", { r: 220, g: 220, b: 230 }],
    ["shadow.png", { r: 150, g: 150, b: 160 }],
    ["receipt.png", { r: 255, g: 252, b: 240 }],
    ["invoice-photo.png", { r: 248, g: 248, b: 248 }],
    ["noise.png", { r: 180, g: 180, b: 180 }],
    ["glare.png", { r: 255, g: 255, b: 255 }],
  ] as const) {
    let img = sharp({
      create: { width: 400, height: 260, channels: 3, background: bg },
    });
    if (name === "angle.png") img = img.rotate(10, { background: bg });
    if (name === "noise.png") img = img.blur(0.8);
    await writeFile(path.join(dir, "photos", name), await img.png().toBuffer());
  }

  // eslint-disable-next-line no-console
  console.log(`Wrote fixtures to ${dir}`);
}

void main();
