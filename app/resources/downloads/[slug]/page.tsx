import { PlanningDetail, getPlanningMetadata } from "@/components/resources/planning-pages";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) { return getPlanningMetadata("downloads", (await params).slug); }

export default async function Page({ params }: Props) { return <PlanningDetail section="downloads" slug={(await params).slug} />; }
