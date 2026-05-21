"use client";

import Link from "next/link";
import { useState } from "react";
import Logo from "./Logo";

const links = [
  { href: "/visit", label: "Visit" },
  { href: "/apply", label: "Apply" },
  { href: "/our-story", label: "Our Story" },
  { href: "/login", label: "Vendor Login" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/90 backdrop-blur">
      {/* Announcement banner */}
      <div className="bg-black px-4 py-2 text-center text-xs uppercase tracking-widest text-white">
        Join The Collective SoHo this Summer —{" "}
        <Link href="/apply" className="underline underline-offset-2 hover:text-neutral-300 transition-colors">
          Apply today
        </Link>
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Logo className="text-lg sm:text-xl" />

        <nav className="hidden gap-10 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm uppercase tracking-widest text-black hover:text-muted transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/apply"
          className="hidden md:inline-flex items-center justify-center bg-black px-5 py-2.5 text-xs uppercase tracking-widest text-white hover:bg-neutral-800 transition-colors"
        >
          Apply Now
        </Link>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col gap-1.5 p-2"
        >
          <span className={`block h-0.5 w-6 bg-black transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`block h-0.5 w-6 bg-black transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-6 bg-black transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-white">
          <nav className="flex flex-col px-6 py-6">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-3 text-sm uppercase tracking-widest"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/apply"
              onClick={() => setOpen(false)}
              className="mt-4 inline-flex items-center justify-center bg-black px-5 py-3 text-xs uppercase tracking-widest text-white"
            >
              Apply Now
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
