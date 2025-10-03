"use client";
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X, ChevronDown, User, Briefcase, Wrench, Network, MessageCircle, Info, Layers, BookOpen } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import CurrencyDropdown from './CurrencyDropdown';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const mainLinks = [
    {
      href: '/about',
      label: 'About',
      icon: User,
      description: 'Learn about Eugene Boondock and his journey in tech',
      items: [
        { label: 'Personal Story', href: '/about#story' },
        { label: 'Skills & Expertise', href: '/about#skills' },
        { label: 'Career Timeline', href: '/about#timeline' }
      ]
    },
    {
      href: '/work',
      label: 'Work',
      icon: Briefcase,
      description: 'Explore projects and case studies',
      items: [
        { label: 'Featured Projects', href: '/work#featured' },
        { label: 'Client Work', href: '/work#clients' },
        { label: 'Open Source', href: '/work#opensource' }
      ]
    },
    {
      href: '/case-studies',
      label: 'Case Studies',
      icon: Layers,
      description: 'Detailed project breakdowns and technical deep-dives',
      items: [
        { label: 'Earthie Platform', href: '/case-studies/earthie-platform' },
        { label: 'Morphed Platform', href: '/case-studies/morphed-platform' },
        { label: 'Entropy Suite', href: '/case-studies/entropy-suite' }
      ]
    },
    {
      href: '/contact',
      label: 'Contact',
      icon: MessageCircle,
      description: 'Get in touch for projects and collaborations',
      items: [
        { label: 'Send Message', href: '/contact#message' },
        { label: 'Project Inquiry', href: '/contact#inquiry' },
        { label: 'Social Links', href: '/contact#social' }
      ]
    }
  ];

  const moreLinks = [
    {
      href: '/blog',
      label: 'Blog',
      icon: BookOpen,
      description: 'Technical articles on AI, web development, and platform building',
      items: [
        { label: 'AI Integration', href: '/blog?category=ai-integration' },
        { label: 'Case Studies', href: '/blog?category=case-studies' },
        { label: 'Development Tips', href: '/blog?category=development' }
      ]
    },
    {
      href: '/services',
      label: 'Services',
      icon: Wrench,
      description: 'Web development and digital solutions',
      items: [
        { label: 'Website Development', href: '/services#websites' },
        { label: 'API Development', href: '/services#apis' },
        { label: 'MCP Servers', href: '/services#mcp' }
      ]
    },
    {
      href: '/mcp',
      label: 'MCP',
      icon: Network,
      description: 'Model Context Protocol servers and tools',
      items: [
        { label: 'MCP Overview', href: '/mcp#overview' },
        { label: 'Available Servers', href: '/mcp#servers' },
        { label: 'Getting Started', href: '/mcp#guide' }
      ]
    }
  ];

  const links = [...mainLinks, ...moreLinks];

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const handleDropdownMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleDropdownMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-4 pt-3 sm:pt-4">
      {/* Backdrop for mobile menu */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden backdrop-blur-sm"
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

        {/* Navigation Links Container */}
        <div className="relative">
          {/* Navigation Links - Right Pill */}
          <div className="bg-[#e7dbc8]/40 backdrop-blur-md border border-zinc-300/30 shadow-xl shadow-zinc-800/10 rounded-full px-6 py-2">
            <div className="flex items-center space-x-1 h-14">
              {mainLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <div
                    key={link.href}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(link.label)}
                    onMouseLeave={handleMouseLeave}
                    ref={(el) => {
                      dropdownRefs.current[link.label] = el;
                    }}
                  >
                    <Link
                      href={link.href}
                      className="text-sm font-medium text-[#3a2c1a] hover:text-[#d17927] hover:bg-white/30 transition-all px-3 py-2 rounded-full flex items-center gap-1 group"
                    >
                      <IconComponent className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                      {link.label}
                      <ChevronDown className="h-3 w-3 opacity-50 group-hover:opacity-100 transition-all group-hover:rotate-180" />
                    </Link>
                  </div>
                );
              })}

              {/* More Dropdown */}
              {moreLinks.length > 0 && (
                <div
                  className="relative"
                  onMouseEnter={() => handleMouseEnter('More')}
                  onMouseLeave={handleMouseLeave}
                  ref={(el) => {
                    dropdownRefs.current['More'] = el;
                  }}
                >
                  <button
                    className="text-sm font-medium text-[#3a2c1a] hover:text-[#d17927] hover:bg-white/30 transition-all px-3 py-2 rounded-full flex items-center gap-1 group"
                  >
                    <Wrench className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                    More
                    <ChevronDown className="h-3 w-3 opacity-50 group-hover:opacity-100 transition-all group-hover:rotate-180" />
                  </button>
                </div>
              )}

              <div className="ml-2">
                <CurrencyDropdown className="" />
              </div>
            </div>
          </div>

          {/* Dropdown Menu - Positioned relative to navbar container */}
          {activeDropdown && (
            <div
              className="absolute top-full left-0 mt-4 w-full max-w-6xl bg-[#e7dbc8]/95 backdrop-blur-md border border-zinc-300/30 rounded-2xl shadow-xl z-50 animate-in slide-in-from-top-2 duration-200"
              onMouseEnter={handleDropdownMouseEnter}
              onMouseLeave={handleDropdownMouseLeave}
            >
              <div className="p-6">
                {activeDropdown === 'More' ? (
                  // Special layout for "More" dropdown showing multiple sections
                  <div className="space-y-8">
                    {moreLinks.map((link) => {
                      const IconComponent = link.icon;
                      return (
                        <div key={link.label} className="border-b border-zinc-300/20 pb-6 last:border-b-0">
                          <div className="flex gap-6">
                            {/* Main Section */}
                            <div className="flex-shrink-0 w-56">
                              <div className="flex items-start gap-3 mb-4">
                                <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg">
                                  <IconComponent className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                  <h3 className="font-bold text-[#d17927] text-lg mb-1">{link.label}</h3>
                                  <p className="text-sm text-zinc-600 leading-relaxed">{link.description}</p>
                                </div>
                              </div>
                            </div>

                            {/* Navigation Items */}
                            <div className="flex-1">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {link.items.map((item, index) => (
                                  <Link
                                    key={index}
                                    href={item.href}
                                    className="group p-3 rounded-lg border border-zinc-300/20 hover:border-orange-200/50 hover:bg-white/40 transition-all duration-200"
                                  >
                                    <div className="flex items-start justify-between h-full">
                                      <div className="flex-1">
                                        <h4 className="font-medium text-[#3a2c1a] group-hover:text-[#d17927] transition-colors mb-2">
                                          {item.label}
                                        </h4>
                                        <div className="w-8 h-0.5 bg-gradient-to-r from-[#d17927] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                      </div>
                                      <svg className="h-4 w-4 text-zinc-400 group-hover:text-[#d17927] group-hover:translate-x-1 transition-all opacity-0 group-hover:opacity-100 flex-shrink-0 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                      </svg>
                                    </div>
                                  </Link>
                                ))}
                              </div>

                              {/* View All Link */}
                              <div className="mt-4 pt-3 border-t border-zinc-300/20">
                                <Link
                                  href={link.href}
                                  className="inline-flex items-center text-sm font-medium text-[#d17927] hover:text-orange-700 transition-colors group"
                                >
                                  View all {link.label.toLowerCase()}
                                  <svg className="ml-1 h-3 w-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                  </svg>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  // Regular single dropdown layout for main links
                  <>
                    {mainLinks.map((link) => {
                      if (link.label !== activeDropdown) return null;
                      const IconComponent = link.icon;
                      return (
                        <div key={link.label} className="flex gap-6">
                          {/* Main Section */}
                          <div className="flex-shrink-0 w-56">
                            <div className="flex items-start gap-3 mb-4">
                              <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg">
                                <IconComponent className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <h3 className="font-bold text-[#d17927] text-lg mb-1">{link.label}</h3>
                                <p className="text-sm text-zinc-600 leading-relaxed">{link.description}</p>
                              </div>
                            </div>
                          </div>

                          {/* Navigation Items */}
                          <div className="flex-1">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {link.items.map((item, index) => (
                                <Link
                                  key={index}
                                  href={item.href}
                                  className="group p-3 rounded-lg border border-zinc-300/20 hover:border-orange-200/50 hover:bg-white/40 transition-all duration-200"
                                >
                                  <div className="flex items-start justify-between h-full">
                                    <div className="flex-1">
                                      <h4 className="font-medium text-[#3a2c1a] group-hover:text-[#d17927] transition-colors mb-2">
                                        {item.label}
                                      </h4>
                                      <div className="w-8 h-0.5 bg-gradient-to-r from-[#d17927] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </div>
                                    <svg className="h-4 w-4 text-zinc-400 group-hover:text-[#d17927] group-hover:translate-x-1 transition-all opacity-0 group-hover:opacity-100 flex-shrink-0 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                  </div>
                                </Link>
                              ))}
                            </div>

                            {/* View All Link */}
                            <div className="mt-4 pt-3 border-t border-zinc-300/20">
                              <Link
                                href={link.href}
                                className="inline-flex items-center text-sm font-medium text-[#d17927] hover:text-orange-700 transition-colors group"
                              >
                                View all {link.label.toLowerCase()}
                                <svg className="ml-1 h-3 w-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-[#e7dbc8]/40 backdrop-blur-md border border-zinc-300/30 relative shadow-xl shadow-zinc-800/10 rounded-full max-w-6xl mx-auto">
        <div className="px-4 sm:px-6 py-2">
          <div className="flex items-center justify-between h-16 sm:h-14">
            <Link href="/" className="flex items-center no-underline">
              <Image
                src="/Boondocklabs.png"
                alt="Boondock Labs Logo"
                width={48}
                height={48}
                className="mr-2 sm:mr-3"
              />
              <span className="font-bold text-base sm:text-lg text-[#d17927]">
                Boondock Labs
              </span>
            </Link>

            <button
              className="p-2 text-[#3a2c1a] hover:text-[#d17927] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-3 bg-[#e7dbc8]/95 backdrop-blur-md rounded-2xl shadow-xl border border-zinc-300/30 overflow-hidden z-50">
              <div className="py-3 space-y-2 px-3">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => {
                      setIsOpen(false);
                      document.body.style.overflow = 'unset';
                    }}
                    className="block py-4 px-4 text-[#3a2c1a] hover:bg-white/40 rounded-xl text-base font-medium transition-all min-h-[48px] flex items-center"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="border-t border-zinc-300/40 px-4 py-4 flex justify-center sm:justify-end">
                <CurrencyDropdown />
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}