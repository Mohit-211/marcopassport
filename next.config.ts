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
      // Places to visit and businesses are one kind of thing on Explore now,
      // each with its page at /explore/:slug.
      { source: "/places", destination: "/explore", permanent: true },
      { source: "/places/:slug", destination: "/explore/:slug", permanent: true },
      { source: "/listings", destination: "/explore", permanent: true },
      { source: "/listings/:slug", destination: "/explore/:slug", permanent: true },
      { source: "/my-trips", destination: "/passport", permanent: false },
      { source: "/my-trips/:id", destination: "/passport", permanent: false },
      // Sign-in and every account step are dialogs now (AuthDialog): old pages
      // open the matching one on the home page. Query strings such as
      // ?token= from emailed links are passed through.
      { source: "/auth", destination: "/?auth=login", permanent: false },
      { source: "/auth/forgot-password", destination: "/?auth=forgot-password", permanent: false },
      { source: "/auth/reset-password", destination: "/?auth=reset-password", permanent: false },
      { source: "/auth/verify-otp", destination: "/?auth=forgot-password", permanent: false },
      { source: "/verify-email", destination: "/?auth=verify-email", permanent: false },
      { source: "/reset-password", destination: "/?auth=reset-password", permanent: false },
      { source: "/change-password", destination: "/?auth=change-password", permanent: false },
      // The advertising pages moved from /business.
      { source: "/business", destination: "/advertise-with-us", permanent: true },
      { source: "/business/:path*", destination: "/advertise-with-us/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
