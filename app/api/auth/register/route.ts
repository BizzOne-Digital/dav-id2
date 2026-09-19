import { NextResponse } from "next/server";
import { z } from "zod";
import { createRegisteredUser } from "@/lib/actions/auth";

const bodySchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  phone: z.string().max(30).optional(),
  marketing: z.boolean().optional(),
});

export async function POST(request: Request) {
  try {
    const json: unknown = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const result = await createRegisteredUser(parsed.data);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 409 });
    }

    return NextResponse.json({ success: true, userId: result.userId }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Registration failed" }, { status: 500 });
  }
}
