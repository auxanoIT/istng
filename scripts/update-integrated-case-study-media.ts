import { createReadStream } from "node:fs";
import path from "node:path";
import { getCliClient } from "sanity/cli";
import { integratedCaseStudies } from "../data/integrated-case-studies";
import type { ServiceNavMedia } from "../lib/types";

async function main() {
  const client = getCliClient({ apiVersion: "2025-02-19" });
  if (client.config().projectId !== "wfht8407" || client.config().dataset !== "production") throw new Error("Unexpected Sanity project or dataset.");
  const assets = new Map<string, string>();
  async function upload(image: ServiceNavMedia, key?: string, caption?: string) {
    if (!image.src.startsWith("/image/case-studies/integrated/")) throw new Error("Unexpected media source.");
    let ref = assets.get(image.src);
    if (!ref) {
      const file = path.join(process.cwd(), "public", image.src);
      ref = (await client.assets.upload("image", createReadStream(file), { filename: path.basename(file) }))._id;
      assets.set(image.src, ref);
    }
    return { _type: "image", ...(key ? { _key: key } : {}), asset: { _type: "reference", _ref: ref }, alt: image.alt, ...(caption ? { caption } : {}) };
  }
  for (const project of integratedCaseStudies) {
    const id = `integrated-project-${project.slug}`;
    const existing = await client.getDocument<{ _id: string; _rev: string; slug: { current: string } }>(id);
    if (!existing || existing.slug.current !== project.slug) throw new Error(`Missing or changed project: ${project.slug}`);
    if (!process.argv.includes("--apply")) { console.log(`Ready to update media: ${project.slug}`); continue; }
    if (!project.image) throw new Error("Missing lead image.");
    const heroImage = await upload(project.image);
    const gallery = [];
    for (const [index, photo] of (project.gallery ?? []).entries()) gallery.push(await upload(photo, `photo-${index}`, photo.caption));
    await client.patch(id).ifRevisionId(existing._rev).set({ heroImage, gallery, imageCaption: project.imageCaption ?? "", imageIsIllustrative: project.imageIsIllustrative ?? false }).commit();
    console.log(`Updated media only: ${project.slug}`);
  }
}
main().catch(error => { console.error(error instanceof Error ? error.message : "Media update failed."); process.exitCode = 1; });
