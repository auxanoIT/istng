import { PlanningDetail, getPlanningMetadata } from "@/components/resources/planning-pages";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) { return getPlanningMetadata("tools", (await params).slug); }

export default async function Page({ params }: Props) { return <PlanningDetail section="tools" slug={(await params).slug} />; }
