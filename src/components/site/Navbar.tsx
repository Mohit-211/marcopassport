"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { KeyRound, LogOut, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProfileDropdown } from "@/features/trips/components/ProfileDropdown";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/magazine", label: "Magazine" },
  { href: "/local-info", label: "Local Info" },
  { href: "/blog", label: "Blog" },
  { href: "/places", label: "Explore" },
  { href: "/explore", label: "Business Directory" },
  { href: "/passport", label: "Your Custom Passport" },
];

export function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, ready, logout, loggingOut } = useAuth();

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

  // Close the mobile menu on route change (adjust state during render, not in an effect)
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b border-primary/8",
        "bg-cream/50 backdrop-blur-xl",
        "transition-all duration-300",
        scrolled ? "shadow-soft" : "shadow-none",
      )}
    >
      <div className="site-container flex h-20 items-center justify-between">
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
                  active
                    ? "text-primary"
                    : "text-primary/75 hover:text-primary",
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
        <div className="hidden items-center gap-3 lg:flex">
          <ProfileDropdown />
          <Link href="/business">
            <Button
              className={cn(
                "h-10 rounded-full px-5 text-sm font-semibold",
                "bg-primary text-primary-foreground",
                "shadow-sm transition-all duration-200",
                "hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md",
              )}
            >
              Advertise With Us
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <ProfileDropdown />
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
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "overflow-hidden border-t border-primary/10 bg-cream/50 transition-all duration-300 lg:hidden",
          open ? "max-h-[650px]" : "max-h-0",
        )}
      >
        <nav className="site-container flex flex-col gap-1 py-4">
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
                    : "text-primary/80 hover:bg-primary/10 hover:text-primary",
                )}
              >
                {item.label}
              </Link>
            );
          })}

          {ready &&
            (isAuthenticated ? (
              <>
                <Link
                  href="/change-password"
                  className="mt-3 flex items-center gap-2 rounded-xl px-4 py-3 text-[15px] font-medium text-primary/80 transition-colors duration-200 hover:bg-primary/10 hover:text-primary"
                >
                  <KeyRound className="h-4 w-4" /> Change Password
                </Link>
                <Button
                  variant="outline"
                  onClick={() => logout()}
                  disabled={loggingOut}
                  className="mt-2 h-11 w-full rounded-full border-primary/15 text-sm font-semibold text-primary hover:bg-primary/5"
                >
                  <LogOut className="h-4 w-4" />{" "}
                  {loggingOut ? "Signing out…" : "Sign Out"}
                </Button>
              </>
            ) : (
              <Link href="/auth" className="mt-3">
                <Button
                  variant="outline"
                  className="h-11 w-full rounded-full border-primary/15 text-sm font-semibold text-primary hover:bg-primary/5"
                >
                  Sign In
                </Button>
              </Link>
            ))}

          <Link href="/business" className="mt-2">
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
