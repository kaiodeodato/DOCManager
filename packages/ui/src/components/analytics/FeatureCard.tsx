import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Sparkles } from "lucide-react";
import { Card, CardHeader } from "../compound/Card.js";
import { Icon } from "../../icon/Icon.js";
import { Button } from "../base/Button.js";

export type FeatureCardProps = {
  title: ReactNode;
  description?: ReactNode;
  icon?: LucideIcon;
  ctaLabel?: ReactNode;
  onCtaClick?: () => void;
  className?: string;
};

export function FeatureCard({
  title,
  description,
  icon = Sparkles,
  ctaLabel,
  onCtaClick,
  className,
}: FeatureCardProps) {
  return (
    <Card className={className}>
      <Icon icon={icon} size="lg" />
      <CardHeader title={title} description={description} />
      {ctaLabel != null ? (
        <div className="dm-card__footer">
          <Button
            variant="secondary"
            size="sm"
            {...(onCtaClick != null ? { onClick: onCtaClick } : {})}
          >
            {ctaLabel}
          </Button>
        </div>
      ) : null}
    </Card>
  );
}
