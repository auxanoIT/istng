import { resourceServiceOptions } from "./resource-relationships";
import { canonicalServicePath } from "../lib/service-routes";

// Canonical routes are also the persistent CMS keys; labels may change freely.
export const serviceResourceClusters = resourceServiceOptions.map(({ value: href, title, pillar }) => ({
  value: href.replace(/^\/services\//, ""),
  href,
  title,
  pillarTitle: pillar,
}));

export const resourceClusterForHref = (href: string) => serviceResourceClusters.find(cluster => cluster.href === canonicalServicePath(href));
export const resourceClusterForValue = (value?: string) => value
  ? resourceClusterForHref(value.startsWith("/") ? value : `/services/${value}`)
  : undefined;
