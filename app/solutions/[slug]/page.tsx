import { notFound } from "next/navigation";
import { OperationSolution } from "@/components/pages/operation-solution";
import { operationTeams } from "@/data/operation-teams";
import { buildMetadata } from "@/lib/seo";
import { getSolutionStub, SolutionStub } from "@/components/pages/solution-stub";
import { EnterpriseOverview } from "@/components/pages/enterprise-overview";
import { enterpriseOverviewPaths, getEnterpriseOverview } from "@/data/enterprise-overview";
import { infrastructureSubservicePaths, getInfrastructureSubservice } from "@/data/infrastructure-subservices";
import { InfrastructureSubservice, infrastructureSubserviceMetadata } from "@/components/pages/infrastructure-subservice";
import { ContextualResources } from "@/components/resources/resource-connections";

type SolutionPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return [...new Set([...operationTeams.map(({ href }) => href), ...enterpriseOverviewPaths, ...infrastructureSubservicePaths])]
    .filter((href) => /^\/solutions\/[^/]+$/.test(href))
    .map((href) => ({ slug: href.split("/").at(-1)! }));
}

export async function generateMetadata({ params }: SolutionPageProps) {
  const { slug } = await params;
  const subservice = getInfrastructureSubservice(`/solutions/${slug}`);
  if (subservice) return infrastructureSubserviceMetadata(subservice);
  const overview = getEnterpriseOverview(`/solutions/${slug}`);
  if (overview) return buildMetadata({
    title: overview.pillar.label,
    description: overview.intro,
    path: overview.pillar.href,
    imagePath: overview.heroImage.src,
    imageAlt: overview.heroImage.alt,
  });
  const solution = operationTeams.find(({ href }) => href === `/solutions/${slug}`);
  if (!solution) {
    const brief = getSolutionStub(`/solutions/${slug}`);
    if (!brief) notFound();
    return buildMetadata({ title: brief.title, description: brief.description, path: `/solutions/${slug}` });
  }

  return buildMetadata({
    title: solution.cta.replace(/^Explore /, ""),
    description: solution.paragraphs[1],
    path: solution.href,
  });
}

export default async function SolutionOverview({ params }: SolutionPageProps) {
  const { slug } = await params;
  const subservice = getInfrastructureSubservice(`/solutions/${slug}`);
  if (subservice) return <InfrastructureSubservice page={subservice} />;
  const overview = getEnterpriseOverview(`/solutions/${slug}`);
  if (overview) return <EnterpriseOverview overview={overview} />;
  const solution = operationTeams.find(({ href }) => href === `/solutions/${slug}`);
  if (!solution) {
    const brief = getSolutionStub(`/solutions/${slug}`);
    if (!brief) notFound();
    return <><SolutionStub solution={brief} /><ContextualResources service={`/solutions/${slug}`} /></>;
  }

  return <OperationSolution solution={solution} />;
}
