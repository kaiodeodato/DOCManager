import type { ReactNode } from "react";
import { cx } from "../utils/cx.js";
import { Badge, type BadgeVariant } from "../components/base/Badge.js";

export type WorkflowStatus =
  | "draft"
  | "pending"
  | "in_review"
  | "approved"
  | "rejected"
  | "completed"
  | "failed";

const VARIANT: Record<WorkflowStatus, BadgeVariant> = {
  draft: "neutral",
  pending: "warning",
  in_review: "warning",
  approved: "success",
  rejected: "danger",
  completed: "success",
  failed: "danger",
};

const LABEL: Record<WorkflowStatus, string> = {
  draft: "Draft",
  pending: "Pending",
  in_review: "In review",
  approved: "Approved",
  rejected: "Rejected",
  completed: "Completed",
  failed: "Failed",
};

export type StatusBadgeProps = {
  status: WorkflowStatus;
  label?: ReactNode;
  className?: string;
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  return (
    <Badge variant={VARIANT[status]} className={cx("dm-status-badge", className)}>
      {label ?? LABEL[status]}
    </Badge>
  );
}
