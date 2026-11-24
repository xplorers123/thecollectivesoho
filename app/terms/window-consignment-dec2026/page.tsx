export const metadata = {
  title: "Vendor Space Agreement — The Collective SoHo",
  description: "Retail Consignment & Window Placement Agreement · December 2026",
};

export default function WindowConsignmentTerms() {
  return (
    <div className="min-h-screen bg-neutral-50 py-16 px-6">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-12 border-b border-border pb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-muted mb-4">
            The Collective SoHo · 435 Broadway, New York, NY 10013
          </p>
          <h1 className="text-2xl font-medium tracking-tight mb-1">
            Retail Consignment &amp; Window Placement Agreement
          </h1>
          <p className="text-sm text-muted">December 2026</p>
        </div>

        <div className="prose prose-sm max-w-none text-foreground space-y-8">

          {/* Section 1 */}
          <section>
            <h2 className="text-xs uppercase tracking-[0.2em] text-muted font-normal mb-3">
              1. Retail Placement
            </h2>
            <p className="text-sm leading-relaxed text-secondary">
              The Collective SoHo ("Operator") agrees to provide the Vendor with retail display space within its curated vintage section near the storefront window, accommodating approximately two clothing racks.
            </p>
            <p className="text-sm leading-relaxed text-secondary mt-3">
              Operator maintains full discretion over merchandise placement, display arrangements, and visual merchandising. Placement may be adjusted based on operational needs without guaranteeing any specific window position or visibility.
            </p>
          </section>

          <div className="border-t border-border" />

          {/* Section 2 */}
          <section>
            <h2 className="text-xs uppercase tracking-[0.2em] text-muted font-normal mb-3">
              2. Fees &amp; Commission
            </h2>
            <div className="bg-neutral-50 border border-border p-4 mb-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Monthly Placement Fee</span>
                <span className="font-medium">$1,000 — payable in full before start date</span>
              </div>
              <div className="flex justify-between text-sm border-t border-border pt-2">
                <span className="text-muted">Sales Commission (Operator)</span>
                <span className="font-medium">20% of Net Sales</span>
              </div>
              <div className="flex justify-between text-sm border-t border-border pt-2">
                <span className="text-muted">Vendor Share</span>
                <span className="font-medium">80% of Net Sales</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-secondary">
              The placement fee is non-refundable and non-transferable, including in cases of early withdrawal or unsatisfactory sales performance, except as required by law.
            </p>
            <p className="text-sm leading-relaxed text-secondary mt-3">
              Net Sales excludes sales tax, refunds, canceled transactions, and applicable discounts.
            </p>
          </section>

          <div className="border-t border-border" />

          {/* Section 3 */}
          <section>
            <h2 className="text-xs uppercase tracking-[0.2em] text-muted font-normal mb-3">
              3. Inventory &amp; Vendor Responsibilities
            </h2>
            <p className="text-sm leading-relaxed text-secondary mb-3">The Vendor is responsible for:</p>
            <ul className="text-sm leading-relaxed text-secondary space-y-2 list-none pl-0">
              {[
                "Providing their own clothing racks and hangers.",
                "Individually tagging all merchandise with clearly visible retail prices.",
                "Submitting a complete inventory list with item descriptions, quantities, and prices before setup.",
                "Ensuring all merchandise is authentic, legally sourced, clean, and suitable for retail.",
                "Delivering, setting up, maintaining, and removing their inventory and fixtures.",
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-muted shrink-0">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm leading-relaxed text-secondary mt-3">
              The Vendor may restock or replace inventory upon advance notice to Operator. Updated inventory lists and price tags must be provided for all new items.
            </p>
            <p className="text-sm leading-relaxed text-secondary mt-3">
              Operator reserves the right to reject or remove merchandise or fixtures that do not meet store standards.
            </p>
          </section>

          <div className="border-t border-border" />

          {/* Section 4 */}
          <section>
            <h2 className="text-xs uppercase tracking-[0.2em] text-muted font-normal mb-3">
              4. Sales &amp; Payouts
            </h2>
            <p className="text-sm leading-relaxed text-secondary">
              Operator will handle staffing, customer assistance, checkout, and sales processing. All sales must be processed through Operator&apos;s designated point-of-sale system.
            </p>
            <ul className="text-sm leading-relaxed text-secondary space-y-2 list-none pl-0 mt-3">
              {[
                "Vendor receives 80% of Net Sales.",
                "Sales reports and payouts will be issued weekly, generally within five business days after the reporting period.",
                "Payments will be made via Zelle unless otherwise discussed and agreed upon.",
                "Refunds, chargebacks, and sales adjustments may be deducted from payouts.",
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-muted shrink-0">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm leading-relaxed text-secondary mt-3">
              Vendor agrees to provide necessary tax information, including Form W-9 when applicable. Form 1099 reporting may be required if the Vendor meets applicable IRS reporting requirements.
            </p>
          </section>

          <div className="border-t border-border" />

          {/* Section 5 */}
          <section>
            <h2 className="text-xs uppercase tracking-[0.2em] text-muted font-normal mb-3">
              5. Pricing &amp; Merchandising
            </h2>
            <p className="text-sm leading-relaxed text-secondary">
              Vendor is responsible for setting and communicating retail prices. Operator retains control over store operations, display arrangements, merchandising, and promotional activities.
            </p>
            <p className="text-sm leading-relaxed text-secondary mt-3">
              Operator may adjust product placement, rotate displayed inventory, and include merchandise in storewide promotions. Any additional fixtures, signage, or display materials require prior approval.
            </p>
          </section>

          <div className="border-t border-border" />

          {/* Section 6 */}
          <section>
            <h2 className="text-xs uppercase tracking-[0.2em] text-muted font-normal mb-3">
              6. Inventory Security &amp; Liability
            </h2>
            <p className="text-sm leading-relaxed text-secondary">
              Vendor retains ownership of unsold merchandise and is responsible for obtaining any desired inventory insurance.
            </p>
            <p className="text-sm leading-relaxed text-secondary mt-3">
              Operator will exercise reasonable care but does not guarantee protection against theft, loss, damage, or inventory discrepancies. To the fullest extent permitted by law, Operator shall not be liable for such losses except where liability cannot legally be excluded.
            </p>
          </section>

          <div className="border-t border-border" />

          {/* Section 7 */}
          <section>
            <h2 className="text-xs uppercase tracking-[0.2em] text-muted font-normal mb-3">
              7. Marketing &amp; Sales Performance
            </h2>
            <p className="text-sm leading-relaxed text-secondary">
              Operator may photograph, film, and promote Vendor merchandise through its marketing and social media channels. Marketing activities are at Operator&apos;s discretion. No specific customer traffic, promotional exposure, or sales results are guaranteed.
            </p>
          </section>

          <div className="border-t border-border" />

          {/* Section 8 */}
          <section>
            <h2 className="text-xs uppercase tracking-[0.2em] text-muted font-normal mb-3">
              8. Cancellation, Termination &amp; Removal
            </h2>
            <p className="text-sm leading-relaxed text-secondary">
              This Agreement is valid only for the stated period and does not automatically renew. The placement fee remains non-refundable if Vendor cancels, withdraws early, or fails to provide sufficient inventory, except as required by law.
            </p>
            <p className="text-sm leading-relaxed text-secondary mt-3">
              Operator may terminate participation for nonpayment, material violation of store policies, unsafe merchandise, or breach of this Agreement.
            </p>
            <p className="text-sm leading-relaxed text-secondary mt-3">
              Vendor must collect all remaining merchandise, racks, and fixtures by <strong>December 31, 2026</strong>, unless otherwise agreed in writing. Any extension requires Operator&apos;s approval.
            </p>
          </section>

          <div className="border-t border-border" />

          {/* Section 9 */}
          <section>
            <h2 className="text-xs uppercase tracking-[0.2em] text-muted font-normal mb-3">
              9. General Terms
            </h2>
            <p className="text-sm leading-relaxed text-secondary">
              This Agreement does not constitute a lease, partnership, or employment relationship. Vendor is responsible for the authenticity, legality, labeling, and condition of its merchandise.
            </p>
            <p className="text-sm leading-relaxed text-secondary mt-3">
              This Agreement is governed by New York State law. Any amendments or exceptions must be agreed upon in writing by both parties. Electronic signatures are accepted.
            </p>
          </section>

          <div className="border-t border-border" />

          {/* Electronic agreement notice */}
          <section className="bg-neutral-50 border border-border p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-muted mb-2">Electronic Agreement</p>
            <p className="text-sm leading-relaxed text-secondary">
              By submitting payment on your invoice, you acknowledge that you have read, understood, and agree to be bound by the terms of this Agreement. This constitutes a legally binding electronic signature and agreement.
            </p>
          </section>

          {/* Exhibit A */}
          <section>
            <h2 className="text-xs uppercase tracking-[0.2em] text-muted font-normal mb-3">
              Exhibit A — Inventory List
            </h2>
            <p className="text-sm leading-relaxed text-secondary">
              Vendor must provide a complete inventory list to The Collective SoHo before setup and update it whenever merchandise is added, removed, or replaced. Please email your inventory list to{" "}
              <span className="font-medium text-foreground">info@popupcollectivenyc.com</span>.
            </p>
          </section>

        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-xs text-muted">
            The Collective SoHo · 435 Broadway, New York, NY 10013 · info@popupcollectivenyc.com
          </p>
          <p className="text-xs text-muted mt-1">Last updated: November 2026</p>
        </div>

      </div>
    </div>
  );
}
