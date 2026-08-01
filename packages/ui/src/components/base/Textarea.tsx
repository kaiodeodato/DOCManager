import type { ReactNode, TextareaHTMLAttributes } from "react";
import { cx } from "../../utils/cx.js";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
};

export function Textarea({
  label,
  hint,
  error,
  className,
  id,
  ...rest
}: TextareaProps) {
  const inputId = id ?? (typeof label === "string" ? `dm-textarea-${label}` : undefined);
  const invalid = Boolean(error);
  return (
    <div className="dm-field">
      {label != null ? (
        <label className="dm-field__label" htmlFor={inputId}>
          {label}
        </label>
      ) : null}
      <textarea
        id={inputId}
        className={cx("dm-textarea", className)}
        aria-invalid={invalid || undefined}
        {...rest}
      />
      {error != null ? <p className="dm-field__error">{error}</p> : null}
      {error == null && hint != null ? <p className="dm-field__hint">{hint}</p> : null}
    </div>
  );
}
