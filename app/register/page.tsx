"use client";

import { useSignUp } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Step = "email" | "details" | "verify";

export default function Register() {
  const { signUp } = useSignUp();
  const router = useRouter();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [brandName, setBrandName] = useState("");
  const [password, setPassword] = useState("");
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
        setError("Your email isn't on our approved list. Please submit an application first, or contact info@popupcollectivenyc.com.");
      } else {
        setStep("details");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function createAccount(e: React.FormEvent) {
    e.preventDefault();
    if (!signUp) return;
    setError("");
    setLoading(true);
    try {
      const { error: createError } = await signUp.create({
        emailAddress: email,
        password,
        unsafeMetadata: { brandName },
      });
      if (createError) {
        setError(createError.longMessage ?? "Could not create account.");
        return;
      }
      await signUp.verifications.sendEmailCode();
      setStep("verify");
    } catch (err: any) {
      setError(err?.errors?.[0]?.longMessage ?? "Could not create account. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function verifyEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!signUp) return;
    setError("");
    setLoading(true);
    try {
      const { error: verifyError } = await signUp.verifications.verifyEmailCode({ code });
      if (verifyError) {
        setError(verifyError.longMessage ?? "Invalid code.");
        return;
      }
      await signUp.finalize();
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.errors?.[0]?.longMessage ?? "Invalid code. Please try again.");
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

          {step === "details" && (
            <form onSubmit={createAccount} className="space-y-5">
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
              <div>
                <label className="mb-2 block text-xs uppercase tracking-widest text-muted" htmlFor="password">
                  Create a password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-border bg-white px-4 py-3 text-sm focus:border-black focus:outline-none"
                  placeholder="At least 8 characters"
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={loading || !signUp}
                className="w-full bg-black px-6 py-4 text-xs uppercase tracking-widest text-white hover:bg-neutral-800 transition-colors disabled:opacity-50"
              >
                {loading ? "Creating account…" : "Create Account"}
              </button>
            </form>
          )}

          {step === "verify" && (
            <form onSubmit={verifyEmail} className="space-y-5">
              <p className="text-sm text-muted">
                We sent a 6-digit code to <strong>{email}</strong>. Enter it below to verify your account.
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
                disabled={loading || !signUp}
                className="w-full bg-black px-6 py-4 text-xs uppercase tracking-widest text-white hover:bg-neutral-800 transition-colors disabled:opacity-50"
              >
                {loading ? "Verifying…" : "Verify & Enter Portal"}
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
