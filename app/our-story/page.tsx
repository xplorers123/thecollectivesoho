import Image from "next/image";
import Link from "next/link";
import StoryCarousel from "@/components/StoryCarousel";

export const metadata = {
  title: "Our Story — The Collective SoHo",
  description: "How Lou founded The Collective SoHo after experiencing firsthand how hard it is for small businesses to access retail space in New York City.",
};

export default function OurStory() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-border bg-white px-6 pt-32 pb-20">
        <div className="mx-auto max-w-5xl">
          <p className="mb-6 text-xs uppercase tracking-[0.3em] text-muted">
            Our Story
          </p>
          <h1 className="text-5xl font-medium leading-[1.05] tracking-tight sm:text-7xl">
            Built by a small business owner,{" "}
            <span className="serif-italic font-normal">for small business owners</span>.
          </h1>
        </div>
      </section>

      {/* Personal story */}
      <section className="bg-white px-6 py-24">
        <div className="mx-auto grid max-w-6xl gap-16 md:grid-cols-2">
          <div className="space-y-6 text-lg leading-relaxed text-neutral-700">
            <p>
              Hi, my name is Lou, I&apos;m a student at Columbia University, and the founder of
              Pop-Up Collective NYC (Now Collective SoHo). Like many students living in New York
              City, I needed to find ways to support myself. I worked as an art instructor,
              barista, camp counselor etc…
            </p>
            <p>
              Two years ago, I started my small business selling press-on nails. Through that
              journey, I quickly learned how hard it is for small brands like me to find a
              sustainable place to showcase our products. Most retail spaces in the city are out of
              reach, extremely expensive and require long term commitment. However, that frustration
              turned into a vision: a space built for small businesses, by someone who truly
              understands what it&apos;s like to be one.
            </p>
            <p>
              That&apos;s how Pop-Up Collective NYC began. It&apos;s more than a market;
              it&apos;s a community. A place where independent creators, artists, and designers can
              showcase their craft, meet customers face-to-face, and grow together.
            </p>
            <p>
              What began as a 1 month pop-up has since grown into a larger presence in SoHo,
              bringing the concept into one of New York City&apos;s most iconic shopping
              destinations. This next chapter reflects both the growth of the brand and the growing
              need for spaces that make retail more accessible for local businesses.
            </p>
          </div>
          <StoryCarousel />
        </div>
      </section>

      {/* Timeline */}
      <section className="border-t border-border bg-neutral-50 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <p className="mb-10 text-xs uppercase tracking-[0.3em] text-muted">The journey</p>
          <div className="space-y-16">
            {/* November 2025 */}
            <div className="border-t border-border pt-8">
              <div className="grid gap-4 md:grid-cols-[180px_1fr]">
                <p className="text-xs uppercase tracking-widest text-muted pt-1">November 2025</p>
                <div>
                  <h3 className="text-xl font-medium">The first pop-up</h3>
                  <p className="mt-3 text-base leading-relaxed text-muted">We launched our first market at 57 Bond Street — proving the concept and building a community of independent creators, artists, and designers ready to showcase their work.</p>
                  <div className="relative mt-6 aspect-[3/2] overflow-hidden w-1/2">
                    <Image
                      src="/images/grand-opening-lou.webp"
                      alt="Grand opening at 57 Bond Street"
                      fill
                      className="object-cover"
                      sizes="(min-width: 768px) 60vw, 100vw"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* April 2026 */}
            <div className="border-t border-border pt-8">
              <div className="grid gap-4 md:grid-cols-[180px_1fr]">
                <p className="text-xs uppercase tracking-widest text-muted pt-1">April 2026</p>
                <div>
                  <h3 className="text-xl font-medium">Expanding to SoHo</h3>
                  <p className="mt-3 text-base leading-relaxed text-muted">We opened The Collective SoHo at 435 Broadway — one of NYC's most iconic retail corridors — bringing our mission to the heart of the city.</p>
                  <div className="relative mt-6 aspect-[3/2] overflow-hidden w-1/2">
                    <Image
                      src="/images/IMG_0446.jpg"
                      alt="Opening at 435 Broadway SoHo"
                      fill
                      className="object-cover"
                      sizes="(min-width: 768px) 60vw, 100vw"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-medium leading-tight sm:text-4xl">What we&apos;re building.</h2>
          <div className="mt-12 grid gap-12 md:grid-cols-3">
            {[
              {
                t: "More than a market.",
                b: "The Collective SoHo is a community — a place where independent creators, artists, and designers can showcase their craft, meet customers face-to-face, and grow together.",
              },
              {
                t: "Flexibility first.",
                b: "We offer booking periods that work for small brands — no long-term leases, no impossible overhead. Just the space and support you need to sell.",
              },
              {
                t: "Shop small, always.",
                b: "Every purchase at The Collective SoHo supports an independent maker. We invite locals and visitors alike to discover the people who make this city special.",
              },
            ].map((v) => (
              <div key={v.t} className="border-t border-border pt-8">
                <h3 className="text-xl font-medium leading-snug serif-italic">{v.t}</h3>
                <p className="mt-4 text-base text-muted">{v.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black px-6 py-32 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h3 className="text-4xl font-medium leading-tight sm:text-5xl">
            Ready to join the community?
          </h3>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/70">
            Whether you&apos;re here to sell or to shop — you belong here.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/apply"
              className="inline-flex items-center justify-center bg-white px-10 py-4 text-xs uppercase tracking-widest text-black hover:bg-neutral-200 transition-colors"
            >
              Apply as a Vendor
            </Link>
            <Link
              href="/visit"
              className="inline-flex items-center justify-center border border-white px-10 py-4 text-xs uppercase tracking-widest text-white hover:bg-white hover:text-black transition-colors"
            >
              Visit the Space
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
