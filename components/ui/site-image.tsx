import NextImage from "next/image";
import type { ComponentProps } from "react";

import { getImageReplacement, resolveSiteImagePath } from "@/lib/image-assets";

export default function SiteImage({ src, alt, style, ...props }: ComponentProps<typeof NextImage>) {
  const replacement = typeof src === "string" ? getImageReplacement(src) : undefined;
  return (
    <NextImage
      {...props}
      fetchPriority={props.fetchPriority ?? (props.preload || props.priority ? "high" : undefined)}
      src={typeof src === "string" ? resolveSiteImagePath(src) : src}
      alt={alt && replacement ? replacement.alt : alt}
      style={replacement?.objectPosition ? { ...style, objectPosition: replacement.objectPosition } : style}
    />
  );
}
