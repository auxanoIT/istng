
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { evaluate, parse } from "groq-js";

const source = readFileSync(new URL("../sanity/lib/queries.ts", import.meta.url), "utf8");
function query(name) {
  const tick = String.fromCharCode(96);
  const marker = "const " + name + " = groq" + tick;
  const start = source.indexOf(marker);
  assert.notEqual(start, -1);
  return source.slice(start + marker.length, source.indexOf(tick, start + marker.length))
    .replace("$" + "{editorialFields}", () => query("editorialFields"));
}

const service = "/solutions/solar-energy/commercial-solar";
const industry = "hospitality";
const dataset = [
  { _id: "post", _type: "post", title: "Hotel solar", slug: { current: "hotel-solar" }, relatedIndustries: [industry], relatedServices: [service], relatedReading: [{ _ref: "guide" }], body: [{ _type: "block", children: [{ _type: "span", text: "Start with the load." }] }] },
  { _id: "guide", _type: "technicalGuide", title: "Commercial load assessment", slug: { current: "load-assessment" }, relatedServices: [service] },
  { _id: "drafts.secret", _type: "post", title: "Draft", slug: { current: "draft" }, relatedServices: [service] },
  { _id: "pdf", _type: "resourceDownload", title: "Load checklist", slug: { current: "load-checklist" }, relatedServices: [service], pdf: { asset: { _ref: "asset" } } },
  { _id: "asset", _type: "sanity.fileAsset", mimeType: "application/pdf", url: "https://cdn.sanity.io/files/wfht8407/production/sample.pdf" },
  { _id: "missing", _type: "resourceDownload", title: "Unattached document", slug: { current: "missing" }, relatedServices: [service] },
  { _id: "retired-tool", _type: "planningTool", title: "Retired worksheet", slug: { current: "retired-tool" }, relatedServices: [service], toolKind: "solar" },
];
async function run(name, params) {
  return (await evaluate(parse(query(name)), { dataset, params })).get();
}

const [article, serviceCards, industryCards, tools, download] = await Promise.all([
  run("editorialArticleQuery", { type: "post", slug: "hotel-solar" }),
  run("relatedResourceCardsQuery", { industry: "", service, serviceAliases: [service], legacyServices: [service] }),
  run("relatedResourceCardsQuery", { industry, service: "", serviceAliases: [], legacyServices: [] }),
  run("planningResourcesQuery", { type: "planningTool" }),
  run("planningResourceQuery", { type: "resourceDownload", slug: "load-checklist" }),
]);
assert.equal(article.body[0].children[0].text, "Start with the load.");
assert.deepEqual(article.relatedReading, [{ title: "Commercial load assessment", slug: "load-assessment", section: "guides" }]);
assert.deepEqual(new Set(serviceCards.map(card => card.section)), new Set(["insights", "guides", "downloads"]));
assert.ok(serviceCards.every(card => !["draft", "missing"].includes(card.slug) && !("body" in card)));
assert.ok(industryCards.some(card => card.slug === "hotel-solar"));
assert.equal(tools.length, 0);
assert.equal(download.file.mimeType, "application/pdf");
console.log("Resource relationships, published backlinks, retired-tool exclusion, and PDF filtering verified.");

