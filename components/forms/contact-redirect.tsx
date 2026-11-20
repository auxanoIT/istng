"use client";

import { useEffect } from "react";

import { redirectContactEnquiry } from "@/lib/lead-attribution";

export function ContactRedirect({ destination }: { destination: string }) {
  useEffect(() => {
    redirectContactEnquiry(destination);
  }, [destination]);

  return (
    <section className="mx-auto max-w-3xl px-6 py-20 text-center">
      <h1 className="text-3xl font-semibold">Discuss your project with Integrated Solutions</h1>
      <p className="mt-5">Continue to our project enquiry form.</p>
      <a className="mt-6 inline-block underline" href={destination}>Open the consultation form</a>
      <noscript><meta httpEquiv="refresh" content={`0;url=${destination}`} /></noscript>
    </section>
  );
}
