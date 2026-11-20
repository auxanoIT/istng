import { getInsightTopicMetadata, InsightTopicPage } from "@/components/resources/insight-topic-page";

export const revalidate = 60;
type Props = { params: Promise<{ slug: string; cluster: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug, cluster } = await params;
  return getInsightTopicMetadata(slug, cluster);
}

export default async function Page({ params }: Props) {
  const { slug, cluster } = await params;
  return <InsightTopicPage slug={slug} clusterSlug={cluster} />;
}
