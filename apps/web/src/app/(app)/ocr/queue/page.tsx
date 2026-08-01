import {
  Badge,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@ac/ui";
import { getUserOrgContext } from "@/lib/auth/server";
import { listPersistedDocuments } from "@/lib/document-repository";

export default async function OcrQueuePage() {
  const context = await getUserOrgContext();
  const documents = context ? await listPersistedDocuments(context.orgId) : [];
  const queue = documents.filter(
    (document) =>
      document.status === "received" ||
      document.status === "ocr_failed" ||
      document.status === "needs_review",
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold">OCR queue</h2>
        <p className="text-sm text-[var(--dm-color-muted)]">
          Worker jobs waiting or in progress — open review for low confidence.
        </p>
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Document</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {queue.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell>{doc.originalFilename}</TableCell>
              <TableCell>
                <Badge variant="warning">{doc.status}</Badge>
              </TableCell>
              <TableCell>
                <a href={doc.status === "needs_review" ? "/ocr/review" : `/ocr/${doc.id}`}>
                  <Button size="sm" variant="primary">
                    Review
                  </Button>
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {queue.length === 0 ? (
        <Card className="p-6 text-sm text-[var(--dm-color-muted)]">Queue is empty.</Card>
      ) : null}
    </div>
  );
}
