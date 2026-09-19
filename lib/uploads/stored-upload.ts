import crypto from "crypto";
import { connectDB } from "@/lib/db/connect";
import { StoredUpload } from "@/lib/models/StoredUpload";
import { parseStoredUploadUrl } from "@/lib/uploads/constants";

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

export const ALLOWED_MIME_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export function generateUploadFilename(mimeType: string): string | null {
  const ext = ALLOWED_MIME_TYPES[mimeType];
  if (!ext) return null;
  const rand = crypto.randomBytes(8).toString("hex");
  return `${Date.now()}-${rand}.${ext}`;
}

export async function deleteStoredUploadByUrl(url: string): Promise<boolean> {
  const parsed = parseStoredUploadUrl(url);
  if (!parsed) return false;
  await connectDB();
  const result = await StoredUpload.deleteOne({ folder: parsed.folder, filename: parsed.filename });
  return result.deletedCount === 1;
}
