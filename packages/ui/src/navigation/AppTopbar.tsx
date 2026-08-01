import type { ReactNode } from "react";
import { cx } from "../utils/cx.js";

export type AppTopbarProps = {
  title?: ReactNode;
  breadcrumbs?: ReactNode;
  search?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

export function AppTopbar({ title, breadcrumbs, search, actions, className }: AppTopbarProps) {
  return (
    <header className={cx("dm-topbar", className)}>
      <div className="dm-topbar__left">
        {breadcrumbs != null ? <div className="dm-topbar__crumbs">{breadcrumbs}</div> : null}
        {title != null ? <h1 className="dm-topbar__title">{title}</h1> : null}
      </div>
      {search != null ? <div className="dm-topbar__search">{search}</div> : null}
      {actions != null ? <div className="dm-topbar__actions">{actions}</div> : null}
    </header>
  );
}
