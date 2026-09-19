export const UPLOAD_FOLDERS = ["products", "gallery", "pages", "misc"] as const;
export type UploadFolder = (typeof UPLOAD_FOLDERS)[number];

export const LEGACY_UPLOAD_PLACEHOLDER = "/images/broadway-neon.jpg";

export function isUploadFolder(value: string): value is UploadFolder {
  return (UPLOAD_FOLDERS as readonly string[]).includes(value);
}

export function sanitizeUploadFilename(filename: string): string | null {
  if (!filename || filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
    return null;
  }
  if (!/^[a-zA-Z0-9._-]+$/.test(filename)) {
    return null;
  }
  return filename;
}

export function buildStoredUploadUrl(folder: UploadFolder, filename: string): string {
  return `/api/uploads/${folder}/${filename}`;
}

export function parseStoredUploadUrl(url: string): { folder: UploadFolder; filename: string } | null {
  if (!url.startsWith("/api/uploads/")) return null;
  const parts = url.split("/").filter(Boolean);
  if (parts.length !== 4 || parts[0] !== "api" || parts[1] !== "uploads") return null;
  const folder = parts[2];
  const filename = parts[3];
  if (!isUploadFolder(folder)) return null;
  if (!sanitizeUploadFilename(filename)) return null;
  return { folder, filename };
}

export function resolvePublicImageUrl(src?: string | null): string {
  if (!src || !src.trim()) return LEGACY_UPLOAD_PLACEHOLDER;
  if (src.startsWith("/uploads/")) return LEGACY_UPLOAD_PLACEHOLDER;
  return src;
}

export function isStoredUploadUrl(url?: string | null): boolean {
  return !!url && url.startsWith("/api/uploads/");
}
