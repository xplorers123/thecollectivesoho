import Image from "next/image";
import Link from "next/link";
import HeroCarousel from "@/components/HeroCarousel";
import GalleryMosaic from "@/components/GalleryMosaic";


export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[92vh] w-full overflow-hidden bg-black">
        <HeroCarousel />
        <div className="absolute inset-0 z-[2] bg-gradient-to-b from-black/30 via-black/50 to-black/90" />
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-20 text-white">
          <p className="mb-6 text-xs uppercase tracking-[0.3em] text-white/80">
            435 Broadway · New York City
          </p>
          <h1 className="max-w-4xl text-5xl font-bold uppercase leading-[0.95] tracking-tight sm:text-7xl md:text-8xl">
            The Collective <span className="serif-italic font-normal normal-case">SoHo</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/90">
            A curated market showcasing emerging independent brands, local
            designers and unique finds in NYC.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/visit"
              className="inline-flex items-center justify-center bg-white px-8 py-4 text-xs uppercase tracking-widest text-black hover:bg-neutral-200 transition-colors"
            >
              Shop with Us
            </Link>
            <Link
              href="/apply"
              className="inline-flex items-center justify-center border border-white px-8 py-4 text-xs uppercase tracking-widest text-white hover:bg-white hover:text-black transition-colors"
            >
              Sell with Us
            </Link>
          </div>
        </div>
      </section>

      {/* Brand statement */}
      <section className="border-b border-border bg-white px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <p className="mb-8 text-xs uppercase tracking-[0.3em] text-muted">
            A Curated Market
          </p>
          <h2 className="max-w-4xl text-3xl font-medium leading-tight tracking-tight sm:text-5xl md:text-6xl">
            We bring together NYC independent brands and artists{" "}
            <span className="serif-italic font-normal text-muted">
              under one roof
            </span>
            .
          </h2>
          <p className="mt-10 max-w-2xl text-lg leading-relaxed text-muted">
            The Collective SoHo is more than a store. It&apos;s a platform for
            creators, designers, and makers to share their work with a thoughtful
            audience.
          </p>
        </div>
      </section>

      {/* Two-column feature */}
      <section className="bg-white px-6 py-16">
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
            <p className="mb-6 text-xs uppercase tracking-[0.3em] text-muted">
              The Collective
            </p>
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
                  <span className="serif-italic text-3xl text-black">{k}</span>
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
      <section className="bg-neutral-50 px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-4 text-xs uppercase tracking-[0.3em] text-muted">
                Inside the space
              </p>
              <h3 className="text-3xl font-medium leading-tight sm:text-5xl">
                Our Gallery.
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
      <section className="bg-black px-6 py-16 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-6 text-xs uppercase tracking-[0.3em] text-white/60">
            Now accepting applications
          </p>
          <h3 className="text-4xl font-medium leading-tight sm:text-6xl">
            Bring your brand to{" "}
            <span className="serif-italic font-normal">SoHo</span>.
          </h3>
          <p className="mx-auto mt-8 max-w-xl text-lg text-white/70">
            We&apos;re currently curating our Spring/Summer 2026 lineup.
          </p>
          <Link
            href="/apply"
            className="mt-12 inline-flex items-center justify-center bg-white px-10 py-4 text-xs uppercase tracking-widest text-black hover:bg-neutral-200 transition-colors"
          >
            Apply for a Booth
          </Link>
        </div>
      </section>
    </>
  );
}
