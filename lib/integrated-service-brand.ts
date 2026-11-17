// Rebrand display copy while preserving canonical URLs, asset paths and anchors.
export const integratedServiceText = (text: string) => text.replace(/\bIntegrated Solutions(?: Technology)?(?: Limited)?\b/gi, "Integrated Solutions Technology");
export function integratedServiceContent<T>(value: T, key = ""): T {
  if (["id", "slug", "href", "src", "serviceMixId"].includes(key)) return value;
  if (typeof value === "string") return integratedServiceText(value) as T;
  if (Array.isArray(value)) return value.map(item => integratedServiceContent(item)) as T;
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([name,item]) => [name,integratedServiceContent(item,name)])) as T;
  return value;
}
