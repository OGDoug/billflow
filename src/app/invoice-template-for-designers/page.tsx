import type { Metadata } from "next";
import SeoPage from "../seo-page";
import { SITE_URL } from "@/lib/stripe";

const title = "Invoice Template for Designers | Bill Projects, Retainers, and Revisions | Duxbill";
const description =
  "Use this designer invoice template guide to bill clearly for creative services, project phases, retainers, and revision rounds without vague line items.";
const path = "/invoice-template-for-designers";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "invoice template for designers",
    "designer invoice template",
    "graphic design invoice template",
    "freelance designer invoice",
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

export default function InvoiceTemplateForDesignersPage() {
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
          name: "What should a design invoice include?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A design invoice should include the client details, invoice number, project or retainer name, itemized services or milestones, revision charges if applicable, payment terms, and the total due.",
          },
        },
        {
          "@type": "Question",
          name: "How should designers label line items?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Designers should label line items around deliverables or phases such as brand concepts, homepage design, presentation deck revisions, or monthly retainer work so clients can match the invoice to approved scope.",
          },
        },
      ],
    },
  ];

  return (
    <SeoPage
      eyebrow="Designer invoice guide"
      title="Invoice template for designers billing projects, retainers, and revisions"
      intro="Designer invoices work best when the billed work is easy to connect to the approved scope. Whether you bill for branding, web design, retainers, or production work, the invoice should make the deliverables, timing, and payment expectations obvious."
      ctaLabel="Create a Designer Invoice"
      sections={[
        {
          title: "Why designers need a more specific invoice template",
          body: [
            "Creative work is often approved in phases, not as interchangeable hours. Clients may sign off on discovery, concept work, revisions, final files, or monthly design support. A useful designer invoice template should reflect that workflow instead of compressing everything into a vague 'design services' line item.",
            "When your invoice mirrors the language in the proposal or statement of work, clients can review it faster. That clarity matters because design invoices often get reviewed by someone who was not involved in the day-to-day creative process.",
          ],
          bullets: [
            "Client and project name so the invoice is easy to route internally.",
            "Invoice number, issue date, and due date.",
            "Line items tied to deliverables, phases, or retainer periods.",
            "Separate charges for revisions, add-ons, rush work, or licensing when relevant.",
            "Subtotal, tax if required, and final amount due.",
            "Payment instructions and file-delivery notes if needed.",
          ],
        },
        {
          title: "How designers should write invoice line items",
          body: [
            "The strongest design invoices use line items that describe outcomes, not just effort. A client can approve 'Landing page design and responsive revisions' more easily than a generic line like 'creative services.' Specific language reduces confusion and protects you if the client later questions what the invoice covered.",
            "If you bill hourly, still add context to the work category. If you bill fixed-fee, tie each amount to a milestone or deliverable, such as brand concept development, packaging revisions, Figma file handoff, or April retainer support.",
          ],
        },
        {
          title: "How to invoice retainers, milestones, and revision rounds",
          body: [
            "Design billing structures vary, so the invoice format should follow the agreement. Retainers should name the covered period and scope. Milestone invoices should identify the phase that has been completed. Revision charges should be broken out only when they fall outside the included rounds from the original agreement.",
            "That structure helps preserve trust. Clients are less likely to push back when the invoice clearly shows what was included and what became an additional charge.",
          ],
        },
        {
          title: "Details that make designer invoices easier to approve",
          body: [
            "Design clients usually do not need more decoration on the invoice. They need clean information, recognizable project language, and payment terms they can act on immediately.",
          ],
          bullets: [
            "Match the project name to the proposal or purchase order.",
            "Reference the service month on retainer invoices.",
            "Call out extra revisions or rush work as separate items.",
            "Use the notes section for file-delivery timing or licensing reminders.",
            "Include the actual due date rather than only shorthand terms like net 15.",
          ],
        },
      ]}
      faqs={[
        {
          question: "What should a design invoice include?",
          answer:
            "A design invoice should include the client details, invoice number, issue and due dates, itemized project phases or services, revision charges when applicable, and clear payment instructions. The goal is to connect the invoice directly to approved scope.",
        },
        {
          question: "How should designers label line items?",
          answer:
            "Use line items based on deliverables, phases, or retainer periods. For example, 'Homepage UI design,' 'Brand identity revisions,' or 'May design retainer' is more useful than a generic service label.",
        },
        {
          question: "Should revision rounds be listed separately?",
          answer:
            "Only when they affect billing. If revisions are included in the agreed project fee, they can stay inside the main line item. If the client requested work outside the included rounds, separate it so the added charge is transparent.",
        },
      ]}
      relatedLinks={[
        {
          href: "/freelance-invoice-template",
          label: "Freelance invoice template guide",
          description: "See the broader invoice structure freelancers use across projects, retainers, and service work.",
        },
        {
          href: "/free-invoice-generator",
          label: "Free invoice generator",
          description: "Turn your design invoice into a clean PDF without managing a manual template.",
        },
        {
          href: "/invoice-template-for-contractors",
          label: "Invoice template for contractors",
          description: "See how another niche service business structures billing around labor, materials, and job details.",
        },
      ]}
      schema={schema}
    />
  );
}
