import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../../utils/cx.js";

export type AccordionItem = {
  id: string;
  title: ReactNode;
  content: ReactNode;
  defaultOpen?: boolean;
};

export type AccordionProps = HTMLAttributes<HTMLDivElement> & {
  items: readonly AccordionItem[];
};

export function Accordion({ items, className, ...rest }: AccordionProps) {
  return (
    <div className={cx("dm-accordion", className)} {...rest}>
      {items.map((item) => (
        <details key={item.id} open={item.defaultOpen}>
          <summary>
            <span>{item.title}</span>
            <span aria-hidden>+</span>
          </summary>
          <div className="dm-accordion__body">{item.content}</div>
        </details>
      ))}
    </div>
  );
}
