import type { InputHTMLAttributes, ReactNode } from "react";
import { cx } from "../../utils/cx.js";

export type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: ReactNode;
};

export function Radio({ label, className, id, ...rest }: RadioProps) {
  const inputId = id ?? (typeof label === "string" ? `dm-radio-${label}` : undefined);
  return (
    <label className={cx("dm-radio", className)} htmlFor={inputId}>
      <input id={inputId} type="radio" {...rest} />
      <span>{label}</span>
    </label>
  );
}
