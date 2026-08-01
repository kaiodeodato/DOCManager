/**
 * Design-system package for DOC Manager.
 */
export const PACKAGE_NAME = "@ac/ui" as const;

export { TOKEN_SWATCHES, brand, tokens } from "./tokens.js";
export type { TokenCategory, TokenSwatch } from "./tokens.js";

export { cx } from "./utils/cx.js";

export { Icon } from "./icon/Icon.js";
export type { IconProps, IconSize } from "./icon/Icon.js";

export { Button } from "./components/base/Button.js";
export type { ButtonProps, ButtonSize, ButtonVariant } from "./components/base/Button.js";
export { Input } from "./components/base/Input.js";
export type { InputProps } from "./components/base/Input.js";
export { Textarea } from "./components/base/Textarea.js";
export type { TextareaProps } from "./components/base/Textarea.js";
export { Select } from "./components/base/Select.js";
export type { SelectOption, SelectProps } from "./components/base/Select.js";
export { Checkbox } from "./components/base/Checkbox.js";
export type { CheckboxProps } from "./components/base/Checkbox.js";
export { Radio } from "./components/base/Radio.js";
export type { RadioProps } from "./components/base/Radio.js";
export { Switch } from "./components/base/Switch.js";
export type { SwitchProps } from "./components/base/Switch.js";
export { Badge } from "./components/base/Badge.js";
export type { BadgeProps, BadgeVariant } from "./components/base/Badge.js";
export { Avatar } from "./components/base/Avatar.js";
export type { AvatarProps, AvatarSize } from "./components/base/Avatar.js";
export { Tooltip } from "./components/base/Tooltip.js";
export type { TooltipProps } from "./components/base/Tooltip.js";
export { Divider } from "./components/base/Divider.js";
export type { DividerProps } from "./components/base/Divider.js";
export { Skeleton } from "./components/base/Skeleton.js";
export type { SkeletonProps } from "./components/base/Skeleton.js";
export { Spinner } from "./components/base/Spinner.js";
export type { SpinnerProps } from "./components/base/Spinner.js";
export { Progress } from "./components/base/Progress.js";
export type { ProgressProps } from "./components/base/Progress.js";

