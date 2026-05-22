"use client";

import { useSignIn, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Login() {
  const { signIn } = useSignIn();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isSignedIn) router.replace("/dashboard");
  }, [isSignedIn, router]);

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!signIn) return;
    setError("");
    setLoading(true);
    try {
      // Check approved vendors list
      const res = await fetch(`/api/check-approval?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (!data.approved) {
        setError("This email isn't on our approved vendor list. Contact info@popupcollectivenyc.com to apply.");
        setLoading(false);
        return;
      }

      const { error: createError } = await (signIn as any).create({ identifier: email });
      if (createError) {
        setError(createError.longMessage ?? createError.message ?? "Could not send code.");
        setLoading(false);
        return;
      }
      const { error: sendError } = await (signIn as any).emailCode.sendCode();
      if (sendError) {
        setError(sendError.longMessage ?? sendError.message ?? "Could not send code.");
        setLoading(false);
        return;
      }
      setStep("code");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err?.errors?.[0]?.longMessage ?? err?.message ?? JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleCode(e: React.FormEvent) {
    e.preventDefault();
    if (!signIn) return;
    setError("");
    setLoading(true);
    try {
      const { error: verifyError } = await (signIn as any).emailCode.verifyCode({ code });
      if (verifyError) {
        setError(verifyError.longMessage ?? verifyError.message ?? "Invalid code. Please try again.");
        return;
      }
      await (signIn as any).finalize({ navigate: () => router.push("/dashboard") });
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
            Welcome <span className="serif-italic font-normal">back</span>.
          </h1>
          <p className="mx-auto mt-6 max-w-md text-base text-muted">
            Enter your approved email and we'll send you a sign-in code.
          </p>
        </div>
      </section>

      <section className="bg-neutral-50 px-6 py-20">
        <div className="mx-auto max-w-md">
          {step === "email" ? (
            <form onSubmit={handleEmail} className="space-y-5">
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
                disabled={loading || !signIn}
                className="w-full bg-black px-6 py-4 text-xs uppercase tracking-widest text-white hover:bg-neutral-800 transition-colors disabled:opacity-50"
              >
                {loading ? "Sending code…" : "Send Sign-In Code"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleCode} className="space-y-5">
              <p className="text-sm text-muted">
                We sent a 6-digit code to <strong>{email}</strong>. Enter it below.
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
                {loading ? "Verifying…" : "Sign In"}
              </button>
              <button
                type="button"
                onClick={() => { setStep("email"); setCode(""); setError(""); }}
                className="w-full text-xs text-muted uppercase tracking-widest hover:text-black transition-colors"
              >
                ← Use a different email
              </button>
            </form>
          )}

          <div className="my-10 border-t border-border" />
          <div className="space-y-4 text-center">
            <p className="text-sm text-muted">
              Don&apos;t have an account yet?
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center border border-black px-8 py-3 text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
              >
                Create Account
              </Link>
              <Link
                href="/apply"
                className="inline-flex items-center justify-center border border-border px-8 py-3 text-xs uppercase tracking-widest text-muted hover:border-black hover:text-black transition-colors"
              >
                Apply as a Vendor
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
