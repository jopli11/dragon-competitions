import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.ctfassets.net",
      },
    ],
  },
  turbopack: {
    // Explicitly set the root to the project root to avoid incorrect inference
    root: path.resolve(__dirname, "../../"),
  },
};

export default nextConfig;
