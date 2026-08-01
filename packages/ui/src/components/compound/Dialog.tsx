"use client";

import {
  useEffect,
  useId,
  useRef,
  type DialogHTMLAttributes,
  type ReactNode,
} from "react";
import { cx } from "../../utils/cx.js";
import { Button } from "../base/Button.js";

export type DialogProps = Omit<DialogHTMLAttributes<HTMLDialogElement>, "title"> & {
  open?: boolean;
  title: ReactNode;
  children?: ReactNode;
  onClose?: () => void;
};

export function Dialog({
  open = false,
  title,
  children,
  onClose,
  className,
  ...rest
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (open && !node.open) node.showModal();
    if (!open && node.open) node.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={cx("dm-dialog", className)}
      aria-labelledby={titleId}
      onClose={onClose}
      {...rest}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
        <h2 id={titleId} className="dm-dialog__title">
          {title}
        </h2>
        {onClose != null ? (
          <Button variant="ghost" size="sm" aria-label="Close" onClick={onClose}>
            ×
          </Button>
        ) : null}
      </div>
      <div className="dm-dialog__body">{children}</div>
    </dialog>
  );
}
