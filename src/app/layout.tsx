import type { Metadata } from "next";
import "./globals.css";
import AuthSync from "./AuthSync";
import { SITE_URL } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Duxbill — Free Invoice Generator for Freelancers & Small Business",
  description: "Create professional invoices in seconds. Export PDFs, track payments, all from your browser — no signup required. 100% free.",
  keywords: ["invoice generator", "free invoice", "freelancer invoice", "invoice template", "PDF invoice", "online invoice maker", "invoice creator", "billing tool", "duxbill"],
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "Duxbill — Free Invoice Generator for Freelancers & Small Business",
    description: "Create professional invoices in seconds. Export PDFs, track payments — no signup required.",
    url: SITE_URL,
    siteName: "Duxbill",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Duxbill — Free Invoice Generator",
    description: "Create professional invoices in seconds. No signup. 100% free.",
    creator: "@BrickBWoodstock",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE_URL,
  },
  verification: {
    google: "t7nGv63QBO2NkVMRzzl6Z2dKwFhVpw73D7ZoyTOKVUk",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
        <AuthSync />
        {children}
      </body>
    </html>
  );
}
