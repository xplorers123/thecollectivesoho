"use client";

import { useEffect, useState } from "react";

export default function NewsletterPopup() {
  const [visible, setVisible] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("newsletter_dismissed")) return;
    const t = setTimeout(() => setVisible(true), 30000);
    return () => clearTimeout(t);
  }, []);

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
    setTimeout(() => {
      localStorage.setItem("newsletter_dismissed", "1");
      setVisible(false);
    }, 2000);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 right-4 z-50 w-80">
      {/* Minimized tab */}
      {minimized ? (
        <button
          type="button"
          onClick={() => setMinimized(false)}
          className="w-full bg-black text-white text-xs uppercase tracking-widest px-5 py-3 flex items-center justify-between hover:bg-neutral-800 transition-colors"
        >
          <span>Join the community</span>
          <span className="text-lg leading-none">+</span>
        </button>
      ) : (
        <div className="bg-white border border-border shadow-xl">
          {/* Header bar with minimize */}
          <div className="flex items-center justify-between bg-black px-5 py-3">
            <span className="text-xs uppercase tracking-widest text-white">
              Stay connected
            </span>
            <button
              type="button"
              onClick={() => setMinimized(true)}
              aria-label="Minimize"
              className="text-white/60 hover:text-white transition-colors text-xl leading-none pb-1"
            >
              −
            </button>
          </div>

          <div className="px-6 py-6">
            {submitted ? (
              <div className="text-center py-4">
                <p className="serif-italic text-3xl mb-2">Thank you.</p>
                <p className="text-xs text-muted uppercase tracking-widest">
                  You&apos;re on the list.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight">
                  Join the community.
                </h2>
                <p className="mb-5 text-xs text-muted leading-relaxed">
                  Be the first to hear about new vendors, markets, and events.
                </p>

                <div className="space-y-3 mb-4">
                  <input
                    type="text"
                    placeholder="First name"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full border border-border px-3 py-2.5 text-sm outline-none focus:border-black transition-colors"
                  />
                  <input
                    type="email"
                    placeholder="Email address"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-border px-3 py-2.5 text-sm outline-none focus:border-black transition-colors"
                  />
                </div>

                <div className="mb-5">
                  <p className="mb-2 text-xs uppercase tracking-widest text-muted">
                    I am a
                  </p>
                  <div className="flex gap-5">
                    {["Shopper", "Vendor"].map((opt) => (
                      <label
                        key={opt}
                        className="flex cursor-pointer items-center gap-2 text-xs uppercase tracking-wider"
                      >
                        <input
                          type="checkbox"
                          checked={interest.includes(opt)}
                          onChange={() => toggleInterest(opt)}
                          className="h-3.5 w-3.5 cursor-pointer accent-black"
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-black py-3 text-xs uppercase tracking-widest text-white hover:bg-neutral-800 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
