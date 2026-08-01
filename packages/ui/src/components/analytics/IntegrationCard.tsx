import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Plug } from "lucide-react";
import { Card, CardHeader } from "../compound/Card.js";
import { Badge, type BadgeVariant } from "../base/Badge.js";
import { Icon } from "../../icon/Icon.js";

export type IntegrationCardProps = {
  title: ReactNode;
  description?: ReactNode;
  icon?: LucideIcon;
  connected?: boolean;
  statusLabel?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function IntegrationCard({
  title,
  description,
  icon = Plug,
  connected = false,
  statusLabel,
  action,
  className,
}: IntegrationCardProps) {
  const variant: BadgeVariant = connected ? "success" : "neutral";
  const label = statusLabel ?? (connected ? "Connected" : "Available");
  return (
    <Card className={className}>
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
        <Icon icon={icon} />
        <Badge variant={variant}>{label}</Badge>
      </div>
      <CardHeader title={title} description={description} />
      {action != null ? <div className="dm-card__footer">{action}</div> : null}
    </Card>
  );
}
