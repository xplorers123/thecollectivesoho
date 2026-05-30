export type Invoice = {
  id: string;
  email: string;
  name: string;
  description: string;
  amountCents: number;
  dueDate?: string;
};

export const invoices: Record<string, Invoice> = {
  "yuehu-june-2026": {
    id: "yuehu-june-2026",
    email: "yuehu@ydimension.co",
    name: "Yuehu",
    description: "Share Staff Model — Base Rent, June 1–30, 2026",
    amountCents: 100000, // $1,000.00
    dueDate: "May 31, 2026",
  },
};
