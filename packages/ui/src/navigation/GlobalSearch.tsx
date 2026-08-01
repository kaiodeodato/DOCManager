"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { Search as SearchIcon } from "lucide-react";
import { cx } from "../utils/cx.js";
import { Icon } from "../icon/Icon.js";
import { Search } from "../components/compound/Search.js";

export type GlobalSearchResult = {
  id: string;
  label: ReactNode;
  href?: string;
  group?: string;
  onSelect?: () => void;
};

export type GlobalSearchProps = {
  placeholder?: string;
  results?: readonly GlobalSearchResult[];
  onQueryChange?: (query: string) => void;
  className?: string;
  /** Keyboard shortcut hint (default ⌘K). */
  shortcutHint?: ReactNode;
};

/**
 * Global search field that opens a results popover. Listens for Cmd/Ctrl+K.
 */
export function GlobalSearch({
  placeholder = "Search documents, people, settings…",
  results = [],
  onQueryChange,
  className,
  shortcutHint = "⌘K",
}: GlobalSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const listId = useId();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className={cx("dm-global-search", className)}>
      <Search
        placeholder={placeholder}
        shortcutHint={shortcutHint}
        value={query}
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          const next = e.target.value;
          setQuery(next);
          setOpen(true);
          onQueryChange?.(next);
        }}
      />
      {open && results.length > 0 ? (
        <ul id={listId} className="dm-global-search__results" role="listbox">
          {results.map((result) => (
            <li key={result.id} role="option">
              <a
                href={result.href ?? "#"}
                className="dm-global-search__item"
                onClick={() => {
                  result.onSelect?.();
                  setOpen(false);
                }}
              >
                <Icon icon={SearchIcon} size="sm" />
                <span>
                  {result.group != null ? (
                    <span className="dm-global-search__group">{result.group} · </span>
                  ) : null}
                  {result.label}
                </span>
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
