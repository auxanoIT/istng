import galleries from "./subservice-gallery-images.json";
import { canonicalServicePath } from "@/lib/service-routes";
import type { ServiceNavMedia } from "@/lib/types";

const selections: Record<string, ServiceNavMedia[]> = galleries;

export function subserviceGalleryImage(path: string, index: number, fallback: ServiceNavMedia) {
  return selections[canonicalServicePath(path)]?.[index] ?? fallback;
}
