"use client";

import { Button, Card, CardHeader, StatusBadge, Timeline } from "@ac/ui";

export default function ApprovalsPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="p-6">
        <CardHeader
          title="Approval — Policy-RGPD-Internal.pdf"
          description="Requested by João Mendes"
          action={<StatusBadge status="in_review" />}
        />
        <p className="mt-4 text-sm text-[var(--dm-color-muted)]">
          Review retention clause updates before publishing to the compliance pack.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Button variant="primary">Approve</Button>
          <Button variant="danger">Reject</Button>
          <Button variant="outline">Request changes</Button>
        </div>
      </Card>
      <Card className="p-6">
        <CardHeader title="Workflow timeline" />
        <Timeline
          items={[
            { id: "1", title: "Submitted", description: "João Mendes", time: "Mon 09:12", status: "done" },
            { id: "2", title: "Legal review", description: "Ana Silva", time: "Mon 11:40", status: "done" },
            { id: "3", title: "Owner approval", description: "Waiting", time: "Now", status: "current" },
            { id: "4", title: "Archive", description: "Metadata finalize", status: "upcoming" },
          ]}
        />
        <div className="mt-6 flex flex-wrap gap-2">
          <StatusBadge status="draft" />
          <StatusBadge status="pending" />
          <StatusBadge status="approved" />
          <StatusBadge status="rejected" />
          <StatusBadge status="failed" />
        </div>
      </Card>
    </div>
  );
}
