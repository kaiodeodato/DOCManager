import type { ReactNode } from "react";
import { Card, CardHeader } from "../compound/Card.js";
import { cx } from "../../utils/cx.js";

export type MetricDelta = {
  value: string;
  direction?: "up" | "down" | "flat";
};

export type MetricCardProps = {
  title: ReactNode;
  value: ReactNode;
  description?: ReactNode;
  delta?: MetricDelta;
  className?: string;
};

export function MetricCard({
  title,
  value,
  description,
  delta,
  className,
}: MetricCardProps) {
  return (
    <Card className={className}>
      <CardHeader title={title} description={description} />
      <p className="dm-metric-value">{value}</p>
      {delta != null ? (
        <p
          className={cx(
            "dm-metric-delta",
            `dm-metric-delta--${delta.direction ?? "flat"}`,
          )}
        >
          {delta.value}
        </p>
      ) : null}
    </Card>
  );
}
