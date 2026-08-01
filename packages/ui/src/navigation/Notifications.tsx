"use client";

import { useState, type ReactNode } from "react";
import { Bell } from "lucide-react";
import { cx } from "../utils/cx.js";
import { Button } from "../components/base/Button.js";
import { Icon } from "../icon/Icon.js";

export type NotificationItem = {
  id: string;
  title: ReactNode;
  body?: ReactNode;
  time?: ReactNode;
  unread?: boolean;
  href?: string;
};

export type NotificationsProps = {
  items: readonly NotificationItem[];
  unreadCount?: number;
  className?: string;
  onMarkAllRead?: () => void;
};

export function Notifications({
  items,
  unreadCount,
  className,
  onMarkAllRead,
}: NotificationsProps) {
  const [open, setOpen] = useState(false);
  const count = unreadCount ?? items.filter((i) => i.unread).length;

  return (
    <div className={cx("dm-notifications", className)}>
      <Button
        variant="ghost"
        size="sm"
        aria-label={count > 0 ? `Notifications, ${count} unread` : "Notifications"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <Icon icon={Bell} size="md" />
        {count > 0 ? <span className="dm-notifications__dot" aria-hidden /> : null}
      </Button>
      {open ? (
        <div className="dm-notifications__panel" role="dialog" aria-label="Notifications">
          <div className="dm-notifications__head">
            <strong>Notifications</strong>
            {onMarkAllRead != null ? (
              <Button variant="ghost" size="sm" onClick={onMarkAllRead}>
                Mark all read
              </Button>
            ) : null}
          </div>
          <ul className="dm-notifications__list">
            {items.length === 0 ? (
              <li className="dm-notifications__empty">You&apos;re all caught up.</li>
            ) : (
              items.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href ?? "#"}
                    className={cx(
                      "dm-notifications__item",
                      item.unread && "dm-notifications__item--unread",
                    )}
                    onClick={() => setOpen(false)}
                  >
                    <span className="dm-notifications__title">{item.title}</span>
                    {item.body != null ? (
                      <span className="dm-notifications__body">{item.body}</span>
                    ) : null}
                    {item.time != null ? (
                      <span className="dm-notifications__time">{item.time}</span>
                    ) : null}
                  </a>
                </li>
              ))
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
