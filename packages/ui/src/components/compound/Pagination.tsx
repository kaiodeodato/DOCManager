import type { HTMLAttributes } from "react";
import { cx } from "../../utils/cx.js";

export type PaginationProps = HTMLAttributes<HTMLElement> & {
  page: number;
  pageCount: number;
  onPageChange?: (page: number) => void;
};

export function Pagination({
  page,
  pageCount,
  onPageChange,
  className,
  ...rest
}: PaginationProps) {
  const pages = Array.from({ length: Math.max(pageCount, 0) }, (_, i) => i + 1);
  return (
    <nav aria-label="Pagination" className={cx("dm-pagination", className)} {...rest}>
      <button
        type="button"
        className="dm-pagination__page"
        disabled={page <= 1}
        aria-label="Previous page"
        onClick={() => onPageChange?.(page - 1)}
      >
        ‹
      </button>
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          className="dm-pagination__page"
          aria-current={p === page ? "page" : undefined}
          onClick={() => onPageChange?.(p)}
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        className="dm-pagination__page"
        disabled={page >= pageCount}
        aria-label="Next page"
        onClick={() => onPageChange?.(page + 1)}
      >
        ›
      </button>
    </nav>
  );
}
