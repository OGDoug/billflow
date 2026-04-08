import type { Metadata } from "next";
import SeoPage from "../seo-page";
import { SITE_URL } from "@/lib/stripe";

const title = "Invoice Template for Contractors | Progress, Labor, and Materials | Duxbill";
const description =
  "Learn what a contractor invoice template should include, how to organize labor and materials billing, and when a better invoicing workflow beats manual documents.";
const path = "/invoice-template-for-contractors";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "invoice template for contractors",
    "contractor invoice template",
    "construction invoice template",
    "home contractor invoice",
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

export default function InvoiceTemplateForContractorsPage() {
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
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What should a contractor invoice include?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A contractor invoice should include the customer details, project address, invoice number, labor and material line items, taxes if applicable, payment terms, and the total amount due.",
          },
        },
        {
          "@type": "Question",
          name: "Should contractors invoice by project, milestone, or time?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Use the structure that matches the job agreement. Fixed bids often map to milestones or project phases, while smaller service calls may be easier to bill with labor hours plus materials.",
          },
        },
      ],
    },
  ];

  return (
    <SeoPage
      eyebrow="Contractor invoice guide"
      title="Invoice template for contractors who need clear labor and materials billing"
      intro="Contractor invoices usually need more job context than a generic template provides. The right structure helps clients approve labor, materials, deposits, and project phases quickly without turning billing into another paperwork project."
      ctaLabel="Create Contractor Invoice"
      secondaryCtaLabel="Start Free Account"
      sections={[
        {
          title: "What makes a contractor invoice template different",
          body: [
            "Contractors are often billing for a mix of labor, materials, deposits, change orders, and project phases. That means the invoice has to do a little more than show an amount due. It has to make the job context easy to follow.",
            "A useful contractor invoice template should help you document what was done, where the work happened, and how the total was calculated. That clarity reduces disputes and makes it easier for the client to compare the invoice against the approved estimate or proposal.",
          ],
          bullets: [
            "Customer name and billing contact.",
            "Service or project address when it differs from the billing address.",
            "Invoice number, issue date, and due date.",
            "Clear labor, materials, equipment, or subcontractor line items.",
            "Taxes, deposits credited, and remaining balance due.",
            "Notes for change orders, payment methods, or warranty language.",
          ],
        },
        {
          title: "How contractors should structure line items",
          body: [
            "Clear line items matter because contractor work is often tied to a quote, a draw schedule, or a phase of completion. If the invoice only says 'construction services,' the client may have to call you to understand what they are approving.",
            "Use line items that reflect how the job was sold. That might mean labor by trade, materials by category, or billing by project phase such as demolition, rough-in, installation, or final completion. The invoice should mirror the logic of the job, not force the client to decode it.",
          ],
        },
        {
          title: "When to bill by milestone instead of one final invoice",
          body: [
            "Many contractors do not wait until the end of the project to bill. Progress invoices protect cash flow and make it easier for clients to approve payments in stages, especially when material costs hit early or the work spans multiple weeks.",
            "If you use milestone billing, label the invoice so it clearly maps to the agreed schedule. Short phrases like '50% deposit,' 'framing completion,' or 'final balance after walkthrough' are more useful than generic partial-payment language.",
          ],
        },
        {
          title: "Practical billing details that help contractors get paid faster",
          body: [
            "The most common invoice delays in contractor work are not design issues. They come from missing job details, unclear totals, or invoices that do not line up with the client's paperwork.",
          ],
          bullets: [
            "Reference the estimate, proposal, or work order number when one exists.",
            "Show deposits already paid so the remaining balance is obvious.",
            "Separate taxable materials from non-taxable labor if your local rules require it.",
            "Name the project phase or service date range when invoicing progress work.",
            "State accepted payment methods so the client knows how to settle the invoice.",
          ],
        },
        {
          title: "Why contractors outgrow manual invoice templates",
          body: [
            "A template can help you understand the structure of a contractor invoice, but it still leaves you editing a document by hand every time you bill. That is where mistakes, mismatched totals, and inconsistent formatting start to creep in.",
            "Duxbill is the cleaner next step when you want contractor-specific clarity without carrying the overhead of manual paperwork. It keeps the invoice focused on the job details that matter and gets you to a send-ready bill faster.",
          ],
        },
      ]}
      faqs={[
        {
          question: "What should a contractor invoice include?",
          answer:
            "Include the customer details, project location, invoice number, dates, itemized labor and materials, taxes where required, any deposit credits, and the final amount due. For larger jobs, add references to the estimate or phase being billed.",
        },
        {
          question: "Should contractors invoice by project, milestone, or time?",
          answer:
            "Use the format that matches the contract and how the client expects to review charges. Fixed-bid work often works best with milestone invoices, while repair or maintenance jobs are often easier to bill with labor hours plus materials.",
        },
        {
          question: "Do contractor invoices need the job address?",
          answer:
            "Usually yes. Including the service or project address helps clients, office staff, and property managers match the invoice to the correct job, especially when you do repeat work for the same customer.",
        },
        {
          question: "Should contractors keep using a document template for repeat billing?",
          answer:
            "Usually only if invoicing is occasional. When billing becomes routine, a dedicated invoicing workflow is typically faster and less error-prone than editing the same template for every job.",
        },
      ]}
      relatedLinks={[
        {
          href: "/free-invoice-generator",
          label: "Free invoice generator",
          description: "See when an invoice generator is a better fit than editing contractor invoice documents manually.",
        },
        {
          href: "/how-to-create-an-invoice",
          label: "How to create an invoice",
          description: "Review the core invoice structure and common mistakes before sending your next bill.",
        },
        {
          href: "/invoice-template-for-designers",
          label: "Invoice template for designers",
          description: "Compare how another service business can adapt invoice structure around deliverables and revisions.",
        },
      ]}
      schema={schema}
    />
  );
}
