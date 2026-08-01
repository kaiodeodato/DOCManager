import type { HTMLAttributes, ImgHTMLAttributes, ReactNode } from "react";
import { cx } from "../../utils/cx.js";

export type AvatarSize = "sm" | "md" | "lg";

export type AvatarProps = HTMLAttributes<HTMLSpanElement> & {
  size?: AvatarSize;
  src?: string;
  alt?: string;
  fallback?: ReactNode;
  imgProps?: Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt">;
};

export function Avatar({
  size = "md",
  src,
  alt = "",
  fallback,
  className,
  imgProps,
  ...rest
}: AvatarProps) {
  return (
    <span className={cx("dm-avatar", `dm-avatar--${size}`, className)} {...rest}>
      {src != null ? <img src={src} alt={alt} {...imgProps} /> : fallback}
    </span>
  );
}
