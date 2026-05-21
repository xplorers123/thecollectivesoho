export const metadata = { title: "Terms & Conditions — The Collective SoHo" };

export default function TermsAndConditions() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-medium mb-2">Terms &amp; Conditions</h1>
      <p className="text-xs text-muted uppercase tracking-widest mb-10">The Collective SoHo</p>

      <div className="prose prose-sm max-w-none space-y-8 text-sm leading-relaxed text-neutral-800">

        <section>
          <p>
            This Agreement is entered into between <strong>Xplorers, LLC (DBA The Collective SoHo)</strong> ("The Collective SoHo") and the Merchant applicant ("Merchant"). This Agreement becomes effective and binding upon (1) receipt of the Offer Email from The Collective SoHo and (2) payment of the applicable Rental Fee.
          </p>
          <p className="mt-3">
            Location: 435 Broadway, New York, NY 10013.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium uppercase tracking-widest mb-3">1. Rental Fees</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>All Rental Fees are non-refundable and must be paid no later than three (3) days before the Term begins.</li>
            <li>Late charges of 2.5% of the outstanding amount are due immediately upon default, plus 12% annual interest after 30 days.</li>
            <li>Returned or failed payments will incur a $25 administrative fee.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-medium uppercase tracking-widest mb-3">2. Space Assignment</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Each Merchant is allocated approximately 30 square feet of retail space.</li>
            <li>Merchant will be advised of their specific Space location on the Monday prior to the start of their Term.</li>
            <li>Merchant may not sublet, assign, or permit any third party to display merchandise in the Space.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-medium uppercase tracking-widest mb-3">3. Operating Requirements</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Market hours are 11:00 AM – 7:00 PM daily. Merchant must staff their Space continuously during all operating hours.</li>
            <li>A $25 penalty will be assessed for late arrival or late setup.</li>
            <li>All displays and merchandise must be completely torn down by 8:30 PM on the final day of the Term.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-medium uppercase tracking-widest mb-3">4. Display Standards</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Display height may not exceed six (6) feet.</li>
            <li>A minimum of eight (8) inches clearance from aisles must be maintained at all times.</li>
            <li>No items may be placed on or affixed to storefront glass.</li>
            <li>Electrical usage is limited to a maximum of 100 watts per Space.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-medium uppercase tracking-widest mb-3">5. Insurance Requirements</h2>
          <p className="mb-2">Effective November 10, 2025, Merchant is required to maintain the following insurance coverage throughout the Term:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>"All risk" property insurance at full replacement value for all merchandise and display materials.</li>
            <li>Commercial general liability insurance with a minimum of $1,000,000 per occurrence.</li>
            <li>Certificate holder must be listed as: Xplorers LLC, 435 Broadway, New York, NY 10013.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-medium uppercase tracking-widest mb-3">6. Default &amp; Termination</h2>
          <p>The Collective SoHo reserves the right to terminate this Agreement immediately upon: non-payment of any amounts due; violation of any term of this Agreement; or Merchant's bankruptcy or insolvency. Holdover occupancy beyond the agreed Term will be charged at 200% of the daily rate for each day of holdover.</p>
        </section>

        <section>
          <h2 className="text-base font-medium uppercase tracking-widest mb-3">7. Conduct &amp; Compliance</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>The Collective SoHo maintains a zero-tolerance policy for harassment and discrimination of any kind.</li>
            <li>Merchant agrees not to disparage The Collective SoHo during the Term and for one (1) year following its conclusion.</li>
            <li>Merchant must comply with all applicable COVID-19 and public health protocols in effect during the Term.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-medium uppercase tracking-widest mb-3">8. Force Majeure</h2>
          <p>In the event of closure or interruption due to circumstances beyond The Collective SoHo's control (including acts of God, government order, or public health emergency), Merchant shall remain obligated to pay all Rental Fees unless otherwise agreed in writing.</p>
        </section>

        <section>
          <h2 className="text-base font-medium uppercase tracking-widest mb-3">9. Governing Law</h2>
          <p>This Agreement shall be governed by the laws of the State of New York. Any disputes shall be resolved in the courts of Kings County or New York County, New York.</p>
        </section>

        <section>
          <h2 className="text-base font-medium uppercase tracking-widest mb-3">10. Contact</h2>
          <p>
            Questions regarding these Terms &amp; Conditions may be directed to{" "}
            <a href="mailto:info@popupcollectivenyc.com" className="underline underline-offset-2 hover:text-black transition-colors">
              info@popupcollectivenyc.com
            </a>.
          </p>
        </section>

      </div>
    </div>
  );
}
