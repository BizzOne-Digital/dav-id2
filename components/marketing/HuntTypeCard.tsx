import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";
import { resolvePublicImageUrl } from "@/lib/uploads/constants";
import type { PublicHuntListing } from "@/lib/site/huntCatalog";

type HuntTypeCardProps = {
  hunt: PublicHuntListing;
  priority?: boolean;
};

export function HuntTypeCard({ hunt, priority }: HuntTypeCardProps) {
  const displayCover = resolvePublicImageUrl(hunt.coverImage);

  return (
    <Link href={`/hunts/${hunt.slug}`} className="group block h-full overflow-hidden rounded-xl">
      <Card className="h-full overflow-hidden p-0 transition-colors group-hover:border-gold/40">
        <div className="relative h-44 w-full sm:h-48">
          <Image
            src={displayCover}
            alt={hunt.title}
            fill
            priority={priority}
            className="object-cover brightness-[1.1] contrast-[1.03] saturate-[1.05] transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            unoptimized={hunt.coverImage.startsWith("/api/uploads/")}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/75 via-charcoal/15 to-transparent" />
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <MapPin className="size-4 text-gold" aria-hidden />
            {hunt.featured && <Badge>Featured</Badge>}
          </div>
        </div>
        <div className="p-5">
          <CardTitle>{hunt.title}</CardTitle>
          <CardDescription className="mt-2">{hunt.shortDescription}</CardDescription>
          <p className="mt-4 text-sm text-cream/60">
            <span className="capitalize">{hunt.difficulty}</span>
            {` · ${hunt.duration}`}
            {` · ${formatCurrency(hunt.pricePerPersonCents)}/person`}
          </p>
          {hunt.groupTypes.length > 0 && (
            <p className="mt-2 text-xs text-cream/50">Great for {hunt.groupTypes.join(", ")}</p>
          )}
        </div>
      </Card>
    </Link>
  );
}
