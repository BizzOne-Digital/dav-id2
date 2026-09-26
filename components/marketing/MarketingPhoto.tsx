import Image from "next/image";
import { cn } from "@/lib/utils";
import { resolvePublicImageUrl } from "@/lib/uploads/constants";

type MarketingPhotoProps = {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  aspect?: "video" | "square" | "wide" | "portrait";
};

export function MarketingPhoto({
  src,
  alt,
  className,
  imageClassName,
  priority,
  fill = true,
  sizes = "(max-width: 768px) 100vw, 50vw",
  aspect,
}: MarketingPhotoProps) {
  const aspectClass =
    aspect === "video"
      ? "aspect-video"
      : aspect === "square"
        ? "aspect-square"
        : aspect === "portrait"
          ? "aspect-[3/4]"
          : aspect === "wide"
            ? "aspect-[21/9]"
            : "min-h-[12rem]";

  const resolvedSrc = resolvePublicImageUrl(src);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-cream/10 bg-charcoal shadow-[0_12px_40px_rgba(0,0,0,0.35)]",
        aspectClass,
        className
      )}
    >
      <Image
        src={resolvedSrc}
        alt={alt}
        fill={fill}
        priority={priority}
        sizes={sizes}
        className={cn("object-cover", imageClassName)}
        unoptimized={src.startsWith("/api/uploads/")}
      />
    </div>
  );
}
