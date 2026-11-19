import { ArrowRight, Database, Headset, Network, Server, ShieldCheck, Sun } from "lucide-react";
import type { CSSProperties } from "react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button-link";
import copy from "@/data/about-company.json";
import styles from "./about-company.module.css";

const icons = [Sun, Server, Network, Server, ShieldCheck, Headset];
const nodes = [[46.46, 136.46], [16, 210], [46.46, 283.54], [193.54, 136.46], [224, 210], [193.54, 283.54]];

export function AboutCompany() {
  const company = copy.company;
  return <section id="about-company" aria-labelledby="about-company-title" className={styles.section}>
    <Container>
      <header className={styles.intro}>
        <h2 id="about-company-title">{company.title}</h2>
        {company.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
      </header>
      <div className={styles.diagram}>
        <div className={styles.hub}>
          <svg aria-hidden="true" viewBox="0 0 240 420" width="240" height="420">
            <g fill="none" stroke="var(--brand-muted)" strokeWidth="1">
              <path d="M0 70 H20 L46.46 136.46 M0 210 H16 M0 350 H20 L46.46 283.54 M240 70 H220 L193.54 136.46 M240 210 H224 M240 350 H220 L193.54 283.54" />
            </g>
            <circle cx="120" cy="210" r="104" fill="var(--brand-navy)" stroke="var(--brand-orange)" strokeWidth="3" />
            {nodes.map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="5" fill="var(--brand-orange)" stroke="white" strokeWidth="1.5" />)}
          </svg>
          <p>Your<br />requirements.</p>
        </div>
        <ul className={styles.services} role="list" aria-label="Six connected energy and technology capabilities">
          {company.items.map((item, index) => {
            const Icon = icons[index];
            return <li key={item.title} className={styles.service} data-side={index < 3 ? "left" : "right"} style={{ "--company-row": index % 3 + 1, "--company-column": index < 3 ? 1 : 3 } as CSSProperties}>
              <span className={styles.icon} data-service-icon={index} aria-hidden="true">
                <Icon size={48} strokeWidth={1.5} />
                {index === 0 && <svg viewBox="0 0 44 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.panel}><path d="M8 3h28l6 19H2L8 3Z M15 3l-3 19 M29 3l3 19 M22 3v19 M5 12.5h34 M22 22v7 M15 29h14" /></svg>}
                {index === 3 && <Database size={25} strokeWidth={1.5} className={styles.storage} />}
              </span>
              <div><h3>{item.title}</h3><p>{item.description}</p></div>
            </li>;
          })}
        </ul>
      </div>
      <div className={styles.principle}>
        <p>{company.principle}</p>
        <ButtonLink href="#about-solutions" className="mt-6 rounded-md shadow-none">{company.cta}<ArrowRight size={18} className="ml-3" aria-hidden="true" /></ButtonLink>
      </div>
    </Container>
  </section>;
}
