import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import { CartProvider } from "@/lib/cart-context";
import CartBadge from "@/components/CartBadge";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  const brandName = (user?.unsafeMetadata?.brandName as string) ?? user?.emailAddresses?.[0]?.emailAddress ?? "Vendor";

  return (
    <CartProvider>
      <div className="flex min-h-[calc(100vh-120px)]">
        {/* Sidebar */}
        <aside className="hidden md:flex w-56 shrink-0 flex-col border-r border-border bg-neutral-50 px-6 py-10">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-widest text-muted">Welcome</p>
            <p className="mt-1 text-sm font-medium truncate">{brandName}</p>
          </div>
          <nav className="flex flex-col gap-1 text-xs uppercase tracking-widest">
            <Link href="/dashboard" className="py-2 text-black hover:text-muted transition-colors">
              Dashboard
            </Link>
            <Link href="/dashboard/book" className="py-2 text-black hover:text-muted transition-colors">
              Book a Booth
            </Link>
            <Link href="/dashboard/cart" className="py-2 text-black hover:text-muted transition-colors flex items-center gap-2">
              Cart <CartBadge />
            </Link>
            <Link href="/dashboard/vendor-guide" className="py-2 text-black hover:text-muted transition-colors">
              Vendor Guide
            </Link>
          </nav>
          <div className="mt-auto border-t border-border pt-6">
            <SignOutButton redirectUrl="/login">
              <button className="text-xs uppercase tracking-widest text-muted hover:text-black transition-colors">
                Sign Out
              </button>
            </SignOutButton>
          </div>
        </aside>

        {/* Mobile top bar */}
        <div className="md:hidden w-full">
          <div className="flex items-center justify-between border-b border-border bg-neutral-50 px-6 py-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted">Welcome</p>
              <p className="text-sm font-medium">{brandName}</p>
            </div>
            <div className="flex items-center gap-4 text-xs uppercase tracking-widest">
              <Link href="/dashboard" className="hover:text-muted transition-colors">Dashboard</Link>
              <Link href="/dashboard/book" className="hover:text-muted transition-colors">Book</Link>
              <Link href="/dashboard/cart" className="hover:text-muted transition-colors flex items-center gap-1">
                Cart <CartBadge />
              </Link>
              <SignOutButton redirectUrl="/login">
                <button className="text-muted hover:text-black transition-colors">Sign Out</button>
              </SignOutButton>
            </div>
          </div>
          <div className="flex-1">{children}</div>
        </div>

        {/* Main content (desktop) */}
        <div className="hidden md:block flex-1">{children}</div>
      </div>
    </CartProvider>
  );
}
