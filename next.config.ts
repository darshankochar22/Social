import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.moneycontrol.com",
      },
    ],
  },
};

export default nextConfig;
