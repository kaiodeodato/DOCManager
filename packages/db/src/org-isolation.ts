import { UserRole, type UserRole as UserRoleValue } from "@ac/shared";

/**
 * Membership row shape used by policy simulation (mirrors org_members).
 */
export type OrgMembership = {
  org_id: string;
  user_id: string;
  role: UserRoleValue;
};

/**
 * Mirrors `public.current_user_org_ids()` — org ids the user may access under RLS.
 */
export function resolveAccessibleOrgIds(
  memberships: readonly OrgMembership[],
  userId: string,
): string[] {
  const ids = new Set<string>();
  for (const m of memberships) {
    if (m.user_id === userId) {
      ids.add(m.org_id);
    }
  }
  return [...ids];
}

/**
 * Simulates `org_id in (select current_user_org_ids())` USING / WITH CHECK.
 */
export function canAccessOrgRow(
  rowOrgId: string,
  accessibleOrgIds: readonly string[],
): boolean {
  return accessibleOrgIds.includes(rowOrgId);
}

/**
 * Simulates owner-only manage policies on org_members / orgs update.
 */
export function canManageOrgAsOwner(
  memberships: readonly OrgMembership[],
  userId: string,
  orgId: string,
): boolean {
  return memberships.some(
    (m) =>
      m.user_id === userId && m.org_id === orgId && m.role === UserRole.Owner,
  );
}

export type PolicyAction = "select" | "insert" | "update" | "delete";

/**
 * Generic org-scoped table policy (documents, jobs, extractions, tags, taxonomy).
 */
export function evaluateOrgIsolationPolicy(input: {
  action: PolicyAction;
  rowOrgId: string;
  accessibleOrgIds: readonly string[];
}): boolean {
  return canAccessOrgRow(input.rowOrgId, input.accessibleOrgIds);
}
