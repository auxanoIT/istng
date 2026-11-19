import replacementData from "@/data/image-replacements.json";

export type ImageReplacement = {
  src: string;
  alt: string;
  objectPosition?: string;
};

const replacements: Record<string, ImageReplacement> = replacementData;

// Only explicitly audited, inherited marketing images are replaced. Customer
// photographs, staff portraits, logos and external CMS images pass through.
export function getImageReplacement(source: string): ImageReplacement | undefined {
  if (/^https?:\/\//i.test(source)) {
    const url = new URL(source);
    if (!["istng.com", "www.istng.com"].includes(url.hostname)) return undefined;
    return replacements[url.pathname];
  }
  return replacements[source.split(/[?#]/, 1)[0]];
}

export function resolveSiteImagePath(source: string): string {
  const replacement = getImageReplacement(source);
  if (!replacement) return source;
  if (/^https?:\/\//i.test(source)) {
    const original = new URL(source);
    return new URL(replacement.src + original.search + original.hash, original.origin).href;
  }
  const suffixIndex = source.search(/[?#]/);
  return replacement.src + (suffixIndex < 0 ? "" : source.slice(suffixIndex));
}
