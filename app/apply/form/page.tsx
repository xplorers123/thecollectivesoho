"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  "Jewelry",
  "Beauty and Home Goods",
  "Clothing & Accessories",
  "Vintage",
  "Food / Drink",
  "Other",
];

const BOOKING_TYPES = [
  "Weekly ($850+/week)",
  "Monthly ($3,200+/month)",
  "Weekend ($600+/weekend)",
];

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="mb-2 block text-xs uppercase tracking-widest text-muted">
      {children}{required && <span className="ml-1 text-black">*</span>}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full border border-border bg-white px-4 py-3 text-sm focus:border-black focus:outline-none"
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      rows={4}
      className="w-full border border-border bg-white px-4 py-3 text-sm focus:border-black focus:outline-none resize-none"
    />
  );
}

function RadioGroup({
  name, options, value, onChange,
}: {
  name: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      {options.map((opt) => (
        <label key={opt} className="flex cursor-pointer items-center gap-3 text-sm">
          <input
            type="radio"
            name={name}
            value={opt}
            checked={value === opt}
            onChange={() => onChange(opt)}
            className="h-4 w-4 cursor-pointer accent-black"
          />
          {opt}
        </label>
      ))}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-t border-border pt-10 mt-10">
      <p className="text-xs uppercase tracking-[0.3em] text-muted mb-6">{children}</p>
    </div>
  );
}

