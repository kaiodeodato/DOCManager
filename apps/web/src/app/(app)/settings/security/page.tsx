"use client";
import { Card, CardHeader, Switch } from "@ac/ui";

export default function SecuritySettingsPage() {
  return (
    <Card className="max-w-xl p-6">
      <CardHeader title="Security" description="Authentication and session controls" />
      <div className="mt-4 flex flex-col gap-4">
        <Switch label="Require MFA for admins" defaultChecked />
        <Switch label="Enforce SSO" />
        <Switch label="Revoke sessions on password change" defaultChecked />
      </div>
    </Card>
  );
}
