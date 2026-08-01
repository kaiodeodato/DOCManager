import type { HTMLAttributes } from "react";
import { cx } from "../../utils/cx.js";

export type DividerProps = HTMLAttributes<HTMLHRElement> & {
  orientation?: "horizontal" | "vertical";
};

export function Divider({
  orientation = "horizontal",
  className,
  ...rest
}: DividerProps) {
  if (orientation === "vertical") {
    return (
      <span
        role="separator"
        aria-orientation="vertical"
        className={cx("dm-divider--vertical", className)}
      />
    );
  }
  return <hr className={cx("dm-divider", className)} {...rest} />;
}
