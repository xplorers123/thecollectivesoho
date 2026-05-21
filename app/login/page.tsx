"use client";

import { useSignIn, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Login() {
  const { signIn } = useSignIn();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) router.replace("/dashboard");
  }, [isSignedIn, router]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!signIn) return;
    setError("");
    setLoading(true);
    try {
      const { error: createError } = await (signIn as any).create({ identifier: email, password });
      if (createError) {
        setError(createError.longMessage ?? createError.message ?? "Invalid email or password.");
        return;
      }
      await (signIn as any).finalize({ navigate: () => router.push("/dashboard") });
    } catch (err: any) {
      setError(err?.errors?.[0]?.longMessage ?? "Invalid email or password.");
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
            This area is for approved vendors only. If you have an account, sign in below.
          </p>
        </div>
      </section>

      <section className="bg-neutral-50 px-6 py-20">
        <div className="mx-auto max-w-md">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-xs uppercase tracking-widest text-muted" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-border bg-white px-4 py-3 text-sm focus:border-black focus:outline-none"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-widest text-muted" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-border bg-white px-4 py-3 text-sm focus:border-black focus:outline-none"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading || !signIn}
              className="w-full bg-black px-6 py-4 text-xs uppercase tracking-widest text-white hover:bg-neutral-800 transition-colors disabled:opacity-50"
            >
              {loading ? "Signing in…" : "Log In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            <a href="mailto:info@popupcollectivenyc.com" className="underline underline-offset-2 hover:text-black transition-colors">
              Forgot your password?
            </a>
          </p>

          <div className="my-10 border-t border-border" />

          <div className="space-y-4 text-center">
            <p className="text-sm text-muted">
              Don&apos;t have an account? Only approved vendors who have submitted an application may register.
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
