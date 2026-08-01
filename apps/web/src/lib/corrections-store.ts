import { randomUUID } from "node:crypto";
import type { ExtractionCorrection } from "@ac/shared";

export type CorrectionRow = ExtractionCorrection & {
  id: string;
  createdAt: string;
};

const corrections: CorrectionRow[] = [];

export function rememberCorrection(
  input: ExtractionCorrection,
): CorrectionRow {
  const row: CorrectionRow = {
    ...input,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };
  corrections.unshift(row);
  return row;
}

export function listCorrections(documentId?: string): CorrectionRow[] {
  if (!documentId) return [...corrections];
  return corrections.filter((c) => c.documentId === documentId);
}

export function resetCorrectionsStore(): void {
  corrections.length = 0;
}
