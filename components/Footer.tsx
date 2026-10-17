import Link from "next/link";
import Logo from "./Logo";
import { Snowfall } from "./HolidayDecor";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-evergreen-deep text-white">
      <Snowfall density={0.4} />
      <div className="relative z-[4] mx-auto max-w-7xl px-6 py-16 md:py-20">
        <p className="ornament mb-14 text-sm text-champagne" aria-hidden>✦</p>
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo className="text-2xl text-white" />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/60">
              A curated retail destination in the heart of SoHo, home to emerging
              designers, artists, and independent brands.
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-champagne">
              Visit
            </h4>
            <p className="mt-4 text-sm leading-relaxed text-white">
              435 Broadway<br />
              New York, NY 10013
            </p>
            <p className="mt-3 text-sm text-white/60">Open daily · 11am–7pm</p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-champagne">
              Connect
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a
                  href="mailto:info@popupcollectivenyc.com"
                  className="hover:text-champagne"
                >
                  info@popupcollectivenyc.com
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/popupcollective.nyc/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-champagne"
                >
                  Instagram
                </a>
              </li>
              <li>
                <Link href="/apply" className="hover:text-champagne">
                  Become a Vendor
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col-reverse items-start gap-4 border-t border-white/10 pt-8 text-xs text-white/45 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} The Collective SoHo. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/terms-and-conditions" className="hover:text-champagne">
              Terms &amp; Conditions
            </Link>
            <Link href="/terms-of-use" className="hover:text-champagne">
              Terms of Use
            </Link>
            <Link href="/privacy-policy" className="hover:text-champagne">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
