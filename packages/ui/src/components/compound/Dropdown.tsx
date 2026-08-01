import type { DetailsHTMLAttributes, ReactNode } from "react";
import { cx } from "../../utils/cx.js";

export type DropdownItem = {
  id: string;
  label: ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
};

export type DropdownProps = DetailsHTMLAttributes<HTMLDetailsElement> & {
  label: ReactNode;
  items: readonly DropdownItem[];
};

export function Dropdown({ label, items, className, ...rest }: DropdownProps) {
  return (
    <details className={cx("dm-dropdown", className)} {...rest}>
      <summary className={cx("dm-btn", "dm-btn--outline", "dm-btn--sm")}>{label}</summary>
      <div className="dm-dropdown__menu" role="menu">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            role="menuitem"
            className="dm-dropdown__item"
            disabled={item.disabled}
            onClick={item.onSelect}
          >
            {item.label}
          </button>
        ))}
      </div>
    </details>
  );
}
