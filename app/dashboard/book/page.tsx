import Image from "next/image";
import Link from "next/link";

export const metadata = { title: "Book a Booth — The Collective SoHo" };

const types = [
  {
    type: "Weekend",
    href: "/dashboard/book/weekend",
    days: "Saturday – Sunday",
    image: "/images/DSC_0361-scaled.jpg",
  },
  {
    type: "Weekly",
    href: "/dashboard/book/weekly",
    days: "Saturday – Friday",
    image: "/images/DSC_0381-scaled.jpg",
  },
  {
    type: "Monthly",
    href: "/dashboard/book/monthly",
    days: "Full calendar month",
    image: "/images/DSC_0378-scaled.jpg",
  },
];

export default function BookPage() {
  return (
    <div className="px-8 py-10">
      <div className="mb-10">
        <Link href="/dashboard" className="text-xs uppercase tracking-widest text-muted hover:text-black transition-colors">
          ← Dashboard
        </Link>
        <h1 className="mt-6 text-3xl font-medium">Book a Booth</h1>
        <p className="mt-2 text-sm text-muted">Select a booking period to view available dates.</p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {types.map((t) => (
          <Link key={t.type} href={t.href} className="group relative block overflow-hidden border border-border bg-white">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={t.image}
                alt={t.type}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(min-width: 768px) 33vw, 100vw"
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-medium">{t.type}</h2>
              <p className="mt-1 text-xs uppercase tracking-widest text-muted">{t.days}</p>
              <p className="mt-4 text-xs uppercase tracking-widest text-black group-hover:underline underline-offset-2 transition-all">
                Select Dates →
              </p>
            </div>
          </Link>
        ))}
      </div>

      <p className="mt-8 text-sm text-muted border-t border-border pt-6">
        Interested in a double space or a custom arrangement?{" "}
        <a href="mailto:info@popupcollectivenyc.com" className="underline underline-offset-2 hover:text-black transition-colors">
          Contact us
        </a>.
      </p>
    </div>
  );
}
