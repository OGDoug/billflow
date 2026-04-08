import type { Metadata } from "next";
import SeoPage from "../seo-page";
import { SITE_URL } from "@/lib/stripe";

const title = "Free Invoice Generator | Create Professional Invoices Online | Duxbill";
const description =
  "Learn what to look for in a free invoice generator, what details matter on every invoice, and when a simple tool beats editing templates by hand.";
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
            text: "A useful invoice generator should cover the core invoice details such as sender and client information, itemized charges, dates, totals, tax if needed, and a clean export format.",
          },
        },
        {
          "@type": "Question",
          name: "When is a free invoice generator enough?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A free invoice generator is often enough when you need to create and send a professional invoice quickly. If you invoice repeatedly, saved history and a more repeatable workflow become more important.",
          },
        },
      ],
    },
  ];

  return (
    <SeoPage
      eyebrow="Invoice generator guide"
      title="Free invoice generator guide for freelancers and small businesses"
      intro="A free invoice generator should help you move from draft to sendable invoice without turning billing into a formatting project. The real value is speed, clarity, and a workflow you can keep using as invoicing becomes routine."
      ctaLabel="Create Invoice in Duxbill"
      secondaryCtaLabel="Start Free Account"
      sections={[
        {
          title: "What a good free invoice generator should actually do",
          body: [
            "A free invoice generator is useful when it removes busywork, not when it gives you another document to babysit. The essentials are straightforward: accurate business and client details, clean line items, clear totals, and an invoice the client can process without extra explanation.",
            "That is why the better option is usually a focused invoicing workflow instead of a blank template. Duxbill gives you the structure clients expect while cutting out the manual formatting that slows invoicing down.",
          ],
          bullets: [
            "Business and client details that are easy to verify.",
            "Itemized charges, totals, and tax support where needed.",
            "A due date and payment notes so the next step is obvious.",
            "A clean export or send-ready format that does not need cleanup elsewhere.",
          ],
        },
        {
          title: "Why an invoice generator often beats a manual template",
          body: [
            "Templates still leave you doing repetitive work: editing fields, checking spacing, recalculating totals, and exporting the file in a format that looks finished. That may be acceptable for occasional billing, but it is a weak long-term workflow.",
            "An invoice generator is a better fit when you want the structure handled for you so your attention stays on the bill itself. For most freelancers and small businesses, that is the point where a lightweight product becomes more practical than another free document.",
          ],
        },
        {
          title: "What information every invoice still needs",
          body: [
            "No tool can rescue an incomplete invoice. Before you send one, make sure it clearly identifies who billed whom, what was delivered, how the total was calculated, and when payment is due.",
            "That does not require a long manual process. It requires a short review and a format that makes missing details obvious before you send.",
          ],
          bullets: [
            "Invoice number, issue date, and due date.",
            "Service or product descriptions that map to the approved work.",
            "Subtotal, tax treatment, and final amount due.",
            "Payment instructions or terms the client can act on immediately.",
          ],
        },
        {
          title: "When a free tool is enough and when to move up",
          body: [
            "If you need to create a single invoice today, a free invoice generator is often enough. If you send invoices repeatedly, the better question becomes whether the workflow is easy to reuse, easy to track, and easy to trust.",
            "Duxbill is built for that next step. You can start with a free invoice, and when you want invoice history and a steadier billing workflow, the product is already set up for it.",
          ],
        },
        {
          title: "Why Duxbill is the natural next step",
          body: [
            "Duxbill is a strong fit for freelancers, consultants, contractors, and small service businesses that want invoice creation to stay simple. It keeps the process focused on drafting a clear bill quickly, not on managing a bloated accounting stack.",
            "That makes it useful both for first-time invoices and for repeat billing. The page you are on is the guide. The product is the faster way to do the work.",
          ],
        },
      ]}
      faqs={[
        {
          question: "What should a free invoice generator include?",
          answer:
            "At minimum, it should support business and client information, invoice numbering, itemized charges, totals, taxes where relevant, payment notes, and a clean export or send-ready format. If those basics are missing, you usually end up finishing the invoice somewhere else.",
        },
        {
          question: "Is a free invoice generator enough for a real business?",
          answer:
            "It can be enough when you need to create and send invoices quickly without extra setup. If invoicing becomes a recurring part of your workflow, a tool that also supports a more repeatable billing process usually makes more sense.",
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
          description: "See what a freelancer-focused invoice structure should include and when to move beyond templates.",
        },
        {
          href: "/how-to-create-an-invoice",
          label: "How to create an invoice",
          description: "Review the core invoice checklist and the mistakes that slow down payment.",
        },
        {
          href: "/invoice-template-for-contractors",
          label: "Invoice template for contractors",
          description: "Learn how contractors should handle labor, materials, deposits, and project phases.",
        },
        {
          href: "/invoice-template-for-designers",
          label: "Invoice template for designers",
          description: "See how designers can structure invoices around deliverables, retainers, and revision rounds.",
        },
      ]}
      schema={schema}
    />
  );
}
