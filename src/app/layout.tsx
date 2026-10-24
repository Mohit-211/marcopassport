import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/site/Navbar";
import { PlanTripButton } from "@/features/passport/planner/PlanTripButton";
import { Footer } from "@/components/site/Footer";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CookieBanner } from "@/components/site/CookieBanner";
import { AuthProvider } from "@/hooks/useAuth";
import { PassportsProvider } from "@/features/passport/PassportsProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// Display face for headings. Its italic is used for the gold accent words in page titles.
const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://themarcopassport.com"),
  title: {
    default: "The Marco Passport | Discover Marco Island, Florida",
    template: "%s | The Marco Passport",
  },
  description:
    "Discover the best of Marco Island with top recommendations for places to stay, restaurants, attractions, shopping, local services, and travel inspiration.",
  applicationName: "The Marco Passport",
  keywords: [
    "Marco Island",
    "Marco Island Florida",
    "Marco Island travel",
    "Marco Island restaurants",
    "Marco Island hotels",
    "Marco Island shopping",
    "Marco Island attractions",
    "Marco Island activities",
    "Things to do in Marco Island",
    "The Marco Passport",
  ],
  authors: [
    {
      name: "The Marco Passport",
    },
  ],
  creator: "The Marco Passport",
  publisher: "The Marco Passport",
  category: "Travel",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://themarcopassport.com",
    siteName: "The Marco Passport",
    title: "The Marco Passport | Discover Marco Island, Florida",
    description:
      "Discover the best of Marco Island with top recommendations for places to stay, restaurants, attractions, shopping, local services, and travel inspiration.",
    images: [
      {
        url: "/assets/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "The Marco Passport",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Marco Passport | Discover Marco Island, Florida",
    description:
      "Discover the best of Marco Island with top recommendations for places to stay, restaurants, attractions, shopping, local services, and travel inspiration.",
    images: ["/assets/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased">
        <TooltipProvider>
          <AuthProvider>
            <PassportsProvider>
              <Navbar />
              <main>{children}</main>
              <Footer />
              <PlanTripButton />
            </PassportsProvider>
          </AuthProvider>
          <CookieBanner />
        </TooltipProvider>
        <Toaster
          closeButton
          position="top-right"
          visibleToasts={3}
          offset={{ top: "var(--header-offset)", right: 24 }}
          mobileOffset={{ top: "calc(var(--header-height) + 0.5rem)", left: 16, right: 16 }}
        />
      </body>
    </html>
  );
}
