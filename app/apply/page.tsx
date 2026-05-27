import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Apply — The Collective SoHo",
  description: "Bring your brand to The Collective SoHo at 435 Broadway, New York City.",
};

const reasons = [
  {
    title: "Prime SoHo Location",
    body: "435 Broadway sits in the heart of SoHo — one of NYC's highest foot-traffic retail corridors, drawing locals and tourists year-round.",
  },
  {
    title: "Flexible Booking Periods",
    body: "From a single weekend to a full month, we offer booking options designed to fit where your brand is right now.",
  },
  {
    title: "Built-In Amenities",
    body: "Every booth includes heat, AC, electricity, WiFi, tables and chairs — so you can focus on selling, not logistics.",
  },
  {
    title: "A Real Community",
    body: "Join a curated roster of independent designers, local makers, and emerging brands all under one roof.",
  },
];

export default function Apply() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-border bg-white px-6 pt-32 pb-20">
        <div className="mx-auto max-w-5xl">
          <p className="mb-6 text-xs uppercase tracking-[0.3em] text-muted">
            Vendor Application
          </p>
          <h1 className="text-5xl font-medium leading-[1.05] tracking-tight sm:text-7xl">
            Bring your brand{" "}
            <span className="serif-italic font-normal">to SoHo</span>.
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-muted">
            We&apos;re currently accepting applications for Summer 2026.
            We seek independent creators, designers, and small brands with unique,
            high-quality products who want to build a presence in New York City.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/apply/form"
              className="inline-flex items-center justify-center bg-black px-10 py-4 text-xs uppercase tracking-widest text-white hover:bg-neutral-800 transition-colors"
            >
              Apply Now
            </Link>
            <Link
              href="/apply/booth-options"
              className="inline-flex items-center justify-center border border-black px-10 py-4 text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
            >
              Booth Options & Details
            </Link>
            <Link
              href="/dashboard/vendor-guide"
              className="inline-flex items-center justify-center border border-border px-10 py-4 text-xs uppercase tracking-widest text-muted hover:border-black hover:text-black transition-colors"
            >
              Vendor Guide
            </Link>
          </div>
        </div>
      </section>

      {/* Why sell with us */}
      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <p className="mb-8 text-xs uppercase tracking-[0.3em] text-muted">Why sell with us</p>
          <div className="grid gap-10 md:grid-cols-2">
            {reasons.map((r) => (
              <div key={r.title} className="border-t border-border pt-8">
                <h3 className="text-lg font-medium">{r.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-muted">{r.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Two CTAs */}
      <section className="border-t border-border bg-neutral-50 px-6 py-24">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          <div className="flex flex-col justify-between border border-border bg-white p-10">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted">Step 1</p>
              <h2 className="mt-4 text-2xl font-medium leading-snug">
                View booth options<br />& pricing
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                Compare weekend, weekly, and monthly packages — including sizes,
                amenities, and what&apos;s included.
              </p>
            </div>
            <Link
              href="/apply/booth-options"
              className="mt-10 inline-flex items-center justify-center border border-black px-8 py-3 text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
            >
              See Booth Options
            </Link>
          </div>

          <div className="flex flex-col justify-between border border-black bg-black p-10 text-white">
            <div>
              <p className="text-xs uppercase tracking-widest text-white/60">Step 2</p>
              <h2 className="mt-4 text-2xl font-medium leading-snug">
                Submit your<br />application
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white/70">
                Tell us about your brand. All applications are reviewed
                personally and we&apos;ll be in touch shortly.
              </p>
            </div>
            <Link
              href="/apply/form"
              className="mt-10 inline-flex items-center justify-center bg-white px-8 py-3 text-xs uppercase tracking-widest text-black hover:bg-neutral-200 transition-colors"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
