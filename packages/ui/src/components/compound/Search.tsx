import type { InputHTMLAttributes, ReactNode } from "react";
import { Search as SearchIcon } from "lucide-react";
import { cx } from "../../utils/cx.js";
import { Icon } from "../../icon/Icon.js";

export type SearchProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  shortcutHint?: ReactNode;
};

export function Search({
  shortcutHint,
  className,
  placeholder = "Search…",
  ...rest
}: SearchProps) {
  return (
    <div className={cx("dm-search", className)}>
      <Icon icon={SearchIcon} size="sm" />
      <input type="search" placeholder={placeholder} {...rest} />
      {shortcutHint != null ? (
        <kbd className="dm-search__hint">{shortcutHint}</kbd>
      ) : null}
    </div>
  );
}
