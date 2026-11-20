# Insights hubs and editable topic clusters

Implemented a six-service hub structure using the current Integrated Solutions catalogue. Insights & Articles has topic navigation, and each hub links to its relevant service overview. Existing article permalinks remain /resources/insights/{article-slug}; descriptive hub and topic URLs provide navigation without changing article addresses when editors reclassify an article.

Sanity Resources now includes Topic Clusters. Editors can add a title, service pillar, stable slug and introduction for any new subject. Posts have a required Main Service Topic, an optional filtered Topic Cluster reference and an optional main-guide flag. Cluster/service mismatches are validated. Reserved service-hub slugs cannot be used as post slugs.

The inherited Related Sub-Service list now uses the same 41 current sub-services and six pillar names as the website, including all six solar services. Stored service keys and legacy route aliases remain resolvable where they match current services. No CMS documents have been mutated by this change.

Hub and cluster pages list published content, feature an assigned overview guide, and use canonical URLs, CollectionPage/ItemList schema and breadcrumbs. Article breadcrumbs link back to the service hub and cluster. Related reading prioritises the same cluster and its main guide. Existing related-service and industry links continue working.

Empty hubs are noindex and are excluded from the sitemap. Editable clusters enter navigation and the sitemap only once they have published articles. Article and cluster fetches use the existing resource cache; signed cluster webhooks are recognised for resource/sitemap invalidation, and normal cache expiry still applies. Drafts are excluded from the sitemap. No articles or topic documents were created or published.

Google recommends logical site organisation, descriptive URLs and useful crawlable links: https://developers.google.com/search/docs/fundamentals/seo-starter-guide and https://developers.google.com/search/docs/crawling-indexing/links-crawlable . The implementation uses those principles without depending on URL depth alone.

Read docs/solar-content-cluster-plan.md for the source guide breakdown: one pillar article and 13 distinct supporting articles, suggested topic groups, service connections and editorial checks before writing.

Validation: five focused tests cover current service options, topic inference, published resource queries, solar/non-solar cluster isolation and cache invalidation. Resource relationship regressions, ESLint, type checking, Studio schema extraction and the production build passed. Browser checks cover six screen widths, all six hubs, overview links, canonical/noindex metadata and unknown-cluster 404s. The site SEO audit checked 88 pages and 139 images with zero errors or warnings.
