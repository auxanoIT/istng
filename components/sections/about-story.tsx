import { Network, Server, ShieldCheck, Zap } from "lucide-react";
import Image from "@/components/ui/site-image";
import { Container } from "@/components/ui/container";
import copy from "@/data/about-company.json";
import { aboutContent } from "@/data/about-content";
import styles from "./about-story.module.css";

const icons = [Zap, Network, Server, ShieldCheck];
const iconNames = ["power", "network", "infrastructure", "security"];

export function AboutStory() {
  const story = copy.story;
  const accent = "Behind the Scenes.";
  const emphasised = story.title.endsWith(accent);
  return <section id="about-story" aria-labelledby="about-story-title" className={styles.section}>
    <Container>
      <header className={styles.intro}>
        <h2 id="about-story-title">
          {emphasised ? <>{story.title.slice(0, -accent.length).trim()}<br /><span>{accent}</span></> : story.title}
        </h2>
        <p>{story.paragraphs[0]}</p>
      </header>
      <ul className={styles.foundations}>
        {story.items.map((item, index) => {
          const Icon = icons[index];
          return <li key={item.title}>
            <span className={styles.icon} data-foundation-icon={iconNames[index]} aria-hidden="true">
              <Icon size={48} strokeWidth={1.5} />
              {index === 0 && <span className={styles.rays}><i /><i /><i /></span>}
            </span>
            <div><h3>{item.title}</h3><p>{item.description}</p></div>
          </li>;
        })}
      </ul>
    </Container>
    <div className={styles.band}>
      <Container className={styles.bandInner}>
        <p className={styles.statement}>One partner.<br />A stronger foundation.</p>
        <figure className={styles.photo}>
          <Image src={aboutContent.story.image} alt={aboutContent.story.alt} fill sizes="(min-width: 1280px) 584px, (min-width: 768px) 45vw, 100vw" className="object-cover" />
        </figure>
      </Container>
    </div>
  </section>;
}
