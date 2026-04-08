import type { Metadata } from "next";
import SeoPage from "../seo-page";
import { SITE_URL } from "@/lib/stripe";

const title = "Freelance Invoice Template Guide | What to Include | Duxbill";
const description =
  "Learn how to use a freelance invoice template that covers client details, scope, rates, payment terms, and the exact information needed to get paid faster.";
const path = "/freelance-invoice-template";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "freelance invoice template",
    "invoice template for freelancers",
    "freelancer billing template",
    "consultant invoice template",
    "duxbill",
  ],
  alternates: {
    canonical: path,
  },
  openGraph: {
    title,
    description,
    url: `${SITE_URL}${path}`,
    siteName: "Duxbill",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function FreelanceInvoiceTemplatePage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    mainEntityOfPage: `${SITE_URL}${path}`,
    author: {
      "@type": "Organization",
      name: "Duxbill",
    },
  };

  return (
    <SeoPage
      eyebrow="Freelancer billing guide"
      title="Freelance invoice template: what to include and how to use it"
      intro="A freelance invoice template should do more than look clean. It should make the job, rate, terms, and payment deadline obvious so clients can approve and pay without extra questions."
      ctaLabel="Create a Freelancer Invoice"
      sections={[
        {
          title: "The purpose of a freelance invoice template",
          body: [
            "Freelancers usually need repeatable structure more than fancy design. A good invoice template gives you a reliable format for billing projects, retainers, one-off services, or productized work without rebuilding the document every time.",
            "The goal is consistency. When your invoices always show the same essential details in the same places, clients know how to process them and you spend less time correcting omissions.",
          ],
          bullets: [
            "Your business name and contact details.",
            "The client or company being billed.",
            "A unique invoice number and issue date.",
            "A clear description of work completed or deliverables provided.",
            "Rates, quantities, taxes, and the final total.",
            "Payment terms, due date, and instructions.",
          ],
        },
        {
          title: "How freelancers should describe their work",
          body: [
            "One of the biggest invoice mistakes is using vague line items like 'design work' or 'consulting.' That may be technically true, but it often creates follow-up questions from clients or finance teams.",
            "Use line items that anchor the invoice to the project scope. Instead of a generic label, write something like 'Homepage wireframes and revisions' or 'April SEO consulting retainer.' Clear descriptions help clients match your invoice to the work they approved.",
          ],
        },
        {
          title: "Template vs. invoice generator",
          body: [
            "A static template can work if you invoice occasionally. But if you bill clients every month, a generator usually removes repetitive formatting work and reduces the chance of manual math errors.",
            "Duxbill gives you the structure of a good freelance invoice template while handling totals and PDF output for you. That keeps the workflow simple without forcing you into a heavy accounting platform.",
          ],
        },
        {
          title: "Best practices that improve payment speed",
          body: [
            "Freelancers often focus on the design of the invoice and overlook the operational details that drive payment. Fast payment usually comes down to clarity, not decoration.",
          ],
          bullets: [
            "Use an invoice number format that is easy to reference in emails.",
            "Include the due date explicitly instead of writing only 'net 14' or 'net 30.'",
            "Match the client name to the legal entity or team that actually pays invoices.",
            "State accepted payment methods in the notes area.",
            "Send the invoice promptly while the work is still fresh for the client.",
          ],
        },
      ]}
      faqs={[
        {
          question: "What makes a freelance invoice template different from a general invoice template?",
          answer:
            "Freelance invoices often need more context around services, project phases, retainers, or hourly work. They also benefit from clearer notes and descriptions because the billed work is less standardized than product sales.",
        },
        {
          question: "Should freelancers use hourly or fixed-fee line items?",
          answer:
            "Use whichever matches your agreement. Hourly items should show hours and rate clearly. Fixed-fee items should name the deliverable or milestone so the client can connect the amount to the agreed scope.",
        },
        {
          question: "Can I reuse the same structure for all clients?",
          answer:
            "Usually yes, but you should still adapt line-item descriptions, payment instructions, tax handling, and legal entity names to match each client relationship.",
        },
      ]}
      relatedLinks={[
        {
          href: "/free-invoice-generator",
          label: "Free invoice generator",
          description: "Skip manual templates and build a ready-to-send invoice online with PDF export.",
        },
        {
          href: "/how-to-create-an-invoice",
          label: "How to create an invoice",
          description: "Use a practical step-by-step checklist for writing invoices correctly the first time.",
        },
        {
          href: "/invoice-template-for-designers",
          label: "Invoice template for designers",
          description: "See how creative freelancers can structure invoices around deliverables, retainers, and revisions.",
        },
      ]}
      schema={schema}
    />
  );
}
