"use client";

import { useSignIn } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Step = "email" | "brand" | "code";

export default function Register() {
  const { signIn } = useSignIn();
  const router = useRouter();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [brandName, setBrandName] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function checkApproval(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/check-approval?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (!data.approved) {
        setError("This email isn't on our approved list. Contact info@popupcollectivenyc.com to apply.");
      } else {
        setStep("brand");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function createAndSendCode(e: React.FormEvent) {
    e.preventDefault();
    if (!signIn) return;
    setError("");
    setLoading(true);
    try {
      // Create the Clerk user server-side
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, brandName }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not create account.");
        return;
      }

      // Sign in with email OTP (same flow as login page, which works)
      await (signIn as any).create({ identifier: email });
      await (signIn as any).emailCode.sendCode();
      setStep("code");
    } catch (err: any) {
      setError(err?.errors?.[0]?.longMessage ?? err?.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    if (!signIn) return;
    setError("");
    setLoading(true);
    try {
      await (signIn as any).emailCode.verifyCode({ code });
      await (signIn as any).finalize({ navigate: () => router.push("/dashboard") });
    } catch (err: any) {
      setError(err?.errors?.[0]?.longMessage ?? err?.message ?? "Invalid code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section className="border-b border-border bg-white px-6 pt-20 pb-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-6 text-xs uppercase tracking-[0.3em] text-muted">Vendor Portal</p>
          <h1 className="text-5xl font-medium leading-[1.05] tracking-tight sm:text-6xl">
            Create your <span className="serif-italic font-normal">account</span>.
          </h1>
          <p className="mx-auto mt-6 max-w-md text-base text-muted">
            Only vendors approved by The Collective SoHo may register.
          </p>
        </div>
      </section>

      <section className="bg-neutral-50 px-6 py-20">
        <div className="mx-auto max-w-md">

          {step === "email" && (
            <form onSubmit={checkApproval} className="space-y-5">
              <div>
                <label className="mb-2 block text-xs uppercase tracking-widest text-muted" htmlFor="email">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-border bg-white px-4 py-3 text-sm focus:border-black focus:outline-none"
                  placeholder="you@example.com"
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black px-6 py-4 text-xs uppercase tracking-widest text-white hover:bg-neutral-800 transition-colors disabled:opacity-50"
              >
                {loading ? "Checking…" : "Continue"}
              </button>
            </form>
          )}

          {step === "brand" && (
            <form onSubmit={createAndSendCode} className="space-y-5">
              <div>
                <label className="mb-2 block text-xs uppercase tracking-widest text-muted">Email</label>
                <p className="border border-border bg-white px-4 py-3 text-sm text-muted">{email}</p>
              </div>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-widest text-muted" htmlFor="brand">
                  Brand name
                </label>
                <input
                  id="brand"
                  type="text"
                  required
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full border border-border bg-white px-4 py-3 text-sm focus:border-black focus:outline-none"
                  placeholder="Your brand name"
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={loading || !signIn}
                className="w-full bg-black px-6 py-4 text-xs uppercase tracking-widest text-white hover:bg-neutral-800 transition-colors disabled:opacity-50"
              >
                {loading ? "Creating account…" : "Create Account & Send Code"}
              </button>
            </form>
          )}

          {step === "code" && (
            <form onSubmit={verifyCode} className="space-y-5">
              <p className="text-sm text-muted">
                We sent a 6-digit code to <strong>{email}</strong>. Enter it below to verify and activate your account.
              </p>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-widest text-muted" htmlFor="code">
                  Verification code
                </label>
                <input
                  id="code"
                  type="text"
                  inputMode="numeric"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full border border-border bg-white px-4 py-3 text-sm tracking-widest focus:border-black focus:outline-none"
                  placeholder="123456"
                  maxLength={6}
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={loading || !signIn}
                className="w-full bg-black px-6 py-4 text-xs uppercase tracking-widest text-white hover:bg-neutral-800 transition-colors disabled:opacity-50"
              >
                {loading ? "Verifying…" : "Verify & Enter Portal"}
              </button>
              <button
                type="button"
                onClick={() => { setStep("email"); setCode(""); setError(""); }}
                className="w-full text-xs text-muted uppercase tracking-widest hover:text-black transition-colors"
              >
                ← Start over
              </button>
            </form>
          )}

          <div className="my-10 border-t border-border" />
          <p className="text-center text-sm text-muted">
            Already have an account?{" "}
            <Link href="/login" className="underline underline-offset-2 hover:text-black transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
