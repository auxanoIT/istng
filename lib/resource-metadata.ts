import { buildMetadata } from "./seo";
import { getEditorialIndex, getPlanningIndex } from "./resources";
import { editorialSections, planningSections, resourcePath, type EditorialSection, type PlanningSection } from "@/data/resource-sections";

export async function editorialIndexMetadata(section: EditorialSection) {
  const { title, description } = editorialSections[section];
  const entries = await getEditorialIndex(section);
  return buildMetadata({ title, description, path: resourcePath(section), noIndex: entries.length === 0 });
}
export async function planningIndexMetadata(section: PlanningSection) {
  const { title, description } = planningSections[section];
  const entries = await getPlanningIndex(section);
  return buildMetadata({ title, description, path: resourcePath(section), noIndex: entries.length === 0 });
}
