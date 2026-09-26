"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useClientMounted } from "@/lib/hooks/useClientMounted";
import { Menu, X } from "lucide-react";
import { AdminNavLinks } from "@/components/admin/AdminNav";
import { AdminToastProvider } from "@/components/admin/AdminToastProvider";
import { cn } from "@/lib/utils";

export function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  const [navOpen, setNavOpen] = useState(false);
  const mounted = useClientMounted();

  useEffect(() => {
    if (!navOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [navOpen]);

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <div className="flex items-center justify-between border-b border-cream/10 bg-charcoal/95 px-4 py-3 md:hidden">
        <Link href="/admin" className="font-[family-name:var(--font-bebas)] text-xl text-gold">
          Admin
        </Link>
        <button
          type="button"
          className="inline-flex rounded-lg p-2 text-cream hover:bg-cream/10"
          aria-expanded={navOpen}
          aria-label={navOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setNavOpen((v) => !v)}
        >
          {navOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      <aside className="hidden w-56 shrink-0 border-r border-cream/10 bg-charcoal/90 p-4 md:block">
        <Link href="/admin" className="font-[family-name:var(--font-bebas)] text-xl text-gold">
          Admin
        </Link>
        <AdminNavLinks className="mt-8" />
      </aside>

      {mounted &&
        navOpen &&
        createPortal(
          <div className="fixed inset-0 z-[200] md:hidden" role="dialog" aria-modal="true" aria-label="Admin navigation">
            <button
              type="button"
              className="absolute inset-0 bg-black/60"
              aria-label="Close navigation"
              onClick={() => setNavOpen(false)}
            />
            <aside
              className={cn(
                "absolute left-0 top-0 flex h-full w-[min(100%,18rem)] flex-col border-r border-cream/10 bg-charcoal p-4 shadow-2xl"
              )}
            >
              <div className="mb-4 flex items-center justify-between">
                <Link
                  href="/admin"
                  className="font-[family-name:var(--font-bebas)] text-xl text-gold"
                  onClick={() => setNavOpen(false)}
                >
                  Admin
                </Link>
                <button
                  type="button"
                  className="rounded-lg p-2 text-cream hover:bg-cream/10"
                  aria-label="Close navigation"
                  onClick={() => setNavOpen(false)}
                >
                  <X className="size-5" />
                </button>
              </div>
              <AdminNavLinks onNavigate={() => setNavOpen(false)} className="flex-1 overflow-y-auto" />
            </aside>
          </div>,
          document.body
        )}

      <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-10">
        <AdminToastProvider>{children}</AdminToastProvider>
      </main>
    </div>
  );
}
