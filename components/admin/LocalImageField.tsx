"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAdminToast } from "@/components/admin/AdminToastProvider";
import { deleteStoredUploadByUrlClient } from "@/lib/uploads/client";
import { resolvePublicImageUrl, type UploadFolder } from "@/lib/uploads/constants";

const ACCEPT = "image/png,image/jpeg,image/webp,image/gif";

type LocalImageFieldProps = {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  folder: UploadFolder;
  className?: string;
};

export function LocalImageField({ label, value, onChange, folder, className }: LocalImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { toastSuccess, toastError } = useAdminToast();

  async function handleFile(file: File) {
    setUploading(true);
    const previous = value;

    try {
      if (previous.startsWith("/api/uploads/")) {
        await deleteStoredUploadByUrlClient(previous);
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success || !data.url) {
        toastError(data.error ?? "Upload failed");
        return;
      }

      onChange(data.url as string);
      toastSuccess("Image uploaded");
    } catch {
      toastError("Upload failed — check your connection");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleRemove() {
    if (value.startsWith("/api/uploads/")) {
      setUploading(true);
      try {
        await deleteStoredUploadByUrlClient(value);
        toastSuccess("Image removed");
      } catch {
        toastError("Could not delete stored file");
      } finally {
        setUploading(false);
      }
    }
    onChange("");
  }

  const previewSrc = value ? resolvePublicImageUrl(value) : null;

  return (
    <div className={className}>
      {label && <p className="mb-2 text-sm font-medium text-cream/90">{label}</p>}

      {previewSrc ? (
        <div className="relative aspect-video max-w-md overflow-hidden rounded-lg border border-cream/15 bg-charcoal">
          <Image src={previewSrc} alt="" fill className="object-cover" sizes="400px" unoptimized={value.startsWith("/api/uploads/")} />
          <div className="absolute bottom-2 right-2 flex gap-2">
            <Button
              type="button"
              variant="secondary"
              className="!px-3 !py-1.5 text-xs"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
            >
              Replace
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="!px-3 !py-1.5 text-xs"
              disabled={uploading}
              onClick={handleRemove}
            >
              <X className="size-4" aria-hidden />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="flex aspect-video max-w-md w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-cream/25 bg-charcoal/50 text-cream/60 transition-colors hover:border-gold/40 hover:text-cream"
        >
          {uploading ? (
            <Loader2 className="size-8 animate-spin text-gold" aria-hidden />
          ) : (
            <Upload className="size-8 text-gold/80" aria-hidden />
          )}
          <span className="text-sm">{uploading ? "Uploading…" : "Choose image"}</span>
          <span className="text-xs text-cream/40">PNG, JPEG, WebP, GIF · max 8MB</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />

      {value && (
        <p className="mt-2 truncate text-xs text-cream/40" title={value}>
          {value}
        </p>
      )}
    </div>
  );
}
