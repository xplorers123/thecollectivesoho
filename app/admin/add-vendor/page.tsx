"use client";

import { useState } from "react";
import Link from "next/link";

const CATEGORIES = [
  "Jewelry",
  "Clothing & Accessories",
  "Beauty and Home Goods",
  "Vintage",
  "Food / Drink",
  "Other",
];

export default function AddVendorPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    brandName: "",
    category: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<"success" | "error" | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/add-vendor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? "Something went wrong.");
        setResult("error");
      } else {
        setResult("success");
        setForm({ firstName: "", lastName: "", email: "", brandName: "", category: "" });
      }
    } catch (err: any) {
      setErrorMsg(err.message ?? "Something went wrong.");
      setResult("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto px-8 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-xl font-medium">Add Approved Vendor</h1>
        <Link href="/admin/applications" className="text-xs uppercase tracking-widest text-neutral-400 hover:text-black transition-colors">
          ← Applications
        </Link>
      </div>

      {result === "success" && (
        <div className="mb-6 rounded bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">
          ✓ Vendor added and welcome email sent.
        </div>
      )}
      {result === "error" && (
        <div className="mb-6 rounded bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-widest text-neutral-500">First name</label>
            <input
              required
              value={form.firstName}
              onChange={(e) => set("firstName", e.target.value)}
              className="w-full border border-neutral-200 bg-white px-3 py-2.5 text-sm focus:border-black focus:outline-none"
              placeholder="Jane"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-widest text-neutral-500">Last name</label>
            <input
              required
              value={form.lastName}
              onChange={(e) => set("lastName", e.target.value)}
              className="w-full border border-neutral-200 bg-white px-3 py-2.5 text-sm focus:border-black focus:outline-none"
              placeholder="Smith"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-widest text-neutral-500">Email</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            className="w-full border border-neutral-200 bg-white px-3 py-2.5 text-sm focus:border-black focus:outline-none"
            placeholder="jane@example.com"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-widest text-neutral-500">Brand name</label>
          <input
            required
            value={form.brandName}
            onChange={(e) => set("brandName", e.target.value)}
            className="w-full border border-neutral-200 bg-white px-3 py-2.5 text-sm focus:border-black focus:outline-none"
            placeholder="Brand Name"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-widest text-neutral-500">Category</label>
          <select
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            className="w-full border border-neutral-200 bg-white px-3 py-2.5 text-sm focus:border-black focus:outline-none"
          >
            <option value="">Select a category (optional)</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black px-6 py-3 text-xs uppercase tracking-widest text-white hover:bg-neutral-800 transition-colors disabled:opacity-50"
        >
          {loading ? "Adding vendor…" : "Add Vendor & Send Welcome Email"}
        </button>
      </form>

      <p className="mt-6 text-xs text-neutral-400 leading-relaxed">
        This will add them to the approved vendors list, create their portal account, and send them the welcome email with registration instructions.
      </p>
    </div>
  );
}
