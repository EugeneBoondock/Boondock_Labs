import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import { cn, isMobileDevice } from "@/lib/utils";
import Image from 'next/image';
import Link from 'next/link';
import Navbar from './Navbar';
import AnimeBackground from './AnimeBackground';
import ChatWidget from './ChatWidget';
import LoadingScreen from './LoadingScreen';
import { CurrencyProvider } from './CurrencyContext';

const rubik = Rubik({ subsets: ["latin"], weight: ["400", "500", "700"] });

export const metadata: Metadata = {
  title: "Boondock Labs | AI-Powered Web Development & MCP Servers",
  description:
    "Expert web development, AI integration, and Model Context Protocol servers. Building the future of digital experiences with Eugene Boondock - full-stack developer specializing in Next.js, React, AI tools, and complex platform development.",
  keywords:
    "Boondock Labs, Eugene Ncube, Eugene Boondock, web development, AI integration, MCP servers, Model Context Protocol, Next.js developer, React developer, full-stack developer, AI tools, Cursor, Windsurf, Claude Code, OpenAI Codex, metaverse development, Earth2, portfolio, tech studio, custom APIs, backend development, frontend development",
  authors: [
    {
      name: "Eugene Ncube",
      url: "https://boondocklabs.com",
    },
  ],
  creator: "Eugene Ncube",
  publisher: "Boondock Labs",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://boondocklabs.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Boondock Labs | AI-Powered Web Development & MCP Servers",
    description:
      "Expert web development, AI integration, and Model Context Protocol servers. Building the future of digital experiences with Eugene Boondock.",
    url: "https://boondocklabs.com",
    siteName: "Boondock Labs",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/Boondocklabs.png",
        width: 1200,
        height: 630,
        alt: "Boondock Labs - AI-Powered Web Development",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Boondock Labs | AI-Powered Web Development & MCP Servers",
    description:
      "Expert web development, AI integration, and Model Context Protocol servers. Building the future of digital experiences.",
    images: ["/Boondocklabs.png"],
    creator: "@eugeneboondock",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION,
  },
};

function Footer() {
  return (
    <footer className="w-full px-4 flex justify-center mt-12">
      <div className="max-w-4xl w-full text-center text-sm text-zinc-500 pb-6">
        <p>© {new Date().getFullYear()} Boondock Labs by Eugene Ncube. All rights reserved.</p>
        <p className="mt-1">Building the web, one adventure at a time.</p>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/Boondocklabs.png" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="shortcut icon" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" href="/favicon-32x32.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#18181b" />
        <meta name="author" content="Eugene Ncube" />
        <meta name="robots" content="index, follow" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Boondock Labs" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:url" content="https://boondocklabs.com" />
        <meta property="og:title" content="Boondock Labs | Eugene Ncube's Portfolio & Tech Studio" />
        <meta property="og:description" content="Building web apps, games, and the future of digital experiences. Portfolio by Eugene Ncube (Eugene Boondock)." />
        <meta property="og:image" content="/boondocklabs-logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Boondock Labs | Eugene Ncube's Portfolio & Tech Studio" />
        <meta name="twitter:description" content="Building web apps, games, and the future of digital experiences. Portfolio by Eugene Ncube (Eugene Boondock)." />
        <meta name="twitter:image" content="/boondocklabs-logo.png" />
      </head>
      <body className={cn(rubik.className, "min-h-screen bg-transparent antialiased relative")}>
        <CurrencyProvider>
          <LoadingScreen />
          <div style={{ display: 'none' }} id="main-content">
            {!isMobileDevice() && <AnimeBackground />}
            <Navbar />
            <main className="pt-20 relative">{children}</main>
            <Footer />
            <ChatWidget />
          </div>
        </CurrencyProvider>
      </body>
    </html>
  );
}
