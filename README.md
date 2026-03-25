# BillFlow — Free Invoice Generator for Freelancers

Create professional invoices in seconds. Export beautiful PDFs. Track payments. All from your browser — no account needed.

![BillFlow Screenshot](./screenshots/hero.png)

## Features

- **📝 Create Invoices** — Line items, tax calculations, custom notes
- **📄 PDF Export** — Clean, print-ready PDFs with one click
- **📊 Status Tracking** — Draft, sent, paid — always know where your money stands
- **🔒 100% Private** — All data stays in your browser (localStorage)
- **⚡ Fast** — No loading screens, no bloat, works offline
- **🎨 Professional** — Modern dark UI that makes your business look polished

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to start creating invoices.

## Tech Stack

- **Next.js 14** — React framework with App Router
- **TypeScript** — Type safety
- **Tailwind CSS** — Utility-first styling
- **jsPDF** — Client-side PDF generation
- **localStorage** — No backend needed

## How It Works

1. Click "Create Invoice"
2. Fill in client details and line items
3. Preview your invoice
4. Download as PDF

No signup. No servers. No tracking. Just invoicing.

## Deployment

Deploy to Vercel in one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/billflow)

Or deploy manually:

```bash
npm i -g vercel
vercel --yes
```

## License

MIT
