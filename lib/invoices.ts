export type LineItem = {
  label: string;
  amountCents: number;
  deduction?: boolean;
};

export type Invoice = {
  id: string;
  email: string;
  name: string;
  description: string;
  lineItems?: LineItem[];
  amountCents: number; // net total to charge
  dueDate?: string;
};

export const invoices: Record<string, Invoice> = {
  "yuehu-june-2026": {
    id: "yuehu-june-2026",
    email: "yuehu@ydimension.co",
    name: "Yuehu",
    description: "Share Staff Model — Base Rent, June 1–30, 2026",
    amountCents: 100000,
    dueDate: "May 31, 2026",
  },

  "aromademerrie-june-2026": {
    id: "aromademerrie-june-2026",
    email: "info@aromademerrie.com",
    name: "Aroma de Merrie",
    description: "Booth Fee — June 5 – July 4, 2026",
    amountCents: 300000,
    dueDate: "June 4, 2026",
  },

  "frgmnt-june-2026": {
    id: "frgmnt-june-2026",
    email: "ed@frgmntfoto.com",
    name: "Ed",
    description: "Booth Fee — June 1–30, 2026",
    amountCents: 140000,
    dueDate: "June 1, 2026",
  },

  "esveiled-jun27-2026": {
    id: "esveiled-jun27-2026",
    email: "esveiled@gmail.com",
    name: "Esveiled Fine Jewelry",
    description: "Weekly Booth Fee — June 27 – July 3, 2026",
    amountCents: 85000,
    dueDate: "June 25, 2026",
  },

  "alejita-jul-2026": {
    id: "alejita-jul-2026",
    email: "alejitalala@gmail.com",
    name: "Hunch Studio",
    description: "Prorated Booth Fee — July 18–31, 2026",
    lineItems: [
      { label: "Monthly rate (July 2026)",       amountCents: 365000 },
      { label: "Proration adjustment (17/30 days free)", amountCents: 206833, deduction: true },
    ],
    amountCents: 158167,
    dueDate: "June 25, 2026",
  },

  "deewangstudio-jul-2026": {
    id: "deewangstudio-jul-2026",
    email: "deewangllc@gmail.com",
    name: "Dee Wang Studio",
    description: "Space L2 — Monthly Vendor Booth, July 1–31, 2026",
    amountCents: 400000,
    dueDate: "June 25, 2026",
  },

  "cafetruman-june-aug-2026": {
    id: "cafetruman-june-aug-2026",
    email: "cafetruman@gmail.com",
    name: "Cafe Truman",
    description: "Booth Rent — June 8, 2026 – August 7, 2026",
    lineItems: [
      { label: "June 8 – July 7, 2026",  amountCents: 250000 },
      { label: "July 8 – Aug 7, 2026",   amountCents: 250000 },
      { label: "Deposit paid",            amountCents: 50000, deduction: true },
    ],
    amountCents: 450000, // $4,500 net
    dueDate: "June 7, 2026",
  },
};
