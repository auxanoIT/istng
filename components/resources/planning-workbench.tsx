"use client";

import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, ClipboardCheck } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { getPlanningQuestions, planningChecklists } from "@/data/planning-checklists";
import type { ToolKind } from "@/lib/resources";

const inputClass = "w-full min-w-0 rounded-md border border-brand-border bg-white px-3 py-2 text-brand-navy focus-visible:outline-2 focus-visible:outline-brand-navy";
const decimal = new Intl.NumberFormat("en-NG", { maximumFractionDigits: 2 });

export function PlanningWorkbench({ kind, checklist }: { kind: ToolKind; checklist?: string[] }) {
  return <div className="space-y-10">{kind === "solar" && <SolarWorksheet />}<ReadinessChecklist key={kind} kind={kind} checklist={checklist} /></div>;
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

const answerOptions = ["Yes, prepared", "I need help", "Not sure yet"] as const;

function ReadinessChecklist({ kind, checklist }: { kind: ToolKind; checklist?: string[] }) {
  const questions = getPlanningQuestions(kind, checklist);
  const config = planningChecklists[kind];
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [step, setStep] = useState(0);
  const [review, setReview] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const answered = Object.keys(answers).length;
  const complete = answered === questions.length;
  const prepared = Object.values(answers).filter(answer => answer === answerOptions[0]).length;
  const booking = `/book-consultation?${new URLSearchParams({ service: config.service, section: "Project planning checklist" })}#project-enquiry`;
  function move(index: number, showReview = false) {
    setStep(index);
    setReview(showReview);
    requestAnimationFrame(() => {
      heading.current?.focus({ preventScroll: true });
      if (window.matchMedia("(max-width: 1023px)").matches) heading.current?.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    });
  }
  return <div className="overflow-hidden rounded-2xl border border-brand-border bg-white" data-planning-checklist>
    <div className="border-b border-brand-border px-5 py-7 sm:px-8">
      <div className="flex items-center gap-3 text-brand-navy"><ClipboardCheck className="size-6 text-[var(--brand-orange-text)]" aria-hidden /><h2 className="text-2xl font-semibold">A clearer starting point for your project.</h2></div>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-brand-support">{config.introduction}</p>
      <div className="mt-6 flex items-center justify-between gap-4 text-sm"><p aria-live="polite" className="font-semibold text-brand-navy">{answered} of {questions.length} answered</p><button type="button" onClick={() => { setAnswers({}); move(0); }} disabled={!answered} className="min-h-11 font-medium text-brand-support underline underline-offset-4 disabled:opacity-40">Start again</button></div>
      <div role="progressbar" aria-label="Questions answered" aria-valuenow={answered} aria-valuemin={0} aria-valuemax={questions.length} className="h-1.5 overflow-hidden rounded-full bg-brand-border"><div className="h-full bg-brand-orange transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${answered / questions.length * 100}%` }} /></div>
    </div>
    <div className="grid lg:grid-cols-[1.7fr_1fr]">
      <div className="min-w-0 p-5 sm:p-8">
        <h3 ref={heading} tabIndex={-1} className="scroll-mt-28 text-xs font-semibold tracking-[.15em] text-brand-support outline-none">{review ? "YOUR PLANNING SUMMARY" : `QUESTION ${String(step + 1).padStart(2, "0")} / ${questions.length}`}</h3>
        {review ? <div className="mt-5">
          <h4 className="text-2xl leading-snug font-semibold text-brand-navy">Ready to talk through the next steps?</h4>
          <p className="mt-3 text-sm leading-7 text-brand-support">You have reviewed all {questions.length} questions. Bring these notes to your consultation so we can discuss the details and arrange any assessment your project needs.</p>
          <ul className="mt-6 divide-y divide-brand-border">{questions.map((question, index) => <li key={question.prompt} className="py-3"><button type="button" onClick={() => move(index)} className="group flex w-full items-start justify-between gap-4 text-left"><span className="text-sm leading-6 text-brand-navy">{index + 1}. {question.prompt}<span className="mt-1 block text-xs text-brand-support">{answers[index]}</span></span><span className="shrink-0 text-xs font-semibold text-[var(--brand-orange-text)] group-hover:underline">Edit</span></button></li>)}</ul>
          <ButtonLink href={booking} className="mt-7 w-full sm:w-auto">Book a Technical Consultation <ArrowRight size={17} aria-hidden /></ButtonLink>
          <p className="mt-3 text-xs leading-6 text-brand-support">Your answers stay on this page and are not submitted automatically. The next page lets you send your enquiry.</p>
        </div> : <fieldset className="mt-5">
          <legend className="text-2xl leading-snug font-semibold text-brand-navy sm:text-3xl">{questions[step].prompt}</legend>
          <p className="mt-4 text-sm leading-7 text-brand-support">{questions[step].guidance}</p>
          <div className="mt-6 grid gap-3">{answerOptions.map(option => <label key={option} className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${answers[step] === option ? "border-brand-orange bg-brand-tint text-brand-navy" : "border-brand-border text-brand-navy hover:border-brand-orange"}`}><input type="radio" name={`planning-question-${step}`} value={option} checked={answers[step] === option} onChange={() => setAnswers(current => ({ ...current, [step]: option }))} className="size-4 accent-brand-navy" />{option}</label>)}</div>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3"><button type="button" onClick={() => move(step - 1)} disabled={step === 0} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand-navy disabled:opacity-30"><ArrowLeft size={16} aria-hidden /> Previous</button><button type="button" disabled={!answers[step]} onClick={() => { if (step === questions.length - 1) { const unanswered = questions.findIndex((_, index) => !answers[index]); move(unanswered < 0 ? step : unanswered, unanswered < 0); } else move(step + 1); }} className="inline-flex min-h-11 items-center gap-2 rounded-md bg-brand-orange px-5 py-3 text-sm font-semibold text-brand-navy disabled:cursor-not-allowed disabled:opacity-40">{step === questions.length - 1 ? complete ? "Review my answers" : "Continue checklist" : "Next question"}<ArrowRight size={16} aria-hidden /></button></div>
        </fieldset>}
      </div>
      <aside className="border-t border-brand-border bg-brand-soft-white p-5 sm:p-8 lg:border-t-0 lg:border-l">
        <p className="text-sm font-semibold text-brand-navy">Your project preparation</p>
        <p className="mt-3 text-sm leading-7 text-brand-support">{prepared} prepared · {answered - prepared} to discuss</p>
        <nav aria-label="Planning questions" className="mt-5 grid grid-cols-5 gap-2">{questions.map((question, index) => <button key={question.prompt} type="button" onClick={() => move(index)} aria-label={`Question ${index + 1}${answers[index] ? ', answered' : ''}`} aria-current={!review && step === index ? "step" : undefined} className={`flex min-h-11 items-center justify-center rounded-md border text-sm font-semibold ${!review && step === index ? "border-brand-navy bg-brand-navy text-white" : answers[index] ? "border-brand-orange bg-brand-tint text-brand-navy" : "border-brand-border bg-white text-brand-support"}`}>{index + 1}{answers[index] && <Check size={12} className="ml-1" aria-hidden />}</button>)}</nav>
        {complete && !review && <button type="button" onClick={() => move(step, true)} className="mt-5 min-h-11 text-sm font-semibold text-brand-navy underline underline-offset-4">View my summary</button>}
        <div className="mt-8 border-t border-brand-border pt-6"><p className="text-sm font-semibold text-brand-navy">What happens next?</p><ol className="mt-3 space-y-3 text-sm leading-6 text-brand-support"><li>1. Review what is prepared and where you need help.</li><li>2. Send a project enquiry using the booking page.</li><li>3. Our team discusses your requirements and any site assessment needed.</li></ol></div>
        <p className="mt-6 text-xs leading-6 text-brand-support">This is a preparation guide, not a technical assessment, equipment recommendation or quotation.</p>
      </aside>
    </div>
  </div>;
}
