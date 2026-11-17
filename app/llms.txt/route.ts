import { getCaseStudies, getIndustries } from "@/lib/content";
import { solutionPillars } from "@/data/enterprise-solutions";
import { siteIdentity } from "@/data/site-identity";
import { resourceLinks } from "@/data/resource-catalog";
import { absoluteUrl } from "@/lib/utils";
export const revalidate = 60;
const link = (title: string, path: string) => "- [" + title + "](" + absoluteUrl(path) + ")";
export async function GET() {
  const [projects, industries] = await Promise.all([getCaseStudies(), getIndustries()]);
  const body = [
    "# " + siteIdentity.name, "",
    siteIdentity.description, "",
    "## Website",
    link("Home","/"), link("About","/about"), link("All solutions","/solutions"), link("Industries","/industries"), link("Website directory","/site-map"), link("XML sitemap","/sitemap.xml"), link("Request a consultation","/book-consultation"), "",
    "## Solutions",
    ...solutionPillars.flatMap(pillar => [link(pillar.label,pillar.href), "  " + pillar.description, ...pillar.items.map(item => link(item.title,item.href))]), "",
    "## Industries",
    ...industries.map(industry => link(industry.title,industry.href)), "",
    "## Resources",
    ...resourceLinks.map(resource => link(resource.label,resource.href)), "",
    "## Project case studies",
    ...projects.map(project => link(project.title,"/resources/case-studies/" + project.slug)), "",
    "Project records identify installed equipment and documented delivery scope. Inverter ratings, battery capacity and panel ratings are different quantities. They do not alone establish measured backup hours, energy yield or savings.", "",
    "## Contact",
    "- Email: " + siteIdentity.email,
    "- Phone: " + siteIdentity.telephone,
    "- Office: " + siteIdentity.address,
    "- Country: " + siteIdentity.country, "",
  ].join("\n");
  return new Response(body,{headers:{"Content-Type":"text/plain; charset=utf-8","Cache-Control":"public, max-age=60, s-maxage=60"}});
}
