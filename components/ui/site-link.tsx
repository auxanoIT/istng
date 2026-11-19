import NextLink from "next/link";
import type { ComponentProps } from "react";
import { canonicalServicePath } from "@/lib/service-routes";

export default function SiteLink({ href, ...props }: ComponentProps<typeof NextLink>) {
  const destination = typeof href === "string" ? canonicalServicePath(href)
    : href.pathname ? { ...href, pathname: canonicalServicePath(href.pathname) } : href;
  return <NextLink {...props} href={destination} />;
}
