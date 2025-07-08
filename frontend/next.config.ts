import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { hostname: "utfs.io" }, 
      { hostname: 'encrypted-tbn0.gstatic.com'}],
  },
};

export default nextConfig;
