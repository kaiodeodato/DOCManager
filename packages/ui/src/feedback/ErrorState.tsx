import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { cx } from "../utils/cx.js";
import { Icon } from "../icon/Icon.js";
import { Button } from "../components/base/Button.js";
import { Alert } from "../components/compound/Alert.js";

export type ErrorStateProps = {
  title?: ReactNode;
  description?: ReactNode;
  actionLabel?: ReactNode;
  onAction?: () => void;
  className?: string;
  /** Compact inline alert instead of full-page block. */
  inline?: boolean;
};

export function ErrorState({
  title = "Something went wrong",
  description = "Please try again. If the problem continues, contact support.",
  actionLabel = "Retry",
  onAction,
  className,
  inline = false,
}: ErrorStateProps) {
  if (inline) {
    return (
      <Alert variant="danger" className={className} title={title}>
        {description}
      </Alert>
    );
  }

  return (
    <div className={cx("dm-error-state", className)} role="alert">
      <div className="dm-error-state__icon" aria-hidden>
        <Icon icon={AlertTriangle} size="lg" />
      </div>
      <h2 className="dm-error-state__title">{title}</h2>
      {description != null ? <p className="dm-error-state__desc">{description}</p> : null}
      {onAction != null ? (
        <Button variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
