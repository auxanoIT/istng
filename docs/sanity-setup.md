# Integrated Solutions Technology content editor

- Sanity project: `wfht8407`, organisation: `onu9eywww`.
- Dataset: `production`. Published reads don't require a token.
- Local Studio: http://localhost:3100/sanity.

Project defaults are in `sanity/config.ts`. Override with `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` if needed. Set `NEXT_PUBLIC_SITE_URL` to the canonical Integrated Solutions deployment origin.

In [Sanity Manage](https://www.sanity.io/manage), open project `wfht8407` → API → CORS Origins. Allow `http://localhost:3100` with credentials. Add the deployed origin if you use the embedded Studio there. Include the origin only, without `/sanity`.

An authenticated project admin can configure the origin and register the schema from this repo:

```powershell
npx sanity cors add http://localhost:3100 --credentials
npx sanity schemas deploy
```

## Publishing

| Studio collection | Website | What to enter |
| --- | --- | --- |
| Insights & Articles | /resources/insights | Title, slug, category, excerpt, formatted body, optional cover image, author, and SEO. Reuses the Integrated Solutions Technology article editor. |
| Technical Guides | /resources/guides | Detailed guidance, tables, callouts, and illustrations. |
| Knowledge Centre | /resources/knowledge-centre | Choose FAQ, Explainer or Glossary Term. Use the title for the question or term and the body for its explanation. |
| Project Planning Tools | /resources/tools | Select the solar energy worksheet, infrastructure checklist or security checklist. Add instructions and optional custom checklist items. |
| Downloads & Checklists | /resources/downloads | Upload a PDF, add a title and description, and publish to enable downloads. |
| Case Studies | /resources/case-studies | Add a verified project and enable the Published field before publishing. A matching Sanity record takes precedence over the existing fallback. |
| Our Work / Photo Albums | /resources/our-work | Add approved installation photography. The current starter albums remain available. |

Set **Related Industries** and **Related Services** to show the resource on those pages, and **Related Reading** to link articles, guides and Knowledge Centre entries. For example, link a hotel solar article to its load assessment guide, Hospitality & Leisure, and Commercial Solar Installation.

Three ready-to-publish planning tool records are included. Import them without overwriting existing documents:

```powershell
npx sanity dataset import sanity/seed/planning-tools.ndjson production --missing
```

Visitors see published content. Resource and project reads use a one-minute request-driven cache. The next request after expiry can serve cached content while refreshing it.

## Optional publish webhook and preview

Use a new `SANITY_REVALIDATE_SECRET` in the website environment and the signed Sanity webhook. Configure a POST to `/api/revalidate` on the deployed site for create, update and delete events.

Filter:

```groq
coalesce(after()._type, before()._type) in ["post", "technicalGuide", "knowledgeEntry", "planningTool", "resourceDownload", "caseStudy", "galleryAlbum", "careerOpening"]
&& !(coalesce(after()._id, before()._id) in path("drafts.**"))
&& !(coalesce(after()._id, before()._id) in path("versions.**"))
```

Projection:

```groq
{
  "_id": coalesce(after()._id, before()._id),
  "_type": coalesce(after()._type, before()._type),
  "slug": coalesce(after().slug.current, before().slug.current),
  "previousSlug": before().slug.current
}
```

For draft preview, also set `SANITY_API_READ_TOKEN` from project `wfht8407` as a server variable. Do not share or commit it. Preview is separate from Studio login.

