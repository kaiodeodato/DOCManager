import type { ReactNode } from "react";
import { cx } from "../utils/cx.js";
import { Icon } from "../icon/Icon.js";
import type { NavSection } from "./types.js";

export type AppSidebarProps = {
  brand?: ReactNode;
  sections: readonly NavSection[];
  footer?: ReactNode;
  className?: string;
};

export function AppSidebar({ brand, sections, footer, className }: AppSidebarProps) {
  return (
    <div className={cx("dm-sidebar", className)}>
      {brand != null ? <div className="dm-sidebar__brand">{brand}</div> : null}
      <nav className="dm-sidebar__nav" aria-label="App">
        {sections.map((section) => (
          <div key={section.id} className="dm-sidebar__section">
            {section.label != null ? (
              <p className="dm-sidebar__section-label">{section.label}</p>
            ) : null}
            <ul className="dm-sidebar__list">
              {section.items.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    className={cx("dm-sidebar__link", item.active && "dm-sidebar__link--active")}
                    aria-current={item.active ? "page" : undefined}
                  >
                    {item.icon != null ? <Icon icon={item.icon} size="sm" /> : null}
                    <span className="dm-sidebar__label">{item.label}</span>
                    {item.badge != null ? <span className="dm-sidebar__badge">{item.badge}</span> : null}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      {footer != null ? <div className="dm-sidebar__footer">{footer}</div> : null}
    </div>
  );
}
