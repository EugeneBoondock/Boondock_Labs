"use client";
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const links = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/work', label: 'Work' },
    { href: '/services', label: 'Services' },
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
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Backdrop for mobile menu */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden"
          onClick={toggleMenu}
          aria-hidden="true"
        />
      )}
      <nav className="glass-darker backdrop-blur-md border-b border-zinc-300/30 relative">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <div className="flex items-center">
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

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-[#3a2c1a] hover:text-[#d17927] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-[#3a2c1a] hover:text-[#d17927]"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          <div
            className={`
              md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-[#e7dbc8] rounded-b-lg relative z-50
              ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
            `}
          >
            <div className="py-2 space-y-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => {
                    setIsOpen(false);
                    document.body.style.overflow = 'unset';
                  }}
                  className="block py-3 px-4 text-[#3a2c1a] hover:bg-[#d8ceb9]/50 rounded-lg text-base font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>


    </div>
  );
}