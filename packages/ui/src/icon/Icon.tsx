import type { LucideIcon, LucideProps } from "lucide-react";
import { cx } from "../utils/cx.js";

const SIZE_MAP = {
  sm: 14,
  md: 18,
  lg: 22,
} as const;

const STROKE_MAP = {
  sm: 1.75,
  md: 1.75,
  lg: 1.5,
} as const;

export type IconSize = keyof typeof SIZE_MAP;

export type IconProps = Omit<LucideProps, "ref" | "size" | "strokeWidth"> & {
  icon: LucideIcon;
  size?: IconSize;
  label?: string;
};

/**
 * Standardized Lucide wrapper — fixed size/stroke for DOC Manager chrome.
 */
export function Icon({
  icon: Lucide,
  size = "md",
  label,
  className,
  color = "currentColor",
  "aria-hidden": ariaHidden,
  ...rest
}: IconProps) {
  const decorative = label == null;
  return (
    <Lucide
      className={cx("dm-icon", `dm-icon--${size}`, className)}
      size={SIZE_MAP[size]}
      strokeWidth={STROKE_MAP[size]}
      color={color}
      aria-hidden={decorative ? true : ariaHidden}
      {...(label != null ? { "aria-label": label } : {})}
      role={decorative ? "presentation" : "img"}
      {...rest}
    />
  );
}
