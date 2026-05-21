"use client";

import { useState } from "react";

export default function ApplyForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="border border-border bg-white p-10 text-center">
        <p className="serif-italic text-4xl">Thank you.</p>
        <p className="mt-4 text-muted">
          We&apos;ve received your application and will be in touch within
          5 business days.
        </p>
      </div>
    );
  }

  const field =
    "w-full border-b border-border bg-transparent py-4 text-base outline-none focus:border-black transition-colors";
  const label = "block text-xs uppercase tracking-widest text-muted mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="name" className={label}>Your name</label>
          <input id="name" name="name" required className={field} />
        </div>
        <div>
          <label htmlFor="brand" className={label}>Brand name</label>
          <input id="brand" name="brand" required className={field} />
        </div>
        <div>
          <label htmlFor="email" className={label}>Email</label>
          <input id="email" name="email" type="email" required className={field} />
        </div>
        <div>
          <label htmlFor="instagram" className={label}>Instagram</label>
          <input id="instagram" name="instagram" placeholder="@yourbrand" className={field} />
        </div>
      </div>

      <div>
        <label htmlFor="tier" className={label}>Booth interest</label>
        <select id="tier" name="tier" className={field} defaultValue="">
          <option value="" disabled>Select an option…</option>
          <option value="weekend">Weekend — $550</option>
          <option value="week">Week — $750</option>
          <option value="month">Month — $3,000</option>
          <option value="unsure">Not sure yet</option>
        </select>
      </div>

      <div>
        <label htmlFor="about" className={label}>Tell us about your brand</label>
        <textarea
          id="about"
          name="about"
          rows={5}
          required
          className={`${field} resize-none`}
          placeholder="What do you make? Who is it for? What makes it different?"
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex items-center justify-center bg-black px-10 py-4 text-xs uppercase tracking-widest text-white hover:bg-neutral-800 transition-colors disabled:opacity-50"
      >
        {status === "sending" ? "Sending…" : "Submit application"}
      </button>

      {status === "error" && (
        <p className="text-sm text-red-600">
          Something went wrong. Please email info@popupcollectivenyc.com directly.
        </p>
      )}
    </form>
  );
}
