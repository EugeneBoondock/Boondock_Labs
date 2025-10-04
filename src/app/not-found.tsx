'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Home, ArrowLeft, Search, Coffee } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const funnyMessages = [
    "Looks like this page went on an adventure and never came back! 🏕️",
    "404: Page not found. But hey, at least YOU found this awesome error page!",
    "This page is currently exploring the Boondocks... literally.",
    "Oops! This page took a wrong turn at the internet crossroads.",
    "Even our AI couldn't predict you'd end up here! 🤖",
  ];

  const randomMessage = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-2xl w-full text-center">
        {/* Logo with animation */}
        <div className="mb-8 flex justify-center">
          <div className="relative animate-bounce">
            <Image
              src="/Boondocklabs.png"
              alt="Boondock Labs"
              width={120}
              height={120}
              className="opacity-70"
            />
            <div className="absolute -top-2 -right-2 bg-[#d17927] text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold shadow-lg">
              ?
            </div>
          </div>
        </div>

        {/* 404 Number */}
        <h1 className="text-9xl font-bold text-[#d17927] mb-4 animate-in fade-in-up" style={{ 
          textShadow: '4px 4px 0px rgba(209, 121, 39, 0.2)' 
        }}>
          404
        </h1>

        {/* Main message */}
        <h2 className="text-3xl md:text-4xl font-bold text-[#3a2c1a] mb-4">
          Lost in the Boondocks!
        </h2>

        {/* Funny random message */}
        <p className="text-lg md:text-xl text-[#8c6e4a] mb-8 max-w-lg mx-auto">
          {randomMessage}
        </p>

        {/* Fun illustration with emoji */}
        <div className="my-8 text-6xl">
          🧭 🏕️ 🗺️
        </div>

        {/* Helpful text */}
        <div className="glass p-6 rounded-2xl mb-8 max-w-md mx-auto">
          <p className="text-[#3a2c1a] mb-4">
            <strong>What happened?</strong>
          </p>
          <p className="text-sm text-[#8c6e4a]">
            The page you're looking for might have been moved, deleted, or is hiding from our AI. 
            Don't worry, even the best explorers get lost sometimes!
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="btn-primary flex items-center gap-2 no-underline px-6 py-3 rounded-full"
          >
            <Home className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="glass-lighter border border-orange-200 hover:border-orange-400 text-[#3a2c1a] font-semibold px-6 py-3 rounded-full transition-all flex items-center gap-2"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Easter egg / extra humor */}
        <div className="mt-12 text-sm text-[#8c6e4a] opacity-70">
          <p className="mb-2">💡 <em>Pro tip: Try checking the URL for typos!</em></p>
          <p className="flex items-center justify-center gap-2">
            <Coffee className="h-4 w-4" />
            Or take a coffee break. The page might magically appear after caffeine.
          </p>
        </div>

        {/* Search suggestion */}
        <div className="mt-8 p-4 bg-orange-50/50 rounded-xl border border-orange-100">
          <p className="text-sm text-[#3a2c1a] mb-3">
            <Search className="h-4 w-4 inline mr-2" />
            Looking for something specific?
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link href="/about" className="text-xs bg-white px-3 py-2 rounded-lg hover:bg-[#d17927] hover:text-white transition-colors no-underline">
              About
            </Link>
            <Link href="/work" className="text-xs bg-white px-3 py-2 rounded-lg hover:bg-[#d17927] hover:text-white transition-colors no-underline">
              Work
            </Link>
            <Link href="/services" className="text-xs bg-white px-3 py-2 rounded-lg hover:bg-[#d17927] hover:text-white transition-colors no-underline">
              Services
            </Link>
            <Link href="/contact" className="text-xs bg-white px-3 py-2 rounded-lg hover:bg-[#d17927] hover:text-white transition-colors no-underline">
              Contact
            </Link>
            <Link href="/mcp" className="text-xs bg-white px-3 py-2 rounded-lg hover:bg-[#d17927] hover:text-white transition-colors no-underline">
              MCP
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
