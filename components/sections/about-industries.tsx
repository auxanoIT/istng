import { ArrowUpRight, Building2, Factory, GraduationCap, Handshake, Hospital, Hotel, House, Landmark, Radio, Server, ShoppingBag, Sprout, Users, Warehouse, Zap } from "lucide-react";
import Link from "@/components/ui/site-link";
import { Container } from "@/components/ui/container";
import copy from "@/data/about-company.json";
import { industryNavigation } from "@/data/industry-navigation";
import styles from "./about-industries.module.css";

const presentation = {
  "corporate-offices": { label: "Corporate Offices", icon: Building2 },
  manufacturing: { label: "Manufacturing", icon: Factory },
  "warehousing-logistics": { label: "Warehousing & Logistics", icon: Warehouse },
  retail: { label: "Retail & Shopping Centres", icon: ShoppingBag },
  healthcare: { label: "Healthcare", icon: Hospital },
  education: { label: "Education", icon: GraduationCap },
  "financial-services": { label: "Banking & Finance", icon: Landmark },
  government: { label: "Government", icon: Landmark },
  "real-estate-property-management": { label: "Real Estate", icon: Building2 },
  hospitality: { label: "Hospitality & Leisure", icon: Hotel },
  "data-centres": { label: "Data Centres", icon: Server },
  "telecommunications-isps": { label: "Telecoms & ISPs", icon: Radio },
  "residential-homes-gated-communities": { label: "Homes & Gated Communities", icon: House },
  "religious-organizations": { label: "Religious & Community", icon: Users },
  "technology-partners": { label: "Technology Partners", icon: Handshake },
  "energy-utilities": { label: "Energy & Utilities", icon: Zap },
  "agriculture-agribusiness": { label: "Agriculture & Agribusiness", icon: Sprout },
};

export function AboutIndustries() {
  return (
    <section id="about-industries" aria-labelledby="about-industries-title" className={styles.section}>
      <Container>
        <header className={styles.intro}>
          <h2 id="about-industries-title">{copy.industries.title}</h2>
          <p>{copy.industries.paragraphs[0]}</p>
        </header>
        <ul className={styles.grid}>
          {industryNavigation.map(group => group.entries.map(([slug, name]) => {
            const { label, icon: Icon } = presentation[slug];
            return (
              <li key={slug}>
                <Link href={`/industries/${slug}`} aria-label={name} className={styles.tile}>
                  <Icon className={styles.icon} size={32} strokeWidth={1.5} aria-hidden="true" />
                  <span className={styles.label}>{label}</span>
                  <ArrowUpRight className={styles.arrow} size={18} strokeWidth={1.75} aria-hidden="true" />
                </Link>
              </li>
            );
          }))}
        </ul>
      </Container>
    </section>
  );
}

