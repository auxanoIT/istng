import Image from "@/components/ui/site-image";
import { Container } from "@/components/ui/container";
import copy from "@/data/about-company.json";
import { aboutContent } from "@/data/about-content";
import styles from "./about-vision-mission.module.css";

export function AboutVisionMission() {
  return <section id="about-vision-mission" aria-label="Our vision and mission" className={styles.section}>
    <Container>
      <div className={styles.declarations}>
        {[{ id: "about-vision-title", ...copy.vision }, { id: "about-mission-title", ...copy.mission }].map(statement => <div key={statement.id} className={styles.declaration}>
          <h2 id={statement.id}>{statement.title}</h2>
          {statement.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
        </div>)}
      </div>
      <figure className={styles.photo}>
        <Image src={aboutContent.visionMission.image} alt={aboutContent.visionMission.alt} fill sizes="(min-width: 1280px) 1216px, (min-width: 640px) 95vw, 100vw" className="object-cover" />
      </figure>
    </Container>
  </section>;
}
