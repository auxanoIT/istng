import nodemailer from "nodemailer";
import { siteIdentity } from "../data/site-identity";

export type EnquiryEmailDetails = {
  name: string;
  company: string;
  email: string;
  phone: string;
  serviceInterest: string;
  message: string;
  context: "hero" | "contact" | "consultation";
};

// This mailbox forwards internally; sending to its aliases as well duplicates alerts.
const recipients = ["ask@istng.com"];
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);

export function buildEnquiryEmails(details: EnquiryEmailDetails) {
  const kind = details.context === "hero" ? "Solar energy enquiry" : "Booking & discussion enquiry";
  const footer = `Integrated Solutions Technology\n${siteIdentity.address}\n${siteIdentity.email} | ${siteIdentity.phone}\nhttps://istng.com`;
  const acknowledgement = [
    `Hello ${details.name},`, "",
    "Thank you for contacting Integrated Solutions Technology. We have received your enquiry.", "",
    details.context === "hero"
      ? "Our team will review your energy needs and contact you to discuss a suitable next step."
      : "Our team will review your requirements and contact you to discuss the next steps. If you requested a consultation, we will agree a date and time with you before confirming an appointment.",
    "", `Your area of interest: ${details.serviceInterest}`, "",
    "If you need to add anything, reply to this email or call 08050274481.", "",
    "Kind regards,", "The Integrated Solutions Technology Team", "", footer,
  ].join("\n");
  return {
    notification: {
      to: recipients,
      replyTo: details.email,
      subject: `New ${kind.toLowerCase()} — Integrated Solutions`,
      text: [`${kind} received via istng.com`, "", `Name: ${details.name}`, `Company: ${details.company}`,
        `Email: ${details.email}`, `Phone: ${details.phone}`, `Service: ${details.serviceInterest}`,
        `Source: ${details.context}`, "", "Project details:", details.message].join("\n"),
    },
    acknowledgement: {
      to: details.email,
      replyTo: siteIdentity.email,
      subject: "We’ve received your enquiry — Integrated Solutions Technology",
      text: acknowledgement,
      html: `<div style="background:#f7f8f8;padding:32px 16px;font-family:Arial,sans-serif;color:#002b3b"><div style="max-width:600px;margin:auto;background:white;border-top:4px solid #ff9944;padding:32px"><p style="font-size:13px;font-weight:700;letter-spacing:1px">INTEGRATED SOLUTIONS</p><h1 style="font-size:26px;line-height:1.25">Thank you. Your enquiry is with us.</h1>${acknowledgement.split("\n\n").map(paragraph => `<p style="font-size:15px;line-height:1.7">${escapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`).join("")}</div></div>`,
    },
  };
}

export async function sendEnquiryEmails(details: EnquiryEmailDetails, savedInHubSpot: boolean) {
  const user = process.env.ZOHO_SMTP_USER;
  const pass = process.env.ZOHO_SMTP_PASSWORD;
  if (!user || !pass) return { notificationSent: false, storedByEmail: false, acknowledgementSent: false };
  const port = Number(process.env.ZOHO_SMTP_PORT || "465");
  if (![465, 587].includes(port)) return { notificationSent: false, storedByEmail: false, acknowledgementSent: false };
  const transport = nodemailer.createTransport({
    host: process.env.ZOHO_SMTP_HOST || "smtppro.zoho.com",
    port,
    secure: port === 465,
    requireTLS: port === 587,
    auth: { user, pass },
    connectionTimeout: 8_000,
    greetingTimeout: 8_000,
    socketTimeout: 12_000,
    tls: { minVersion: "TLSv1.2" },
  });
  const from = { name: "Integrated Solutions Technology", address: process.env.ZOHO_SMTP_FROM || user };
  const messages = buildEnquiryEmails(details);
  let notificationSent = false;
  let storedByEmail = false;
  let acknowledgementSent = false;
  try {
    const result = await transport.sendMail({ from, ...messages.notification, disableFileAccess: true, disableUrlAccess: true });
    storedByEmail = result.accepted.length > 0;
    notificationSent = recipients.every(recipient => result.accepted.some((address: string | { address: string }) =>
      (typeof address === "string" ? address : address.address).toLowerCase() === recipient));
  } catch {
    console.error("Enquiry notification email was not accepted by the mail provider.");
  }
  // An acknowledgement must never claim receipt when neither destination saved the enquiry.
  if (savedInHubSpot || storedByEmail) {
    try {
      const result = await transport.sendMail({ from, ...messages.acknowledgement, disableFileAccess: true, disableUrlAccess: true });
      acknowledgementSent = result.accepted.length > 0;
    } catch {
      console.error("Enquiry acknowledgement email was not accepted by the mail provider.");
    }
  }
  transport.close();
  return { notificationSent, storedByEmail, acknowledgementSent };
}
