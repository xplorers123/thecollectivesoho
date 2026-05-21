import Link from "next/link";
import Script from "next/script";

export const metadata = {
  title: "Apply — The Collective SoHo",
  description: "Submit your vendor application to The Collective SoHo.",
};

export default function ApplyForm() {
  return (
    <>
      <section className="border-b border-border bg-white px-6 pt-32 pb-12">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/apply"
            className="mb-8 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted hover:text-black transition-colors"
          >
            ← Back to Apply
          </Link>
          <p className="mb-6 text-xs uppercase tracking-[0.3em] text-muted">
            Vendor Application
          </p>
          <h1 className="text-4xl font-medium leading-tight tracking-tight sm:text-6xl">
            Tell us about{" "}
            <span className="serif-italic font-normal">your brand</span>.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted">
            All applications are reviewed personally. We&apos;ll be in touch shortly.
          </p>
        </div>
      </section>

      <section className="bg-neutral-50 px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <iframe
            id="JotFormIFrame-260200584913148"
            title="Vendor Application"
            src="https://form.jotform.com/260200584913148"
            width="100%"
            style={{ minWidth: "100%", height: "800px", border: "none" }}
            scrolling="yes"
            allow="geolocation; microphone; camera; fullscreen"
          />
          <Script src="https://cdn.jotfor.ms/s/umd/latest/for-form-embed-handler.js" strategy="afterInteractive" />
          <Script id="jotform-handler" strategy="afterInteractive">{`
            window.jotformEmbedHandler("iframe[id='JotFormIFrame-260200584913148']", "https://form.jotform.com/")
          `}</Script>
        </div>
      </section>
    </>
  );
}
