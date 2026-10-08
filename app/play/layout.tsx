import Image from "next/image";
import { MARKETING_IMAGES } from "@/lib/site/marketingImages";

export default function PlayLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-charcoal text-cream">
      <Image
        src={MARKETING_IMAGES.broadway.src}
        alt=""
        fill
        className="object-cover"
        sizes="100vw"
        priority={false}
      />
      <div className="absolute inset-0 bg-charcoal/90" aria-hidden />
      <div className="relative">{children}</div>
    </div>
  );
}
