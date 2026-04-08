import type { Metadata } from "next";
import SeoPage from "../seo-page";
import { SITE_URL } from "@/lib/stripe";

const title = "Freelance Invoice Template Guide | What to Include | Duxbill";
const description =
  "Learn what a freelance invoice template should include, how freelancers should structure invoice details, and when a simple invoicing tool is better than editing templates manually.";
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
      intro="A freelance invoice template is useful as a reference, but most freelancers do not need another document to maintain. They need a clear invoice structure they can reuse quickly without introducing avoidable errors."
      ctaLabel="Create Freelance Invoice"
      secondaryCtaLabel="Start Free Account"
      sections={[
        {
          title: "The purpose of a freelance invoice template",
          body: [
            "Freelancers usually need repeatable structure more than a decorative document. A good invoice template sets expectations for what belongs on the invoice so the client can review it quickly and your billing process stays consistent.",
            "The key point is not the template file itself. It is having a reliable way to include the right details every time without rebuilding the invoice from scratch.",
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
            "One of the biggest invoice mistakes is relying on vague line items like 'design work' or 'consulting.' That language may be technically correct, but it often creates unnecessary follow-up from clients or finance teams.",
            "Use line items that anchor the invoice to the approved scope. A short, specific description is usually enough. You do not need to over-document the work, but the client should immediately understand what they are paying for.",
          ],
        },
        {
          title: "Template vs. invoice tool",
          body: [
            "A static template can work when you invoice occasionally and do not mind manual editing. The tradeoff is that every invoice still depends on you to update fields, check totals, and make sure the final document looks finished.",
            "That is where Duxbill becomes the more practical option. It gives you the structure of a good freelance invoice template while turning invoice creation into a faster repeatable workflow instead of a document-editing task.",
          ],
        },
        {
          title: "Best practices that improve payment speed",
          body: [
            "Freelancers often focus on how the invoice looks and overlook the small details that actually drive payment. Fast payment usually comes from clarity, not decoration.",
          ],
          bullets: [
            "Use an invoice number format that is easy to reference in emails.",
            "Include the due date explicitly instead of writing only 'net 14' or 'net 30.'",
            "Match the client name to the legal entity or team that actually pays invoices.",
            "State accepted payment methods in the notes area.",
            "Send the invoice promptly while the work is still fresh for the client.",
          ],
        },
        {
          title: "How to use this guide without relying on a template forever",
          body: [
            "Use this page as a checklist for what your freelance invoices should contain. Then switch to a workflow that lets you create the invoice directly instead of repeatedly translating the same structure into another file.",
            "That is the natural handoff to Duxbill. You keep the clarity of a freelancer-focused invoice template, but you spend less time formatting and more time getting invoices out the door.",
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
        {
          question: "When should a freelancer stop using a manual template?",
          answer:
            "Usually when invoicing becomes frequent enough that editing a document starts to feel repetitive or error-prone. At that point, a simple invoicing tool is often the faster and more reliable workflow.",
        },
      ]}
      relatedLinks={[
        {
          href: "/free-invoice-generator",
          label: "Free invoice generator",
          description: "See what to look for in an invoice generator before replacing manual template work.",
        },
        {
          href: "/how-to-create-an-invoice",
          label: "How to create an invoice",
          description: "Review the core invoice checklist and the mistakes that slow down payment.",
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
