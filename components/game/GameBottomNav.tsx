"use client";

import Link from "next/link";
import { MapPin, Play, Flag } from "lucide-react";
import { cn } from "@/lib/utils";

type GameBottomNavProps = {
  sessionId: string;
  active?: "play" | "map" | "finish";
};

const items = [
  { key: "play" as const, href: (id: string) => `/game/play/${id}`, icon: Play, label: "Play" },
  { key: "map" as const, href: (id: string) => `/game/play/${id}?view=map`, icon: MapPin, label: "Map" },
  { key: "finish" as const, href: (id: string) => `/game/finish/${id}`, icon: Flag, label: "Finish" },
];

export function GameBottomNav({ sessionId, active = "play" }: GameBottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-20 border-t border-cream/10 bg-charcoal/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-md"
      aria-label="Game navigation"
    >
      <ul className="mx-auto flex max-w-lg justify-around py-2">
        {items.map(({ key, href, icon: Icon, label }) => {
          const isActive = active === key;
          return (
            <li key={key}>
              <Link
                href={href(sessionId)}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-4 py-1 text-xs",
                  isActive ? "text-gold" : "text-cream/50"
                )}
              >
                <Icon className="size-5" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
