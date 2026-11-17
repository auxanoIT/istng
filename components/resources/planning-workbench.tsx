"use client";

import { useState } from "react";
import type { ToolKind } from "@/lib/resources";

const defaults = {
  infrastructure: ["List the devices, racks and rooms in scope", "Document existing network and power connections", "Confirm available rack space, cooling and access", "Identify the maintenance window and handover owner"],
  security: ["List the areas that need monitoring or controlled access", "Identify existing cameras, access devices and network coverage", "Record lighting conditions and mounting constraints", "Confirm who will manage access, footage and retention"],
};
const inputClass = "w-full min-w-0 rounded-md border border-brand-border bg-white px-3 py-2 text-brand-navy focus-visible:outline-2 focus-visible:outline-brand-navy";
const decimal = new Intl.NumberFormat("en-NG", { maximumFractionDigits: 2 });

export function PlanningWorkbench({ kind, checklist }: { kind: ToolKind; checklist?: string[] }) {
  return kind === "solar" ? <SolarWorksheet /> : <ReadinessChecklist items={checklist?.filter(item => item.trim()).length ? [...new Set(checklist.filter(item => item.trim()))] : defaults[kind]} />;
}

function SolarWorksheet() {
  const [rows, setRows] = useState([{ id: 1, name: "", watts: "", hours: "" }]);
  const [nextId, setNextId] = useState(2);
  const total = rows.reduce((sum, { watts, hours }) => sum + (Number(watts) >= 0 && Number(hours) >= 0 && Number(hours) <= 24 ? Number(watts) * Number(hours) / 1000 : 0), 0);
  function change(id: number, field: "name" | "watts" | "hours", value: string) {
    setRows(current => current.map(row => row.id === id ? { ...row, [field]: value } : row));
  }
  return <div className="rounded-xl border border-brand-border bg-white p-5 sm:p-8">
    <h2 className="text-2xl font-semibold text-brand-navy">Estimate daily electricity use</h2>
    <p className="mt-2 text-sm leading-6 text-brand-support">Use one row for each appliance or group of appliances. Enter the total watts for that row and the hours used each day.</p>
    <div className="mt-6 grid gap-4">
      {rows.map(({ id, name, watts, hours }, index) => <fieldset key={id} className="grid gap-3 rounded-lg border border-brand-border p-3 sm:grid-cols-[minmax(0,1fr)_7rem_8rem_auto] sm:items-end">
        <legend className="px-1 text-xs font-semibold text-brand-support">Appliance {index + 1}</legend>
        <label className="text-sm font-medium text-brand-navy">Appliance<input className={inputClass} placeholder="e.g. Lighting" value={name} onChange={event => change(id, "name", event.target.value)} /></label>
        <label className="text-sm font-medium text-brand-navy">Total watts<input className={inputClass} type="number" min="0" step="any" inputMode="decimal" value={watts} onChange={event => change(id, "watts", event.target.value)} /></label>
        <label className="text-sm font-medium text-brand-navy">Hours per day<input className={inputClass} type="number" min="0" max="24" step="any" inputMode="decimal" value={hours} onChange={event => change(id, "hours", event.target.value)} /></label>
        {rows.length > 1 && <button type="button" aria-label={`Remove appliance ${index + 1}`} onClick={() => setRows(current => current.filter(row => row.id !== id))} className="min-h-10 text-left text-sm font-semibold text-brand-navy underline underline-offset-4">Remove</button>}
        {((hours !== "" && (Number(hours) < 0 || Number(hours) > 24)) || (watts !== "" && Number(watts) < 0)) && <p className="text-sm text-red-700 sm:col-span-full">Enter watts of zero or more and between 0 and 24 hours per day.</p>}
      </fieldset>)}
    </div>
    <button type="button" onClick={() => { setRows(current => [...current, { id: nextId, name: "", watts: "", hours: "" }]); setNextId(nextId + 1); }} className="mt-4 min-h-11 font-semibold text-brand-navy underline decoration-brand-orange underline-offset-4">+ Add appliance</button>
    <div className="mt-6 rounded-lg bg-brand-navy p-5 text-white">
      <p className="text-sm text-white/80">Estimated daily electricity use</p>
      <output aria-live="polite" className="mt-2 block text-3xl font-semibold">{Number.isFinite(total) ? decimal.format(total) : "—"} kWh/day</output>
      <p className="mt-3 text-sm leading-6 text-white/75">Use this as a starting point for a consultation. Actual consumption varies with equipment and usage.</p>
    </div>
  </div>;
}

function ReadinessChecklist({ items }: { items: string[] }) {
  const [checked, setChecked] = useState<string[]>([]);
  return <div className="rounded-xl border border-brand-border bg-white p-5 sm:p-8">
    <h2 className="text-2xl font-semibold text-brand-navy">Project readiness checklist</h2>
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
      <p aria-live="polite" className="text-sm font-semibold text-brand-navy">{checked.length} of {items.length} ready</p>
      <button type="button" onClick={() => setChecked([])} disabled={checked.length === 0} className="min-h-11 text-sm font-semibold text-brand-navy underline underline-offset-4 disabled:text-brand-support disabled:no-underline">Reset checklist</button>
    </div>
    <progress value={checked.length} max={items.length} aria-label="Checklist completion" className="mt-1 h-2 w-full accent-brand-orange" />
    <ul className="mt-5 divide-y divide-brand-border">{items.map(item => <li key={item}>
      <label className="flex min-h-12 cursor-pointer items-start gap-3 py-4 text-sm leading-6 text-brand-navy">
        <input type="checkbox" className="mt-1 size-4 shrink-0 accent-brand-navy" checked={checked.includes(item)} onChange={event => setChecked(current => event.target.checked ? [...current, item] : current.filter(value => value !== item))} />
        {item}
      </label>
    </li>)}</ul>
  </div>;
}
