# Solar insights cluster plan

The source is The Complete Guide to Solar Power in Nigeria.docx, including its three comparison tables. This plan separates search intents instead of reproducing the whole guide on several pages. It does not publish the source or present its illustrative examples as completed Integrated Solutions projects.

## Website and CMS structure

- Topic hub: /resources/insights/solar-energy
- Service overview: /services/solar-energy
- Article permalinks: /resources/insights/{descriptive-article-slug}
- Sanity: choose Main Service Topic = Solar Energy & Power Solutions. Mark the broad overview as Main Guide for This Topic. Select the appropriate current sub-service and any related industries/reading.
- Article permalinks remain independent of their topic, so moving an article does not break its URL. The hub, article breadcrumbs, related reading and service links establish the cluster.

## Pillar and supporting articles

| Role | Proposed article and slug | Distinct question | Relevant service | Source sections |
| --- | --- | --- | --- | --- |
| Pillar | Complete Guide to Solar Power in Nigeria — complete-guide-solar-power-nigeria | What should a Nigerian homeowner or business understand before planning solar? Keep concise summaries and link to the focused articles. | /services/solar-energy | Core educational sections, summarised; exclude unverified promotional claims and illustrative case studies |
| Support | How Solar Power Works in Nigeria — how-solar-power-works-nigeria | What do panels, inverters, batteries and protection devices do? | /services/solar-energy/hybrid-solar-systems | 3 |
| Support | Hybrid, Off-Grid and Grid-Tied Solar Systems — hybrid-off-grid-grid-tied-solar-nigeria | How do the system types differ, including outage behaviour? | /services/solar-energy/hybrid-solar-systems | 5 |
| Support | How to Size a Solar System for Your Loads — solar-system-sizing-load-assessment | Which appliances, run times, startup loads and backup duration shape system sizing? | /services/solar-energy/residential-solar | 7; site assessment in 10 and 12 |
| Support | What Affects Solar Installation Costs in Nigeria — solar-installation-cost-factors-nigeria | How should readers compare itemised quotations? Avoid unsupported package prices. | /services/solar-energy | 7; quotation guidance in 10 |
| Support | Choosing Solar Battery Storage — choosing-solar-battery-storage-nigeria | What should readers compare in usable capacity, compatibility and warranty? | /services/solar-energy/battery-storage | Battery material in 3; 7 |
| Support | Choosing a Hybrid Inverter — choosing-hybrid-inverter-nigeria | How do inverter capacity, charging, compatibility and backup requirements differ? | /services/solar-energy/hybrid-solar-systems | Inverter material in 3; 5 |
| Support | Solar and Generator Running Costs — solar-vs-generator-running-costs-nigeria | Which costs and assumptions should a fair comparison include? Do not promise fixed savings or payback. | /services/solar-energy/hybrid-solar-systems | 8 and 14 |
| Support | Planning Solar for a Home — planning-residential-solar-nigeria | How do essential circuits, space and household habits affect a home project? | /services/solar-energy/residential-solar | Residential segment in 6 |
| Support | Planning Solar for a Business — planning-commercial-solar-nigeria | How do operating hours, business loads and continuity needs affect commercial design? | /services/solar-energy/commercial-solar | Business segments in 6 |
| Support | What Happens During Solar Installation — solar-installation-process-nigeria | What should customers expect from survey to testing, handover and training? | /services/solar-energy | 12 |
| Support | Solar Maintenance in Rainy Season and Harmattan — solar-maintenance-rainy-season-harmattan | What should owners monitor, and when should qualified technicians help? Avoid unsafe DIY electrical or rooftop instructions. | /services/solar-energy/solar-maintenance | 13 and weather FAQs in 16 |
| Support | Choosing a Solar Installer and Comparing Quotes — choosing-solar-installer-nigeria | What should a buyer check in scope, equipment, protections, warranties and support? Incorporate common buying mistakes and the buyer checklist. | /services/solar-energy | 9, 10 and buyer checklist |
| Support | Expanding an Existing Solar System — expanding-solar-system-panels-batteries | What compatibility and capacity checks matter before adding equipment? | /services/solar-energy/solar-maintenance | Expansion in 7 and 16 |

## Internal linking and editorial boundaries

The pillar should link naturally to each supporting article where its subject is introduced. Each support article should link to the topic hub, the pillar, a small number of genuinely relevant siblings and the appropriate service overview/sub-service. Industry examples should link to the corresponding industry page when relevant, without adding every service or industry to every article.

Keep the pricing article about quotation factors; keep the generator comparison about operating-cost assumptions. Keep inverter and battery articles about selection, leaving general component explanations to the how-it-works article. Cover buyer mistakes within installer selection rather than producing near-duplicate buying articles. Use distinct page titles, excerpts and search descriptions.

## Review before drafting or publishing

Replace Auxano branding with Integrated Solutions Technology. Remove the source's unrelated preparation credits from company-authored website copy. Do not transfer unverified certifications, project history or promises to Integrated Solutions.

The guide includes illustrative Abuja, Lagos and Enugu examples; do not publish them as verified company case studies. Use only independently verified project records for case studies.

Recheck Nigeria-specific sunlight estimates, equipment lifespans, battery comparisons, costs and savings against current primary sources and manufacturers before publishing numerical claims. Avoid universal claims about seamless transfer, powering every appliance, uninterrupted healthcare loads or guaranteed return on investment. Explain that these depend on equipment, system design and operating conditions.

Do not add a year to the title unless the article has actually been reviewed for that year. Keep FAQs relevant to each article; do not duplicate the full FAQ list across every page. No articles or case studies are published by this setup.

## Editable topic clusters in Sanity

The six service pillars are the top-level hubs. Their topic clusters are editorial documents, so new subjects do not require code changes.

1. In Resources → Topic Clusters, create a topic name, choose its main service, generate a stable URL slug and write a specific introduction.
2. In Insights & Articles, choose Main Service Topic, then choose the matching Topic Cluster. The selector only lists clusters for that service. Leave the cluster blank for a service-wide pillar article.
3. Use Main Guide for This Hub for the introductory guide at either level. Link supporting articles naturally within the guide as they are published.
4. Publish the cluster and reviewed articles. A cluster enters public navigation and the sitemap only when it has published articles. An empty cluster URL is noindex. Draft articles are not published by this setup.

Example hierarchy:

- /resources/insights/solar-energy — service hub
- /resources/insights/solar-energy/battery-storage — editable topic cluster
- /resources/insights/choosing-solar-battery-storage-nigeria — stable article permalink

Networking can use /resources/insights/network-structured-cabling/fibre-optic-cabling in the same way. The article's visual and structured breadcrumbs include its service hub and cluster, even though its permanent article URL stays independent of later editorial reclassification.

Suggested initial solar clusters: Solar Basics and System Types; System Sizing and Planning; Inverters and Battery Storage; Costs and Generator Comparisons; Residential and Business Applications; Installation and Installer Selection; Maintenance and Expansion. These are a plan, not newly created or published Sanity documents.
