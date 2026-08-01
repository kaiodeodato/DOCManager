import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../../utils/cx.js";

export type ToastProps = HTMLAttributes<HTMLDivElement> & {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
};

export function Toast({
  title,
  description,
  action,
  className,
  ...rest
}: ToastProps) {
  return (
    <div className={cx("dm-toast", className)} role="status" {...rest}>
      <div style={{ flex: 1 }}>
        <p className="dm-alert__title">{title}</p>
        {description != null ? <p className="dm-alert__body">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export type ToastViewportProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

export function ToastViewport({ className, children, ...rest }: ToastViewportProps) {
  return (
    <div className={cx("dm-toast-viewport", className)} {...rest}>
      {children}
    </div>
  );
}
