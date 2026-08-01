import type { InputHTMLAttributes, ReactNode } from "react";
import { cx } from "../../utils/cx.js";

export type SwitchProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: ReactNode;
};

export function Switch({ label, className, id, ...rest }: SwitchProps) {
  const inputId = id ?? (typeof label === "string" ? `dm-switch-${label}` : undefined);
  return (
    <label className={cx("dm-switch", className)} htmlFor={inputId}>
      <input id={inputId} type="checkbox" role="switch" {...rest} />
      <span className="dm-switch__track" aria-hidden />
      <span>{label}</span>
    </label>
  );
}
