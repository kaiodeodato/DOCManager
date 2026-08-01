import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "../../utils/cx.js";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children?: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx("dm-btn", `dm-btn--${variant}`, `dm-btn--${size}`, className)}
      {...rest}
    >
      {children}
    </button>
  );
}
