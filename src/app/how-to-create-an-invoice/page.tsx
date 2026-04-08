import type { Metadata } from "next";
import SeoPage from "../seo-page";
import { SITE_URL } from "@/lib/stripe";

const title = "How to Create an Invoice: Step-by-Step Guide | Duxbill";
const description =
  "Learn how to create an invoice step by step, including what information to include, how to structure line items, and how to avoid common billing mistakes.";
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
        { "@type": "HowToStep", name: "Add business and client details" },
        { "@type": "HowToStep", name: "Assign an invoice number and dates" },
        { "@type": "HowToStep", name: "List products or services with prices" },
        { "@type": "HowToStep", name: "Add tax, notes, and payment terms" },
        { "@type": "HowToStep", name: "Review totals and send the invoice" },
      ],
    },
  ];

  return (
    <SeoPage
      eyebrow="Step-by-step invoice guide"
      title="How to create an invoice clients can review and pay quickly"
      intro="Creating an invoice is straightforward once you know what belongs on it. The key is to make the bill clear, complete, and easy for the client or finance team to process without follow-up questions."
      ctaLabel="Create an Invoice Now"
      sections={[
        {
          title: "Step 1: Add your business information and the client details",
          body: [
            "Start with the two parties involved. Your invoice should clearly show who is sending the bill and who is responsible for paying it. Include your business name, address, and any contact details you want on the invoice.",
            "Then add the client name, company name if relevant, and their billing contact information. This seems basic, but incorrect client details are a common reason invoices get delayed or routed to the wrong person.",
          ],
        },
        {
          title: "Step 2: Add an invoice number, issue date, and due date",
          body: [
            "Every invoice should have a unique invoice number so both you and the client can refer to it later. Add the issue date so there is a clear billing timestamp, and set a due date so payment expectations are explicit.",
            "If you use terms like net 15 or net 30, still include the actual due date on the invoice. It removes ambiguity and helps clients process payment on schedule.",
          ],
        },
        {
          title: "Step 3: List the products or services being billed",
          body: [
            "This is the part clients scrutinize most. Break the invoice into line items and describe the work in plain language. If you bill hourly, include the number of hours and rate. If you bill per project or milestone, name the deliverable clearly.",
            "Your descriptions should help someone outside the project understand what they are approving. The clearer the line items, the fewer email threads you will need to justify the invoice later.",
          ],
        },
        {
          title: "Step 4: Add taxes, notes, and payment instructions",
          body: [
            "Once the line items are in place, calculate tax if it applies to your business or region. Then use the notes section for any information the client needs to pay correctly, such as bank transfer details, late fee language, or a thank-you note.",
            "This section is also useful for clarifying the service period, purchase order references, or milestone names tied to the invoice.",
          ],
        },
        {
          title: "Step 5: Review before you send",
          body: [
            "Before sending the invoice, verify totals, spelling, tax treatment, and the recipient details. A fast review catches the kinds of small mistakes that make an invoice look less credible or force a corrected resend.",
          ],
          bullets: [
            "Check that the invoice number is unique.",
            "Confirm the due date and payment terms match your agreement.",
            "Make sure every line item description is specific enough to approve.",
            "Verify subtotal, tax, and total amounts.",
            "Export a clean PDF if the client expects a formal document.",
          ],
        },
        {
          title: "Common mistakes to avoid",
          body: [
            "Most invoice problems are not complicated. They come from leaving out key details, writing vague line items, or assuming the client already knows how and when to pay.",
          ],
          bullets: [
            "Sending an invoice without a due date.",
            "Using generic descriptions that do not map to the work performed.",
            "Forgetting tax where it is legally required.",
            "Addressing the invoice to an individual instead of the paying company entity.",
            "Waiting too long after finishing the work to bill for it.",
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
            "The easiest approach is usually an invoice generator that already handles structure, totals, and PDF export. That lets you focus on the information that matters instead of formatting the document manually.",
        },
      ]}
      relatedLinks={[
        {
          href: "/free-invoice-generator",
          label: "Use the free invoice generator",
          description: "Put the steps into practice and build an invoice directly in Duxbill.",
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
