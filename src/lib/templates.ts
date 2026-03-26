import { InvoiceTemplate } from "./types";

export interface TemplateStyle {
  // Web preview
  card: string;
  heading: string;
  invoiceNumber: string;
  label: string;
  text: string;
  subtext: string;
  tableHead: string;
  tableHeadText: string;
  tableRow: string;
  tableBorder: string;
  totalBorder: string;
  totalText: string;
  statusDraft: string;
  statusSent: string;
  statusPaid: string;
  // PDF colors [R, G, B]
  pdf: {
    headingColor: [number, number, number];
    textColor: [number, number, number];
    subtextColor: [number, number, number];
    tableHeadBg: [number, number, number];
    tableHeadText: [number, number, number];
    accentColor: [number, number, number];
  };
}

export const templates: Record<InvoiceTemplate, TemplateStyle> = {
  classic: {
    card: "rounded-xl border border-zinc-800 bg-zinc-900/50 p-8 space-y-8",
    heading: "text-3xl font-bold tracking-tight text-white",
    invoiceNumber: "text-sm text-zinc-500 font-mono mt-1",
    label: "text-xs text-zinc-500 uppercase tracking-wider",
    text: "font-medium text-white",
    subtext: "text-sm text-zinc-400",
    tableHead: "bg-zinc-800/50",
    tableHeadText: "text-xs font-medium text-zinc-400 uppercase tracking-wider",
    tableRow: "divide-y divide-zinc-800",
    tableBorder: "border border-zinc-800",
    totalBorder: "border-t border-zinc-700",
    totalText: "text-xl font-bold text-white",
    statusDraft: "bg-zinc-700 text-zinc-300",
    statusSent: "bg-yellow-900/50 text-yellow-400",
    statusPaid: "bg-green-900/50 text-green-400",
    pdf: {
      headingColor: [30, 30, 30],
      textColor: [40, 40, 40],
      subtextColor: [100, 100, 100],
      tableHeadBg: [245, 245, 245],
      tableHeadText: [60, 60, 60],
      accentColor: [30, 30, 30],
    },
  },
  modern: {
    card: "rounded-xl border-2 border-blue-500/30 bg-zinc-950 p-8 space-y-8",
    heading: "text-3xl font-bold tracking-tight text-blue-400",
    invoiceNumber: "text-sm text-blue-400/60 font-mono mt-1",
    label: "text-xs text-blue-400/50 uppercase tracking-wider",
    text: "font-medium text-white",
    subtext: "text-sm text-zinc-400",
    tableHead: "bg-blue-500/10",
    tableHeadText: "text-xs font-medium text-blue-400/70 uppercase tracking-wider",
    tableRow: "divide-y divide-blue-500/10",
    tableBorder: "border border-blue-500/20",
    totalBorder: "border-t border-blue-500/30",
    totalText: "text-xl font-bold text-blue-400",
    statusDraft: "bg-zinc-700 text-zinc-300",
    statusSent: "bg-blue-900/50 text-blue-400",
    statusPaid: "bg-green-900/50 text-green-400",
    pdf: {
      headingColor: [59, 130, 246],
      textColor: [40, 40, 40],
      subtextColor: [100, 120, 150],
      tableHeadBg: [230, 240, 255],
      tableHeadText: [59, 100, 200],
      accentColor: [59, 130, 246],
    },
  },
  minimal: {
    card: "rounded-none border border-zinc-800 bg-zinc-950 p-8 space-y-8",
    heading: "text-2xl font-light tracking-widest uppercase text-zinc-300",
    invoiceNumber: "text-xs text-zinc-600 font-mono mt-2",
    label: "text-xs text-zinc-600 uppercase tracking-widest",
    text: "font-normal text-zinc-300",
    subtext: "text-sm text-zinc-500",
    tableHead: "bg-transparent",
    tableHeadText: "text-xs font-normal text-zinc-600 uppercase tracking-widest",
    tableRow: "divide-y divide-zinc-800/50",
    tableBorder: "border-t border-b border-zinc-800",
    totalBorder: "border-t border-zinc-800",
    totalText: "text-lg font-light text-zinc-200",
    statusDraft: "bg-zinc-800 text-zinc-400",
    statusSent: "bg-zinc-800 text-zinc-300",
    statusPaid: "bg-zinc-800 text-zinc-200",
    pdf: {
      headingColor: [80, 80, 80],
      textColor: [60, 60, 60],
      subtextColor: [140, 140, 140],
      tableHeadBg: [255, 255, 255],
      tableHeadText: [120, 120, 120],
      accentColor: [80, 80, 80],
    },
  },
  bold: {
    card: "rounded-xl border-2 border-amber-500/40 bg-zinc-950 p-8 space-y-8",
    heading: "text-4xl font-black tracking-tight text-amber-400",
    invoiceNumber: "text-sm text-amber-500/60 font-mono mt-1",
    label: "text-xs text-amber-500/50 uppercase tracking-wider font-bold",
    text: "font-semibold text-white",
    subtext: "text-sm text-zinc-400",
    tableHead: "bg-amber-500/10",
    tableHeadText: "text-xs font-bold text-amber-400/70 uppercase tracking-wider",
    tableRow: "divide-y divide-amber-500/10",
    tableBorder: "border border-amber-500/20",
    totalBorder: "border-t-2 border-amber-500/40",
    totalText: "text-2xl font-black text-amber-400",
    statusDraft: "bg-zinc-700 text-zinc-300",
    statusSent: "bg-amber-900/50 text-amber-400",
    statusPaid: "bg-green-900/50 text-green-400",
    pdf: {
      headingColor: [200, 140, 20],
      textColor: [30, 30, 30],
      subtextColor: [120, 100, 60],
      tableHeadBg: [255, 248, 230],
      tableHeadText: [160, 110, 20],
      accentColor: [200, 140, 20],
    },
  },
  elegant: {
    card: "rounded-xl border border-stone-700 bg-stone-950 p-8 space-y-8",
    heading: "text-3xl font-serif font-normal tracking-wide text-stone-300",
    invoiceNumber: "text-sm text-stone-500 font-mono mt-1",
    label: "text-xs text-stone-500 uppercase tracking-widest",
    text: "font-medium text-stone-200",
    subtext: "text-sm text-stone-400",
    tableHead: "bg-stone-900",
    tableHeadText: "text-xs font-medium text-stone-400 uppercase tracking-widest",
    tableRow: "divide-y divide-stone-800",
    tableBorder: "border border-stone-800",
    totalBorder: "border-t border-stone-700",
    totalText: "text-xl font-serif text-stone-200",
    statusDraft: "bg-stone-800 text-stone-400",
    statusSent: "bg-amber-900/30 text-amber-400",
    statusPaid: "bg-emerald-900/30 text-emerald-400",
    pdf: {
      headingColor: [80, 70, 60],
      textColor: [50, 45, 40],
      subtextColor: [120, 110, 100],
      tableHeadBg: [245, 240, 235],
      tableHeadText: [90, 80, 70],
      accentColor: [80, 70, 60],
    },
  },
};

export function getTemplate(name?: InvoiceTemplate): TemplateStyle {
  return templates[name || "classic"];
}
