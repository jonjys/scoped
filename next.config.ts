import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        destination: "https://liveproof.nyttolabs.com/check",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
