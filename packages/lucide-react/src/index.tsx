import { createElement, type FC, type SVGProps } from "react";

export type LucideProps = SVGProps<SVGSVGElement> & {
  size?: string | number;
  absoluteStrokeWidth?: boolean;
  strokeWidth?: string | number;
};

export type LucideIcon = FC<LucideProps>;

function createIcon(name: string): LucideIcon {
  const Icon: LucideIcon = ({ size = 24, strokeWidth = 2, className, ...rest }) =>
    createElement(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className,
        "data-lucide": name,
        "aria-hidden": true,
        ...rest,
      },
      createElement("circle", { cx: 12, cy: 12, r: 9 }),
    );
  Icon.displayName = name;
  return Icon;
}

export const Search = createIcon("search");
export const FileText = createIcon("file-text");
export const Sparkles = createIcon("sparkles");
export const Plug = createIcon("plug");
export const Lightbulb = createIcon("lightbulb");
export const AlertTriangle = createIcon("alert-triangle");
export const Menu = createIcon("menu");
export const Bell = createIcon("bell");
export const X = createIcon("x");
export const ChevronDown = createIcon("chevron-down");
export const ChevronRight = createIcon("chevron-right");
export const Home = createIcon("home");
export const Settings = createIcon("settings");
export const Users = createIcon("users");
export const Upload = createIcon("upload");
export const Check = createIcon("check");
export const Plus = createIcon("plus");
export const Filter = createIcon("filter");
export const LayoutDashboard = createIcon("layout-dashboard");
export const Bot = createIcon("bot");
export const FolderOpen = createIcon("folder-open");
export const Shield = createIcon("shield");
export const Mail = createIcon("mail");
export const LogOut = createIcon("log-out");
export const Files = createIcon("files");
export const ScanText = createIcon("scan-text");
export const GitPullRequestApprove = createIcon("git-pull-request-approve");
export const Tags = createIcon("tags");
export const ListOrdered = createIcon("list-ordered");
export const ClipboardCheck = createIcon("clipboard-check");
export const CheckCircle2 = createIcon("check-circle-2");
export const Building2 = createIcon("building-2");
export const Lock = createIcon("lock");
export const Send = createIcon("send");
export const MessageSquare = createIcon("message-square");
export const Eye = createIcon("eye");
export const Inbox = createIcon("inbox");
export const FileSearch = createIcon("file-search");
export const ShieldCheck = createIcon("shield-check");
export const Workflow = createIcon("workflow");
export const Camera = createIcon("camera");
export const Image = createIcon("image");
export const Clock = createIcon("clock");
export const CheckCircle = createIcon("check-circle");
export const XCircle = createIcon("x-circle");
export const Download = createIcon("download");
export const ExternalLink = createIcon("external-link");
export const ArrowRight = createIcon("arrow-right");
export const BookOpen = createIcon("book-open");
export const HelpCircle = createIcon("help-circle");
