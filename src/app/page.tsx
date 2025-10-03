"use client";

import React from 'react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ArrowRight, ChevronUp, Twitter, Linkedin, Facebook, Github, Package, Network, Code, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useCurrency } from './CurrencyContext';
import ServiceModal from './components/ServiceModal';

// Make sure to set NEXT_PUBLIC_FORMSPREE_ENDPOINT in your .env.local file

export default function Home() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string|null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [packageForm, setPackageForm] = useState({
    name: '',
    email: '',
    business: '',
    goals: '',
    features: '',
    design: '',
    budget: '',
    timeline: '',
    extra: '',
  });
  const [packageLoading, setPackageLoading] = useState(false);
  const [packageSent, setPackageSent] = useState(false);
  const [packageError, setPackageError] = useState<string|null>(null);
  const { currency, convert } = useCurrency();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Replace with your Formspree endpoint
  const FORMSPREE_ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;

  const openModal = (packageName: string) => {
    setSelectedPackage(packageName);
    setIsModalOpen(true);
    // Reset form state when opening modal
    setPackageSent(false);
    setPackageError(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPackage(null);
    setPackageSent(false);
    setPackageError(null);
  };

  const handleFormChange = (field: string, value: string) => {
    setPackageForm(prev => ({ ...prev, [field]: value }));
  };

  async function handlePackageSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!FORMSPREE_ENDPOINT) {
      setPackageError('NEXT_PUBLIC_FORMSPREE_ENDPOINT is not set in .env.local');
      return;
    }
    setPackageLoading(true);
    setPackageSent(false);
    setPackageError(null);
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _subject: `New ${selectedPackage} Website Inquiry`,
          package: selectedPackage,
          ...packageForm,
        }),
      });
      if (!res.ok) throw new Error('Failed to send form');
      setPackageSent(true);
      setPackageForm({ name: '', email: '', business: '', goals: '', features: '', design: '', budget: '', timeline: '', extra: '' });
      // Close modal after successful submission
      setTimeout(() => {
        closeModal();
      }, 2000);
    } catch (err: unknown) {
      setPackageError(err instanceof Error ? err.message : 'Error sending form');
    } finally {
      setPackageLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start pb-24">
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full glass pulse-animation"
          aria-label="Scroll to top"
        >
          <ChevronUp className="text-orange-400" />
        </button>
      )}

      {/* Hero Section */}
      <section className="w-full pt-6 sm:pt-8 px-4 flex justify-center items-center min-h-0">
        <div className="glass shadow-xl max-w-2xl w-full text-center py-8 sm:py-10 px-4 sm:px-12 flex flex-col items-center fade-in-up relative z-10">
          <div className="relative flex items-center justify-center mb-3 sm:mb-4">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-full w-[140px] h-[140px] sm:w-[180px] sm:h-[180px] bg-[#d17927] opacity-40 blur-2xl logo-glow"></div>
            </div>
          <Image
            src="/Boondocklabs.png"
            alt="Boondock Labs Logo"
            width={130}
            height={130}
            priority
              className="mx-auto drop-shadow-lg select-none animate-in-delay-1 relative"
          />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-1 sm:mb-2 accent tracking-wide animate-in-delay-1">Boondock Labs</h1>
          <p className="text-xs sm:text-sm mb-1 cream animate-in-delay-1">By Eugene Boondock</p>
          <p className="text-base sm:text-lg font-medium mb-2 sm:mb-3 text-black animate-in-delay-2 px-2">
            Boldly building webapps, games, digital worlds & the future of the web
          </p>
          <p className="mb-3 sm:mb-4 text-black text-sm animate-in-delay-2 px-2 leading-relaxed">Portfolio, tech studio, and playground for ambitious digital creativity</p>
          <p className="text-xs italic text-[#3a2c1a]/70 mb-3 sm:mb-2 font-medium tracking-wide">`translucency is by design`</p>
          <div className="flex justify-center gap-3 sm:gap-4 mt-2">
            <a href="https://twitter.com/eugeneboondock" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="p-2 hover:bg-white/20 rounded-full transition-colors">
              <Twitter className="w-5 h-5 sm:w-6 sm:h-6 text-[#d17927] hover:scale-110 hover:text-[#ccad89] transition" />
            </a>
            <a href="https://www.linkedin.com/in/eboondock/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="p-2 hover:bg-white/20 rounded-full transition-colors">
              <Linkedin className="w-5 h-5 sm:w-6 sm:h-6 text-[#d17927] hover:scale-110 hover:text-[#ccad89] transition" />
            </a>
            <a href="https://www.facebook.com/philosophisticater/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="p-2 hover:bg-white/20 rounded-full transition-colors">
              <Facebook className="w-5 h-5 sm:w-6 sm:h-6 text-[#d17927] hover:scale-110 hover:text-[#ccad89] transition" />
            </a>
            <a href="https://github.com/EugeneBoondock" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="p-2 hover:bg-white/20 rounded-full transition-colors">
              <Github className="w-5 h-5 sm:w-6 sm:h-6 text-[#d17927] hover:scale-110 hover:text-[#ccad89] transition" />
            </a>
          </div>
        </div>
      </section>

      {/* MCP Builder Section - Visual Showcase */}
      <section className="w-full flex justify-center items-center mb-6 sm:mb-8 mt-4 sm:mt-6 px-4">
        <div className="glass shadow-lg max-w-4xl w-full py-6 sm:py-8 px-4 sm:px-6 lg:px-10 flex flex-col items-center relative z-10 fade-in-up">
          <div className="text-center mb-4 sm:mb-6">
            <div className="flex items-center justify-center mb-2 sm:mb-3">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-orange-600 to-orange-400 rounded-xl mr-2 sm:mr-3">
                <Network className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold accent">MCP Server Builder</h2>
            </div>
            <p className="text-base sm:text-lg text-black mb-1 sm:mb-2">Building Model Context Protocol servers from scratch</p>
            <p className="text-sm text-zinc-700 px-2">Creating custom API endpoints and transforming them into powerful MCP tools</p>
          </div>

          {/* NPM Packages Grid */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
            {/* Earth2 API Wrapper */}
            <a
              href="https://www.npmjs.com/package/earth2-api-wrapper"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 sm:p-4 bg-white/60 hover:bg-white/80 rounded-lg border border-orange-200 transition-all hover:shadow-md group min-h-[120px] flex flex-col"
            >
              <div className="flex items-center mb-2">
                <Package className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 mr-2 flex-shrink-0" />
                <h3 className="font-bold text-sm accent">earth2-api-wrapper</h3>
              </div>
              <p className="text-xs text-zinc-700 mb-2 flex-grow">API wrapper for Earth2 platform</p>
              <div className="flex items-center text-xs text-orange-600 group-hover:underline mt-auto">
                View on NPM <ExternalLink className="h-3 w-3 ml-1" />
              </div>
            </a>

            {/* Morphed MCP Server */}
            <a
              href="https://www.npmjs.com/package/morphed-mcp-server"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 sm:p-4 bg-white/60 hover:bg-white/80 rounded-lg border border-orange-200 transition-all hover:shadow-md group min-h-[120px] flex flex-col"
            >
              <div className="flex items-center mb-2">
                <Network className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 mr-2 flex-shrink-0" />
                <h3 className="font-bold text-sm accent">morphed-mcp-server</h3>
              </div>
              <p className="text-xs text-zinc-700 mb-2 flex-grow">MCP server built from scratch for Morphed.io</p>
              <div className="flex items-center text-xs text-orange-600 group-hover:underline mt-auto">
                View on NPM <ExternalLink className="h-3 w-3 ml-1" />
              </div>
            </a>

            {/* HubSpot MCP Server */}
            <a
              href="https://www.npmjs.com/package/hubspot-mcp-server"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 sm:p-4 bg-white/60 hover:bg-white/80 rounded-lg border border-orange-200 transition-all hover:shadow-md group min-h-[120px] flex flex-col sm:col-span-2 lg:col-span-1"
            >
              <div className="flex items-center mb-2">
                <Network className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 mr-2 flex-shrink-0" />
                <h3 className="font-bold text-sm accent">hubspot-mcp-server</h3>
              </div>
              <p className="text-xs text-zinc-700 mb-2 flex-grow">Enhanced MCP server with additional features for HubSpot</p>
              <div className="flex items-center text-xs text-orange-600 group-hover:underline mt-auto">
                View on NPM <ExternalLink className="h-3 w-3 ml-1" />
              </div>
            </a>
          </div>

          {/* What I Do */}
          <div className="w-full bg-orange-50/50 rounded-lg p-4 sm:p-5 border border-orange-100">
            <h3 className="font-bold text-base sm:text-lg accent mb-3 flex items-center">
              <Code className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              What I Build
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-sm text-black">
              <li className="flex items-start">
                <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 mr-2 mt-0.5 text-orange-600 flex-shrink-0" />
                <span><strong>Custom API Endpoints:</strong> Building RESTful APIs tailored to your business needs</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 mr-2 mt-0.5 text-orange-600 flex-shrink-0" />
                <span><strong>MCP Server Development:</strong> Creating Model Context Protocol servers from the ground up</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 mr-2 mt-0.5 text-orange-600 flex-shrink-0" />
                <span><strong>API-to-MCP Transformation:</strong> Converting existing APIs into powerful MCP tools for AI integration</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 mr-2 mt-0.5 text-orange-600 flex-shrink-0" />
                <span><strong>NPM Package Publishing:</strong> Packaging and distributing tools for the developer community</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Packages & Pricing Section */}
      <section className="w-full flex justify-center items-center mb-12 sm:mb-16 mt-4 sm:mt-6 px-4">
        <div className="max-w-5xl w-full relative z-10">
          <div className="text-center mb-8 sm:mb-12 fade-in-up">
            <h2 className="text-3xl sm:text-4xl font-bold accent mb-2">My Repertoire</h2>
            <p className="text-base sm:text-lg text-black">Services and solutions tailored to bring your digital vision to life</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Basic Website */}
          <div className="glass shadow-md p-4 sm:p-6 flex flex-col items-start scale-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center mb-2">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-orange-600 to-orange-400 rounded-xl mr-2 sm:mr-3">
                <svg className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold accent mb-0">Basic Website</h3>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold mb-2 text-black">
              {mounted ? (
                <>
                  {convert(3000)} – {convert(10000)}
                </>
              ) : (
                <>R3,000 – R10,000</>
              )}
            </div>
            <p className="text-xs sm:text-sm text-zinc-700 mb-2 leading-relaxed">Perfect for personal, portfolio, or informational sites. Includes up to 3 pages, mobile responsive, and basic SEO.</p>
            <ul className="text-xs text-black space-y-1.5 mb-3 flex-grow">
              <li className="flex items-center">
                <ArrowRight className="h-3 w-3 mr-1.5" style={{ color: '#d17927' }} />
                Up to 3 pages
              </li>
              <li className="flex items-center">
                <ArrowRight className="h-3 w-3 mr-1.5" style={{ color: '#d17927' }} />
                Mobile responsive design
              </li>
              <li className="flex items-center">
                <ArrowRight className="h-3 w-3 mr-1.5" style={{ color: '#d17927' }} />
                Basic SEO optimization
              </li>
              <li className="flex items-center">
                <ArrowRight className="h-3 w-3 mr-1.5" style={{ color: '#d17927' }} />
                Contact form integration
              </li>
            </ul>
            <button
              className="btn-primary mt-auto !text-white !bg-[#d17927] hover:!bg-orange-700 hover:!text-white focus:!text-white active:!text-white w-full min-h-[44px]"
              onClick={() => openModal('Basic Website')}
            >
              Select
            </button>
          </div>
          {/* Business Website */}
          <div className="glass shadow-md p-4 sm:p-6 flex flex-col items-start scale-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center mb-2">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-orange-600 to-orange-400 rounded-xl mr-2 sm:mr-3">
                <svg className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold accent mb-0">Business Website</h3>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold mb-2 text-black">
              {mounted ? (
                <>
                  {convert(11000)} – {convert(15000)}
                </>
              ) : (
                <>R11,000 – R15,000</>
              )}
            </div>
            <p className="text-xs sm:text-sm text-zinc-700 mb-2 leading-relaxed">For small businesses or startups. Up to 8 pages, contact forms, Google Maps, blog, and enhanced SEO.</p>
            <ul className="text-xs text-black space-y-1.5 mb-3 flex-grow">
              <li className="flex items-center">
                <ArrowRight className="h-3 w-3 mr-1.5" style={{ color: '#d17927' }} />
                Up to 8 pages
              </li>
              <li className="flex items-center">
                <ArrowRight className="h-3 w-3 mr-1.5" style={{ color: '#d17927' }} />
                Contact forms integration
              </li>
              <li className="flex items-center">
                <ArrowRight className="h-3 w-3 mr-1.5" style={{ color: '#d17927' }} />
                Google Maps integration
              </li>
              <li className="flex items-center">
                <ArrowRight className="h-3 w-3 mr-1.5" style={{ color: '#d17927' }} />
                Blog functionality
              </li>
              <li className="flex items-center">
                <ArrowRight className="h-3 w-3 mr-1.5" style={{ color: '#d17927' }} />
                Enhanced SEO optimization
              </li>
            </ul>
            <button
              className="btn-primary mt-auto !text-white !bg-[#d17927] hover:!bg-orange-700 hover:!text-white focus:!text-white active:!text-white w-full min-h-[44px]"
              onClick={() => openModal('Business Website')}
            >
              Select
            </button>
          </div>
          {/* E-commerce Website */}
          <div className="glass shadow-md p-4 sm:p-6 flex flex-col items-start scale-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center mb-2">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-orange-600 to-orange-400 rounded-xl mr-2 sm:mr-3">
                <svg className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold accent mb-0">E-commerce Website</h3>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold mb-2 text-black">
              {mounted ? (
                <>
                  {convert(15000)} – {convert(20000)}
                </>
              ) : (
                <>R15,000 – R20,000</>
              )}
            </div>
            <p className="text-xs sm:text-sm text-zinc-700 mb-2 leading-relaxed">Online shop with product catalog, payment gateway, order management, and training. Scalable for growth.</p>
            <ul className="text-xs text-black space-y-1.5 mb-3 flex-grow">
              <li className="flex items-center">
                <ArrowRight className="h-3 w-3 mr-1.5" style={{ color: '#d17927' }} />
                Product catalog management
              </li>
              <li className="flex items-center">
                <ArrowRight className="h-3 w-3 mr-1.5" style={{ color: '#d17927' }} />
                Payment gateway integration
              </li>
              <li className="flex items-center">
                <ArrowRight className="h-3 w-3 mr-1.5" style={{ color: '#d17927' }} />
                Order management system
              </li>
              <li className="flex items-center">
                <ArrowRight className="h-3 w-3 mr-1.5" style={{ color: '#d17927' }} />
                Inventory tracking
              </li>
              <li className="flex items-center">
                <ArrowRight className="h-3 w-3 mr-1.5" style={{ color: '#d17927' }} />
                Staff training included
              </li>
            </ul>
            <button
              className="btn-primary mt-auto !text-white !bg-[#d17927] hover:!bg-orange-700 hover:!text-white focus:!text-white active:!text-white w-full min-h-[44px]"
              onClick={() => openModal('E-commerce Website')}
            >
              Select
            </button>
          </div>
          {/* Custom/Advanced Website */}
          <div className="glass shadow-md p-4 sm:p-6 flex flex-col items-start scale-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center mb-2">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-orange-600 to-orange-400 rounded-xl mr-2 sm:mr-3">
                <svg className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold accent mb-0">Custom / Advanced Website</h3>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold mb-2 text-black">
              {mounted ? (
                <>
                  From {convert(30000)}+
                </>
              ) : (
                <>From R30,000+</>
              )}
            </div>
            <p className="text-xs sm:text-sm text-zinc-700 mb-2 leading-relaxed">For complex needs: custom features, integrations, web apps, or large corporate sites. Tailored to your vision.</p>
            <ul className="text-xs text-black space-y-1.5 mb-3 flex-grow">
              <li className="flex items-center">
                <ArrowRight className="h-3 w-3 mr-1.5" style={{ color: '#d17927' }} />
                Custom feature development
              </li>
              <li className="flex items-center">
                <ArrowRight className="h-3 w-3 mr-1.5" style={{ color: '#d17927' }} />
                Third-party integrations
              </li>
              <li className="flex items-center">
                <ArrowRight className="h-3 w-3 mr-1.5" style={{ color: '#d17927' }} />
                Web application development
              </li>
              <li className="flex items-center">
                <ArrowRight className="h-3 w-3 mr-1.5" style={{ color: '#d17927' }} />
                Advanced functionality
              </li>
              <li className="flex items-center">
                <ArrowRight className="h-3 w-3 mr-1.5" style={{ color: '#d17927' }} />
                Enterprise-level solutions
              </li>
            </ul>
            <button
              className="btn-primary mt-auto !text-white !bg-[#d17927] hover:!bg-orange-700 hover:!text-white focus:!text-white active:!text-white w-full min-h-[44px]"
              onClick={() => openModal('Custom / Advanced Website')}
            >
              Select
            </button>
          </div>

          {/* MCP Server Building */}
          <div className="glass shadow-md p-4 sm:p-6 flex flex-col items-start scale-in" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center mb-2">
              <Network className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600 mr-2" />
              <h3 className="text-lg sm:text-xl font-bold accent mb-0">MCP Server Building</h3>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold mb-2 text-black">
              {mounted ? (
                <>
                  {convert(20000)} – {convert(50000)}
                </>
              ) : (
                <>R20,000 – R50,000</>
              )}
            </div>
            <p className="text-xs sm:text-sm text-zinc-700 mb-2 leading-relaxed">Custom Model Context Protocol (MCP) servers built from scratch. Transform your APIs into powerful AI-integrated tools for Claude and other LLMs.</p>
            <ul className="text-xs text-black space-y-1.5 mb-3">
              <li className="flex items-center">
                <ArrowRight className="h-3 w-3 mr-1.5" style={{ color: '#d17927' }} />
                Complete MCP server architecture
              </li>
              <li className="flex items-center">
                <ArrowRight className="h-3 w-3 mr-1.5" style={{ color: '#d17927' }} />
                Custom tool development
              </li>
              <li className="flex items-center">
                <ArrowRight className="h-3 w-3 mr-1.5" style={{ color: '#d17927' }} />
                NPM package publishing
              </li>
              <li className="flex items-center">
                <ArrowRight className="h-3 w-3 mr-1.5" style={{ color: '#d17927' }} />
                Documentation & testing
              </li>
            </ul>
            <button
              className="btn-primary mt-auto !text-white !bg-[#d17927] hover:!bg-orange-700 hover:!text-white focus:!text-white active:!text-white w-full min-h-[44px]"
              onClick={() => openModal('MCP Server Building')}
            >
              Select
            </button>
          </div>

          {/* API Endpoint Building */}
          <div className="glass shadow-md p-4 sm:p-6 flex flex-col items-start scale-in" style={{ animationDelay: '0.6s' }}>
            <div className="flex items-center mb-2">
              <Code className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600 mr-2" />
              <h3 className="text-lg sm:text-xl font-bold accent mb-0">API Endpoint Building</h3>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold mb-2 text-black">
              {mounted ? (
                <>
                  {convert(15000)} – {convert(40000)}
                </>
              ) : (
                <>R15,000 – R40,000</>
              )}
            </div>
            <p className="text-xs sm:text-sm text-zinc-700 mb-2 leading-relaxed">Custom RESTful API endpoints tailored to your business needs. Scalable, secure, and well-documented APIs that power your applications.</p>
            <ul className="text-xs text-black space-y-1.5 mb-3">
              <li className="flex items-center">
                <ArrowRight className="h-3 w-3 mr-1.5" style={{ color: '#d17927' }} />
                RESTful API architecture
              </li>
              <li className="flex items-center">
                <ArrowRight className="h-3 w-3 mr-1.5" style={{ color: '#d17927' }} />
                Authentication & authorization
              </li>
              <li className="flex items-center">
                <ArrowRight className="h-3 w-3 mr-1.5" style={{ color: '#d17927' }} />
                Database integration
              </li>
              <li className="flex items-center">
                <ArrowRight className="h-3 w-3 mr-1.5" style={{ color: '#d17927' }} />
                API documentation & testing
              </li>
            </ul>
            <button
              className="btn-primary mt-auto !text-white !bg-[#d17927] hover:!bg-orange-700 hover:!text-white focus:!text-white active:!text-white w-full min-h-[44px]"
              onClick={() => openModal('API Endpoint Building')}
            >
              Select
            </button>
          </div>
        </div>
        </div>
      </section>

      {/* Service Modal */}
      <ServiceModal
        isOpen={isModalOpen}
        onClose={closeModal}
        serviceName={selectedPackage || ''}
        serviceTitle={getServiceTitle(selectedPackage)}
        servicePrice={getServicePrice(selectedPackage, mounted, convert)}
        serviceDescription={getServiceDescription(selectedPackage)}
        serviceFeatures={getServiceFeatures(selectedPackage)}
        formFields={packageForm}
        onFormChange={handleFormChange}
        onSubmit={handlePackageSubmit}
        loading={packageLoading}
        sent={packageSent}
        error={packageError}
      />
    </main>
  );
}

