import type { HTMLAttributes } from "react";
import { cx } from "../../utils/cx.js";

export type SpinnerProps = HTMLAttributes<HTMLDivElement> & {
  size?: "md" | "lg";
  label?: string;
};

export function Spinner({
  size = "md",
  label = "Loading",
  className,
  ...rest
}: SpinnerProps) {
  return (
    <div
      className={cx("dm-spinner", size === "lg" && "dm-spinner--lg", className)}
      role="status"
      aria-label={label}
      {...rest}
    />
  );
}
