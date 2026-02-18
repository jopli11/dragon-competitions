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
  // Disable Turbopack for production builds to avoid lightningcss binary issues on Render/Vercel
  experimental: {
    turbo: {
      // This ensures we use the stable Webpack-based builder for production
    }
  }
};

export default nextConfig;
