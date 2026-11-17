import { solutionPillars } from "./enterprise-solutions";
import { industryNavigation } from "./industry-navigation";

export const resourceIndustryOptions = industryNavigation.flatMap(({ entries }) =>
  entries.map(([value, title]) => ({ value, title })),
);

export const resourceServiceOptions = [...new Map(solutionPillars.flatMap((pillar) =>
  pillar.items.map(({ href, title }) => [href, { value: href, title, pillar: pillar.label }] as const),
)).values()];
