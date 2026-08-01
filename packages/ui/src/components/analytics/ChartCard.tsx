import type { ReactNode } from "react";
import { Card, CardHeader } from "../compound/Card.js";

export type ChartCardProps = {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  /** Optional chart slot — defaults to placeholder SVG area. */
  children?: ReactNode;
  className?: string;
};

function ChartPlaceholder() {
  return (
    <div className="dm-chart-slot" aria-hidden>
      <svg width="100%" height="120" viewBox="0 0 320 120" role="img">
        <polyline
          fill="none"
          stroke="var(--dm-color-accent)"
          strokeWidth="3"
          points="0,90 40,70 80,78 120,40 160,55 200,30 240,48 280,20 320,35"
        />
      </svg>
    </div>
  );
}

export function ChartCard({
  title,
  description,
  action,
  children,
  className,
}: ChartCardProps) {
  return (
    <Card className={className}>
      <CardHeader title={title} description={description} action={action} />
      {children ?? <ChartPlaceholder />}
    </Card>
  );
}