// Helper functions for service data
function getServiceTitle(serviceName: string | null): string {
  switch (serviceName) {
    case 'Basic Website': return 'Basic Website';
    case 'Business Website': return 'Business Website';
    case 'E-commerce Website': return 'E-commerce Website';
    case 'Custom / Advanced Website': return 'Custom / Advanced Website';
    case 'MCP Server Building': return 'MCP Server Building';
    case 'API Endpoint Building': return 'API Endpoint Building';
    default: return '';
  }
}

function getServicePrice(serviceName: string | null, mounted?: boolean, convert?: (amount: number) => string): string {
  if (!mounted || !convert) {
    switch (serviceName) {
      case 'Basic Website': return 'R3,000 – R10,000';
      case 'Business Website': return 'R11,000 – R15,000';
      case 'E-commerce Website': return 'R15,000 – R20,000';
      case 'Custom / Advanced Website': return 'From R30,000+';
      case 'MCP Server Building': return 'R20,000 – R50,000';
      case 'API Endpoint Building': return 'R15,000 – R40,000';
      default: return '';
    }
  }

  switch (serviceName) {
    case 'Basic Website': return `${convert(3000)} – ${convert(10000)}`;
    case 'Business Website': return `${convert(11000)} – ${convert(15000)}`;
    case 'E-commerce Website': return `${convert(15000)} – ${convert(20000)}`;
    case 'Custom / Advanced Website': return `From ${convert(30000)}+`;
    case 'MCP Server Building': return `${convert(20000)} – ${convert(50000)}`;
    case 'API Endpoint Building': return `${convert(15000)} – ${convert(40000)}`;
    default: return '';
  }
}

