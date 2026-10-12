import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Old URLs that may still be bookmarked or sitting in emails.
  async redirects() {
    return [
      { source: "/my-trips", destination: "/passport", permanent: false },
      { source: "/my-trips/:id", destination: "/passport", permanent: false },
      { source: "/auth/reset-password", destination: "/reset-password", permanent: false },
      { source: "/auth/verify-otp", destination: "/auth/forgot-password", permanent: false },
    ];
  },
};

export default nextConfig;
