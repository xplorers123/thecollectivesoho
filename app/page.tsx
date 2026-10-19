import Image from "next/image";
import Link from "next/link";
import HeroCarousel from "@/components/HeroCarousel";
import GalleryMosaic from "@/components/GalleryMosaic";
import { FloatingDecor, HangingOrnaments, Snowfall } from "@/components/HolidayDecor";

const holidayHighlights = [
  {
    label: "The Season",
    value: "Now – Dec 31",
    body: "Holiday shopping at 435 Broadway all season long, with new brands arriving every week.",
  },
  {
    label: "The Gifts",
    value: "20+ brands",
    body: "Jewelry, beauty, home goods, clothing and vintage from NYC independent makers.",
  },
  {
    label: "The Hours",
    value: "Daily · 11–7",
    body: "Open every day in the heart of SoHo, steps from Canal Street.",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[86vh] md:h-[80vh] w-full overflow-hidden bg-evergreen-deep">
        <HeroCarousel />
        <div className="absolute inset-0 z-[2] bg-gradient-to-b from-black/25 via-black/45 to-evergreen-deep/95" />
        <Snowfall />
        <HangingOrnaments
          ornaments={[
            { left: "68%", length: 70, size: 30, delay: 0 },
            { left: "76%", length: 130, size: 42, kind: "bauble", color: "var(--gold)", delay: 1.2 },
            { left: "84%", length: 50, size: 26, kind: "star", delay: 0.6 },
            { left: "91%", length: 105, size: 36, kind: "bauble", color: "var(--evergreen)", delay: 2 },
          ]}
          className="origin-top-right scale-[0.65] sm:scale-100"
        />
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-24 text-white">
          <p className="eyebrow mb-6 flex items-center gap-3 text-champagne">
            <span aria-hidden>✦</span> Holiday Season 2026 · 435 Broadway
          </p>
          <h1 className="max-w-4xl text-5xl font-bold uppercase leading-[0.95] tracking-tight sm:text-7xl md:text-8xl">
            The Collective <span className="serif-italic font-normal normal-case">SoHo</span>
          </h1>
          <p className="mt-6 serif-italic text-2xl font-normal text-white/90 sm:text-3xl">
            The holiday market in SoHo.
          </p>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
            Thoughtful gifts from emerging independent brands, local designers
            and makers, open daily through December 31.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/visit"
              className="inline-flex items-center justify-center bg-background px-8 py-4 text-xs uppercase tracking-widest text-foreground hover:bg-cream transition-colors"
            >
              Shop the Holiday Market
            </Link>
            <Link
              href="/apply"
              className="inline-flex items-center justify-center border border-white/80 px-8 py-4 text-xs uppercase tracking-widest text-white hover:bg-white hover:text-foreground transition-colors"
            >
              Become a Holiday Vendor
            </Link>
          </div>
        </div>
      </section>

      {/* Holiday season band */}
      <section className="relative overflow-hidden bg-evergreen px-6 py-16 text-white md:py-20">
        <FloatingDecor
          items={[
            { kind: "snowflake", className: "top-6 right-[4%] h-8 w-8", opacity: 0.25, duration: 9 },
            { kind: "star", className: "bottom-8 right-[30%] h-4 w-4 hidden md:block", delay: 1, opacity: 0.8 },
            { kind: "snowflake", className: "bottom-6 left-[46%] h-5 w-5 hidden md:block", opacity: 0.2, delay: 2 },
            { kind: "star", className: "top-8 left-[62%] h-3 w-3", delay: 3, opacity: 0.7 },
          ]}
        />
        <div className="relative z-[4] mx-auto max-w-7xl">
          <div className="grid gap-12 md:grid-cols-3 md:gap-0 md:divide-x md:divide-white/15">
            {holidayHighlights.map((h) => (
              <div key={h.label} className="md:px-10 md:first:pl-0 md:last:pr-0">
                <p className="eyebrow text-champagne">{h.label}</p>
                <p className="mt-4 serif-italic text-3xl font-normal sm:text-4xl">{h.value}</p>
                <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">{h.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inside the market */}
      <section className="bg-background px-6 py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-4">
            <p className="eyebrow mb-6 text-muted">Inside the market</p>
            <h2 className="text-3xl font-medium leading-tight sm:text-5xl">
              Always something{" "}
              <span className="serif-italic font-normal text-cranberry">new to find</span>.
            </h2>
            <p className="mt-6 max-w-sm text-base leading-relaxed text-muted">
              New vendors rotate in every week, so every visit to 435 Broadway is a
              little different. Here&apos;s what a day on the floor looks like.
            </p>
            <Link
              href="/visit"
              className="mt-10 inline-flex items-center justify-center border border-foreground px-8 py-3 text-xs uppercase tracking-widest hover:bg-foreground hover:text-white transition-colors"
            >
              Plan Your Visit
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 md:col-span-8 md:grid-cols-3">
            <div className="relative col-span-2 aspect-[9/16] overflow-hidden bg-cream md:col-span-1 md:row-span-2 md:aspect-auto">
              <Image src="/images/collective/crowd-main-aisle.jpg" alt="Shoppers browsing the main aisle at The Collective SoHo" fill className="object-cover" sizes="(min-width: 768px) 25vw, 100vw" />
            </div>
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image src="/images/collective/crowd-jewelry-tables.jpg" alt="Shoppers at the jewelry tables" fill className="object-cover" sizes="(min-width: 768px) 25vw, 50vw" />
            </div>
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image src="/images/collective/product-candles.jpg" alt="Candles on display" fill className="object-cover" sizes="(min-width: 768px) 25vw, 50vw" />
            </div>
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image src="/images/collective/booth-selfloom.jpg" alt="A vendor booth with clothing and accessories" fill className="object-cover" sizes="(min-width: 768px) 25vw, 50vw" />
            </div>
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image src="/images/collective/product-gold-cuffs.jpg" alt="Gold cuffs and rings in a display case" fill className="object-cover" sizes="(min-width: 768px) 25vw, 50vw" />
            </div>
          </div>
        </div>
      </section>

      {/* Brand statement */}
      <section className="relative overflow-hidden border-b border-border bg-background px-6 py-20 md:py-28">
        <FloatingDecor
          items={[
            { kind: "holly", className: "top-10 right-[6%] h-12 w-16 md:top-16 md:right-[10%] md:h-16 md:w-24", tilt: -12 },
            { kind: "star", className: "top-[42%] right-[16%] h-5 w-5 hidden md:block", delay: 1.5 },
            { kind: "bauble", className: "bottom-10 right-[5%] h-12 w-10 hidden md:block", tilt: 10, delay: 0.8 },
          ]}
        />
        <div className="relative z-[4] mx-auto max-w-5xl">
          <p className="eyebrow mb-8 text-muted">A Curated Market</p>
          <h2 className="max-w-4xl text-3xl font-medium leading-tight tracking-tight sm:text-5xl md:text-6xl">
            We bring together NYC independent brands and artists{" "}
            <span className="serif-italic font-normal text-cranberry">
              under one roof
            </span>
            .
          </h2>
          <p className="mt-10 max-w-2xl text-lg leading-relaxed text-muted">
            The Collective SoHo is more than a store. It&apos;s a platform for
            creators, designers, and makers to share their work with a thoughtful
            audience, and this season, a place to find gifts you won&apos;t see anywhere else.
          </p>
        </div>
      </section>

      {/* Two-column feature */}
      <section className="relative overflow-hidden bg-background px-6 py-20 md:py-28">
        <FloatingDecor
          items={[
            { kind: "candyCane", className: "bottom-12 right-[6%] h-14 w-9 hidden md:block", tilt: 14, delay: 0.4 },
            { kind: "gift", className: "top-14 right-[12%] h-10 w-10 hidden md:block", tilt: -8, delay: 2.2 },
          ]}
        />
        <div className="relative z-[4] mx-auto grid max-w-7xl gap-16 md:grid-cols-2 md:items-center">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="/images/collective/feature-perfume-testers.jpg"
              alt="Shoppers testing perfume strips inside The Collective SoHo"
              fill
              className="object-cover object-[35%_center]"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>
          <div>
            <p className="eyebrow mb-6 text-muted">The Collective</p>
            <h3 className="text-3xl font-medium leading-tight sm:text-4xl">
              A storefront designed for{" "}
              <span className="serif-italic">discovery</span>.
            </h3>
            <p className="mt-6 text-base leading-relaxed text-muted">
              Located on Broadway in the heart of SoHo, our store welcomes
              tourists and locals alike — all looking for something unique and
              unexpected.
            </p>
            <ul className="mt-10 space-y-4 border-t border-border pt-8">
              {[
                ["2,000", "Square feet of retail space"],
                ["20+", "Curated brands"],
                ["11–7", "Open daily to the public"],
              ].map(([k, v]) => (
                <li key={k} className="flex items-baseline gap-6">
                  <span className="serif-italic text-3xl text-evergreen">{k}</span>
                  <span className="text-sm uppercase tracking-wider text-muted">
                    {v}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="relative overflow-hidden bg-cream px-6 py-20 md:py-28">
        <FloatingDecor
          items={[
            { kind: "tree", className: "top-10 right-[5%] h-14 w-11 md:top-16 md:h-20 md:w-16", tilt: 4 },
            { kind: "star", className: "top-12 right-[16%] h-4 w-4 hidden md:block", delay: 1 },
          ]}
        />
        <div className="relative z-[4] mx-auto max-w-7xl">
          <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow mb-4 text-muted">Inside the space</p>
              <h3 className="text-3xl font-medium leading-tight sm:text-5xl">
                Our <span className="serif-italic font-normal">Gallery</span>.
              </h3>
            </div>
            <p className="max-w-md text-base text-muted">
              A glimpse of our most recent markets, vendors, and collaborations.
            </p>
          </div>
          <GalleryMosaic />
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-cranberry px-6 py-24 text-white md:py-32">
        <Snowfall density={0.6} />
        <HangingOrnaments
          ornaments={[
            { left: "6%", length: 60, size: 28, color: "var(--gold)", delay: 0.3 },
            { left: "13%", length: 110, size: 36, color: "var(--evergreen)", delay: 1.4 },
            { left: "84%", length: 90, size: 34, color: "var(--evergreen)", delay: 0.8 },
            { left: "92%", length: 45, size: 24, kind: "star", delay: 2 },
          ]}
          className="hidden sm:block"
        />
        <div className="relative z-[4] mx-auto max-w-4xl text-center">
          <p className="ornament eyebrow mx-auto max-w-sm text-champagne">Limited holiday booths</p>
          <h3 className="mt-8 text-4xl font-medium leading-tight sm:text-6xl">
            Spend the holidays in{" "}
            <span className="serif-italic font-normal">SoHo</span>.
          </h3>
          <p className="mx-auto mt-8 max-w-xl text-lg text-white/80">
            We&apos;re curating our Holiday 2026 lineup for November 1 – December 31.
            Only a few booths remain.
          </p>
          <Link
            href="/apply"
            className="mt-12 inline-flex items-center justify-center bg-background px-10 py-4 text-xs uppercase tracking-widest text-cranberry hover:bg-cream transition-colors"
          >
            Apply for a Holiday Booth
          </Link>
        </div>
      </section>
    </>
  );
}
