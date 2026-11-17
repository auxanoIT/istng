import { PlanningIndex } from "@/components/resources/planning-pages";
import { planningIndexMetadata } from "@/lib/resource-metadata";
const section = "tools";
export const revalidate = 60;
export function generateMetadata() { return planningIndexMetadata(section); }
export default function Page() { return <PlanningIndex section={section} />; }
