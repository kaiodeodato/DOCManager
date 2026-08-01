"use client";

import { useEffect, useState } from "react";
import { Badge, EmptyState, LoadingState } from "@ac/ui";
import { Users } from "lucide-react";

type Member = { id: string; role: string; user_id: string };

export default function UsersSettingsPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/org/members");
        if (!res.ok) throw new Error("Failed to load members");
        const data = (await res.json()) as { members: Member[] };
        setMembers(data.members);
      } catch (err) {
        setError(err instanceof Error ? err.message : "error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <LoadingState label="Loading members…" />;
  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (members.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No members yet"
        description="Invite users after your organization is bootstrapped."
      />
    );
  }

  return (
    <ul className="space-y-2">
      {members.map((m) => (
        <li
          key={m.id}
          className="flex items-center justify-between rounded-lg border border-[var(--dm-color-border)] p-3"
        >
          <span className="font-mono text-sm">{m.user_id}</span>
          <Badge>{m.role}</Badge>
        </li>
      ))}
    </ul>
  );
}
