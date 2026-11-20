import { EditorialArticle, getEditorialMetadata } from "@/components/resources/editorial-article";
import { getInsightTopic } from "@/data/insight-topics";
import { getInsightTopicMetadata, InsightTopicPage } from "@/components/resources/insight-topic-page";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return getInsightTopic(slug) ? getInsightTopicMetadata(slug) : getEditorialMetadata("insights", slug);
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return getInsightTopic(slug) ? <InsightTopicPage slug={slug} /> : <EditorialArticle section="insights" slug={slug} />;
}
