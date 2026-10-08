import { Suspense } from "react";
import Link from "next/link";
import { PlayEntry } from "@/components/play/PlayEntry";
import { CardDescription } from "@/components/ui/Card";

export default function PlayPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-10">
      <div className="mb-4 flex items-center justify-between gap-3">
        <Link
          href="/"
          className="rounded-lg border border-cream/15 px-3 py-2 text-sm text-cream hover:border-gold/40 hover:text-gold"
        >
          ← Home
        </Link>
        <Link href="/booking" className="text-sm font-medium text-gold hover:underline">Book a hunt</Link>
      </div>

      <h1 className="mb-6 text-center font-[family-name:var(--font-bebas)] text-3xl tracking-wide text-gold">
        Music City Scavenger Hunt
      </h1>

      <Suspense
        fallback={
          <CardDescription className="text-center">Loading…</CardDescription>
        }
      >
        <PlayEntry />
      </Suspense>
    </div>
  );
}
