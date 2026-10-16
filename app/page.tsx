import Image from "next/image";
import Link from "next/link";
import HeroCarousel from "@/components/HeroCarousel";
import GalleryMosaic from "@/components/GalleryMosaic";

const holidayHighlights = [
  {
    label: "The Season",
    value: "Nov 1 – Dec 31",
    body: "Two months of holiday shopping at 435 Broadway, with new brands arriving every week.",
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
      <section className="bg-evergreen px-6 py-16 text-white md:py-20">
        <div className="mx-auto max-w-7xl">
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

      {/* Brand statement */}
      <section className="border-b border-border bg-background px-6 py-20 md:py-28">
        <div className="mx-auto max-w-5xl">
          <p className="eyebrow mb-8 text-muted">A Curated Market</p>
          <h2 className="max-w-4xl text-3xl font-medium leading-tight tracking-tight sm:text-5xl md:text-6xl">
            We bring together NYC independent brands and artists{" "}
            <span className="serif-italic font-normal text-evergreen">
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
      <section className="bg-background px-6 py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-16 md:grid-cols-2 md:items-center">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="/images/IMG_1819.jpg"
              alt="Inside The Collective SoHo"
              fill
              className="object-cover"
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
      <section className="bg-cream px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
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
      <section className="bg-evergreen px-6 py-20 text-white md:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <p className="ornament eyebrow mx-auto max-w-sm text-champagne">Limited holiday booths</p>
          <h3 className="mt-8 text-4xl font-medium leading-tight sm:text-6xl">
            Spend the holidays in{" "}
            <span className="serif-italic font-normal">SoHo</span>.
          </h3>
          <p className="mx-auto mt-8 max-w-xl text-lg text-white/70">
            We&apos;re curating our Holiday 2026 lineup for November 1 – December 31.
            Only a few booths remain.
          </p>
          <Link
            href="/apply"
            className="mt-12 inline-flex items-center justify-center bg-background px-10 py-4 text-xs uppercase tracking-widest text-foreground hover:bg-cream transition-colors"
          >
            Apply for a Holiday Booth
          </Link>
        </div>
      </section>
    </>
  );
}
