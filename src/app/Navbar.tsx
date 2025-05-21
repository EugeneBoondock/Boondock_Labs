"use client";
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [navOpen, setNavOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 glass-darker border-b border-zinc-800`}>
      <div className="container max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Image
            src="/Boondocklabs.png"
            alt="Boondock Labs Logo"
            width={56}
            height={56}
            className="mr-3"
          />
          <span className={`font-bold text-lg accent transition-all duration-300`}>Boondock Labs</span>
        </div>
        <div className="hidden md:flex space-x-8">
          {[
            { href: '/', label: 'Home' },
            { href: '/about', label: 'About' },
            { href: '/work', label: 'Work' },
            { href: '/services', label: 'Services' },
            { href: '/contact', label: 'Contact' }
          ].map(item => (
            <Link key={item.href} href={item.href} className="text-sm font-medium transition-all hover:text-orange-700 text-[#3a2c1a]">{item.label}</Link>
          ))}
        </div>
        <button className="md:hidden text-[#3a2c1a] p-2" onClick={() => setNavOpen(!navOpen)}><Menu /></button>
      </div>
      {navOpen && (
        <div className="md:hidden fixed right-4 top-16 w-48 bg-[#e7dbc8] border border-zinc-300 z-[9999] shadow-sm">
          <button className="absolute top-2 right-2 text-[#3a2c1a]" onClick={() => setNavOpen(false)}><X /></button>
          <div className="flex flex-col pt-8">
            {[
              { href: '/', label: 'Home' },
              { href: '/about', label: 'About' },
              { href: '/work', label: 'Work' },
              { href: '/services', label: 'Services' },
              { href: '/contact', label: 'Contact' }
            ].map(item => (
              <Link key={item.href} href={item.href} className="text-left px-4 py-2 text-[#3a2c1a] hover:bg-orange-100 border-b border-zinc-200 last:border-b-0" onClick={() => setNavOpen(false)}>{item.label}</Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
} 