export default function ApplyForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [brandName, setBrandName] = useState("");
  const [category, setCategory] = useState("");
  const [instagram, setInstagram] = useState("");
  const [website, setWebsite] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [brandStory, setBrandStory] = useState("");
  const [productPhotos, setProductPhotos] = useState<FileList | null>(null);
  const [displayPhotos, setDisplayPhotos] = useState<FileList | null>(null);
  const [bookingType, setBookingType] = useState("");
  const [additionalComments, setAdditionalComments] = useState("");
  const [emailConsent, setEmailConsent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!emailConsent) {
      setError("Please agree to receive communications to submit your application.");
      return;
    }

    // File size check — max 3 MB per file, 10 MB total
    const allFiles = [
      ...(productPhotos ? Array.from(productPhotos) : []),
      ...(displayPhotos ? Array.from(displayPhotos) : []),
    ];
    const oversized = allFiles.filter((f) => f.size > 3 * 1024 * 1024);
    if (oversized.length) {
      setError(`Each photo must be under 3 MB. Please compress or resize: ${oversized.map((f) => f.name).join(", ")}`);
      return;
    }
    const totalSize = allFiles.reduce((s, f) => s + f.size, 0);
    if (totalSize > 10 * 1024 * 1024) {
      setError("Total photo size must be under 10 MB. Please reduce the number or size of photos.");
      return;
    }

    setError("");
    setLoading(true);

    const fd = new FormData();
    fd.append("firstName", firstName);
    fd.append("lastName", lastName);
    fd.append("phone", phone);
    fd.append("email", email);
    fd.append("brandName", brandName);
    fd.append("category", category);
    fd.append("instagram", instagram);
    fd.append("website", website);
    fd.append("priceRange", priceRange);
    fd.append("brandStory", brandStory);
    fd.append("bookingType", bookingType);
    fd.append("additionalComments", additionalComments);
    fd.append("emailConsent", String(emailConsent));
    if (productPhotos) Array.from(productPhotos).forEach((f) => fd.append("productPhotos", f));
    if (displayPhotos) Array.from(displayPhotos).forEach((f) => fd.append("displayPhotos", f));

    try {
      const res = await fetch("/api/apply", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
      } else {
        setSubmitted(true);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <section className="bg-neutral-50 px-6 py-32 min-h-[60vh] flex items-center justify-center">
        <div className="mx-auto max-w-md text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-muted">Application Received</p>
          <h2 className="text-4xl font-medium leading-tight">
            Thank you, <span className="serif-italic font-normal">{firstName}</span>.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-muted">
            We've received your application for <strong>{brandName}</strong> and will be in touch shortly.
          </p>
          <Link
            href="/"
            className="mt-10 inline-flex items-center justify-center border border-black px-8 py-3 text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="border-b border-border bg-white px-6 pt-32 pb-12">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/apply"
            className="mb-8 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted hover:text-black transition-colors"
          >
            ← Back to Apply
          </Link>
          <p className="mb-6 text-xs uppercase tracking-[0.3em] text-muted">Vendor Application</p>
          <h1 className="text-4xl font-medium leading-tight tracking-tight sm:text-6xl">
            Tell us about{" "}
            <span className="serif-italic font-normal">your brand</span>.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted">
            All applications are reviewed personally. We'll be in touch shortly.
          </p>
        </div>
      </section>

      <section className="bg-neutral-50 px-6 py-16">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-6">

          {/* Personal Info */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label required>First Name</Label>
              <Input required value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Jane" />
            </div>
            <div>
              <Label required>Last Name</Label>
              <Input required value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Smith" />
            </div>
          </div>

          <div>
            <Label required>Phone Number</Label>
            <Input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(000) 000-0000" />
          </div>

          <div>
            <Label required>Email</Label>
            <Input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>

          <SectionTitle>Brand Information</SectionTitle>

          <div>
            <Label required>Company / Brand Name</Label>
            <Input required value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="Your Brand" />
          </div>

          <div>
            <Label required>Product Category</Label>
            <select
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-border bg-white px-4 py-3 text-sm focus:border-black focus:outline-none"
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {category === "Food / Drink" && (
              <p className="mt-2 text-xs text-muted leading-relaxed">
                Food vendors must comply with all applicable NYC and NY State food safety regulations and may be asked to provide relevant permits.
              </p>
            )}
          </div>

          <div>
            <Label required>Instagram / Facebook / TikTok Handle</Label>
            <Input required value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="@yourbrand" />
          </div>

          <div>
            <Label>Website</Label>
            <Input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://yourbrand.com" />
          </div>

          <div>
            <Label required>Price Range of Your Products</Label>
            <Input required value={priceRange} onChange={(e) => setPriceRange(e.target.value)} placeholder="e.g. $20 – $200" />
          </div>

          <div>
            <Label>Tell us about your brand and story</Label>
            <Textarea value={brandStory} onChange={(e) => setBrandStory(e.target.value)} placeholder="Share your story..." />
          </div>

          <div>
            <Label>Attach photos of your products / display</Label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setProductPhotos(e.target.files)}
              className="w-full border border-border bg-white px-4 py-3 text-sm file:mr-4 file:border-0 file:bg-black file:px-3 file:py-1 file:text-xs file:uppercase file:tracking-widest file:text-white cursor-pointer"
            />
          </div>

          <div>
            <Label>Attach photos of your displays</Label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setDisplayPhotos(e.target.files)}
              className="w-full border border-border bg-white px-4 py-3 text-sm file:mr-4 file:border-0 file:bg-black file:px-3 file:py-1 file:text-xs file:uppercase file:tracking-widest file:text-white cursor-pointer"
            />
          </div>

          <SectionTitle>Booking Preference</SectionTitle>

          <div>
            <Label required>Which booking type are you interested in?</Label>
            <RadioGroup name="bookingType" options={BOOKING_TYPES} value={bookingType} onChange={setBookingType} />
            {bookingType === "Weekend ($600+/weekend)" && (
              <p className="mt-3 border border-border bg-white px-4 py-3 text-xs leading-relaxed text-muted">
                <strong className="text-black">NOTE:</strong> Weekend-only application is limited and not guaranteed. For the summer/fall, we are prioritizing weekly participants.
              </p>
            )}
          </div>

          <SectionTitle>Almost Done</SectionTitle>

          <div>
            <Label>Additional Comments / Questions</Label>
            <Textarea value={additionalComments} onChange={(e) => setAdditionalComments(e.target.value)} placeholder="Anything else you'd like us to know?" />
          </div>

          <div>
            <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed">
              <input
                type="checkbox"
                checked={emailConsent}
                onChange={(e) => setEmailConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 cursor-pointer accent-black"
              />
              <span>
                I agree to receive email or text messages from The Collective SoHo.{" "}
                <span className="text-black font-medium">*</span>
              </span>
            </label>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black px-6 py-4 text-xs uppercase tracking-widest text-white hover:bg-neutral-800 transition-colors disabled:opacity-50"
          >
            {loading ? "Submitting…" : "Submit Application"}
          </button>

          <p className="text-center text-xs text-muted">
            All applications are reviewed personally. We'll be in touch shortly.
          </p>
        </form>
      </section>
    </>
  );
}
