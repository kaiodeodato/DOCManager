import type { ReactNode } from "react";
import { cx } from "../utils/cx.js";

export type TimelineItem = {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  time?: ReactNode;
  status?: "done" | "current" | "upcoming";
};

export type TimelineProps = {
  items: readonly TimelineItem[];
  className?: string;
};

export function Timeline({ items, className }: TimelineProps) {
  return (
    <ol className={cx("dm-timeline", className)}>
      {items.map((item) => (
        <li
          key={item.id}
          className={cx("dm-timeline__item", item.status && `dm-timeline__item--${item.status}`)}
        >
          <span className="dm-timeline__dot" aria-hidden />
          <div className="dm-timeline__body">
            <div className="dm-timeline__head">
              <span className="dm-timeline__title">{item.title}</span>
              {item.time != null ? <span className="dm-timeline__time">{item.time}</span> : null}
            </div>
            {item.description != null ? (
              <p className="dm-timeline__desc">{item.description}</p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
