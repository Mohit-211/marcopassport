import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://themarcopassport.com"),
  title: {
    default: "Marco Passport | Discover Marco Island, Florida",
    template: "%s | Marco Passport",
  },
  description:
    "Discover the best of Marco Island with curated recommendations for places to stay, restaurants, attractions, shopping, local services, and travel inspiration.",
  applicationName: "Marco Passport",
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
    "Marco Passport",
  ],
  authors: [
    {
      name: "Marco Passport",
    },
  ],
  creator: "Marco Passport",
  publisher: "Marco Passport",
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
    siteName: "Marco Passport",
    title: "Marco Passport | Discover Marco Island, Florida",
    description:
      "Discover the best of Marco Island with curated recommendations for places to stay, restaurants, attractions, shopping, local services, and travel inspiration.",
    images: [
      {
        url: "/assets/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Marco Passport",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Marco Passport | Discover Marco Island, Florida",
    description:
      "Discover the best of Marco Island with curated recommendations for places to stay, restaurants, attractions, shopping, local services, and travel inspiration.",
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${fraunces.variable} antialiased`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
