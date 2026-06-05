import Link from "next/link";

export const metadata = {
  title: "Booth Options — The Collective SoHo",
  description: "Compare booth packages at The Collective SoHo — weekend, weekly, and monthly options.",
};

const tiers = [
  {
    name: "Weekend",
    badge: "Limited Availability",
    price: "$600",
    period: "/ weekend",
    description: "A short-run option to test the market. Weekend slots are limited and fill quickly.",
    days: "Saturday – Sunday (2 days)",
    featured: false,
    limited: true,
    features: [
      "2 days on the floor (Sat – Sun)",
      "5×7 ft or 4×9 ft booth",
      "Table & chairs included",
      "Heat, AC, electricity & WiFi",
      "Featured on our Instagram",
    ],
  },
  {
    name: "Weekly",
    badge: "Most Popular",
    price: "$850",
    period: "/ week",
    description: "Our most popular option — a full week to build momentum and connect with shoppers.",
    days: "Saturday – following Friday (7 days)",
    featured: true,
    limited: false,
    features: [
      "7 days on the floor (Sat – Fri)",
      "5×7 ft or 4×9 ft booth",
      "Table & chairs included",
      "Heat, AC, electricity & WiFi",
      "Listed on our vendor directory",
      "Priority floor placement",
    ],
  },
  {
    name: "Monthly",
    badge: "Best Value",
    price: "$3,200",
    period: "/ month",
    description: "Commit to a full month and we'll secure the best placement in the space for your brand.",
    days: "4-week booking period",
    featured: false,
    limited: false,
    features: [
      "30 days on the floor",
      "5×7 ft or 4×9 ft booth",
      "Table & chairs included",
      "Heat, AC, electricity & WiFi",
      "Premium placement in the space",
    ],
  },
];

const amenities = [
  { label: "Booth Size", value: "5×7 ft or 4×9 ft" },
  { label: "Power", value: "Electricity included" },
  { label: "Connectivity", value: "WiFi included" },
  { label: "Furniture", value: "Table & chairs provided" },
];

export default function BoothOptions() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-border bg-white px-6 pt-32 pb-16">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/apply"
            className="mb-8 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted hover:text-black transition-colors"
          >
            ← Back to Apply
          </Link>
          <p className="mb-6 text-xs uppercase tracking-[0.3em] text-muted">Booth Options</p>
          <h1 className="text-5xl font-medium leading-[1.05] tracking-tight sm:text-7xl">
            Find the right{" "}
            <span className="serif-italic font-normal">fit</span>.
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-muted">
            We offer flexibility for new brands to test out the location — while aiming to give every brand a long-term home in SoHo.
          </p>
        </div>
      </section>

      {/* Amenities strip */}
      <section className="border-b border-border bg-neutral-50 px-6 py-10">
        <div className="mx-auto max-w-5xl">
          <p className="mb-6 text-xs uppercase tracking-[0.3em] text-muted">What's included in every booth</p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {amenities.map((a) => (
              <div key={a.label} className="border-t border-border pt-4">
                <p className="text-xs uppercase tracking-widest text-muted">{a.label}</p>
                <p className="mt-1 text-sm font-medium">{a.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing tiers */}
      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 md:grid-cols-3">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative flex flex-col border p-8 ${
                  tier.featured
                    ? "border-black bg-black text-white"
                    : "border-border bg-white text-black"
                }`}
              >
                <div className="mb-6 flex items-start justify-between gap-2">
                  <p className="text-xs uppercase tracking-widest">{tier.name}</p>
                  <span
                    className={`text-xs uppercase tracking-widest px-2 py-1 ${
                      tier.limited
                        ? "bg-neutral-100 text-neutral-500"
                        : tier.featured
                        ? "bg-white/20 text-white"
                        : "bg-neutral-100 text-neutral-600"
                    }`}
                  >
                    {tier.badge}
                  </span>
                </div>

                <p className={`text-xs uppercase tracking-widest mb-1 ${tier.featured ? "text-white/50" : "text-muted"}`}>Starting at</p>
                <p className="text-4xl font-medium">
                  {tier.price}
                  <span className={`text-sm font-normal ml-1 ${tier.featured ? "text-white/60" : "text-muted"}`}>
                    {tier.period}
                  </span>
                </p>

                <p className={`mt-3 text-xs uppercase tracking-widest ${tier.featured ? "text-white/60" : "text-muted"}`}>
                  {tier.days}
                </p>

                <p className={`mt-4 text-sm leading-relaxed ${tier.featured ? "text-white/70" : "text-muted"}`}>
                  {tier.description}
                </p>

                <ul className={`mt-8 space-y-3 border-t pt-6 text-sm flex-1 ${
                  tier.featured ? "border-white/20 text-white/90" : "border-border text-neutral-700"
                }`}>
                  {tier.features.map((f) => (
                    <li key={f}>— {f}</li>
                  ))}
                </ul>

                <Link
                  href="/apply/form"
                  className={`mt-8 inline-flex items-center justify-center px-6 py-3 text-xs uppercase tracking-widest transition-colors ${
                    tier.featured
                      ? "bg-white text-black hover:bg-neutral-200"
                      : "border border-black hover:bg-black hover:text-white"
                  }`}
                >
                  Apply for {tier.name}
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-muted border-t border-border pt-6">
            Interested in a double space or a prime spot?{" "}
            <a
              href="mailto:info@popupcollectivenyc.com"
              className="underline underline-offset-2 hover:text-black transition-colors"
            >
              Contact us
            </a>{" "}
            — pricing varies based on size and placement.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-neutral-50 px-6 py-16">
        <div className="mx-auto max-w-5xl flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-lg font-medium">Ready to bring your brand to SoHo?</p>
          <Link
            href="/apply/form"
            className="inline-flex items-center justify-center bg-black px-10 py-4 text-xs uppercase tracking-widest text-white hover:bg-neutral-800 transition-colors"
          >
            Apply Now
          </Link>
        </div>
      </section>
    </>
  );
}
