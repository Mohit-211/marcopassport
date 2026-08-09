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
  {
    href: "mailto:hello@marcopassport.com",
    label: "@",
    name: "Email",
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-cream">
      {/* Main Footer */}
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 sm:px-6 md:grid-cols-2 md:gap-14 md:py-16 lg:grid-cols-4 lg:px-8">
        {/* Brand */}
        <div className="lg:pr-6">
          <Link href="/" className="inline-block">
            <Image
              src="/logo.png"
              alt="The Marco Passport"
              width={280}
              height={100}
              className="h-16 w-auto object-contain sm:h-[72px] md:h-20 lg:h-24"
            />
          </Link>

          <p className="mt-5 max-w-xs text-sm leading-relaxed text-cream-foreground/65">
            Everything you need to make the most of Marco Island, from places to
            stay and eat to experiences worth discovering.
          </p>

          {/* Social Links */}
          <div className="mt-6 flex gap-2.5">
            {socialLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                aria-label={item.name}
                className="
                  grid h-9 w-9 place-items-center rounded-full
                  border border-primary/10
                  bg-primary/5
                  text-[11px] font-semibold text-primary
                  transition-all duration-200
                  hover:-translate-y-0.5
                  hover:border-primary/20
                  hover:bg-primary
                  hover:text-primary-foreground
                "
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        {/* Discover */}
        <div>
          <h4 className="mb-5 font-display text-base text-primary">Discover</h4>

          <ul className="space-y-3 text-sm">
            {discoverLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="
                    text-cream-foreground/65
                    transition-colors duration-200
                    hover:text-primary
                  "
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Business */}
        <div>
          <h4 className="mb-5 font-display text-base text-primary">
            For Businesses
          </h4>

          <ul className="space-y-3 text-sm">
            {businessLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="
                    text-cream-foreground/65
                    transition-colors duration-200
                    hover:text-primary
                  "
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="mb-5 font-display text-base text-primary">
            Stay in the Loop
          </h4>

          <p className="mb-5 max-w-sm text-sm leading-relaxed text-cream-foreground/65">
            Island gems, new listings, and travel inspiration delivered once a
            month.
          </p>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="
              flex overflow-hidden rounded-full
              border border-primary/10
              bg-primary/5
              p-1
              transition-colors
              focus-within:border-primary/25
            "
          >
            <input
              type="email"
              placeholder="you@island.com"
              aria-label="Email address"
              className="
                min-w-0 flex-1
                bg-transparent
                px-4 py-2.5
                text-sm text-primary
                outline-none
                placeholder:text-primary/40
              "
            />

            <button
              type="submit"
              className="
                shrink-0
                rounded-full
                bg-primary
                px-5 py-2.5
                text-sm font-semibold
                text-primary-foreground
                transition-all duration-200
                hover:bg-primary/90
              "
            >
              Join
            </button>
          </form>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-primary/10">
        <div
          className="
            mx-auto flex max-w-7xl
            flex-col justify-between gap-4
            px-5 py-5
            text-xs text-cream-foreground/50
            sm:flex-row sm:items-center sm:px-6
            lg:px-8
          "
        >
          <p>
            © {new Date().getFullYear()} The Marco Passport. Crafted on Marco
            Island, Florida.
          </p>

          <div className="flex gap-4">
            <Link
              href="/privacy"
              className="transition-colors hover:text-primary"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="transition-colors hover:text-primary"
            >
              Terms
            </Link>

            <Link
              href="/cookies"
              className="transition-colors hover:text-primary"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
