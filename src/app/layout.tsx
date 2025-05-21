import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Image from 'next/image';
import Link from 'next/link';
import Navbar from './Navbar';
import BackgroundAnimation from './BackgroundAnimation';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Boondock Labs | Eugene Boondock's Portfolio & Tech Studio",
  description:
    "Boondock Labs - Building web apps, games, and the future of the web. Portfolio and tech studio by Eugene Ncube (aka Eugene Boondock).",
  keywords:
    "Boondock Labs, Eugene Ncube, web development, game development, metaverse, JavaScript, Earth2, programming, tech studio, portfolio",
  authors: [
    {
      name: "Eugene Ncube",
      url: "https://boondocklabs.com",
    },
  ],
  creator: "Eugene Ncube",
  openGraph: {
    title: "Boondock Labs | Eugene Boondock's Portfolio & Tech Studio",
    description:
      "Building web apps, games, and the future of digital experiences. Portfolio by Eugene Ncube (Eugene Boondock).",
    url: "https://boondocklabs.com",
    siteName: "Boondock Labs",
    locale: "en_US",
    type: "website",
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
      <body className={cn(inter.className, "min-h-screen bg-transparent font-sans antialiased relative")}>
        <BackgroundAnimation />
        <Navbar />
        <div className="pt-8 relative z-[99999]">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
