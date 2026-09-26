import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { StoredUpload } from "@/lib/models/StoredUpload";
import { requireAdminApi } from "@/lib/auth/require-admin";
import {
  ALLOWED_MIME_TYPES,
  MAX_UPLOAD_BYTES,
  generateUploadFilename,
  deleteStoredUploadByUrl,
} from "@/lib/uploads/stored-upload";
import {
  buildStoredUploadUrl,
  isUploadFolder,
  parseStoredUploadUrl,
} from "@/lib/uploads/constants";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: Request) {
  const admin = await requireAdminApi();
  if (admin.error) return admin.error;

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid form data" }, { status: 400 });
  }

  const folderRaw = String(formData.get("folder") ?? "");
  if (!isUploadFolder(folderRaw)) {
    return NextResponse.json({ success: false, error: "Invalid folder" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ success: false, error: "File is required" }, { status: 400 });
  }

  if (!ALLOWED_MIME_TYPES[file.type]) {
    return NextResponse.json(
      { success: false, error: "Only JPEG, PNG, WebP, and GIF images are allowed" },
      { status: 400 }
    );
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ success: false, error: "File must be 8MB or smaller" }, { status: 400 });
  }

  const filename = generateUploadFilename(file.type);
  if (!filename) {
    return NextResponse.json({ success: false, error: "Unsupported file type" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  await connectDB();
  await StoredUpload.create({
    folder: folderRaw,
    filename,
    mimeType: file.type,
    size: buffer.length,
    data: buffer,
  });

  const url = buildStoredUploadUrl(folderRaw, filename);

  return NextResponse.json({
    success: true,
    url,
    filename,
    size: buffer.length,
    folder: folderRaw,
  });
}

export async function DELETE(request: Request) {
  const admin = await requireAdminApi();
  if (admin.error) return admin.error;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }

  const url = typeof body === "object" && body && "url" in body ? String((body as { url: string }).url) : "";
  if (!parseStoredUploadUrl(url)) {
    return NextResponse.json({ success: false, error: "Invalid stored upload URL" }, { status: 400 });
  }

  const deleted = await deleteStoredUploadByUrl(url);
  return NextResponse.json({ success: true, deleted });
}
