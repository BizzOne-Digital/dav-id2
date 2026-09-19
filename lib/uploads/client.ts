import type { UploadFolder } from "@/lib/models/StoredUpload";

export type { UploadFolder };

export async function deleteStoredUploadByUrlClient(url: string): Promise<void> {
  if (!url.startsWith("/api/uploads/")) return;
  const res = await fetch("/api/upload", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? "Delete failed");
  }
}
