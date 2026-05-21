import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo className="text-2xl text-white" />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-neutral-400">
              A curated retail destination in the heart of SoHo, home to emerging
              designers, artists, and independent brands.
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-neutral-400">
              Visit
            </h4>
            <p className="mt-4 text-sm leading-relaxed text-white">
              435 Broadway<br />
              New York, NY 10013
            </p>
            <p className="mt-3 text-sm text-neutral-400">Open daily · 11am–7pm</p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-neutral-400">
              Connect
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a
                  href="mailto:info@popupcollectivenyc.com"
                  className="hover:text-neutral-300"
                >
                  info@popupcollectivenyc.com
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/popupcollective.nyc/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-neutral-300"
                >
                  Instagram
                </a>
              </li>
              <li>
                <Link href="/apply" className="hover:text-neutral-300">
                  Become a Vendor
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col-reverse items-start gap-4 border-t border-neutral-800 pt-8 text-xs text-neutral-500 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} The Collective SoHo. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/terms-and-conditions" className="hover:text-neutral-300">
              Terms &amp; Conditions
            </Link>
            <Link href="/terms-of-use" className="hover:text-neutral-300">
              Terms of Use
            </Link>
            <Link href="/privacy-policy" className="hover:text-neutral-300">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
