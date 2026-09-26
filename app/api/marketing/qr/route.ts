import { NextResponse } from "next/server";
import QRCode from "qrcode";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const target =
    searchParams.get("url") ??
    `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/booking`;

  try {
    const svg = await QRCode.toString(target, {
      type: "svg",
      margin: 1,
      color: { dark: "#101216", light: "#F6E8CB" },
    });
    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return new NextResponse("QR generation failed", { status: 500 });
  }
}
