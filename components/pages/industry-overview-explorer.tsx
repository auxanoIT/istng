"use client";

import { Fragment, useId, useState, type CSSProperties, type KeyboardEvent } from "react";
import { ArrowRight, Camera, ChevronDown, ClipboardCheck, FileText, Layers, LockKeyhole, Network, ShieldCheck, Wrench, Zap } from "lucide-react";
import Image from "@/components/ui/site-image";
import { ButtonLink } from "@/components/ui/button-link";
import { scrollToOverviewButton } from "./scroll-to-overview-button";
import type { IndustryFocus, IndustryOverviewExperience, IndustryScene, ScenePoint } from "@/data/industry-overview-explorer";
import styles from "./industry-overview-explorer.module.css";

const icons = { connectivity: Network, power: Zap, security: ShieldCheck, visibility: Camera, growth: Layers, support: Wrench, planning: ClipboardCheck, protection: LockKeyhole, records: FileText };

function FocusIllustration({ image, focus, label }: { image: IndustryScene; focus: IndustryFocus; label: string }) {
  const height = 1000 * image.height / image.width;
  const point = (value: ScenePoint) => ({ x: value.x * 10, y: value.y * height / 100 });
  const a = Object.fromEntries(Object.entries(image.anchors).map(([name, value]) => [name, point(value)])) as Record<keyof IndustryScene["anchors"], ScenePoint>;
  let route: string;
  let nodes: ScenePoint[];
  switch (focus) {
    case "power":
      route = `M${a.solar.x},${a.solar.y} V${a.accessPoint.y} H${a.utility.x} V${a.utility.y} V${a.work.y} H${a.work.x}`;
      nodes = [a.solar, a.utility, a.work]; break;
    case "security":
      route = `M${a.camera.x},${a.camera.y} H${a.entry.x} V${a.entry.y}`;
      nodes = [a.camera, a.entry]; break;
    case "visibility":
      route = `M${a.camera.x},${a.camera.y} H${a.network.x} V${a.network.y} V${a.work.y} H${a.work.x}`;
      nodes = [a.camera, a.network, a.work]; break;
    case "growth":
      route = `M${a.growth.x},${a.growth.y} H${a.network.x} V${a.network.y}`;
      nodes = [a.growth, a.network]; break;
    case "support":
      route = `M${a.work.x},${a.work.y} H${a.network.x} V${a.network.y}`;
      nodes = [a.work, a.network]; break;
    case "planning":
      route = `M${a.records.x},${a.records.y} V${a.accessPoint.y} H${a.utility.x} V${a.utility.y}`;
      nodes = [a.records, a.utility]; break;
    case "protection":
      route = `M${a.network.x},${a.network.y} V${a.accessPoint.y} H${a.accessPoint.x}`;
      nodes = [a.network, a.accessPoint]; break;
    case "records":
      route = `M${a.records.x},${a.records.y} H${a.network.x} V${a.network.y}`;
      nodes = [a.records, a.network]; break;
    default:
      route = `M${a.network.x},${a.network.y} V${a.accessPoint.y} H${a.accessPoint.x} V${a.work.y} H${a.work.x}`;
      nodes = [a.network, a.accessPoint, a.work];
  }
  return <figure className={styles.visual} aria-label={`${label}: ${image.alt}`} data-industry-focus={focus}>
    <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1280px) 1216px, (min-width: 1024px) 90vw, 100vw" className="object-contain" />
    <svg aria-hidden="true" className={styles.overlay} viewBox={`0 0 1000 ${height}`} preserveAspectRatio="xMidYMid meet">
      <path d={route} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" strokeDasharray={focus === "growth" || focus === "planning" ? "8 6" : undefined} />
      {nodes.map((node, index) => <g key={index}><circle cx={node.x} cy={node.y} r="7" fill="var(--brand-orange)" /><circle cx={node.x} cy={node.y} r="3" fill="white" /></g>)}
    </svg>
  </figure>;
}

export function IndustryOverviewExplorer({ experience, industry, enquiry }: { experience: IndustryOverviewExperience; industry: string; enquiry: string }) {
  const [selected, setSelected] = useState(0);
  const id = useId();
  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!window.matchMedia("(min-width: 1024px)").matches) return;
    const last = experience.items.length - 1;
    const next = event.key === "ArrowRight" ? (index + 1) % (last + 1) : event.key === "ArrowLeft" ? (index + last) % (last + 1) : event.key === "Home" ? 0 : event.key === "End" ? last : undefined;
    if (next === undefined) return;
    event.preventDefault();
    const controls = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("[data-industry-priority]");
    controls?.[next].focus();
    setSelected(next);
  }
  return <div data-industry-overview={industry}>
    <div className="mx-auto max-w-5xl text-center">
      <h2 id="industry-overview-title" className="text-balance text-2xl font-semibold leading-tight tracking-tight sm:text-3xl lg:text-4xl">{experience.title}</h2>
      <p className="mx-auto mt-4 max-w-4xl text-sm leading-7 text-slate-200 sm:text-base">{experience.intro}</p>
    </div>
    <div className={styles.explorer} role="group" aria-label={`${industry} infrastructure priorities`}>
      {experience.items.map((item, index) => {
        const active = selected === index;
        const Icon = icons[item.focus];
        return <Fragment key={item.label}>
          <button type="button" data-industry-priority id={`${id}-control-${index}`} aria-controls={`${id}-panel-${index}`} aria-expanded={active}
            onClick={event => { setSelected(index); scrollToOverviewButton(event.currentTarget); }} onKeyDown={event => navigate(event, index)}
            className={styles.control} style={{ "--industry-tab-column": index + 1 } as CSSProperties}>
            <Icon size={25} strokeWidth={1.6} aria-hidden="true" className="shrink-0" />
            <span>{item.label}</span><ChevronDown size={19} aria-hidden="true" className={styles.chevron} />
          </button>
          <div id={`${id}-panel-${index}`} role="region" aria-labelledby={`${id}-control-${index}`} hidden={!active} className={styles.panel}>
            {active && <FocusIllustration image={experience.image} focus={item.focus} label={item.label} />}
            <div className={styles.copy}>
              <h3 className="text-lg font-semibold sm:text-xl lg:text-2xl">{item.title}</h3>
              {item.paragraphs.map(paragraph => <p key={paragraph} className="mt-2 max-w-4xl text-sm leading-7 text-slate-200 sm:text-base">{paragraph}</p>)}
            </div>
          </div>
        </Fragment>;
      })}
    </div>
    <div className="mt-6 flex justify-center lg:justify-start"><ButtonLink href={enquiry} className="min-h-10 rounded-md px-4 py-2 shadow-none">Discuss Your Needs<ArrowRight size={17} aria-hidden="true" className="ml-2" /></ButtonLink></div>
  </div>;
}
