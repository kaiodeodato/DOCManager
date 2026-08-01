import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../../utils/cx.js";

export type CardProps = HTMLAttributes<HTMLElement> & {
  children?: ReactNode;
};

export function Card({ className, children, ...rest }: CardProps) {
  return (
    <section className={cx("dm-card", className)} {...rest}>
      {children}
    </section>
  );
}

export type CardHeaderProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
};

export function CardHeader({
  title,
  description,
  action,
  className,
  ...rest
}: CardHeaderProps) {
  return (
    <div className={cx("dm-card__header", className)} {...rest}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
        <div>
          <h3 className="dm-card__title">{title}</h3>
          {description != null ? (
            <p className="dm-card__description">{description}</p>
          ) : null}
        </div>
        {action}
      </div>
    </div>
  );
}

export type CardFooterProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

export function CardFooter({ className, children, ...rest }: CardFooterProps) {
  return (
    <div className={cx("dm-card__footer", className)} {...rest}>
      {children}
    </div>
  );
}
