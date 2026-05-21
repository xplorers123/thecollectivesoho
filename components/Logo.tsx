import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="The Collective SoHo"
      className={`inline-flex items-baseline gap-1.5 leading-none tracking-tight ${className}`}
    >
      <span className="font-bold">The Collective</span>
      <span className="serif-italic">SoHo</span>
    </Link>
  );
}
