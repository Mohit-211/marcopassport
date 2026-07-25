"use client";

import Image from "next/image";
import Link from "next/link";

const discoverLinks = [
  { href: "/explore", label: "Directory" },
  { href: "/places", label: "Top Places" },
  { href: "/magazine", label: "Magazine" },
  { href: "/blog", label: "Stories" },
];

const businessLinks = [
  { href: "/business", label: "List Your Business" },
  { href: "/business", label: "Packages & Pricing" },
  { href: "/passport", label: "My Passport" },
  { href: "/contact", label: "Contact" },
];

const socialLinks = [
  { href: "#", label: "IG", name: "Instagram" },
  { href: "#", label: "FB", name: "Facebook" },
  { href: "#", label: "X", name: "X (Twitter)" },
  { href: "mailto:hello@marcopassport.com", label: "@", name: "Email" },
];

export function Footer() {
  return (
    <footer className="mt-24 bg-primary text-primary-foreground">
      <div className="container mx-auto grid gap-12 px-5 py-16 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {/* Logo */}
        <div>
          <Link href="/">
            <Image
              src="/assets/logo.png"
              alt="Marco Passport"
              width={220}
              height={120}
              className="h-28 w-auto object-contain"
            />
          </Link>

          <p className="mt-5 max-w-xs text-sm leading-relaxed text-primary-foreground/70">
            Your curated digital passport to Marco Island. Discover, plan, and
            savor the very best of coastal Florida.
          </p>

          <div className="mt-6 flex gap-3">
            {socialLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                aria-label={item.name}
                className="grid h-9 w-9 place-items-center rounded-full bg-primary-soft text-xs font-semibold transition-colors hover:bg-gold hover:text-gold-foreground"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        {/* Discover */}
        <div>
          <h4 className="mb-4 font-display text-base text-gold">Discover</h4>

          <ul className="space-y-2 text-sm text-primary-foreground/80">
            {discoverLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-gold"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Business */}
        <div>
          <h4 className="mb-4 font-display text-base text-gold">
            For Businesses
          </h4>

          <ul className="space-y-2 text-sm text-primary-foreground/80">
            {businessLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-gold"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="mb-4 font-display text-base text-gold">
            Stay in the Loop
          </h4>

          <p className="mb-4 text-sm text-primary-foreground/70">
            Island gems, new listings, and travel inspiration delivered once a
            month.
          </p>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex overflow-hidden rounded-full border border-primary-foreground/20 bg-primary-soft"
          >
            <input
              type="email"
              placeholder="you@island.com"
              className="flex-1 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-primary-foreground/50"
            />

            <button
              type="submit"
              className="bg-gold px-5 text-sm font-medium text-gold-foreground transition-opacity hover:opacity-90"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-primary-soft/40">
        <div className="container mx-auto flex flex-col justify-between gap-3 px-5 py-5 text-xs text-primary-foreground/60 sm:flex-row lg:px-8">
          <p>
            © {new Date().getFullYear()} Marco Passport. Crafted on Marco
            Island, Florida.
          </p>

          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-gold">
              Privacy
            </Link>

            <Link href="/terms" className="hover:text-gold">
              Terms
            </Link>

            <Link href="/cookies" className="hover:text-gold">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
