import type { HTMLAttributes, ReactNode } from "react";

export type BreadcrumbItem = {
  id: string;
  label: ReactNode;
  href?: string;
};

export type BreadcrumbProps = HTMLAttributes<HTMLElement> & {
  items: readonly BreadcrumbItem[];
};

export function Breadcrumb({ items, className, ...rest }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={className} {...rest}>
      <ol className="dm-breadcrumb">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={item.id} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
              {index > 0 ? <span className="dm-breadcrumb__sep" aria-hidden>/</span> : null}
              {last || item.href == null ? (
                <span aria-current={last ? "page" : undefined}>{item.label}</span>
              ) : (
                <a href={item.href}>{item.label}</a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
