import type { ReactNode } from "react";
import { FileText } from "lucide-react";
import { Card, CardHeader } from "../compound/Card.js";
import { Badge, type BadgeVariant } from "../base/Badge.js";
import { Icon } from "../../icon/Icon.js";

export type DocumentCardProps = {
  title: ReactNode;
  meta?: ReactNode;
  status?: ReactNode;
  statusVariant?: BadgeVariant;
  action?: ReactNode;
  className?: string;
};

export function DocumentCard({
  title,
  meta,
  status,
  statusVariant = "neutral",
  action,
  className,
}: DocumentCardProps) {
  return (
    <Card className={className}>
      <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
        <Icon icon={FileText} size="lg" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <CardHeader
            title={title}
            description={meta}
            action={
              status != null ? <Badge variant={statusVariant}>{status}</Badge> : action
            }
          />
          {action != null && status != null ? (
            <div className="dm-card__footer">{action}</div>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
