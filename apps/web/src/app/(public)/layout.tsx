import type { ReactNode } from "react";
import { MarketingChrome } from "@/components/MarketingChrome";

export default function PublicRouteLayout({ children }: { children: ReactNode }) {
  return <MarketingChrome>{children}</MarketingChrome>;
}
