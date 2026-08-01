/**
 * Database package: migrations path, generated types placeholder, RLS policy helpers.
 * SQL source of truth: `supabase/migrations` (repo root).
 */
export const PACKAGE_NAME = "@ac/db" as const;
export const MIGRATIONS_PATH = "supabase/migrations" as const;

export type {
  Database,
  Json,
  Tables,
} from "./database.types.js";

export {
  canAccessOrgRow,
  canManageOrgAsOwner,
  evaluateOrgIsolationPolicy,
  resolveAccessibleOrgIds,
} from "./org-isolation.js";
export type { OrgMembership, PolicyAction } from "./org-isolation.js";
