import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    localPatterns: [
      { pathname: "/images/**" },
      { pathname: "/api/uploads/**" },
      { pathname: "/icon.svg" },
    ],
  },
};

export default nextConfig;
