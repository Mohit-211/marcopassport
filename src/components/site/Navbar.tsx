"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/magazine", label: "Magazine" },
  { href: "/local-info", label: "Local Info" },
  { href: "/blog", label: "Blog" },
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore" },
  { href: "/passport", label: "Your Custom Passport" },
  { href: "/places", label: "Business Directory" },
  // { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);

    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-[#0A3C5A] bg-[#002946]/95 shadow-soft backdrop-blur-xl"
          : "bg-transparent"

        // scrolled
        //   ? "border-b border-border bg-background/90 shadow-soft backdrop-blur-xl"
        //   : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-5 lg:px-8">
        {/* Logo */}
        <Link href="/" className="group shrink-0">
          <Image
            src="/logo.png"
            alt="Marco Passport"
            width={180}
            height={64}
            priority
            className="h-16 w-auto transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "text-[#F8F1E5]"
                    : "text-[#F8F1E5]/85 hover:text-[#F8F1E5]"

                  // active
                  //   ? "text-primary"
                  //   : "text-foreground/80 hover:text-primary"
                )}
              >
                {item.label}

                {active && (
                  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-gold" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:block">
          <Link href="/business">
            <Button variant="gold">Advertise With Us</Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="grid h-11 w-11 place-items-center rounded-xl border border-border bg-background/90 lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "overflow-hidden border-t border-border bg-background transition-all duration-300 lg:hidden",
          open ? "max-h-[600px]" : "max-h-0 border-transparent"
        )}
      >
        <nav className="container mx-auto flex flex-col gap-1 px-5 py-4">
          {NAV.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-4 py-3 text-base font-medium transition-colors",
                  active ? "bg-accent text-primary" : "hover:bg-accent"
                )}
              >
                {item.label}
              </Link>
            );
          })}

          <Link href="/business" className="mt-3">
            <Button variant="gold" className="w-full">
              Advertise With Us
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
