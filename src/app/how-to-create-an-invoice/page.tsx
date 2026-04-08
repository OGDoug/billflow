import type { Metadata } from "next";
import SeoPage from "../seo-page";
import { SITE_URL } from "@/lib/stripe";

const title = "How to Create an Invoice: Step-by-Step Guide | Duxbill";
const description =
  "Learn how to create an invoice with the right details, a clear review checklist, and fewer manual billing mistakes before you send it.";
const path = "/how-to-create-an-invoice";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "how to create an invoice",
    "how to write an invoice",
    "invoice guide",
    "invoice example",
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

export default function HowToCreateAnInvoicePage() {
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title,
      description,
      mainEntityOfPage: `${SITE_URL}${path}`,
      author: {
        "@type": "Organization",
        name: "Duxbill",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "How to create an invoice",
      description,
      step: [
        { "@type": "HowToStep", name: "Add the core invoice details" },
        { "@type": "HowToStep", name: "Describe the billed work clearly" },
        { "@type": "HowToStep", name: "Set dates, totals, and payment terms" },
        { "@type": "HowToStep", name: "Review the invoice before sending" },
      ],
    },
  ];

  return (
    <SeoPage
      eyebrow="Invoice creation guide"
      title="How to create an invoice clients can review and pay quickly"
      intro="Creating an invoice does not need a long manual workflow. What matters is using a clear structure, checking the details that affect payment, and turning the invoice into something ready to send without extra document cleanup."
      ctaLabel="Create Invoice in Duxbill"
      secondaryCtaLabel="Start Free Account"
      sections={[
        {
          title: "Start with the core invoice details",
          body: [
            "Every invoice needs the same foundation: who is billing, who is being billed, and what this invoice is called. That means your business details, the client details, an invoice number, and the relevant dates.",
            "You do not need to overthink this section, but it does need to be accurate. Incorrect names, missing dates, or inconsistent numbering create avoidable delays later.",
          ],
          bullets: [
            "Business name and contact details.",
            "Client name and billing contact.",
            "Invoice number, issue date, and due date.",
          ],
        },
        {
          title: "Describe the billed work clearly",
          body: [
            "This is the part clients read most closely. Use line items that make the charges easy to approve, whether you bill by hour, project, milestone, or service period.",
            "The goal is not to recreate the full project history on the invoice. It is to describe the billed work clearly enough that the client or finance team can process it without questions.",
          ],
        },
        {
          title: "Set totals and payment terms",
          body: [
            "Once the charges are listed, the rest is operational: totals, tax treatment if it applies, and the payment instructions the client needs to act on. This section should remove ambiguity, not add more text.",
            "If there is a purchase order number, service period, or milestone name that helps the client process payment, include it. Keep notes short and useful.",
          ],
        },
        {
          title: "Use a short review checklist before sending",
          body: [
            "Before sending the invoice, do a fast review. Most billing mistakes are small and preventable, and catching them here is easier than correcting the invoice after the client receives it.",
          ],
          bullets: [
            "Check that the invoice number is unique.",
            "Confirm the due date and payment terms match your agreement.",
            "Make sure every line item description is specific enough to approve.",
            "Verify subtotal, tax, and total amounts.",
            "Make sure the invoice is in a clean send-ready format.",
          ],
        },
        {
          title: "Common invoice mistakes to avoid",
          body: [
            "Most invoice problems are not complicated. They come from leaving out key details, writing vague line items, or relying on a manual workflow that makes errors easy to miss.",
          ],
          bullets: [
            "Sending an invoice without a due date.",
            "Using generic descriptions that do not map to the work performed.",
            "Forgetting tax where it is legally required.",
            "Addressing the invoice to an individual instead of the paying company entity.",
            "Waiting too long after finishing the work to bill for it.",
          ],
        },
        {
          title: "Why most businesses stop creating invoices by hand",
          body: [
            "You can absolutely learn the structure of a good invoice from a guide like this one. The friction appears when you keep repeating the same manual steps in a document editor or spreadsheet every time you bill someone.",
            "That is where Duxbill fits. It turns this checklist into a faster invoice-creation workflow, which is usually the more sensible next step once you know what belongs on the invoice.",
          ],
        },
      ]}
      faqs={[
        {
          question: "What are the minimum details every invoice needs?",
          answer:
            "At minimum, include your business details, the client details, an invoice number, issue date, due date, itemized charges, the amount due, and payment terms or instructions.",
        },
        {
          question: "Do I need to include payment terms on every invoice?",
          answer:
            "Yes. Even if you already discussed them in a contract, including payment terms on the invoice itself reduces ambiguity and gives clients a clear deadline to work from.",
        },
        {
          question: "What is the easiest way to create an invoice?",
          answer:
            "The easiest approach is usually an invoice tool that already handles structure and formatting. That lets you focus on the information that matters instead of rebuilding the invoice manually each time.",
        },
      ]}
      relatedLinks={[
        {
          href: "/free-invoice-generator",
          label: "Use the free invoice generator",
          description: "Apply this guide in a faster invoice workflow instead of building the document by hand.",
        },
        {
          href: "/freelance-invoice-template",
          label: "Freelance invoice template guide",
          description: "See how to adapt invoice structure for freelance services, retainers, and project billing.",
        },
        {
          href: "/invoice-template-for-contractors",
          label: "Invoice template for contractors",
          description: "Apply the same invoice basics to contractor jobs, labor, materials, and milestone billing.",
        },
        {
          href: "/invoice-template-for-designers",
          label: "Invoice template for designers",
          description: "See how designers translate project scope and revisions into line items clients can approve quickly.",
        },
      ]}
      schema={schema}
    />
  );
}
