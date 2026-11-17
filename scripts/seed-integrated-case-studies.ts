import { createReadStream } from "node:fs";
import path from "node:path";
import { getCliClient } from "sanity/cli";
import { integratedCaseStudies } from "../data/integrated-case-studies";
import type { ServiceNavMedia } from "../lib/types";

async function main() {
  const client = getCliClient({ apiVersion: "2025-02-19" });
  const config = client.config();
  if (config.projectId !== "wfht8407" || config.dataset !== "production") throw new Error("Refusing to seed a different project or dataset.");
  const existing = await client.fetch<{ _id: string; slug?: string }[]>('*[_type == "caseStudy"]{_id,"slug":slug.current}');
  const pending = integratedCaseStudies.filter(record => !existing.some(doc => doc.slug === record.slug || doc._id === `integrated-project-${record.slug}`));
  if (!process.argv.includes("--apply")) {
    console.log(`Ready to add ${pending.length} Integrated Solutions case studies. Existing records will be preserved.`);
    return;
  }
  const assets = new Map<string, string>();
  async function imageField(image: ServiceNavMedia, key?: string, caption?: string) {
    if (!image.src.startsWith("/image/case-studies/integrated/")) throw new Error("Unexpected source image path.");
    let reference = assets.get(image.src);
    if (!reference) {
      const file = path.join(process.cwd(), "public", image.src);
      const asset = await client.assets.upload("image", createReadStream(file), { filename: path.basename(file) });
      reference = asset._id;
      assets.set(image.src, reference);
    }
    return { _type: "image", ...(key ? { _key: key } : {}), asset: { _type: "reference", _ref: reference }, alt: image.alt, ...(caption ? { caption } : {}) };
  }
  const objects = <T extends object>(values: T[] | undefined, type = "object") => values?.map((value, index) => ({ ...value, _type: type, _key: `item-${index}` }));
  for (const record of pending) {
    const { image, gallery, ...fields } = record;
    const galleryImages = [];
    for (const [index, photo] of (gallery ?? []).entries()) galleryImages.push(await imageField(photo, `photo-${index}`, photo.caption));
    await client.createIfNotExists({
      ...fields,
      _id: `integrated-project-${record.slug}`, _type: "caseStudy",
      slug: { _type: "slug", current: record.slug },
      ...(image ? { heroImage: await imageField(image) } : {}),
      gallery: galleryImages,
      metrics: objects(record.metrics, "metric"),
      specifications: objects(record.specifications),
      faqs: objects(record.faqs),
      relatedServiceLinks: objects(record.relatedServiceLinks),
    });
    console.log(`Created ${record.slug}`);
  }
  console.log(`Finished. Added ${pending.length} records. Existing editorial content was preserved.`);
}
main().catch(error => { console.error(error instanceof Error ? error.message : "Case study seed failed."); process.exitCode = 1; });
