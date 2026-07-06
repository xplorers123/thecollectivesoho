import { notFound } from "next/navigation";
import { invoices } from "@/lib/invoices";
import InvoiceButtons from "./InvoiceButtons";

function fmt(cents: number) {
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const invoice = invoices[slug];
  if (!invoice) notFound();

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
          <p className="text-5xl font-medium tracking-tight">{fmt(invoice.amountCents)}</p>
        </div>

        {/* Details */}
        <div className="space-y-3 mb-6 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">To</span>
            <span className="font-medium">{invoice.name}</span>
          </div>
          {invoice.dueDate && (
            <div className="flex justify-between">
              <span className="text-muted">Due</span>
              <span className="font-medium">{invoice.dueDate}</span>
            </div>
          )}
        </div>

        {/* Line items breakdown */}
        {invoice.lineItems && invoice.lineItems.length > 0 && (
          <div className="border-t border-border pt-6 mb-8">
            <p className="text-xs uppercase tracking-widest text-muted mb-4">Breakdown</p>
            <div className="space-y-2 text-sm">
              {invoice.lineItems.map((item, i) => (
                <div key={i} className="flex justify-between">
                  <span className={item.deduction ? "text-muted" : ""}>{item.label}</span>
                  <span className={item.deduction ? "text-muted" : "font-medium"}>
                    {item.deduction ? `− ${fmt(item.amountCents)}` : fmt(item.amountCents)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between border-t border-border pt-2 mt-2 font-medium">
                <span>Total</span>
                <span>{fmt(invoice.amountCents)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Description if no line items */}
        {!invoice.lineItems && (
          <div className="mb-8 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Description</span>
              <span className="font-medium text-right max-w-[60%]">{invoice.description}</span>
            </div>
          </div>
        )}

        {/* Payment buttons */}
        <InvoiceButtons slug={slug} amountCents={invoice.amountCents} agreementUrl={invoice.agreementUrl} />

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
