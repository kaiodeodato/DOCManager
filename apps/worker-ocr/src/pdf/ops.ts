/**
 * Lightweight PDF stub for worker job wiring (E10 scaffold).
 * Real pdf-lib merge/split can replace this once the dependency installs cleanly in CI.
 * Format: ASCII marker + page count — enough for unit tests without native PDF parsing.
 */

const PREFIX = "DOC_MANAGER_PDF_STUB:";

function pageCountOf(buf: Buffer): number {
  const text = buf.toString("utf8");
  if (text.startsWith(PREFIX)) {
    const n = Number.parseInt(text.slice(PREFIX.length), 10);
    return Number.isFinite(n) && n > 0 ? n : 1;
  }
  // Unknown binary payload — treat as single page.
  return 1;
}

/** Merge multiple PDF buffers into one (E10.01). */
export async function mergePdfs(buffers: Buffer[]): Promise<Buffer> {
  if (buffers.length === 0) {
    throw new Error("merge_requires_at_least_one_pdf");
  }
  const total = buffers.reduce((sum, buf) => sum + pageCountOf(buf), 0);
  return createBlankPdf(total);
}

/** Split a PDF into single-page PDFs (E10.02). */
export async function splitPdf(buffer: Buffer): Promise<Buffer[]> {
  const count = pageCountOf(buffer);
  const parts: Buffer[] = [];
  for (let i = 0; i < count; i += 1) {
    parts.push(await createBlankPdf(1));
  }
  return parts;
}

/** Minimal valid single-page PDF stub for tests (no external files). */
export async function createBlankPdf(pageCount = 1): Promise<Buffer> {
  const n = Math.max(1, Math.floor(pageCount));
  return Buffer.from(`${PREFIX}${n}`, "utf8");
}
