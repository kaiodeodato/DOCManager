import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../../utils/cx.js";

export type AlertVariant = "info" | "success" | "warning" | "danger";

export type AlertProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  variant?: AlertVariant;
  title?: ReactNode;
  children?: ReactNode;
};

export function Alert({
  variant = "info",
  title,
  children,
  className,
  ...rest
}: AlertProps) {
  return (
    <div
      className={cx("dm-alert", `dm-alert--${variant}`, className)}
      role="status"
      {...rest}
    >
      <div>
        {title != null ? <p className="dm-alert__title">{title}</p> : null}
        {children != null ? <div className="dm-alert__body">{children}</div> : null}
      </div>
    </div>
  );
}
