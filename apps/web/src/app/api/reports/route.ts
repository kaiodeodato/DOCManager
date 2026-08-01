import { listDocuments } from "@/lib/document-store";

export const runtime = "nodejs";

/**
 * Generate a minimal documents report PDF (E10.03).
 * Avoids jspdf native optional deps that break Next bundling; swap for jsPDF when deps are stable.
 */
export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const orgId = url.searchParams.get("orgId") ?? undefined;
  const rows = listDocuments(orgId);

  const lines = [
    "DOC Manager — Relatorio de documentos",
    `Gerado em ${new Date().toISOString()}`,
    "",
    ...rows.map(
      (r) =>
        `${r.id.slice(0, 8)} | ${r.originalFilename} | ${r.status} | ${r.amount ?? "—"}`,
    ),
  ];
  const text = lines.join("\n");

  // Minimal valid single-page PDF with Helvetica text.
  const escaped = text
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .slice(0, 1800);
  const stream = `BT /F1 10 Tf 40 800 Td (${escaped.replace(/\n/g, ") Tj T* (")}) Tj ET`;
  const objects = [
    "1 0 obj<< /Type /Catalog /Pages 2 0 R >>endobj",
    "2 0 obj<< /Type /Pages /Kids [3 0 R] /Count 1 >>endobj",
    "3 0 obj<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>endobj",
    `4 0 obj<< /Length ${stream.length} >>stream\n${stream}\nendstream endobj`,
    "5 0 obj<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>endobj",
  ];
  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [0];
  for (const obj of objects) {
    offsets.push(Buffer.byteLength(pdf, "utf8"));
    pdf += `${obj}\n`;
  }
  const xref = Buffer.byteLength(pdf, "utf8");
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (let i = 1; i < offsets.length; i += 1) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;

  return new Response(Buffer.from(pdf, "utf8"), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="doc-manager-report.pdf"',
    },
  });
}
