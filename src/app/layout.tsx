import type { Metadata, Viewport } from "next";
import {
  Bricolage_Grotesque,
  Cormorant_Garamond,
  IBM_Plex_Mono,
} from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const mainFont = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-main",
});

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const monoFont = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Boondock Labs | Eugene Boondock",
    template: "%s | Boondock Labs",
  },
  description:
    "Building intelligent, reliable, and beautifully designed apps that solve everyday problems through thoughtful engineering. Portfolio of Eugene Boondock, a full-stack developer building AI-native products, MCP servers, and platform tooling through Boondock Labs.",
  keywords: [
    "Eugene Boondock",
    "Eugene Loyiso Mzimakhwe",
    "Boondock Labs",
    "full-stack developer",
    "product engineer",
    "MCP servers",
    "AI integration",
    "Next.js developer",
    "React developer",
    "portfolio",
  ],
  authors: [
    {
      name: "Eugene Boondock (Eugene Loyiso Mzimakhwe)",
      url: "https://boondocklabs.com",
    },
  ],
  creator: "Eugene Boondock (Eugene Loyiso Mzimakhwe)",
  publisher: "Boondock Labs",
  metadataBase: new URL("https://boondocklabs.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Boondock Labs | Eugene Boondock",
    description:
      "Building intelligent, reliable, and beautifully designed apps that solve everyday problems through thoughtful engineering." +
      " AI-native products, platform systems, and MCP servers by Eugene Boondock.",
    url: "https://boondocklabs.com",
    siteName: "Boondock Labs",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/Boondocklabs.png",
        width: 1200,
        height: 630,
        alt: "Boondock Labs portfolio preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Boondock Labs | Eugene Boondock",
    description: "Building intelligent, reliable, and beautifully designed apps that solve everyday problems through thoughtful engineering.",
    images: ["/Boondocklabs.png"],
    creator: "@eugeneboondock",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0c",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/Boondocklabs.png" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="shortcut icon" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body
        className={cn(
          mainFont.variable,
          displayFont.variable,
          monoFont.variable,
          "min-h-screen antialiased",
        )}
      >
        {children}
      </body>
    </html>
  );
}