export { Card, CardFooter, CardHeader } from "./components/compound/Card.js";
export type { CardFooterProps, CardHeaderProps, CardProps } from "./components/compound/Card.js";
export { Dialog } from "./components/compound/Dialog.js";
export type { DialogProps } from "./components/compound/Dialog.js";
export { Drawer } from "./components/compound/Drawer.js";
export type { DrawerProps, DrawerSide } from "./components/compound/Drawer.js";
export { Tabs } from "./components/compound/Tabs.js";
export type { TabItem, TabsProps } from "./components/compound/Tabs.js";
export { Accordion } from "./components/compound/Accordion.js";
export type { AccordionItem, AccordionProps } from "./components/compound/Accordion.js";
export { Dropdown } from "./components/compound/Dropdown.js";
export type { DropdownItem, DropdownProps } from "./components/compound/Dropdown.js";
export { Popover } from "./components/compound/Popover.js";
export type { PopoverProps } from "./components/compound/Popover.js";
export { Alert } from "./components/compound/Alert.js";
export type { AlertProps, AlertVariant } from "./components/compound/Alert.js";
export { Toast, ToastViewport } from "./components/compound/Toast.js";
export type { ToastProps, ToastViewportProps } from "./components/compound/Toast.js";
export { Breadcrumb } from "./components/compound/Breadcrumb.js";
export type { BreadcrumbItem, BreadcrumbProps } from "./components/compound/Breadcrumb.js";
export { Pagination } from "./components/compound/Pagination.js";
export type { PaginationProps } from "./components/compound/Pagination.js";
export {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "./components/compound/Table.js";
export type { TableProps } from "./components/compound/Table.js";
export { Search } from "./components/compound/Search.js";
export type { SearchProps } from "./components/compound/Search.js";
export { DatePicker } from "./components/compound/DatePicker.js";
export type { DatePickerProps } from "./components/compound/DatePicker.js";
export { UploadDropzone } from "./components/compound/UploadDropzone.js";
export type { UploadDropzoneProps } from "./components/compound/UploadDropzone.js";

export { AnalyticsCard } from "./components/analytics/AnalyticsCard.js";
export type { AnalyticsCardProps } from "./components/analytics/AnalyticsCard.js";
export { MetricCard } from "./components/analytics/MetricCard.js";
export type { MetricCardProps, MetricDelta } from "./components/analytics/MetricCard.js";
export { ChartCard } from "./components/analytics/ChartCard.js";
export type { ChartCardProps } from "./components/analytics/ChartCard.js";
export { ProgressCard } from "./components/analytics/ProgressCard.js";
export type { ProgressCardProps } from "./components/analytics/ProgressCard.js";
export { InsightCard } from "./components/analytics/InsightCard.js";
export type { InsightCardProps } from "./components/analytics/InsightCard.js";
export { FeatureCard } from "./components/analytics/FeatureCard.js";
export type { FeatureCardProps } from "./components/analytics/FeatureCard.js";
export { IntegrationCard } from "./components/analytics/IntegrationCard.js";
export type { IntegrationCardProps } from "./components/analytics/IntegrationCard.js";
export { DocumentCard } from "./components/analytics/DocumentCard.js";
export type { DocumentCardProps } from "./components/analytics/DocumentCard.js";

export { PublicLayout } from "./layouts/PublicLayout.js";
export type { PublicLayoutProps } from "./layouts/PublicLayout.js";
export { AuthLayout } from "./layouts/AuthLayout.js";
export type { AuthLayoutProps } from "./layouts/AuthLayout.js";
export { DashboardLayout } from "./layouts/DashboardLayout.js";
export type { DashboardLayoutProps } from "./layouts/DashboardLayout.js";

export { AppSidebar } from "./navigation/AppSidebar.js";
export type { AppSidebarProps } from "./navigation/AppSidebar.js";
export { AppTopbar } from "./navigation/AppTopbar.js";
export type { AppTopbarProps } from "./navigation/AppTopbar.js";
export { GlobalSearch } from "./navigation/GlobalSearch.js";
export type { GlobalSearchProps, GlobalSearchResult } from "./navigation/GlobalSearch.js";
export { Notifications } from "./navigation/Notifications.js";
export type { NotificationItem, NotificationsProps } from "./navigation/Notifications.js";
export { ProfileMenu } from "./navigation/ProfileMenu.js";
export type { ProfileMenuProps } from "./navigation/ProfileMenu.js";
export type { NavItem, NavSection } from "./navigation/types.js";

export {
  LandingCardsSection,
  LandingFaq,
  LandingFinalCta,
  LandingHero,
  LandingPricing,
  LandingStats,
  LandingTrust,
  LandingWorkflow,
} from "./marketing/LandingSections.js";
export type {
  LandingCardItem,
  LandingCardsSectionProps,
  LandingFaqItem,
  LandingFaqProps,
  LandingFinalCtaProps,
  LandingHeroProps,
  LandingPricingProps,
  LandingPricingTier,
  LandingStat,
  LandingStatsProps,
  LandingTrustProps,
  LandingWorkflowProps,
  LandingWorkflowStep,
} from "./marketing/LandingSections.js";

export { StatusBadge } from "./workflow/StatusBadge.js";
export type { StatusBadgeProps, WorkflowStatus } from "./workflow/StatusBadge.js";
export { Timeline } from "./workflow/Timeline.js";
export type { TimelineItem, TimelineProps } from "./workflow/Timeline.js";

export { EmptyState } from "./feedback/EmptyState.js";
export type { EmptyStateProps } from "./feedback/EmptyState.js";
export { ErrorState } from "./feedback/ErrorState.js";
export type { ErrorStateProps } from "./feedback/ErrorState.js";
export { LoadingState } from "./feedback/LoadingState.js";
export type { LoadingStateProps } from "./feedback/LoadingState.js";
