import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter, Caveat } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "Music City Scavenger Hunt | Music City Adventure",
    template: "%s | Music City Scavenger Hunt",
  },
  description:
    "Turn downtown Music City into your personal game board. Solve clues, complete challenges, compete on the leaderboard, and earn your Music City certificate.",
  openGraph: {
    siteName: "Music City Scavenger Hunt",
    locale: "en_US",
    type: "website",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#101216",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${bebas.variable} ${inter.variable} ${caveat.variable} h-full overflow-x-clip`}>
      <body className="min-h-full min-w-0 flex flex-col grain-overlay bg-charcoal text-cream antialiased overflow-x-clip">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
