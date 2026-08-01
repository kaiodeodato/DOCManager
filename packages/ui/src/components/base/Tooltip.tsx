import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../../utils/cx.js";

export type TooltipProps = HTMLAttributes<HTMLSpanElement> & {
  content: ReactNode;
  children: ReactNode;
};

export function Tooltip({ content, children, className, ...rest }: TooltipProps) {
  return (
    <span className={cx("dm-tooltip", className)} {...rest}>
      {children}
      <span className="dm-tooltip__content" role="tooltip">
        {content}
      </span>
    </span>
  );
}
