import type { ReactNode } from "react";
import { cx } from "../utils/cx.js";

export type AuthLayoutProps = {
  brand?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  aside?: ReactNode;
  children?: ReactNode;
  className?: string;
};

/**
 * Centered auth card with optional brand aside panel (desktop).
 * Responsive: single column on mobile; split panel from `lg`.
 */
export function AuthLayout({
  brand,
  title,
  description,
  aside,
  children,
  className,
}: AuthLayoutProps) {
  return (
    <div className={cx("dm-layout-auth", className)}>
      {aside != null ? <aside className="dm-layout-auth__aside">{aside}</aside> : null}
      <div className="dm-layout-auth__panel">
        {brand != null ? <div className="dm-layout-auth__brand">{brand}</div> : null}
        {title != null ? <h1 className="dm-layout-auth__title">{title}</h1> : null}
        {description != null ? <p className="dm-layout-auth__desc">{description}</p> : null}
        <div className="dm-layout-auth__form">{children}</div>
      </div>
    </div>
  );
}
