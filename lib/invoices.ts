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
