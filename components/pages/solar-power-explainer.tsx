"use client";

import Image from "next/image";
import { Moon, Sun, Zap } from "lucide-react";
import { useId, useState } from "react";

import { ButtonLink } from "@/components/ui/button-link";
import type { OverviewAction } from "@/components/pages/overview-layout";
import { scrollToOverviewButton } from "@/components/pages/scroll-to-overview-button";
import { cn } from "@/lib/utils";
import transition from "./overview-transition.module.css";

const modes = [
  { label: "Daytime", icon: Sun, description: "Solar powers the building. Surplus can charge the battery." },
  { label: "Night-time", icon: Moon, description: "After dark, the inverter uses stored battery power to run connected equipment while charge is available." },
  { label: "Power Outage", icon: Zap, description: "A compatible backup system keeps designated equipment running on available sunlight and stored energy." },
] as const;

type SolarMode = (typeof modes)[number]["label"];

function SolarFlowDiagram({ mode }: { mode: SolarMode }) {
  const arrowId = useId();
  const daytime = mode === "Daytime";
  const outage = mode === "Power Outage";

  return (
    <figure aria-label={`${mode} solar energy flow`} className="relative isolate aspect-[8/5] overflow-hidden rounded-lg bg-brand-navy">
      <Image
        src="/integrated-assets/images/solutions/solar-power-house.webp"
        alt="House with rooftop solar panels, a hybrid inverter and a battery cabinet"
        fill
        sizes="(min-width: 1280px) 880px, (min-width: 1024px) 70vw, 100vw"
        className={cn("object-cover transition-[filter] duration-300 motion-reduce:transition-none", mode === "Night-time" && "brightness-[.66] saturate-[.8]")}
      />
      <svg aria-hidden="true" viewBox="0 0 800 500" className="absolute inset-0 size-full text-brand-orange">
        <defs>
          <marker id={arrowId} markerWidth="3.5" markerHeight="3.5" refX="3" refY="1.75" orient="auto-start-reverse">
            <path d="M0 0 3.5 1.75 0 3.5Z" fill="currentColor" />
          </marker>
        </defs>
        <g fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" markerEnd={`url(#${arrowId})`}>
          {mode !== "Night-time" && <path data-route="solar-to-inverter" d="M475 157 H235 Q210 157 210 182 V235 Q210 254 191 254 H186" strokeDasharray={outage ? "9 8" : undefined} />}
          <path data-route="inverter-to-building" d="M186 285 H478" />
          {daytime
            ? <path data-route="inverter-to-battery" d="M150 310 V345" />
            : <path data-route="battery-to-inverter" d="M150 345 V310" />}
        </g>
      </svg>
      <DiagramLabel className="left-[58%] top-[21%]">Solar panels</DiagramLabel>
      <DiagramLabel className="left-[4%] top-[39%]">Hybrid inverter</DiagramLabel>
      <DiagramLabel className="left-[11%] bottom-[9%]">Battery</DiagramLabel>
      <DiagramLabel className="left-[65%] top-[66%]">Building</DiagramLabel>
    </figure>
  );
}

function DiagramLabel({ children, className }: { children: string; className: string }) {
  return (
    <span aria-hidden="true" className={cn("absolute rounded-sm bg-white px-1.5 py-0.5 text-[10px] leading-tight font-semibold whitespace-nowrap text-brand-navy shadow-sm sm:px-2.5 sm:py-1 sm:text-sm", className)}>
      {children}
    </span>
  );
}

export function SolarPowerExplainer({ action }: { action: OverviewAction }) {
  const [selected, setSelected] = useState<SolarMode>("Daytime");
  const panelId = useId();
  const activeMode = modes.find(({ label }) => label === selected)!;

  return (
    <div className="mt-7 grid gap-x-8 gap-y-5 sm:mt-10 lg:grid-cols-[minmax(15rem,1fr)_minmax(0,2.35fr)] lg:grid-rows-[auto_1fr]">
      <div role="group" aria-label="Solar power conditions" className="grid min-w-0 gap-2 lg:gap-3">
        {modes.map(({ label, icon: Icon, description }, index) => (
          <div key={label} className="min-w-0">
            <button
              type="button"
              aria-pressed={selected === label}
              aria-controls={`${panelId} ${panelId}-${index}`}
              onClick={(event) => {
                setSelected(label);
                scrollToOverviewButton(event.currentTarget);
              }}
              className={cn(
                "flex min-h-12 w-full cursor-pointer items-center gap-3 rounded-lg border px-4 py-2 text-left text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange motion-reduce:transition-none lg:min-h-15 lg:text-lg",
                selected === label ? "border-brand-orange bg-brand-orange text-brand-navy" : "border-white/55 text-white hover:bg-white/10",
              )}
            >
              <Icon size={24} aria-hidden="true" className="shrink-0" />
              {label}
            </button>
            <div id={`${panelId}-${index}`} aria-live="polite" className="lg:hidden">
              {selected === label && (
                <div className={`px-1 pt-3 pb-4 ${transition.reveal}`}>
                  <SolarFlowDiagram mode={label} />
                  <p className="mt-3 text-sm leading-relaxed text-white">{description}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="hidden min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:block lg:border-l lg:border-white/25 lg:pl-6">
        <div key={selected} className={transition.reveal}>
          <SolarFlowDiagram mode={selected} />
        </div>
      </div>
      <div className="lg:col-start-1 lg:row-start-2">
        <div id={panelId} aria-live="polite" className="hidden lg:block">
          <p key={selected} className={`text-base leading-relaxed text-white ${transition.reveal}`}>{activeMode.description}</p>
        </div>
        <ButtonLink href={action.href} className="w-full rounded-lg shadow-none sm:w-auto lg:mt-7 lg:w-full">{action.label}</ButtonLink>
      </div>
    </div>
  );
}
