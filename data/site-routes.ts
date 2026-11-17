import { solutionPillars } from "./enterprise-solutions";
import { industryNavigation } from "./industry-navigation";
import { operationTeams } from "./operation-teams";

export const primarySolutionPages = [...new Map(solutionPillars.flatMap(pillar => [
  { href: pillar.href, title: pillar.label, image: pillar.image },
  ...pillar.items.map(item => ({ href: item.href, title: item.title, image: item.image })),
]).map(page => [page.href, page])).values()];
export const primaryIndustryPages = industryNavigation.flatMap(group => group.entries.map(([slug, title]) => ({ slug, title, href: `/industries/${slug}` })));
export const journeyPages = operationTeams.filter(team => !primarySolutionPages.some(page => page.href === team.href));
const currentPaths = new Set([...primarySolutionPages.map(page => page.href), ...primaryIndustryPages.map(page => page.href)]);

// Keep older links usable without submitting superseded catalogue pages to search.
export function isRetiredContentPath(path: string) {
  const pathname = path.split(/[?#]/)[0];
  return (pathname.startsWith("/services/") || pathname.startsWith("/industries/")) && !currentPaths.has(pathname);
}
