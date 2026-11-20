import Link from "@/components/ui/site-link";
import { ArrowRight } from "lucide-react";
import { articlesForCluster, articlesForTopic, getInsightTopic, insightClusterPath, insightTopicPath } from "@/data/insight-topics";
import { getEditorialIndex, getInsightCluster, getInsightClusters } from "@/lib/resources";
import { buildMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { JsonLd } from "@/components/ui/json-ld";
import { EditorialCardView } from "./editorial-index";
import { notFound } from "next/navigation";

export async function getInsightTopicMetadata(slug: string, clusterSlug?: string) {
  const topic = getInsightTopic(slug);
  if (!topic) notFound();
  const cluster = clusterSlug ? await getInsightCluster(slug, clusterSlug) : undefined;
  if (clusterSlug && !cluster) notFound();
  const allPosts = await getEditorialIndex("insights");
  const posts = cluster ? articlesForCluster(allPosts, slug, cluster.slug) : articlesForTopic(allPosts, slug);
  return buildMetadata({ title: `${cluster?.title ?? topic.title} Insights in Nigeria`, description: cluster?.description ?? topic.description, path: cluster ? insightClusterPath(slug, cluster.slug) : insightTopicPath(slug), noIndex: posts.length === 0 });
}

export async function InsightTopicPage({ slug, clusterSlug }: { slug: string; clusterSlug?: string }) {
  const topic = getInsightTopic(slug);
  if (!topic) notFound();
  const cluster = clusterSlug ? await getInsightCluster(slug, clusterSlug) : undefined;
  if (clusterSlug && !cluster) notFound();
  const allPosts = await getEditorialIndex("insights");
  const posts = cluster ? articlesForCluster(allPosts, slug, cluster.slug) : articlesForTopic(allPosts, slug);
  const clusters = cluster ? [] : (await getInsightClusters(slug)).filter(item => articlesForCluster(posts, slug, item.slug).length > 0);
  const guide = posts.find(post => post.isPillarGuide && (cluster || !post.cluster));
  const articles = posts.filter(post => post.slug !== guide?.slug);
  const title = cluster?.title ?? topic.title;
  const description = cluster?.description ?? topic.description;
  const path = cluster ? insightClusterPath(slug, cluster.slug) : insightTopicPath(slug);
  return <>
    <JsonLd data={[
      { "@context": "https://schema.org", "@type": "CollectionPage", name: `${title} Insights`, description, url: absoluteUrl(path), ...(posts.length ? { mainEntity: { "@type": "ItemList", itemListElement: posts.map((post, index) => ({ "@type": "ListItem", position: index + 1, name: post.title, url: absoluteUrl(`/resources/insights/${encodeURIComponent(post.slug)}`) })) } } : {}) },
      { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "Insights & Articles", item: absoluteUrl("/resources/insights") },
        { "@type": "ListItem", position: 3, name: topic.title, item: absoluteUrl(insightTopicPath(slug)) },
        ...(cluster ? [{ "@type": "ListItem", position: 4, name: cluster.title, item: absoluteUrl(path) }] : []),
      ] },
    ]} />
    <header className="bg-brand-navy py-14 text-white sm:py-20"><Container>
      <nav aria-label="Breadcrumb"><Link href={cluster ? insightTopicPath(slug) : "/resources/insights"} className="inline-flex min-h-11 items-center text-sm font-semibold text-brand-orange underline-offset-4 hover:underline">← {cluster ? topic.title : "All insights & articles"}</Link></nav>
      <h1 className="mt-6 max-w-4xl text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">{title} Insights</h1>
      <p className="mt-5 max-w-2xl leading-8 text-white/80">{description}</p>
    </Container></header>
    <section className="bg-brand-surface py-12 sm:py-16"><Container>
      {clusters.length > 0 && <nav aria-labelledby="cluster-navigation-title" className="mb-12"><h2 id="cluster-navigation-title" className="text-2xl font-semibold text-brand-navy">Explore topics</h2><ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{clusters.map(item => <li key={item.slug}><Link href={insightClusterPath(slug, item.slug)} className="block h-full rounded border border-brand-border bg-white p-5 hover:border-brand-orange focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-navy"><h3 className="font-semibold text-brand-navy">{item.title}</h3><p className="mt-3 text-sm leading-6 text-brand-support">{item.description}</p></Link></li>)}</ul></nav>}
      {guide && <div className="mb-12"><h2 className="mb-6 text-2xl font-semibold text-brand-navy">Start with the complete guide</h2><EditorialCardView section="insights" post={guide} featured /></div>}
      {articles.length > 0 && <div><h2 className="mb-6 text-2xl font-semibold text-brand-navy">Explore the articles</h2><ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{articles.map(post => <li key={post.slug}><EditorialCardView section="insights" post={post} /></li>)}</ul></div>}
      {!posts.length && <p className="rounded border border-brand-border bg-white p-6 text-brand-support">Published articles for this topic will appear here.</p>}
      <aside className="mt-10 border-t border-brand-border pt-7"><h2 className="text-xl font-semibold text-brand-navy">Explore the related solutions</h2><Link href={topic.serviceHref} className="mt-3 inline-flex min-h-11 items-center gap-3 font-semibold text-brand-navy underline decoration-brand-orange underline-offset-4">{topic.title}<ArrowRight size={18} aria-hidden="true" /></Link></aside>
    </Container></section>
  </>;
}
