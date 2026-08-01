import type { HTMLAttributes } from "react";
import { cx } from "../../utils/cx.js";

export type SkeletonProps = HTMLAttributes<HTMLDivElement> & {
  width?: string | number;
  height?: string | number;
};

export function Skeleton({
  width = "100%",
  height = "1rem",
  className,
  style,
  ...rest
}: SkeletonProps) {
  return (
    <div
      className={cx("dm-skeleton", className)}
      style={{ width, height, ...(style ?? {}) }}
      aria-hidden
      {...rest}
    />
  );
}
