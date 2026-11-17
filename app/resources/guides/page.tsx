import { EditorialIndex } from "@/components/resources/editorial-index";
import { editorialIndexMetadata } from "@/lib/resource-metadata";
const section = "guides";
export const revalidate = 60;
export function generateMetadata() { return editorialIndexMetadata(section); }
export default function Page() { return <EditorialIndex section={section} />; }
