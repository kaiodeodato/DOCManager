"use client";

import { useId, useState, type HTMLAttributes, type ReactNode } from "react";
import { cx } from "../../utils/cx.js";

export type TabItem = {
  id: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
};

export type TabsProps = HTMLAttributes<HTMLDivElement> & {
  items: readonly TabItem[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (id: string) => void;
};

export function Tabs({
  items,
  defaultValue,
  value,
  onValueChange,
  className,
  ...rest
}: TabsProps) {
  const baseId = useId();
  const first = items[0]?.id ?? "";
  const [internal, setInternal] = useState(defaultValue ?? first);
  const active = value ?? internal;

  function select(id: string) {
    if (value == null) setInternal(id);
    onValueChange?.(id);
  }

  const activeItem = items.find((item) => item.id === active) ?? items[0];

  return (
    <div className={cx("dm-tabs", className)} {...rest}>
      <div className="dm-tabs__list" role="tablist">
        {items.map((item) => {
          const selected = item.id === active;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`${baseId}-${item.id}`}
              className="dm-tabs__tab"
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              disabled={item.disabled}
              onClick={() => select(item.id)}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {activeItem != null ? (
        <div
          role="tabpanel"
          id={`${baseId}-panel-${activeItem.id}`}
          aria-labelledby={`${baseId}-${activeItem.id}`}
        >
          {activeItem.content}
        </div>
      ) : null}
    </div>
  );
}
