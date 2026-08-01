import type { ReactNode } from "react";
import { Card, CardHeader } from "../compound/Card.js";
import type { MetricDelta } from "./MetricCard.js";
import { cx } from "../../utils/cx.js";

export type AnalyticsCardProps = {
  title: ReactNode;
  description?: ReactNode;
  metrics?: readonly {
    id: string;
    label: ReactNode;
    value: ReactNode;
    delta?: MetricDelta;
  }[];
  chart?: ReactNode;
  className?: string;
};

export function AnalyticsCard({
  title,
  description,
  metrics,
  chart,
  className,
}: AnalyticsCardProps) {
  return (
    <Card className={className}>
      <CardHeader title={title} description={description} />
      {metrics != null && metrics.length > 0 ? (
        <div
          style={{
            display: "grid",
            gap: "0.75rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(8rem, 1fr))",
            marginBottom: chart != null ? "1rem" : undefined,
          }}
        >
          {metrics.map((m) => (
            <div key={m.id}>
              <p className="dm-card__description">{m.label}</p>
              <p className="dm-metric-value" style={{ fontSize: "var(--dm-text-xl)" }}>
                {m.value}
              </p>
              {m.delta != null ? (
                <p
                  className={cx(
                    "dm-metric-delta",
                    `dm-metric-delta--${m.delta.direction ?? "flat"}`,
                  )}
                >
                  {m.delta.value}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
      {chart}
    </Card>
  );
}
