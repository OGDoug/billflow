import type { Metadata } from "next";
import SeoPage from "../seo-page";
import { SITE_URL } from "@/lib/stripe";

const title = "Free Invoice Generator | Create Professional Invoices Online | Duxbill";
const description =
  "Use Duxbill's free invoice generator to create professional invoices online, add line items and tax, and export a clean PDF in minutes.";
const path = "/free-invoice-generator";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "free invoice generator",
    "invoice generator online",
    "create invoice free",
    "invoice pdf generator",
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

export default function FreeInvoiceGeneratorPage() {
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      description,
      url: `${SITE_URL}${path}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What should a free invoice generator include?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A useful invoice generator should let you add sender and client details, line items, pricing, tax, notes, and a due date, then export a professional PDF.",
          },
        },
        {
          "@type": "Question",
          name: "Can I create an invoice without signing up?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Duxbill lets you create invoices in the browser without requiring an account before you get started.",
          },
        },
      ],
    },
  ];

  return (
    <SeoPage
      eyebrow="Free invoice tool"
      title="Free invoice generator for freelancers and small businesses"
      intro="Create polished invoices without wrestling with spreadsheets or clunky software. Duxbill helps you build an invoice, calculate totals, and export a clean PDF from your browser in a few minutes."
      ctaLabel="Open Free Invoice Generator"
      sections={[
        {
          title: "What a good invoice generator should actually do",
          body: [
            "A free invoice generator is only useful if it helps you send something professional quickly. That means collecting the essential business details, supporting line items and taxes, and producing a PDF your client can read without confusion.",
            "Duxbill is designed around that core workflow. You can enter your business details, add products or services, set a due date, include notes, and create a finished invoice without needing to format a document by hand.",
          ],
          bullets: [
            "Add your business name and address so clients know exactly who billed them.",
            "Include client contact details to reduce payment delays and back-and-forth.",
            "List products or services with quantities, rates, and tax where needed.",
            "Generate a clear total and export a PDF that is ready to send.",
          ],
        },
        {
          title: "Why freelancers use an online invoice generator instead of a template",
          body: [
            "Templates are useful, but they still require manual editing every time you invoice someone. An online generator can speed that up by handling structure, totals, and formatting for you.",
            "If you invoice regularly, the time savings add up fast. You spend less effort fixing layouts and more effort making sure the invoice is accurate, which matters more to getting paid on time.",
          ],
        },
        {
          title: "What to include before you send an invoice",
          body: [
            "Before you send any invoice, check that the basics are covered: your business details, the client name, a unique invoice number, the service period or item descriptions, pricing, taxes, and a due date. Missing one of those pieces is one of the easiest ways to create payment friction.",
            "A short note with payment terms can also help. For example, if you expect bank transfer within 14 days or charge late fees after a certain date, add that clearly in the notes section.",
          ],
        },
        {
          title: "When Duxbill is a strong fit",
          body: [
            "Duxbill works well for solo freelancers, consultants, designers, developers, contractors, and small teams that want a fast invoice workflow without bloated accounting software.",
            "It is especially useful if your immediate goal is simple: create a clean invoice, export a PDF, and keep moving. You do not need to set up a complex system just to send a bill.",
          ],
        },
      ]}
      faqs={[
        {
          question: "What should a free invoice generator include?",
          answer:
            "At minimum, it should support your business information, client details, invoice numbering, itemized charges, taxes, payment notes, and PDF export. If any of those are missing, you usually end up editing the invoice manually somewhere else.",
        },
        {
          question: "Can I create an invoice without signing up?",
          answer:
            "Yes. Duxbill is built so you can start drafting an invoice right away in your browser instead of going through a long onboarding flow first.",
        },
        {
          question: "Is a generated invoice still professional enough to send to clients?",
          answer:
            "Yes, if it includes the right information and is formatted clearly. Clients care more about readability, accuracy, and clear payment terms than whether you made the invoice in a spreadsheet or a dedicated tool.",
        },
      ]}
      relatedLinks={[
        {
          href: "/freelance-invoice-template",
          label: "Freelance invoice template guide",
          description: "See what a freelancer-focused invoice template should include and how to adapt it for repeat client work.",
        },
        {
          href: "/how-to-create-an-invoice",
          label: "How to create an invoice",
          description: "Learn the core steps, common mistakes, and best practices for building invoices clients can approve and pay quickly.",
        },
        {
          href: "/invoice-template-for-contractors",
          label: "Invoice template for contractors",
          description: "Learn how to bill labor, materials, deposits, and job phases more clearly.",
        },
        {
          href: "/invoice-template-for-designers",
          label: "Invoice template for designers",
          description: "See how designers can invoice projects, retainers, and revision rounds with better clarity.",
        },
      ]}
      schema={schema}
    />
  );
}
