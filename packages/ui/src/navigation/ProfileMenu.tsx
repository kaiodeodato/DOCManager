import type { ReactNode } from "react";
import { cx } from "../utils/cx.js";
import { Avatar } from "../components/base/Avatar.js";
import { Dropdown, type DropdownItem } from "../components/compound/Dropdown.js";

export type ProfileMenuProps = {
  name: string;
  email?: string;
  avatarUrl?: string;
  items: readonly DropdownItem[];
  className?: string;
  triggerExtra?: ReactNode;
};

export function ProfileMenu({
  name,
  email,
  avatarUrl,
  items,
  className,
  triggerExtra,
}: ProfileMenuProps) {
  return (
    <div className={cx("dm-profile-menu", className)}>
      <Dropdown
        label={
          <span className="dm-profile-menu__trigger">
            <Avatar
              {...(avatarUrl != null ? { src: avatarUrl } : {})}
              size="sm"
              alt={name}
              fallback={name
                .split(/\s+/)
                .slice(0, 2)
                .map((p) => p[0]?.toUpperCase() ?? "")
                .join("")}
            />
            <span className="dm-profile-menu__meta">
              <span className="dm-profile-menu__name">{name}</span>
              {email != null ? <span className="dm-profile-menu__email">{email}</span> : null}
            </span>
            {triggerExtra}
          </span>
        }
        items={items}
      />
    </div>
  );
}
