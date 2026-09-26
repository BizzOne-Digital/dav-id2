import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db/connect";
import { Challenge } from "@/lib/models/Challenge";
import { normalizeAnswer } from "@/lib/utils";

function sanitizeChallenge(doc: {
  _id: unknown;
  type: string;
  title?: string | null;
  instructions: string;
  clue?: string | null;
  options?: string[] | null;
  hint?: string | null;
  hintPenalty?: number | null;
  basePoints?: number | null;
  difficulty?: string | null;
}) {
  return {
    id: String(doc._id),
    type: doc.type,
    title: doc.title ?? undefined,
    instructions: doc.instructions,
    clue: doc.clue ?? undefined,
    options: doc.options ?? undefined,
    hint: doc.hint ?? undefined,
    hintPenalty: doc.hintPenalty ?? 50,
    basePoints: doc.basePoints ?? 300,
    difficulty: doc.difficulty ?? "moderate",
  };
}

export async function GET() {
  try {
    await connectDB();
    const challenge = await Challenge.findOne({ isPreviewSafe: true, active: true })
      .select("-answer -acceptedVariants")
      .lean();

    if (!challenge) {
      return NextResponse.json({ success: false, error: "No preview challenge configured" }, { status: 404 });
    }

    return NextResponse.json({ success: true, challenge: sanitizeChallenge(challenge) });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

const answerSchema = z.object({
  challengeId: z.string().min(1),
  answer: z.string().min(1).max(500),
});

function isAnswerCorrect(
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

export async function POST(request: Request) {
  try {
    const json: unknown = await request.json();
    const parsed = answerSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    await connectDB();
    const challenge = await Challenge.findOne({
      _id: parsed.data.challengeId,
      isPreviewSafe: true,
      active: true,
    }).lean();

    if (!challenge) {
      return NextResponse.json({ success: false, error: "Preview challenge not found" }, { status: 404 });
    }

    const correct = isAnswerCorrect(
      parsed.data.answer,
      challenge.answer,
      challenge.acceptedVariants
    );

    return NextResponse.json({
      success: true,
      correct,
      message: correct ? "Correct! You nailed it." : "Not quite — try again!",
    });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
