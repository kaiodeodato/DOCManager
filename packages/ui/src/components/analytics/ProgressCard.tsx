import type { ReactNode } from "react";
import { Card, CardHeader } from "../compound/Card.js";
import { Progress } from "../base/Progress.js";

export type ProgressCardProps = {
  title: ReactNode;
  description?: ReactNode;
  value: number;
  max?: number;
  footer?: ReactNode;
  className?: string;
};

export function ProgressCard({
  title,
  description,
  value,
  max = 100,
  footer,
  className,
}: ProgressCardProps) {
  return (
    <Card className={className}>
      <CardHeader title={title} description={description} />
      <Progress value={value} max={max} label={typeof title === "string" ? title : "Progress"} />
      {footer != null ? <div className="dm-card__footer">{footer}</div> : null}
    </Card>
  );
}
