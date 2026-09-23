import type { Metadata } from "next";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export function buildPageMetadata(options: {
  title: string;
  description?: string;
  path?: string;
  ogImage?: string;
}): Metadata {
  const { title, description, path, ogImage } = options;
  const url = path ? `${appUrl}${path.startsWith("/") ? path : `/${path}`}` : appUrl;

  return {
    title,
    description,
    alternates: path ? { canonical: url } : undefined,
    openGraph: {
      title,
      description,
      url,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  };
}

export function settingsToDefaultDescription(settings: {
  tagline?: string;
  seo?: { defaultDescription?: string; defaultTitle?: string };
}): string {
  return (
    settings.seo?.defaultDescription ??
    settings.tagline ??
    "Turn downtown Music City into your personal game board. Solve clues, compete, and earn your Music City certificate."
  );
}
