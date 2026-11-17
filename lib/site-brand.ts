export const siteBrandName = "Integrated Solutions Technology";

export function updateLegacyBrand<T>(value: T): T {
  if (typeof value === "string") {
    return value.replace(
      /\bIntegrated Solutions(?: Technology)?(?: Limited)?\b/gi,
      siteBrandName,
    ) as T;
  }

  if (Array.isArray(value)) {
    return value.map(updateLegacyBrand) as T;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, updateLegacyBrand(item)]),
    ) as T;
  }

  return value;
}
