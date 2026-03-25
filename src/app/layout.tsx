import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BillFlow — Free Invoice Generator for Freelancers",
  description: "Create professional invoices in seconds. Export PDFs, track payments, all from your browser — no signup required. 100% free.",
  keywords: ["invoice generator", "free invoice", "freelancer invoice", "invoice template", "PDF invoice", "online invoice maker", "invoice creator", "billing tool"],
  metadataBase: new URL("https://billflow-black.vercel.app"),
  openGraph: {
    title: "BillFlow — Free Invoice Generator for Freelancers",
    description: "Create professional invoices in seconds. Export PDFs, track payments — no signup required.",
    url: "https://billflow-black.vercel.app",
    siteName: "BillFlow",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BillFlow — Free Invoice Generator",
    description: "Create professional invoices in seconds. No signup. 100% free.",
    creator: "@BrickBWoodstock",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://billflow-black.vercel.app",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
        {children}
      </body>
    </html>
  );
}
