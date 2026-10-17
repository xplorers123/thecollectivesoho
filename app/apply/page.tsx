import Link from "next/link";
import Image from "next/image";
import { FloatingDecor, HangingOrnaments } from "@/components/HolidayDecor";
import LoopVideo from "@/components/LoopVideo";

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
      <section className="relative overflow-hidden border-b border-border bg-background px-6 pt-32 pb-20">
        <HangingOrnaments
          className="hidden md:block"
          ornaments={[
            { left: "74%", length: 90, size: 34, delay: 0 },
            { left: "81%", length: 160, size: 44, color: "var(--gold)", delay: 1.1 },
            { left: "88%", length: 60, size: 26, kind: "star", delay: 0.5 },
            { left: "94%", length: 125, size: 36, color: "var(--evergreen)", delay: 1.8 },
          ]}
        />
        <FloatingDecor items={[{ kind: "holly", className: "top-24 right-[6%] h-10 w-14 md:hidden", tilt: -10 }]} />
        <div className="relative z-[4] mx-auto max-w-5xl">
          <p className="eyebrow mb-6 flex items-center gap-3 text-gold">
            <span aria-hidden>✦</span> Holiday Season 2026 · Vendor Application
          </p>
          <h1 className="text-5xl font-medium leading-[1.05] tracking-tight sm:text-7xl">
            Bring your brand{" "}
            <span className="serif-italic font-normal">to SoHo</span>.
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-muted">
            We&apos;re accepting applications for the holiday season, November 1 – December 31.
            Booths are limited. We seek independent creators, designers, and small brands with unique,
            high-quality products who want to build a presence in New York City.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/apply/form"
              className="inline-flex items-center justify-center bg-foreground px-10 py-4 text-xs uppercase tracking-widest text-white hover:bg-evergreen transition-colors"
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
      <section className="bg-background px-6 py-24">
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

      {/* On the floor */}
      <section className="border-t border-border bg-background px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow mb-4 text-muted">On the floor</p>
              <h2 className="text-3xl font-medium leading-tight sm:text-5xl">
                Your booth, <span className="serif-italic font-normal text-cranberry">your way</span>.
              </h2>
            </div>
            <p className="max-w-sm text-base leading-relaxed text-muted">
              Real booths from our current vendors. Every brand styles its own
              space, and every booth comes with a table, chairs, power and WiFi.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="relative col-span-2 row-span-2 aspect-[3/4] overflow-hidden bg-cream md:aspect-auto">
              <LoopVideo
                src="/videos/loop-front-window.mp4"
                poster="/videos/loop-front-window.jpg"
                label="Shoppers browsing vendor tables by the front windows"
                className="md:absolute md:inset-0"
              />
            </div>
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image src="/images/collective/booth-selfloom.jpg" alt="Clothing and accessories booth" fill className="object-cover transition-transform duration-700 hover:scale-105" sizes="(min-width: 768px) 25vw, 50vw" />
            </div>
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image src="/images/collective/booth-drawings-of-new-york.jpg" alt="Art print booth" fill className="object-cover transition-transform duration-700 hover:scale-105" sizes="(min-width: 768px) 25vw, 50vw" />
            </div>
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image src="/images/collective/booth-glowpop.jpg" alt="Beauty booth" fill className="object-cover transition-transform duration-700 hover:scale-105" sizes="(min-width: 768px) 25vw, 50vw" />
            </div>
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image src="/images/collective/booth-vintage-pennants.jpg" alt="Vintage pennant shop" fill className="object-cover transition-transform duration-700 hover:scale-105" sizes="(min-width: 768px) 25vw, 50vw" />
            </div>
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image src="/images/collective/booth-scrapbook-clothing-bar.jpg" alt="Custom apparel booth" fill className="object-cover transition-transform duration-700 hover:scale-105" sizes="(min-width: 768px) 25vw, 50vw" />
            </div>
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image src="/images/collective/vendor-beautelier.jpg" alt="Perfume vendor at their booth" fill className="object-cover transition-transform duration-700 hover:scale-105" sizes="(min-width: 768px) 25vw, 50vw" />
            </div>
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image src="/images/collective/crowd-eyewear-aisle.jpg" alt="Shoppers in the eyewear aisle" fill className="object-cover transition-transform duration-700 hover:scale-105" sizes="(min-width: 768px) 25vw, 50vw" />
            </div>
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image src="/images/collective/shopping-picking-rings.jpg" alt="A shopper picking out rings" fill className="object-cover transition-transform duration-700 hover:scale-105" sizes="(min-width: 768px) 25vw, 50vw" />
            </div>
          </div>
        </div>
      </section>

      {/* Two CTAs */}
      <section className="border-t border-border bg-cream px-6 py-24">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          <div className="flex flex-col justify-between border border-border bg-background p-10">
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

          <div className="flex flex-col justify-between bg-evergreen p-10 text-white">
            <div>
              <p className="text-xs uppercase tracking-widest text-champagne">Step 2</p>
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
              className="mt-10 inline-flex items-center justify-center bg-background px-8 py-3 text-xs uppercase tracking-widest text-foreground hover:bg-cream transition-colors"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
