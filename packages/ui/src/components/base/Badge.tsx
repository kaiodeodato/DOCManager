import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../../utils/cx.js";

export type BadgeVariant = "neutral" | "success" | "warning" | "danger";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
  children?: ReactNode;
};

export function Badge({
  variant = "neutral",
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span className={cx("dm-badge", `dm-badge--${variant}`, className)} {...rest}>
      {children}
    </span>
  );
}
