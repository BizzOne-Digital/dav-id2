"use client";

import { Copy } from "lucide-react";

export function CopyJoinCodeButton({ code }: { code: string }) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1 text-sm text-gold hover:text-cream"
      onClick={() => navigator.clipboard.writeText(code)}
    >
      <Copy className="size-4" aria-hidden />
      Copy
    </button>
  );
}
