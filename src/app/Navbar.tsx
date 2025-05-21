"use client";
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

// Define styles outside component to prevent re-creation on render
const mobileMenuStyles = {
  visible: "opacity-100 translate-y-0 pointer-events-auto",
  hidden: "opacity-0 -translate-y-4 pointer-events-none"
};

export default function Navbar() {
  const [isClient, setIsClient] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuContentRef = useRef<HTMLDivElement>(null);

  // Set isClient to true after component mounts (client-side only)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    if (!isClient) return;
    
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
  }, [isClient]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (!isClient) return;
    
    if (navOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [navOpen, isClient]);



  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 glass-darker border-b border-zinc-800`}>
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
      {/* Always render these elements but control visibility with CSS */}
      {/* Backdrop */}
      <div 
        className={`md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${navOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setNavOpen(false)}
        aria-hidden="true"
      />
      
      {/* Mobile Menu */}
      <div 
        className={`md:hidden fixed right-4 top-16 w-56 bg-[#e7dbc8] border border-zinc-300 z-50 shadow-lg rounded-md transition-all duration-300 ${navOpen ? mobileMenuStyles.visible : mobileMenuStyles.hidden}`}
        ref={menuContentRef}
      >
        <button 
          className="absolute top-2 right-2 text-[#3a2c1a] hover:bg-orange-100 rounded-full p-1" 
          onClick={() => setNavOpen(false)}
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
        <div className="flex flex-col pt-8">
          {[
            { href: '/', label: 'Home' },
            { href: '/about', label: 'About' },
            { href: '/work', label: 'Work' },
            { href: '/services', label: 'Services' },
            { href: '/contact', label: 'Contact' }
          ].map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              className="text-left px-6 py-3 text-[#3a2c1a] hover:bg-orange-100 border-b border-zinc-200 last:border-b-0 transition-colors duration-200" 
              onClick={() => setNavOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}