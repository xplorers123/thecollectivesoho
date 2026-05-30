export default function InvoiceSuccess() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <p className="text-xs uppercase tracking-[0.3em] text-muted mb-4">The Collective SoHo</p>
        <h1 className="text-4xl font-medium mb-4">Payment <span className="serif-italic font-normal">received</span>.</h1>
        <p className="text-sm text-muted leading-relaxed">
          Thank you — your payment has been submitted. You'll receive a confirmation by email shortly.
        </p>
        <p className="mt-8 text-xs text-muted">
          Questions?{" "}
          <a href="mailto:info@popupcollectivenyc.com" className="underline underline-offset-2 hover:text-black transition-colors">
            info@popupcollectivenyc.com
          </a>
        </p>
      </div>
    </div>
  );
}
