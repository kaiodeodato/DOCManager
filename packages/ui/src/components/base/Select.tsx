import type { ReactNode, SelectHTMLAttributes } from "react";
import { cx } from "../../utils/cx.js";

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  options: readonly SelectOption[];
  placeholder?: string;
};

export function Select({
  label,
  hint,
  error,
  options,
  placeholder,
  className,
  id,
  ...rest
}: SelectProps) {
  const inputId = id ?? (typeof label === "string" ? `dm-select-${label}` : undefined);
  const invalid = Boolean(error);
  return (
    <div className="dm-field">
      {label != null ? (
        <label className="dm-field__label" htmlFor={inputId}>
          {label}
        </label>
      ) : null}
      <select
        id={inputId}
        className={cx("dm-select", className)}
        aria-invalid={invalid || undefined}
        {...rest}
      >
        {placeholder != null ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>
      {error != null ? <p className="dm-field__error">{error}</p> : null}
      {error == null && hint != null ? <p className="dm-field__hint">{hint}</p> : null}
    </div>
  );
}
