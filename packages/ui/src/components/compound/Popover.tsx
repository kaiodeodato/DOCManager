import type { DetailsHTMLAttributes, ReactNode } from "react";
import { cx } from "../../utils/cx.js";

export type PopoverProps = DetailsHTMLAttributes<HTMLDetailsElement> & {
  trigger: ReactNode;
  children?: ReactNode;
};

export function Popover({ trigger, children, className, ...rest }: PopoverProps) {
  return (
    <details className={cx("dm-popover", className)} {...rest}>
      <summary className={cx("dm-btn", "dm-btn--outline", "dm-btn--sm")}>{trigger}</summary>
      <div className="dm-popover__panel">{children}</div>
    </details>
  );
}
