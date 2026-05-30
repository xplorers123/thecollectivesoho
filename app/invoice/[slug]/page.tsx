import { notFound } from "next/navigation";
import { invoices } from "@/lib/invoices";
import InvoiceButtons from "./InvoiceButtons";

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const invoice = invoices[slug];
  if (!invoice) notFound();

  const amount = (invoice.amountCents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md bg-white border border-border p-10">
        {/* Header */}
        <p className="text-xs uppercase tracking-[0.3em] text-muted mb-8">
          The Collective SoHo · Invoice
        </p>

        {/* Amount */}
        <div className="border-t border-border pt-8 mb-8">
          <p className="text-xs uppercase tracking-widest text-muted mb-2">Amount Due</p>
          <p className="text-5xl font-medium tracking-tight">{amount}</p>
        </div>

        {/* Details */}
        <div className="space-y-3 mb-10 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">To</span>
            <span className="font-medium">{invoice.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Description</span>
            <span className="font-medium text-right max-w-[60%]">{invoice.description}</span>
          </div>
          {invoice.dueDate && (
            <div className="flex justify-between">
              <span className="text-muted">Due</span>
              <span className="font-medium">{invoice.dueDate}</span>
            </div>
          )}
        </div>

        {/* Payment buttons */}
        <InvoiceButtons slug={slug} />

        <p className="mt-6 text-xs text-center text-muted">
          Questions? Email{" "}
          <a href="mailto:info@popupcollectivenyc.com" className="underline underline-offset-2">
            info@popupcollectivenyc.com
          </a>
        </p>
      </div>
    </div>
  );
}
