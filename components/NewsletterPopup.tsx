"use client";

import { useEffect, useState } from "react";

export default function NewsletterPopup() {
  const [visible, setVisible] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("newsletter_dismissed")) return;
    const t = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(t);
  }, []);

  function dismiss() {
    localStorage.setItem("newsletter_dismissed", "1");
    setVisible(false);
  }

  function toggleInterest(val: string) {
    setInterest((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName || !email || interest.length === 0) return;
    await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, email, interest }),
    });
    setSubmitted(true);
    setTimeout(dismiss, 2000);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
    >
      <div className="relative w-full max-w-lg bg-white px-10 py-12">
        {/* Close */}
        <button
          onClick={dismiss}
          aria-label="Close"
          className="absolute right-5 top-5 text-black/40 hover:text-black transition-colors text-2xl leading-none"
        >
          ×
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <p className="serif-italic text-4xl mb-3">Thank you.</p>
            <p className="text-sm text-muted uppercase tracking-widest">
              You&apos;re on the list.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <p className="mb-1 text-xs uppercase tracking-[0.25em] text-muted">
              Stay connected
            </p>
            <h2 className="mb-2 text-3xl font-bold leading-tight tracking-tight">
              Join the community.
            </h2>
            <p className="mb-8 text-sm text-muted leading-relaxed">
              Be the first to hear about new vendors, markets, and events at
              The Collective SoHo.
            </p>

            <div className="mb-5 grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-widest">
                  First Name <span className="text-black">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-black transition-colors"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-widest">
                  Email <span className="text-black">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-black transition-colors"
                />
              </div>
            </div>

            <div className="mb-8">
              <p className="mb-3 text-xs uppercase tracking-widest">
                I am a <span className="text-black">*</span>
              </p>
              <div className="flex gap-6">
                {["Shopper", "Vendor"].map((opt) => (
                  <label
                    key={opt}
                    className="flex cursor-pointer items-center gap-2 text-sm uppercase tracking-wider"
                  >
                    <input
                      type="checkbox"
                      checked={interest.includes(opt)}
                      onChange={() => toggleInterest(opt)}
                      className="h-4 w-4 cursor-pointer accent-black"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-black py-4 text-xs uppercase tracking-widest text-white hover:bg-neutral-800 transition-colors"
            >
              Subscribe
            </button>

            <p className="mt-5 text-xs text-muted leading-relaxed">
              By signing up you agree to receive updates from The Collective
              SoHo. You may unsubscribe at any time.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
