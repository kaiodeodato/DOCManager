import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cx } from "../utils/cx.js";
import { Icon } from "../icon/Icon.js";
import { Button } from "../components/base/Button.js";

export type EmptyStateProps = {
  icon?: LucideIcon;
  title: ReactNode;
  description?: ReactNode;
  actionLabel?: ReactNode;
  onAction?: () => void;
  className?: string;
};

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div className={cx("dm-empty", className)} role="status">
      {icon != null ? (
        <div className="dm-empty__icon" aria-hidden>
          <Icon icon={icon} size="lg" />
        </div>
      ) : null}
      <h2 className="dm-empty__title">{title}</h2>
      {description != null ? <p className="dm-empty__desc">{description}</p> : null}
      {actionLabel != null && onAction != null ? (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
