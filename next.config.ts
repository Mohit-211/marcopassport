import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next re-encodes images at quality 75 by default. Our photos are already
    // compressed, so a second lossy pass at 75 visibly softens them; full-bleed
    // heroes ask for 90 (see HeroBackground). Values not listed here are
    // snapped to the nearest allowed one.
    qualities: [75, 90],
  },

  // Old URLs that may still be bookmarked or sitting in emails.
  async redirects() {
    return [
      // Places and businesses share one Explore page now.
      { source: "/places", destination: "/explore?type=place", permanent: true },
      { source: "/my-trips", destination: "/passport", permanent: false },
      { source: "/my-trips/:id", destination: "/passport", permanent: false },
      { source: "/auth/reset-password", destination: "/reset-password", permanent: false },
      { source: "/auth/verify-otp", destination: "/auth/forgot-password", permanent: false },
      // The advertising pages moved from /business.
      { source: "/business", destination: "/advertise-with-us", permanent: true },
      { source: "/business/:path*", destination: "/advertise-with-us/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
