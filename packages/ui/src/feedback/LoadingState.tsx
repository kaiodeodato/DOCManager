import type { ReactNode } from "react";
import { cx } from "../utils/cx.js";
import { Skeleton } from "../components/base/Skeleton.js";
import { Spinner } from "../components/base/Spinner.js";

export type LoadingStateProps = {
  label?: ReactNode;
  variant?: "spinner" | "skeleton";
  rows?: number;
  className?: string;
};

export function LoadingState({
  label = "Loading…",
  variant = "spinner",
  rows = 3,
  className,
}: LoadingStateProps) {
  if (variant === "skeleton") {
    return (
      <div className={cx("dm-loading", className)} aria-busy="true" aria-label={String(label)}>
        {Array.from({ length: rows }, (_, i) => (
          <Skeleton key={i} height="2.5rem" width="100%" style={{ marginBottom: "0.75rem" }} />
        ))}
      </div>
    );
  }

  return (
    <div className={cx("dm-loading", "dm-loading--spinner", className)} role="status">
      <Spinner />
      <span>{label}</span>
    </div>
  );
}
