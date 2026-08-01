import type { ReactNode } from "react";
import { cx } from "../utils/cx.js";

export type PublicLayoutProps = {
  brand?: ReactNode;
  nav?: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  className?: string;
};

/**
 * Marketing shell — header + main + footer. Used by Landing/Blog/Pricing.
 * Responsive: stacks nav under brand below `md`.
 */
export function PublicLayout({
  brand,
  nav,
  actions,
  footer,
  children,
  className,
}: PublicLayoutProps) {
  return (
    <div className={cx("dm-layout-public", className)}>
      <header className="dm-layout-public__header">
        <div className="dm-layout-public__brand">{brand}</div>
        {nav != null ? <nav className="dm-layout-public__nav" aria-label="Primary">{nav}</nav> : null}
        {actions != null ? <div className="dm-layout-public__actions">{actions}</div> : null}
      </header>
      <main className="dm-layout-public__main">{children}</main>
      {footer != null ? <footer className="dm-layout-public__footer">{footer}</footer> : null}
    </div>
  );
}
