import { normalizeAnswer } from "@/lib/utils";

export function isAnswerCorrect(
  submitted: string,
  answer?: string | null,
  variants?: string[] | null
): boolean {
  const normalized = normalizeAnswer(submitted);
  const accepted = new Set<string>();
  if (answer) accepted.add(normalizeAnswer(answer));
  for (const v of variants ?? []) {
    accepted.add(normalizeAnswer(v));
  }
  return accepted.has(normalized);
}
