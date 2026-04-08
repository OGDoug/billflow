import Link from "next/link";
import NavBar from "./NavBar";

type SeoSection = {
  title: string;
  body: string[];
  bullets?: string[];
};

type SeoFaq = {
  question: string;
  answer: string;
};

type SeoPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  ctaLabel: string;
  ctaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  sections: SeoSection[];
  faqs?: SeoFaq[];
  relatedLinks?: { href: string; label: string; description: string }[];
  schema?: Record<string, unknown> | Array<Record<string, unknown>>;
};

function JsonLd({ schema }: { schema?: SeoPageProps["schema"] }) {
  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function SeoPage({
  eyebrow,
  title,
  intro,
  ctaLabel,
  ctaHref = "/invoices/new",
  secondaryCtaLabel = "Create Free Account",
  secondaryCtaHref = "/signup?redirect=/invoices",
  sections,
  faqs,
  relatedLinks,
  schema,
}: SeoPageProps) {
  return (
    <div className="min-h-screen">
      <JsonLd schema={schema} />
      <NavBar />

      <main>
        <section className="border-b border-zinc-800/50 bg-gradient-to-b from-blue-500/10 via-zinc-950 to-zinc-950 px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-xs font-medium text-blue-400">
              {eyebrow}
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl">{title}</h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
              {intro}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href={ctaHref}
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/25"
              >
                {ctaLabel}
              </Link>
              <Link
                href={secondaryCtaHref}
                className="inline-flex items-center justify-center rounded-lg border border-zinc-700 px-8 py-3.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800/50"
              >
                {secondaryCtaLabel}
              </Link>
            </div>
            <p className="mt-4 text-xs text-zinc-500">
              Start with a free invoice now, then create an account if you want invoice history and cloud sync.
            </p>
          </div>
        </section>

        <section className="px-6 py-16 sm:py-20">
          <article className="mx-auto max-w-4xl space-y-8">
            {sections.map((section) => (
              <section
                key={section.title}
                className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-6 sm:p-8"
              >
                <h2 className="text-2xl font-semibold tracking-tight text-white">{section.title}</h2>
                <div className="mt-4 space-y-4 text-sm leading-7 text-zinc-300 sm:text-base">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                {section.bullets && (
                  <ul className="mt-5 space-y-3 text-sm leading-7 text-zinc-300 sm:text-base">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3">
                        <span className="mt-1 text-blue-400">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </article>
        </section>

        {faqs && faqs.length > 0 && (
          <section className="border-y border-zinc-800/50 bg-zinc-900/30 px-6 py-16">
            <div className="mx-auto max-w-4xl">
              <h2 className="text-3xl font-bold tracking-tight">Frequently asked questions</h2>
              <div className="mt-8 space-y-4">
                {faqs.map((faq) => (
                  <div key={faq.question} className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-6">
                    <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
                    <p className="mt-3 text-sm leading-7 text-zinc-300 sm:text-base">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {relatedLinks && relatedLinks.length > 0 && (
          <section className="px-6 py-16">
            <div className="mx-auto max-w-4xl">
              <h2 className="text-3xl font-bold tracking-tight">Keep reading</h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {relatedLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-6 transition-colors hover:border-zinc-700"
                  >
                    <h3 className="font-semibold text-white">{link.label}</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">{link.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="px-6 py-20">
          <div className="mx-auto max-w-3xl rounded-3xl border border-blue-500/20 bg-blue-500/10 p-8 text-center sm:p-10">
            <h2 className="text-3xl font-bold tracking-tight text-white">Create your invoice in minutes</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-blue-100/80 sm:text-base">
              Duxbill gives freelancers and small businesses a faster way to draft invoices, export PDFs, and keep billing simple.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href={ctaHref}
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/25"
              >
                {ctaLabel}
              </Link>
              <Link
                href={secondaryCtaHref}
                className="inline-flex items-center justify-center rounded-lg border border-blue-400/20 bg-zinc-950/40 px-8 py-3.5 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-900/70"
              >
                {secondaryCtaLabel}
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
