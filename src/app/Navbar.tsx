"use client";
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export default function Navbar() {
  const [navOpen, setNavOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setNavOpen(false);
      }
    };

    const handleScroll = () => setScrollY(window.scrollY);
    
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (navOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [navOpen]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100000] transition-all duration-300 glass-darker border-b border-zinc-800`}>
      <div className="container max-w-7xl mx-auto px-4 flex items-center justify-between relative" ref={menuRef}>
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
        <button 
          className="md:hidden text-[#3a2c1a] p-2 z-[100002] relative" 
          onClick={(e) => {
            e.stopPropagation();
            setNavOpen(!navOpen);
          }}
          aria-label={navOpen ? 'Close menu' : 'Open menu'}
        >
          {navOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      <div 
        className={`md:hidden fixed inset-0 bg-black bg-opacity-50 z-[100000] transition-opacity duration-300 ${
          navOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setNavOpen(false)}
      />
      <div 
        className={`md:hidden fixed right-4 top-16 w-48 bg-[#e7dbc8] border border-zinc-300 z-[100001] shadow-sm transition-all duration-300 transform ${
          navOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'
        }`}
      >
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
    </nav>
  );
}