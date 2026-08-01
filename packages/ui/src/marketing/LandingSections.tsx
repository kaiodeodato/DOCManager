import type { ReactNode } from "react";
import { cx } from "../utils/cx.js";
import { Button } from "../components/base/Button.js";

export type LandingHeroProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  primaryCta?: ReactNode;
  secondaryCta?: ReactNode;
  onPrimary?: () => void;
  onSecondary?: () => void;
  visual?: ReactNode;
  className?: string;
};

export function LandingHero({
  eyebrow = "DOC Manager",
  title,
  description,
  primaryCta = "Start free trial",
  secondaryCta = "Book a demo",
  onPrimary,
  onSecondary,
  visual,
  className,
}: LandingHeroProps) {
  return (
    <section className={cx("dm-landing-hero", "dm-fade-in", className)}>
      <div className="dm-landing-hero__copy">
        {eyebrow != null ? <p className="dm-landing-hero__eyebrow">{eyebrow}</p> : null}
        <h1 className="dm-landing-hero__title">{title}</h1>
        {description != null ? <p className="dm-landing-hero__desc">{description}</p> : null}
        <div className="dm-landing-hero__cta">
          <Button variant="primary" size="lg" onClick={onPrimary}>
            {primaryCta}
          </Button>
          <Button variant="outline" size="lg" onClick={onSecondary}>
            {secondaryCta}
          </Button>
        </div>
      </div>
      {visual != null ? <div className="dm-landing-hero__visual dm-hover-lift">{visual}</div> : null}
    </section>
  );
}

export type LandingTrustProps = {
  title?: ReactNode;
  logos: readonly ReactNode[];
  className?: string;
};

export function LandingTrust({ title = "Trusted by operations teams", logos, className }: LandingTrustProps) {
  return (
    <section className={cx("dm-landing-section", "dm-fade-in", className)}>
      <p className="dm-landing-section__eyebrow">{title}</p>
      <ul className="dm-landing-trust">
        {logos.map((logo, i) => (
          <li key={i} className="dm-landing-trust__item">
            {logo}
          </li>
        ))}
      </ul>
    </section>
  );
}

export type LandingStat = { value: ReactNode; label: ReactNode };

export type LandingStatsProps = {
  stats: readonly LandingStat[];
  className?: string;
};

export function LandingStats({ stats, className }: LandingStatsProps) {
  return (
    <section className={cx("dm-landing-section", "dm-fade-in", className)}>
      <ul className="dm-landing-stats">
        {stats.map((stat, i) => (
          <li key={i} className="dm-landing-stats__item dm-hover-lift">
            <p className="dm-landing-stats__value dm-counter">{stat.value}</p>
            <p className="dm-landing-stats__label">{stat.label}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export type LandingCardItem = {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
};

export type LandingCardsSectionProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  items: readonly LandingCardItem[];
  className?: string;
};

export function LandingCardsSection({
  eyebrow,
  title,
  description,
  items,
  className,
}: LandingCardsSectionProps) {
  return (
    <section className={cx("dm-landing-section", "dm-fade-in", className)}>
      {eyebrow != null ? <p className="dm-landing-section__eyebrow">{eyebrow}</p> : null}
      <h2 className="dm-landing-section__title">{title}</h2>
      {description != null ? <p className="dm-landing-section__desc">{description}</p> : null}
      <ul className="dm-landing-grid">
        {items.map((item) => (
          <li key={item.id} className="dm-landing-card dm-hover-lift">
            {item.icon != null ? <div className="dm-landing-card__icon">{item.icon}</div> : null}
            <h3 className="dm-landing-card__title">{item.title}</h3>
            {item.description != null ? (
              <p className="dm-landing-card__desc">{item.description}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

export type LandingWorkflowStep = {
  id: string;
  title: ReactNode;
  description?: ReactNode;
};

export type LandingWorkflowProps = {
  title?: ReactNode;
  steps: readonly LandingWorkflowStep[];
  className?: string;
};

export function LandingWorkflow({
  title = "From upload to archive in minutes",
  steps,
  className,
}: LandingWorkflowProps) {
  return (
    <section className={cx("dm-landing-section", "dm-fade-in", className)}>
      <h2 className="dm-landing-section__title">{title}</h2>
      <ol className="dm-landing-workflow">
        {steps.map((step, index) => (
          <li key={step.id} className="dm-landing-workflow__step">
            <span className="dm-landing-workflow__num" aria-hidden>
              {index + 1}
            </span>
            <div>
              <h3 className="dm-landing-card__title">{step.title}</h3>
              {step.description != null ? (
                <p className="dm-landing-card__desc">{step.description}</p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export type LandingPricingTier = {
  id: string;
  name: ReactNode;
  price: ReactNode;
  description?: ReactNode;
  features: readonly ReactNode[];
  highlighted?: boolean;
  cta?: ReactNode;
  onCta?: () => void;
};

export type LandingPricingProps = {
  title?: ReactNode;
  tiers: readonly LandingPricingTier[];
  className?: string;
};

export function LandingPricing({
  title = "Simple pricing for every team",
  tiers,
  className,
}: LandingPricingProps) {
  return (
    <section className={cx("dm-landing-section", "dm-fade-in", className)} id="pricing">
      <h2 className="dm-landing-section__title">{title}</h2>
      <ul className="dm-landing-pricing">
        {tiers.map((tier) => (
          <li
            key={tier.id}
            className={cx(
              "dm-landing-pricing__tier",
              "dm-hover-lift",
              tier.highlighted && "dm-landing-pricing__tier--featured",
            )}
          >
            <h3 className="dm-landing-card__title">{tier.name}</h3>
            <p className="dm-landing-pricing__price">{tier.price}</p>
            {tier.description != null ? (
              <p className="dm-landing-card__desc">{tier.description}</p>
            ) : null}
            <ul className="dm-landing-pricing__features">
              {tier.features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
            <Button
              variant={tier.highlighted ? "primary" : "outline"}
              onClick={tier.onCta}
            >
              {tier.cta ?? "Get started"}
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export type LandingFaqItem = { id: string; question: ReactNode; answer: ReactNode };

export type LandingFaqProps = {
  title?: ReactNode;
  items: readonly LandingFaqItem[];
  className?: string;
};

export function LandingFaq({ title = "FAQ", items, className }: LandingFaqProps) {
  return (
    <section className={cx("dm-landing-section", "dm-fade-in", className)} id="faq">
      <h2 className="dm-landing-section__title">{title}</h2>
      <div className="dm-landing-faq">
        {items.map((item) => (
          <details key={item.id} className="dm-landing-faq__item">
            <summary>{item.question}</summary>
            <div className="dm-landing-faq__answer">{item.answer}</div>
          </details>
        ))}
      </div>
    </section>
  );
}

export type LandingFinalCtaProps = {
  title: ReactNode;
  description?: ReactNode;
  cta?: ReactNode;
  onCta?: () => void;
  className?: string;
};

export function LandingFinalCta({
  title,
  description,
  cta = "Start with DOC Manager",
  onCta,
  className,
}: LandingFinalCtaProps) {
  return (
    <section className={cx("dm-landing-final", "dm-fade-in", className)}>
      <h2 className="dm-landing-final__title">{title}</h2>
      {description != null ? <p className="dm-landing-final__desc">{description}</p> : null}
      <Button variant="primary" size="lg" onClick={onCta}>
        {cta}
      </Button>
    </section>
  );
}
