"use client";
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import CurrencyDropdown from './CurrencyDropdown';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const links = [
    { href: '/about', label: 'About' },
    { href: '/work', label: 'Work' },
    { href: '/services', label: 'Services' },
    { href: '/mcp', label: 'MCP' },
    { href: '/contact', label: 'Contact' }
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      {/* Backdrop for mobile menu */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden"
          onClick={toggleMenu}
          aria-hidden="true"
        />
      )}

      {/* Desktop Segmented Navigation */}
      <div className="hidden md:flex items-center justify-between max-w-6xl mx-auto gap-4">
        {/* Logo Section - Left Pill */}
        <Link href="/" className="bg-[#e7dbc8]/40 backdrop-blur-md border border-zinc-300/30 shadow-xl shadow-zinc-800/10 rounded-full px-6 py-2 hover:bg-[#e7dbc8]/50 transition-all no-underline">
          <div className="flex items-center h-14">
            <Image
              src="/Boondocklabs.png"
              alt="Boondock Labs Logo"
              width={56}
              height={56}
              className="mr-3"
            />
            <span className="font-bold text-lg text-[#d17927]">
              Boondock Labs
            </span>
          </div>
        </Link>

        {/* Navigation Links - Right Pill */}
        <div className="bg-[#e7dbc8]/40 backdrop-blur-md border border-zinc-300/30 shadow-xl shadow-zinc-800/10 rounded-full px-6 py-2">
          <div className="flex items-center space-x-2 h-14">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[#3a2c1a] hover:text-[#d17927] hover:bg-white/30 transition-all px-4 py-2 rounded-full"
              >
                {link.label}
              </Link>
            ))}
            <div className="ml-2">
              <CurrencyDropdown className="" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-[#e7dbc8]/40 backdrop-blur-md border border-zinc-300/30 relative shadow-xl shadow-zinc-800/10 rounded-full max-w-6xl mx-auto">
        <div className="px-6 py-2">
          <div className="flex items-center justify-between h-14">
            <Link href="/" className="flex items-center no-underline">
              <Image
                src="/Boondocklabs.png"
                alt="Boondock Labs Logo"
                width={56}
                height={56}
                className="mr-3"
              />
              <span className="font-bold text-lg text-[#d17927]">
                Boondock Labs
              </span>
            </Link>

            <button
              className="p-2 text-[#3a2c1a] hover:text-[#d17927]"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#e7dbc8]/95 backdrop-blur-md rounded-2xl shadow-xl border border-zinc-300/30 overflow-hidden z-50">
              <div className="py-2 space-y-1 px-2">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => {
                      setIsOpen(false);
                      document.body.style.overflow = 'unset';
                    }}
                    className="block py-3 px-4 text-[#3a2c1a] hover:bg-white/40 rounded-xl text-base font-medium transition-all"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="border-t border-zinc-300/40 px-4 py-3 flex justify-end">
                <CurrencyDropdown />
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}