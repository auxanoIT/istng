"use client";

import { ArrowDownRight, ArrowRight, X } from "lucide-react";
import { useRef, useState } from "react";

import { BackgroundVideo } from "@/components/ui/background-video";
import styles from "./energy-hero.module.css";

const choices = [
  ["I want cheaper electricity", "Reduce energy costs"],
  ["I want to go green", "Switch to cleaner energy"],
  ["I want to control my power", "Improve power reliability"],
];

export function EnergyHero() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState("");
  const [answers, setAnswers] = useState<FormData>();
  const [draft, setDraft] = useState("");

  return (
    <section className={styles.hero} aria-labelledby="energy-title">
      <BackgroundVideo className={styles.video}
        src={process.env.NEXT_PUBLIC_INTEGRATED_HERO_VIDEO_URL || "https://res.cloudinary.com/dnqn2cs4e/video/upload/integrated_service_new_xd6vey.mp4"}
        poster="/integrated-assets/images/solar-campus.webp" />
      <div className={styles.content}>
        <h1 id="energy-title">Leaders in <em>energy solutions</em> for your business</h1>
        <p>What brings you here?</p>
        <div className={styles.choices}>
          {choices.map(([label, value]) => (
            <button key={value} type="button" aria-haspopup="dialog" onClick={() => {
              setStep(1);
              setGoal(value);
              setAnswers(undefined);
              setDraft("");
              dialog.current?.showModal();
            }}>
              {label} <ArrowDownRight size={18} aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>
      <dialog ref={dialog} className={styles.drawer} aria-labelledby="energy-enquiry-title"
        onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
        <div className={styles.panel}>
          <button type="button" className={styles.close} aria-label="Close enquiry" onClick={() => dialog.current?.close()}><X /></button>
          <p className={styles.progress}>Step {step} of 2</p>
          <h2 id="energy-enquiry-title">Let’s talk about your energy needs</h2>
          {step === 1 ? (
            <form onSubmit={(event) => {
              event.preventDefault();
              setAnswers(new FormData(event.currentTarget));
              setStep(2);
              dialog.current?.scrollTo(0, 0);
            }}>
              <RadioGroup name="Support" title="How can we help?" options={["I have a solution in mind", "Help me choose a solution"]} selected={answers?.get("Support")?.toString()} />
              <RadioGroup name="Goal" title="What matters most to your business?" options={choices.map(([, value]) => value)} selected={goal} onChange={setGoal} />
              <RadioGroup name="Monthly spend" title="What is your monthly electricity spend?" options={["Below ₦500,000", "₦500,000 or more", "I’m not sure yet"]} selected={answers?.get("Monthly spend")?.toString()} />
              <button className={styles.action} type="submit">Next <ArrowRight size={18} /></button>
            </form>
          ) : (
            <form onSubmit={(event) => {
              event.preventDefault();
              const contact = new FormData(event.currentTarget);
              const summary = Array.from(answers?.entries() ?? []).concat(Array.from(contact.entries()))
                .filter(([, value]) => value)
                .map(([name, value]) => `${name}: ${value}`).join("\n");
              setDraft(`https://wa.me/2348050274481?text=${encodeURIComponent("Hello Integrated Solutions Technology, I’d like to discuss an energy project.\n\n" + summary)}`);
            }}>
              <label>Your name<input name="Name" autoComplete="name" required /></label>
              <label>Company<input name="Company" autoComplete="organization" required /></label>
              <label>Work email<input name="Email" type="email" autoComplete="email" required /></label>
              <label>Phone<input name="Phone" type="tel" autoComplete="tel" /></label>
              <button className={styles.action} type="submit">Prepare enquiry <ArrowRight size={18} /></button>
              <button className={styles.back} type="button" onClick={() => { setStep(1); setDraft(""); }}>Back</button>
              {draft && <p role="status"><a href={draft} target="_blank" rel="noopener noreferrer">Open your prepared enquiry in WhatsApp</a></p>}
            </form>
          )}
        </div>
      </dialog>
    </section>
  );
}

function RadioGroup({ name, title, options, selected, onChange }: { name: string; title: string; options: string[]; selected?: string; onChange?: (value: string) => void }) {
  return (
    <fieldset>
      <legend>{title}</legend>
      {options.map((option) => (
        <label key={option}><input type="radio" name={name} value={option} required checked={onChange ? option === selected : undefined} defaultChecked={onChange ? undefined : option === selected} onChange={onChange ? () => onChange(option) : undefined} />{option}</label>
      ))}
    </fieldset>
  );
}

