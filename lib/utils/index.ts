import crypto from "crypto";

export function formatCurrency(cents: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);
}

export function generateJoinCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function generateSessionCode(): string {
  const d = new Date();
  const y = String(d.getFullYear()).slice(-2);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const rand = crypto.randomBytes(2).toString("hex").toUpperCase();
  return `NSH-${y}-${m}${day}-${rand}`;
}

export function generateBookingReference(): string {
  return `BK-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
}

export function generateEntitlementToken(): string {
  return crypto.randomBytes(24).toString("hex");
}

export function generateCompletionNumber(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function hashSeed(parts: string[]): string {
  return crypto.createHash("sha256").update(parts.join(":")).digest("hex");
}

export function seededRandom(seed: string): () => number {
  let h = crypto.createHash("sha256").update(seed).digest();
  let i = 0;
  return () => {
    if (i >= h.length - 4) {
      h = crypto.createHash("sha256").update(h).digest();
      i = 0;
    }
    const n = h.readUInt32BE(i);
    i += 4;
    return n / 0xffffffff;
  };
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function normalizeAnswer(answer: string): string {
  return answer.trim().toLowerCase().replace(/\s+/g, " ");
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
