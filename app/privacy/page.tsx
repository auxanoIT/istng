import { Container } from "@/components/ui/container";
import { CookiePreferences } from "@/components/layout/cookie-preferences";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Website Privacy & Cookies | Integrated Solutions Technology", description: "How Integrated Solutions Technology uses website enquiries, optional analytics and cookies, and how to change your cookie preferences.", path: "/privacy" });

export default function PrivacyPage() {
  return <Container className="py-16 sm:py-24">
    <article className="mx-auto max-w-3xl space-y-8 text-[var(--color-ink)]">
      <h1 className="text-3xl font-semibold sm:text-4xl">Website Privacy &amp; Cookies</h1>
      <p className="leading-7">This notice explains how Integrated Solutions Technology uses information collected through istng.com.</p>
      <section className="space-y-3"><h2 className="text-xl font-semibold">Project enquiries</h2><p className="leading-7">When you submit an enquiry, we use the contact details and project information you provide to review your requirements and respond. The website uses HubSpot to manage enquiries and email services to notify our team. Please avoid including sensitive information that is unnecessary for your request.</p></section>
      <section className="space-y-3"><h2 className="text-xl font-semibold">Optional analytics and chat</h2><p className="leading-7">If you accept optional cookies, Google Analytics measures website visits, successful enquiry submissions and contact-link clicks. Our custom lead events do not include your name, email address, phone number or message. Optional services also include HubSpot website tracking, Vercel analytics and performance measurement, and Tawk.to live chat.</p><p className="leading-7">Google may process information about your browser, device and website activity. Read <a className="underline" href="https://policies.google.com/technologies/partner-sites">how Google uses information from sites that use its services</a>.</p></section>
      <section className="space-y-3"><h2 className="text-xl font-semibold">Your cookie choice</h2><p className="leading-7">Optional tracking and chat load only after you accept. Declining does not prevent you from browsing or submitting an enquiry. We remember your choice for up to one year. You can reopen the choice below; your browser settings can also clear cookies already stored on your device.</p><CookiePreferences /></section>
      <section className="space-y-3"><h2 className="text-xl font-semibold">Essential website services</h2><p className="leading-7">Website hosting, form delivery and Cloudflare Turnstile verification support the operation and security of the website. These services may process technical information needed to deliver pages and protect enquiry forms from abuse.</p></section>
      <section className="space-y-3"><h2 className="text-xl font-semibold">Contact us about your information</h2><p className="leading-7">For privacy questions or requests about information you have submitted, contact <a className="underline" href="mailto:ask@istng.com">ask@istng.com</a> or write to Integrated Solutions Technology, 26A Adeshina Street, Obafemi Awolowo Way, Ikeja, Lagos.</p></section>
    </article>
  </Container>;
}
