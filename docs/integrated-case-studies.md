# Integrated Solutions project records

Sources supplied by the user on 17 November 2026

- INTEGRATED SOLUTIONS CASE STUDY.docx, nine numbered sections including a short additional-project section.
- Inverter and Solar Installation Record.xlsx, Projects!A3:E20, 18 installation entries.
- 24 JPEG photographs and two videos in the user's integrated_image directory. Videos are omitted at the user's preference.

Nine full case studies cover 16 installation entries. DBO and Okota remain compact register entries because their source information only identifies inverter equipment, with no battery or PV details. The two Kaduna hospital entries are from spreadsheet rows 11–12, not the Word document. The source has four CIHP facilities across Abuja, Lagos and Kogi, rather than three individual sites. PiggyTech is inverter and battery backup; PV equipment is not recorded. Customer residential names and precise street addresses are not reproduced.

Row mapping in Projects!A:E: DBO 3; River Valley 4; Sunshine 5–6; CIHP 7–10; Kaduna hospitals 11–12; Ajasa Command 13; Gateway Sparklight 14; Magodo 15; Ernneka 16–17; Okota 18; PiggyTech 19–20.

The challenge sections explain the requirements implied by the documented scope; they do not invent incidents, pre-installation failures, surveys, commissioning tests or cost baselines. Results describe delivered equipment. No measured savings, customer quotes, clinical outcomes, uptime or backup hours were supplied. No project completion day is invented from a month. projectPeriod preserves the given precision. Sanity _updatedAt is an editorial update date, not a completion date.

CIHP Abuja says 10KW 48V + 15KW Lithium. The lithium unit cannot be assumed to mean 15 kWh and remains explicitly unconfirmed. 200 Ah battery counts are not converted into kWh without voltage and bank configuration. PV nameplate ratings are calculated from documented panel counts × wattage; they are not daily energy yield. PiggyTech office storage is 2 × 15 kWh = 30 kWh nameplate capacity, separate from server-room storage.

The user explicitly authorised relatable photography and subsequently requested targeted regeneration where a photo mismatched the equipment or environment. Four lead images now use labelled AI illustrations for CIHP, PiggyTech, Ernneka and River Valley. Five lead photos and every supporting gallery photo remain originals, selected by system type. Generated visuals illustrate the configuration rather than assert the appearance of a named site. The long related-portfolio captions were removed at the user's request; supporting photos have short subject descriptions. Exact generation prompts and paths are in case-study-image-refinement.md. Source photos are preserved, screenshots are excluded, and website copies use WebP with responsive CSS crops. The original-photo source manifest is integrated-case-study-media.json.

The content layer uses the supplied Integrated Solutions project records in integrated-case-studies.json. Sanity matches by slug and takes precedence, including published=false. Other actual CMS case studies remain supported. The unrelated template records have been archived outside the repository. New documents have stable integrated-project-* IDs. The seed script uploads real portfolio images and creates documents only if neither the slug nor ID exists. Never overwrite an editor's record on repeat runs.

The extended schema was deployed and nine case studies with photos were created in wfht8407 / production. A repeat dry run reported zero pending records. Use `npx sanity exec scripts/seed-integrated-case-studies.ts --with-user-token` for a read-only pending check, or append `-- --apply` to create only missing records. Subsequent copy changes belong in Sanity; the matching published document takes precedence over the bundled fallback.

Search implementation uses unique titles, descriptions, canonical URLs, crawlable service links, Article and BreadcrumbList markup, and a CollectionPage with ItemList. Project questions remain editable in the CMS, but the public FAQ section was removed at the owner's request. Structured data matches the page; no ratings, invented dates or FAQ rich-result promises are added. Google guidance used: https://developers.google.com/search/docs/appearance/ai-features and https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data . Search rankings and AI citations cannot be guaranteed by content or schema.
