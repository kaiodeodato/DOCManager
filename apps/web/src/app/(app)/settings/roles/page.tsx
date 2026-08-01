"use client";

import { EmptyState } from "@ac/ui";
import { Shield } from "lucide-react";

const ROLES = [
  { id: "owner", name: "Owner", permissions: "Full org administration" },
  { id: "accountant", name: "Accountant", permissions: "Documents, review, approve" },
  { id: "viewer", name: "Viewer", permissions: "Read-only archive" },
];

export default function RolesSettingsPage() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-[var(--dm-color-muted)]">
        Built-in roles from `@ac/shared` / Postgres check constraint — not demo personas.
      </p>
      <ul className="space-y-2">
        {ROLES.map((r) => (
          <li key={r.id} className="rounded-lg border border-[var(--dm-color-border)] p-3">
            <p className="font-medium">{r.name}</p>
            <p className="text-sm text-[var(--dm-color-muted)]">{r.permissions}</p>
          </li>
        ))}
      </ul>
      <EmptyState
        icon={Shield}
        title="Custom roles"
        description="Custom role matrices are not seeded. Extend org policies when needed."
      />
    </div>
  );
}