function getServiceDescription(serviceName: string | null): string {
  switch (serviceName) {
    case 'Basic Website': return 'Perfect for personal, portfolio, or informational sites. Includes up to 3 pages, mobile responsive, and basic SEO.';
    case 'Business Website': return 'For small businesses or startups. Up to 8 pages, contact forms, Google Maps, blog, and enhanced SEO.';
    case 'E-commerce Website': return 'Online shop with product catalog, payment gateway, order management, and training. Scalable for growth.';
    case 'Custom / Advanced Website': return 'For complex needs: custom features, integrations, web apps, or large corporate sites. Tailored to your vision.';
    case 'MCP Server Building': return 'Custom Model Context Protocol (MCP) servers built from scratch. Transform your APIs into powerful AI-integrated tools for Claude and other LLMs.';
    case 'API Endpoint Building': return 'Custom RESTful API endpoints tailored to your business needs. Scalable, secure, and well-documented APIs that power your applications.';
    default: return '';
  }
}

function getServiceFeatures(serviceName: string | null): string[] {
  switch (serviceName) {
    case 'Basic Website':
      return ['Up to 3 pages', 'Mobile responsive design', 'Basic SEO optimization', 'Contact form integration'];
    case 'Business Website':
      return ['Up to 8 pages', 'Contact forms integration', 'Google Maps integration', 'Blog functionality', 'Enhanced SEO optimization'];
    case 'E-commerce Website':
      return ['Product catalog management', 'Payment gateway integration', 'Order management system', 'Inventory tracking', 'Staff training included'];
    case 'Custom / Advanced Website':
      return ['Custom feature development', 'Third-party integrations', 'Web application development', 'Advanced functionality', 'Enterprise-level solutions'];
    case 'MCP Server Building':
      return ['Complete MCP server architecture', 'Custom tool development', 'NPM package publishing', 'Documentation & testing'];
    case 'API Endpoint Building':
      return ['RESTful API architecture', 'Authentication & authorization', 'Database integration', 'API documentation & testing'];
    default: return [];
  }
}
