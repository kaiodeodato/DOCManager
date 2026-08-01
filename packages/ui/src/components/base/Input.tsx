import type { InputHTMLAttributes, ReactNode } from "react";
import { cx } from "../../utils/cx.js";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
};

export function Input({
  label,
  hint,
  error,
  className,
  id,
  ...rest
}: InputProps) {
  const inputId = id ?? (typeof label === "string" ? `dm-input-${label}` : undefined);
  const invalid = Boolean(error);
  return (
    <div className="dm-field">
      {label != null ? (
        <label className="dm-field__label" htmlFor={inputId}>
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        className={cx("dm-input", className)}
        aria-invalid={invalid || undefined}
        {...rest}
      />
      {error != null ? <p className="dm-field__error">{error}</p> : null}
      {error == null && hint != null ? <p className="dm-field__hint">{hint}</p> : null}
    </div>
  );
}
