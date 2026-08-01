import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export type NavItem = {
  id: string;
  label: string;
  href: string;
  icon?: LucideIcon;
  badge?: ReactNode;
  active?: boolean;
};

export type NavSection = {
  id: string;
  label?: string;
  items: readonly NavItem[];
};
