import type { InputHTMLAttributes, ReactNode } from "react";
import { cx } from "../../utils/cx.js";

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: ReactNode;
};

export function Checkbox({ label, className, id, ...rest }: CheckboxProps) {
  const inputId = id ?? (typeof label === "string" ? `dm-check-${label}` : undefined);
  return (
    <label className={cx("dm-check", className)} htmlFor={inputId}>
      <input id={inputId} type="checkbox" {...rest} />
      <span>{label}</span>
    </label>
  );
}
