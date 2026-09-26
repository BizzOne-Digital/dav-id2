import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MARKETING_IMAGES } from "@/lib/site/marketingImages";

const DIFFERENTIATORS = [
  "Designed by Nashville locals—not a generic franchise template.",
  "Competitive scoring and live leaderboards keep energy high.",
  "Mix of riddles, trivia, and creative photo challenges at every stop.",
  "Flexible pacing: race hard or stroll and savor the city.",
  "No app install; works in mobile browsers your group already uses.",
  "Dedicated support before, during, and after your event.",
];

export function WhyDifferent() {
  return (
    <section className="border-y border-cream/10 bg-[#0c0e11] section-y">
      <div className="site-x mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-gold/30 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
              <Image
                src={MARKETING_IMAGES.qrScan.src}
                alt={MARKETING_IMAGES.qrScan.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 480px"
              />
            </div>
            <div className="absolute -bottom-6 -left-4 hidden w-40 overflow-hidden rounded-lg border-2 border-cream shadow-xl sm:block lg:-left-8">
              <div className="relative aspect-square">
                <Image
                  src={MARKETING_IMAGES.certificate.src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="160px"
                />
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <SectionHeading
              align="left"
              eyebrow="Why us"
              title="More than a walking tour"
              subtitle="We blend game design, local storytelling, and group dynamics into one unforgettable afternoon downtown."
            />
            <ul className="mt-8 space-y-4">
              {DIFFERENTIATORS.map((item) => (
                <li key={item} className="flex gap-3 text-cream/85">
                  <CheckCircle2 className="size-5 shrink-0 text-gold" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
