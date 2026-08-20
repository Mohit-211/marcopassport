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
  { href: "/places", label: "Explore" },
  { href: "/passport", label: "Your Custom Passport" },
  { href: "/explore", label: "Business Directory" },
];

export function Navbar() {
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 16);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b border-primary/8",
        "bg-cream/50 backdrop-blur-xl",
        "transition-all duration-300",
        scrolled ? "shadow-soft" : "shadow-none"
      )}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-5 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          aria-label="The Marco Passport home"
          className="group shrink-0"
        >
          <Image
            src="/logo.png"
            alt="The Marco Passport"
            width={180}
            height={64}
            priority
            className="h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03] lg:h-16"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-0.5 lg:flex">
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
                  "relative rounded-lg px-3 py-2 text-[13px] font-medium tracking-[-0.01em]",
                  "transition-colors duration-200",
                  active ? "text-primary" : "text-primary/75 hover:text-primary"
                )}
              >
                {item.label}

                {active && (
                  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:block">
          <Link href="/business">
            <Button
              className={cn(
                "h-10 rounded-full px-5 text-sm font-semibold",
                "bg-primary text-primary-foreground",
                "shadow-sm transition-all duration-200",
                "hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md"
              )}
            >
              Advertise With Us
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="
            grid h-11 w-11 place-items-center rounded-xl
            border border-primary/10
            bg-primary/5
            text-primary
            shadow-sm
            transition-all duration-200
            hover:bg-primary/10
            lg:hidden
          "
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "overflow-hidden border-t border-primary/10 bg-cream/50 transition-all duration-300 lg:hidden",
          open ? "max-h-[650px]" : "max-h-0"
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
                  "rounded-xl px-4 py-3 text-[15px] font-medium",
                  "transition-colors duration-200",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-primary/80 hover:bg-primary/10 hover:text-primary"
                )}
              >
                {item.label}
              </Link>
            );
          })}

          <Link href="/business" className="mt-3">
            <Button
              className="
                h-11 w-full rounded-full
                bg-primary
                text-sm font-semibold
                text-primary-foreground
                hover:bg-primary/90
              "
            >
              Advertise With Us
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
