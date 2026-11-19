# Service URLs and planning resources

The service catalogue uses `/services/{overview}` for each of its six overviews and `/services/{overview}/{subservice}` for all 41 sub-services. The catalogue index is `/services`.

| Overview | Canonical path |
| --- | --- |
| Solar Energy & Power Solutions | `/services/solar-energy` |
| Data Centre & IT Infrastructure | `/services/data-centre-deployment` |
| Network & Structured Cabling | `/services/network-infrastructure-connectivity` |
| Server, Storage & Hardware | `/services/server-storage-hardware` |
| Security & Surveillance | `/services/data-centre-security-safety` |
| IT Services & Technical Support | `/services/it-services-support` |

`data/service-route-migration.json` records every canonical page and its former address. `lib/service-routes.ts` resolves historical links, including earlier flat solar addresses, to their final destination. Next configuration emits permanent 308 redirects. Internal navigation, case-study service cards, portable-text links, canonical metadata, structured-data URLs and sitemap entries use the same resolver. Existing Sanity resource associations recognise both historical and current URLs, without rewriting published documents.

The three audience journeys at `/solutions/business-energy`, `/solutions/institutional-solutions` and `/solutions/enterprise-it` are audience pages, not catalogue sub-services; their addresses remain available.

Every sub-service's Related Resources section contains three contextual service cards, excluding the current page, plus up to three published Sanity resources when available. The generic gallery caption has been removed from all six sub-service groups.

Infrastructure, security and solar planning tools share a ten-question workbench with progress, editable answers, a review and a booking link that selects the relevant service. Solar retains its electricity-use worksheet. Answers are held only in page state; nothing is automatically submitted. Short or empty older CMS checklists use the complete editorial questions; a CMS checklist containing ten unique entries can override them.

Validation is recorded in `service-route-audit.json` and `seo-audit-report.json`. Regression checks cover catalogue hierarchy, content lookup, redirect mapping, contextual service links, null CMS lists and enquiry delivery. Browser checks cover all three planning tools on desktop and mobile, answer review and booking handoff without sending an enquiry.
