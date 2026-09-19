import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { StoredUpload } from "@/lib/models/StoredUpload";
import {
  isUploadFolder,
  sanitizeUploadFilename,
} from "@/lib/uploads/constants";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ folder: string; filename: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { folder, filename } = await context.params;

  if (!isUploadFolder(folder)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const safeName = sanitizeUploadFilename(filename);
  if (!safeName) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await connectDB();
  const doc = await StoredUpload.findOne({ folder, filename: safeName }).lean();
  if (!doc?.data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = Buffer.isBuffer(doc.data) ? doc.data : Buffer.from(doc.data);

  return new NextResponse(new Uint8Array(body), {
    status: 200,
    headers: {
      "Content-Type": doc.mimeType,
      "Content-Length": String(body.length),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
