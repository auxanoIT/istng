"use client";

import { ArrowDownRight, ArrowRight, X } from "lucide-react";
import { useRef, useState } from "react";

import { BackgroundVideo } from "@/components/ui/background-video";
import { homeVideoPoster } from "@/lib/background-media";
import { TurnstileField } from "@/components/forms/turnstile-field";
import { leadSchema } from "@/lib/schemas";
import { formErrors } from "@/lib/form-errors";
import { getBrowserCookie } from "@/lib/utils";
import { trackLead } from "@/lib/lead-analytics";
import styles from "./energy-hero.module.css";

const choices = [
  ["I want Solar Powered inverter system", "Solar powered inverter system"],
  ["I want cheaper electricity", "Reduce energy costs"],
  ["I want to control my power", "Improve power reliability"],
];

export function EnergyHero() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState("");
  const [answers, setAnswers] = useState<FormData>();
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [turnstileToken, setTurnstileToken] = useState("");
  const [verificationReset, setVerificationReset] = useState(0);
  const inFlight = useRef(false);

  async function submitEnquiry(form: HTMLFormElement) {
    if (inFlight.current) return;
    const contact = new FormData(form);
    const summary = Array.from(answers?.entries() ?? [])
      .map(([name, value]) => `${name}: ${value}`).join("\n");
    const parsed = leadSchema.safeParse({
      name: contact.get("Name"), company: contact.get("Company"), email: contact.get("Email"),
      phone: contact.get("Phone"), marketingConsent: contact.get("consent") === "on",
      serviceInterest: "Solar Energy & Power Solutions", message: summary, context: "hero",
      turnstileToken, hubspotTrackingCookie: getBrowserCookie("hubspotutk"),
    });
    setFieldErrors({});
    setFeedback("");
    if (!parsed.success) {
      const errors = formErrors(parsed.error.issues).fieldErrors;
      setFieldErrors(errors);
      setFeedback("Please check the marked fields and try again.");
      setStatus("error");
      return;
    }
    if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !turnstileToken) {
      setFeedback("Please complete the verification check before sending.");
      setStatus("error");
      return;
    }
    inFlight.current = true;
    setStatus("sending");
    try {
      const response = await fetch("/api/lead", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.ok !== true) {
        setFieldErrors(result?.fieldErrors ?? {});
        throw new Error(result?.error || "Your enquiry could not be sent. Please try again.");
      }
      setStatus("success");
      setFeedback("Thank you. Your energy enquiry has been received. Our team will contact you to discuss the next steps.");
      trackLead("hero");
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : "We could not send your enquiry. Please try again.");
    } finally {
      inFlight.current = false;
      setVerificationReset(value => value + 1);
    }
  }

  const errorFor = (name: string) => fieldErrors[name] ? <span className={styles.error}>{fieldErrors[name]}</span> : null;

  return (
    <section className={styles.hero} aria-labelledby="energy-title">
      <BackgroundVideo className={styles.video}
        src={process.env.NEXT_PUBLIC_INTEGRATED_HERO_VIDEO_URL || "https://res.cloudinary.com/dnqn2cs4e/video/upload/integrated_service_new_xd6vey.mp4"}
        poster={homeVideoPoster} />
      <div className={styles.content}>
        <h1 id="energy-title">Leaders in <em>energy solutions</em> for your business</h1>
        <p>What brings you here?</p>
        <div className={styles.choices}>
          {choices.map(([label, value]) => (
            <button key={value} type="button" aria-haspopup="dialog" onClick={() => {
              if (inFlight.current) {
                dialog.current?.showModal();
                return;
              }
              setStep(1);
              setGoal(value);
              setAnswers(undefined);
              setStatus("idle");
              setFeedback("");
              setFieldErrors({});
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
          <p className={styles.progress}>{status === "success" ? "Enquiry received" : `Step ${step} of 2`}</p>
          <h2 id="energy-enquiry-title">Let’s talk about your energy needs</h2>
          {status === "success" ? (
            <div role="status" className={styles.received}>
              <p>{feedback}</p>
              <p>You can also reach us at <a href="mailto:ask@istng.com">ask@istng.com</a> or <a href="tel:+2348050274481">08050274481</a>.</p>
              <button type="button" className={styles.action} onClick={() => dialog.current?.close()}>Done</button>
            </div>
          ) : step === 1 ? (
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
            <form className={styles.contactForm} aria-busy={status === "sending"} onSubmit={(event) => {
              event.preventDefault();
              void submitEnquiry(event.currentTarget);
            }}>
              <label>Your name<input name="Name" autoComplete="name" minLength={2} maxLength={150} aria-invalid={Boolean(fieldErrors.name)} required />{errorFor("name")}</label>
              <label>Company / household<input name="Company" autoComplete="organization" minLength={2} maxLength={150} aria-invalid={Boolean(fieldErrors.company)} required />{errorFor("company")}</label>
              <label>Email<input name="Email" type="email" autoComplete="email" aria-invalid={Boolean(fieldErrors.email)} required />{errorFor("email")}</label>
              <label>Phone<input name="Phone" type="tel" autoComplete="tel" aria-invalid={Boolean(fieldErrors.phone)} required />{errorFor("phone")}</label>
              <label className={styles.consent}><input name="consent" type="checkbox" required />
                <span>I agree that Integrated Solutions Technology may store my details and contact me by email about this enquiry.</span>
              </label>
              {errorFor("marketingConsent")}
              <TurnstileField onVerify={setTurnstileToken} resetKey={verificationReset} />
              <button className={styles.action} type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Send enquiry"} <ArrowRight size={18} /></button>
              <button className={styles.back} type="button" disabled={status === "sending"} onClick={() => { setStep(1); setFeedback(""); setFieldErrors({}); }}>Back</button>
              {feedback && <p role="alert" className={styles.error}>{feedback}</p>}
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

