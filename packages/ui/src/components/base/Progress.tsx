import type { HTMLAttributes } from "react";
import { cx } from "../../utils/cx.js";

export type ProgressProps = HTMLAttributes<HTMLDivElement> & {
  value: number;
  max?: number;
  label?: string;
};

export function Progress({
  value,
  max = 100,
  label,
  className,
  ...rest
}: ProgressProps) {
  const clamped = Math.max(0, Math.min(value, max));
  const pct = max === 0 ? 0 : (clamped / max) * 100;
  return (
    <div
      className={cx("dm-progress", className)}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
      {...rest}
    >
      <div className="dm-progress__bar" style={{ width: `${pct}%` }} />
    </div>
  );
}
