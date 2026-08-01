"use client";

import { useState, type ReactNode } from "react";
import { Menu } from "lucide-react";
import { cx } from "../utils/cx.js";
import { Button } from "../components/base/Button.js";
import { Drawer } from "../components/compound/Drawer.js";
import { Icon } from "../icon/Icon.js";

export type DashboardLayoutProps = {
  sidebar: ReactNode;
  topbar: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  className?: string;
  /** Accessible label for the mobile nav drawer. */
  mobileNavLabel?: string;
};

/**
 * App chrome: fixed sidebar (desktop) + topbar + content.
 * Mobile: hamburger opens left Drawer with the same sidebar content.
 */
export function DashboardLayout({
  sidebar,
  topbar,
  footer,
  children,
  className,
  mobileNavLabel = "Navigation",
}: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className={cx("dm-layout-dash", className)}>
      <aside className="dm-layout-dash__sidebar" aria-label="Sidebar">
        {sidebar}
      </aside>

      <div className="dm-layout-dash__main">
        <div className="dm-layout-dash__topbar">
          <Button
            variant="ghost"
            size="sm"
            className="dm-layout-dash__menu"
            aria-label="Open navigation"
            onClick={() => setMobileOpen(true)}
          >
            <Icon icon={Menu} size="md" />
          </Button>
          {topbar}
        </div>
        <div className="dm-layout-dash__content">{children}</div>
        {footer != null ? <footer className="dm-layout-dash__footer">{footer}</footer> : null}
      </div>

      <Drawer
        open={mobileOpen}
        side="left"
        title={mobileNavLabel}
        onClose={() => setMobileOpen(false)}
        className="dm-layout-dash__drawer"
      >
        <div onClick={() => setMobileOpen(false)}>{sidebar}</div>
      </Drawer>
    </div>
  );
}
