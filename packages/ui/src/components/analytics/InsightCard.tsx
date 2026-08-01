import type { ReactNode } from "react";
import { Lightbulb } from "lucide-react";
import { Card, CardHeader } from "../compound/Card.js";
import { Icon } from "../../icon/Icon.js";

export type InsightCardProps = {
  title: ReactNode;
  insight: ReactNode;
  source?: ReactNode;
  className?: string;
};

export function InsightCard({
  title,
  insight,
  source,
  className,
}: InsightCardProps) {
  return (
    <Card className={className}>
      <Icon icon={Lightbulb} />
      <CardHeader title={title} description={source} />
      <p className="dm-card__description" style={{ color: "var(--dm-color-foreground)" }}>
        {insight}
      </p>
    </Card>
  );
}
