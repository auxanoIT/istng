import { ServicesDirectory } from "@/components/pages/services-directory";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Solar, Power & Technology Solutions",
  description: "Explore solar energy, battery storage and enterprise IT solutions from Integrated Solutions Technology.",
  path: "/services",
});

export default function SolutionsPage() {
  return <ServicesDirectory />;
}
