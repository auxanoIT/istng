import { EditorialArticle, getEditorialMetadata } from "@/components/resources/editorial-article";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  return getEditorialMetadata("knowledge-centre", (await params).slug);
}

export default async function Page({ params }: Props) {
  return <EditorialArticle section="knowledge-centre" slug={(await params).slug} />;
}
