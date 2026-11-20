import { solutionPillars } from "./enterprise-solutions";
import { canonicalServicePath } from "../lib/service-routes";

const descriptions: Record<string, string> = {
  "solar-energy": "Understand solar panels, inverters, batteries, system sizing, installation and maintenance in Nigeria.",
  "data-centre-infrastructure": "Plan server rooms, rack layouts, equipment deployment and infrastructure readiness.",
  "network-structured-cabling": "Explore network planning, copper and fibre cabling, wireless connectivity and troubleshooting.",
  "server-storage-hardware": "Make informed decisions about enterprise servers, storage, procurement and hardware upgrades.",
  "security-surveillance": "Understand CCTV, access control, recording, monitoring and security system maintenance.",
  "it-services-support": "Explore IT assessments, technical support, maintenance and infrastructure improvements.",
};

export const insightTopics = solutionPillars.map(pillar => ({
  slug: pillar.slug,
  title: pillar.label,
  description: descriptions[pillar.slug],
  serviceHref: pillar.href,
}));

export const insightTopicPath = (slug: string) => `/resources/insights/${encodeURIComponent(slug)}`;
export const insightClusterPath = (topic: string, cluster: string) => `${insightTopicPath(topic)}/${encodeURIComponent(cluster)}`;
export const getInsightTopic = (slug?: string) => insightTopics.find(topic => topic.slug === slug);

type TopicAssignment = { topic?: string; cluster?: { title: string; slug: string; topic: string }; relatedService?: string; relatedServices?: string[] };
export function getArticleTopic(post: TopicAssignment) {
  if (post.topic) return getInsightTopic(post.topic);
  if (post.cluster?.topic) return getInsightTopic(post.cluster.topic);
  const paths = [...(post.relatedServices ?? []), ...(post.relatedService ? [post.relatedService.startsWith("/") ? post.relatedService : `/services/${post.relatedService}`] : [])].map(canonicalServicePath);
  const matches = insightTopics.filter(topic => paths.some(path => path === topic.serviceHref || path.startsWith(topic.serviceHref + "/")));
  return matches.length === 1 ? matches[0] : undefined;
}

export function getArticleCluster(post: TopicAssignment) {
  return post.cluster?.title && post.cluster.slug && getArticleTopic(post)?.slug === post.cluster.topic ? post.cluster : undefined;
}

export function articlesForCluster<T extends TopicAssignment>(posts: T[], topic: string, slug: string): T[] {
  return posts.filter(post => getArticleTopic(post)?.slug === topic && getArticleCluster(post)?.slug === slug);
}

export function articlesForTopic<T extends TopicAssignment>(posts: T[], slug: string): T[] {
  return posts.filter(post => getArticleTopic(post)?.slug === slug);
}
