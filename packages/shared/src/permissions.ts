import { UserRole } from "./enums.js";

/** Capability matrix for org roles (E9.02). */
export const RoleCapability = {
  documentRead: "document:read",
  documentWrite: "document:write",
  documentApprove: "document:approve",
  taxonomyWrite: "taxonomy:write",
  settingsWrite: "settings:write",
  shareExternal: "share:external",
  /** Alias for route handlers using PascalCase. */
  ShareExternal: "share:external",
  manageMembers: "members:manage",
  exportGdpr: "gdpr:export",
  /** Alias for GDPR export/anonymize API. */
  ExportGdpr: "gdpr:export",
} as const;

export type RoleCapabilityName = (typeof RoleCapability)[keyof typeof RoleCapability];

export type Permission =
  | "document:read"
  | "document:write"
  | "document:approve"
  | "taxonomy:write"
  | "settings:write"
  | "share:external"
  | "members:manage"
  | "gdpr:export";

const permissions: Record<string, readonly Permission[]> = {
  [UserRole.Owner]: [
    "document:read",
    "document:write",
    "document:approve",
    "taxonomy:write",
    "settings:write",
    "share:external",
    "members:manage",
    "gdpr:export",
  ],
  [UserRole.Accountant]: [
    "document:read",
    "document:write",
    "document:approve",
    "share:external",
  ],
  [UserRole.Viewer]: ["document:read"],
};

export function listCapabilities(role: string): readonly Permission[] {
  return permissions[role] ?? [];
}

export function hasCapability(role: string, capability: Permission): boolean {
  return listCapabilities(role).includes(capability);
}

export function can(role: string, permission: Permission): boolean {
  return hasCapability(role, permission);
}

export function assertCapability(role: string, capability: Permission): void {
  if (!hasCapability(role, capability)) {
    throw new Error(`Forbidden: ${role} cannot ${capability}`);
  }
}

export function assertCan(role: string, permission: Permission): void {
  assertCapability(role, permission);
}

export function canManageMembers(role: string): boolean {
  return hasCapability(role, "members:manage");
}

export function canShareExternally(role: string): boolean {
  return hasCapability(role, "share:external");
}
