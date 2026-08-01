"use client";
import { Card, CardHeader, Switch } from "@ac/ui";

export default function NotificationSettingsPage() {
  return (
    <Card className="max-w-xl p-6">
      <CardHeader title="Notifications" description="Choose how your team is notified" />
      <div className="mt-4 flex flex-col gap-4">
        <Switch label="Email — OCR needs review" defaultChecked />
        <Switch label="Email — Approval requests" defaultChecked />
        <Switch label="WhatsApp — urgent approvals" />
        <Switch label="Weekly digest" defaultChecked />
      </div>
    </Card>
  );
}
