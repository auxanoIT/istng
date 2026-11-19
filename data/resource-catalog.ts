import type {
  ResourceGroup,
  ResourceGroupId,
  ResourceLinkItem,
} from "@/lib/types";

type ResourceLinkSeed = Omit<ResourceLinkItem, "group">;

function buildGroup(
  id: ResourceGroupId,
  label: string,
  links: ResourceLinkSeed[],
): ResourceGroup {
  return {
    id,
    label,
    href: `/resources#${id}`,
    links: links.map((link) => ({
      ...link,
      group: id,
    })),
  };
}

export const resourceGroups: ResourceGroup[] = [
  buildGroup("insights-knowledge", "Insights & Knowledge", [
    { id: "insights", label: "Insights & Articles", href: "/resources/insights" },
    { id: "guides", label: "Technical Guides", href: "/resources/guides" },
    { id: "knowledge-centre", label: "Knowledge Centre", href: "/resources/knowledge-centre" },
  ]),
  buildGroup("projects-proof", "Projects & Proof", [
    { id: "case-studies", label: "Case Studies", href: "/resources/case-studies" },
    { id: "our-work", label: "Our Work / Gallery", href: "/resources/our-work" },
  ]),
  buildGroup("planning-tools", "Planning & Downloads", [
    { id: "downloads", label: "Downloads & Checklists", href: "/resources/downloads" },
  ]),
];

export const resourceLinks: ResourceLinkItem[] = resourceGroups.flatMap(
  (group) => group.links,
);
