import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

export const metadata = {
  title: "Visit — The Collective SoHo",
  description: "Visit The Collective SoHo at 435 Broadway, New York, NY. Open daily 11am–7pm.",
};

const vendors = [
  { name: "Aroma de Merrie", ig: "aromademerrie" },
  { name: "Askan NYC", ig: "askannyc" },
  { name: "Awita New York Design", ig: "awitanewyorkdesign" },
  { name: "Bang Bang Co", ig: "bangbangco" },
  { name: "Café Truman", ig: "cafe_truman" },
  { name: "Crystella Jing", ig: "crystellajing55" },
  { name: "Deewang Studio", ig: "deewang_studio" },
  { name: "Hunch Studio", ig: "hunchstudio" },
  { name: "Le Nail Studio", ig: "lenailstudio_official" },
  { name: "Maison Raphaella", ig: "maisonraphaella" },
  { name: "Maison Third", ig: "maison_third" },
  { name: "Marina Pecoraro Jewelry", ig: "marinapecorarojewelry" },
  { name: "Oilogy NY", ig: "oilogy.ny" },
  { name: "Psychic Readings by Sandra", ig: "psychicreadingsbysandra" },
  { name: "Real Snow Milk", ig: "realsnowmilk" },
  { name: "Selfloom", ig: "selfloom_" },
  { name: "Y Dimension", ig: "y.dimension" },
];

export default function Visit() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[60vh] w-full overflow-hidden bg-black">
        <Image
          src="/images/DSC_0742.jpg"
          alt="The Collective SoHo storefront"
          fill
          priority
          className="object-cover opacity-70"
          style={{ objectPosition: "center center" }}
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-16 text-white">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-white/80">
            Visit
          </p>
          <h1 className="text-5xl font-medium leading-[1.05] tracking-tight sm:text-7xl">
            435 <span className="serif-italic font-normal">Broadway</span>
          </h1>
        </div>
      </section>

      {/* Info strip */}
      <section className="border-b border-border bg-white px-6 py-10">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-xs uppercase tracking-widest text-muted">Address</p>
            <p className="text-base font-medium">435 Broadway, New York, NY 10013</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs uppercase tracking-widest text-muted">Hours</p>
            <p className="text-base font-medium">Monday – Sunday · 11am – 7pm</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs uppercase tracking-widest text-muted">Subway</p>
            <p className="text-base font-medium">Canal St — N/Q/R/W · J/Z · 6</p>
          </div>
          <a
            href="https://maps.google.com/?q=435+Broadway+New+York"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center border border-black px-8 py-3 text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
          >
            Get Directions
          </a>
        </div>
      </section>

      {/* Description */}
      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <p className="mb-6 text-xs uppercase tracking-[0.3em] text-muted">SoHo, New York City</p>
          <h2 className="max-w-3xl text-3xl font-medium leading-tight tracking-tight sm:text-5xl">
            Discover your{" "}
            <span className="serif-italic font-normal text-muted">favorite local brands.</span>
          </h2>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted">
            New vendors arrive every week, making The Collective SoHo a place to consistently
            discover emerging brands, independent designers, and unique finds. Located on Broadway
            in the heart of SoHo — steps from some of New York City&apos;s most iconic shopping,
            galleries, and culture.
          </p>
        </div>
      </section>

      {/* Vendor showcase */}
      <section className="border-t border-border bg-neutral-50 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.3em] text-muted">Long-term residents</p>
              <h2 className="text-3xl font-medium leading-tight sm:text-4xl">
                20+ Local Brands
              </h2>
            </div>
            <Link
              href="/apply"
              className="inline-flex items-center justify-center bg-black px-8 py-3 text-xs uppercase tracking-widest text-white hover:bg-neutral-800 transition-colors"
            >
              Join Them — Apply
            </Link>
          </div>

          <ul className="divide-y divide-border">
            {vendors.map((v) => (
              <li key={v.ig}>
                <a
                  href={`https://www.instagram.com/${v.ig}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between py-5 transition-colors hover:text-muted"
                >
                  <span className="text-lg font-medium tracking-tight">{v.name}</span>
                  <span className="text-xs uppercase tracking-widest text-muted opacity-0 transition-opacity group-hover:opacity-100">
                    @{v.ig} ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Instagram */}
      <section className="border-t border-border bg-white px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="elfsight-app-3f1f09e0-b842-4811-b321-d81432a23ba5" data-elfsight-app-lazy />
          <Script src="https://elfsightcdn.com/platform.js" strategy="lazyOnload" />
        </div>
      </section>
    </>
  );
}
