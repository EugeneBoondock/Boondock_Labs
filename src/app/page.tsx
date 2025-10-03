"use client";

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ArrowRight, ChevronUp, Twitter, Linkedin, Facebook, Github, Package, Network, Code, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useCurrency } from './CurrencyContext';

// Make sure to set NEXT_PUBLIC_FORMSPREE_ENDPOINT in your .env.local file

export default function Home() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string|null>(null);
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
      <section className="w-full pt-8 sm:pt-8 px-4 flex justify-center items-center min-h-0">
        <div className="glass shadow-xl max-w-2xl w-full text-center py-10 px-6 sm:px-12 flex flex-col items-center animate-in relative z-10">
          <div className="relative flex items-center justify-center mb-4">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-full w-[180px] h-[180px] bg-[#d17927] opacity-40 blur-2xl logo-glow"></div>
            </div>
          <Image
            src="/Boondocklabs.png"
            alt="Boondock Labs Logo"
            width={160}
            height={160}
            priority
              className="mx-auto drop-shadow-lg select-none animate-in-delay-1 relative"
          />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 accent tracking-wide animate-in-delay-1">Boondock Labs</h1>
          <p className="text-xs mb-1 cream animate-in-delay-1">By Eugene Boondock</p>
          <p className="text-lg font-medium mb-3 text-black animate-in-delay-2">
            Boldly building webapps, games, digital worlds & the future of the web
          </p>
          <p className="mb-4 text-black text-sm animate-in-delay-2">Portfolio, tech studio, and playground for ambitious digital creativity</p>
          <p className="text-xs italic text-[#3a2c1a]/70 mb-2 font-medium tracking-wide">`translucency is by design`</p>
          <div className="flex justify-center gap-4 mt-2">
            <a href="https://twitter.com/eugeneboondock" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <Twitter className="w-6 h-6 text-[#d17927] hover:scale-110 hover:text-[#ccad89] transition" />
            </a>
            <a href="https://www.linkedin.com/in/eboondock/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <Linkedin className="w-6 h-6 text-[#d17927] hover:scale-110 hover:text-[#ccad89] transition" />
            </a>
            <a href="https://www.facebook.com/philosophisticater/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <Facebook className="w-6 h-6 text-[#d17927] hover:scale-110 hover:text-[#ccad89] transition" />
            </a>
            <a href="https://github.com/EugeneBoondock" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <Github className="w-6 h-6 text-[#d17927] hover:scale-110 hover:text-[#ccad89] transition" />
            </a>
          </div>
        </div>
      </section>

      {/* MCP Builder Section - Visual Showcase */}
      <section className="w-full flex justify-center items-center mb-8 mt-6">
        <div className="glass shadow-lg max-w-3xl w-full py-8 px-6 sm:px-10 flex flex-col items-center relative z-10">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-3">
              <div className="p-3 bg-gradient-to-br from-orange-600 to-orange-400 rounded-xl mr-3">
                <Network className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold accent">MCP Server Builder</h2>
            </div>
            <p className="text-lg text-black mb-2">Building Model Context Protocol servers from scratch</p>
            <p className="text-sm text-zinc-700">Creating custom API endpoints and transforming them into powerful MCP tools</p>
          </div>

          {/* NPM Packages Grid */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Earth2 API Wrapper */}
            <a
              href="https://www.npmjs.com/package/earth2-api-wrapper"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-white/60 hover:bg-white/80 rounded-lg border border-orange-200 transition-all hover:shadow-md group"
            >
              <div className="flex items-center mb-2">
                <Package className="h-5 w-5 text-orange-600 mr-2" />
                <h3 className="font-bold text-sm accent">earth2-api-wrapper</h3>
              </div>
              <p className="text-xs text-zinc-700 mb-2">API wrapper for Earth2 platform</p>
              <div className="flex items-center text-xs text-orange-600 group-hover:underline">
                View on NPM <ExternalLink className="h-3 w-3 ml-1" />
              </div>
            </a>

            {/* Morphed MCP Server */}
            <a
              href="https://www.npmjs.com/package/morphed-mcp-server"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-white/60 hover:bg-white/80 rounded-lg border border-orange-200 transition-all hover:shadow-md group"
            >
              <div className="flex items-center mb-2">
                <Network className="h-5 w-5 text-orange-600 mr-2" />
                <h3 className="font-bold text-sm accent">morphed-mcp-server</h3>
              </div>
              <p className="text-xs text-zinc-700 mb-2">MCP server built from scratch for Morphed.io</p>
              <div className="flex items-center text-xs text-orange-600 group-hover:underline">
                View on NPM <ExternalLink className="h-3 w-3 ml-1" />
              </div>
            </a>

            {/* HubSpot MCP Server */}
            <a
              href="https://www.npmjs.com/package/hubspot-mcp-server"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-white/60 hover:bg-white/80 rounded-lg border border-orange-200 transition-all hover:shadow-md group"
            >
              <div className="flex items-center mb-2">
                <Network className="h-5 w-5 text-orange-600 mr-2" />
                <h3 className="font-bold text-sm accent">hubspot-mcp-server</h3>
              </div>
              <p className="text-xs text-zinc-700 mb-2">Enhanced MCP server with additional features for HubSpot</p>
              <div className="flex items-center text-xs text-orange-600 group-hover:underline">
                View on NPM <ExternalLink className="h-3 w-3 ml-1" />
              </div>
            </a>
          </div>

          {/* What I Do */}
          <div className="w-full bg-orange-50/50 rounded-lg p-5 border border-orange-100">
            <h3 className="font-bold text-lg accent mb-3 flex items-center">
              <Code className="h-5 w-5 mr-2" />
              What I Build
            </h3>
            <ul className="space-y-2 text-sm text-black">
              <li className="flex items-start">
                <ArrowRight className="h-4 w-4 mr-2 mt-0.5 text-orange-600 flex-shrink-0" />
                <span><strong>Custom API Endpoints:</strong> Building RESTful APIs tailored to your business needs</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="h-4 w-4 mr-2 mt-0.5 text-orange-600 flex-shrink-0" />
                <span><strong>MCP Server Development:</strong> Creating Model Context Protocol servers from the ground up</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="h-4 w-4 mr-2 mt-0.5 text-orange-600 flex-shrink-0" />
                <span><strong>API-to-MCP Transformation:</strong> Converting existing APIs into powerful MCP tools for AI integration</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="h-4 w-4 mr-2 mt-0.5 text-orange-600 flex-shrink-0" />
                <span><strong>NPM Package Publishing:</strong> Packaging and distributing tools for the developer community</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Packages & Pricing Section */}
      <section className="w-full flex justify-center items-center mb-16 mt-6 px-4">
        <div className="max-w-4xl w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {/* Basic Website */}
          <div className="glass shadow-md p-6 flex flex-col items-start">
            <h3 className="text-xl font-bold accent mb-1">Basic Website</h3>
            <div className="text-2xl font-extrabold mb-2 text-black">
              {mounted ? (
                <>
                  {convert(3000)} – {convert(10000)}
                </>
              ) : (
                <>R3,000 – R10,000</>
              )}
            </div>
            <p className="text-sm text-zinc-700 mb-2">Perfect for personal, portfolio, or informational sites. Includes up to 3 pages, mobile responsive, and basic SEO.</p>
            <button
              className="btn-primary mt-2 !text-white !bg-[#d17927] hover:!bg-orange-700 hover:!text-white focus:!text-white active:!text-white"
              onClick={() => setSelectedPackage(selectedPackage === 'Basic Website' ? null : 'Basic Website')}
            >
              {selectedPackage === 'Basic Website' ? 'Unselect' : 'Select'}
            </button>
            {selectedPackage === 'Basic Website' && (
              <form className="w-full mt-4 space-y-2" onSubmit={handlePackageSubmit}>
                <input type="text" className="w-full rounded px-3 py-2 border" placeholder="Your Name" value={packageForm.name} onChange={e => setPackageForm(f => ({...f, name: e.target.value}))} required />
                <input type="email" className="w-full rounded px-3 py-2 border" placeholder="Your Email" value={packageForm.email} onChange={e => setPackageForm(f => ({...f, email: e.target.value}))} required />
                <input type="text" className="w-full rounded px-3 py-2 border" placeholder="Business/Brand (if any)" value={packageForm.business} onChange={e => setPackageForm(f => ({...f, business: e.target.value}))} />
                <textarea className="w-full rounded px-3 py-2 border" placeholder="Project Goals (what do you want to achieve?)" value={packageForm.goals} onChange={e => setPackageForm(f => ({...f, goals: e.target.value}))} required />
                <textarea className="w-full rounded px-3 py-2 border" placeholder="Required Features (e.g. blog, contact form, gallery, etc)" value={packageForm.features} onChange={e => setPackageForm(f => ({...f, features: e.target.value}))} />
                <textarea className="w-full rounded px-3 py-2 border" placeholder="Design Preferences (colors, style, inspiration)" value={packageForm.design} onChange={e => setPackageForm(f => ({...f, design: e.target.value}))} />
                <input type="text" className="w-full rounded px-3 py-2 border" placeholder="Budget Range (optional)" value={packageForm.budget} onChange={e => setPackageForm(f => ({...f, budget: e.target.value}))} />
                <input type="text" className="w-full rounded px-3 py-2 border" placeholder="Timeline (when do you need it?)" value={packageForm.timeline} onChange={e => setPackageForm(f => ({...f, timeline: e.target.value}))} />
                <textarea className="w-full rounded px-3 py-2 border" placeholder="Anything else you'd like to add?" value={packageForm.extra} onChange={e => setPackageForm(f => ({...f, extra: e.target.value}))} />
                <button type="submit" className="btn-primary w-full mt-2" disabled={packageLoading}>{packageLoading ? 'Sending...' : 'Submit Inquiry'}</button>
                {packageSent && <div className="text-green-600 text-xs mt-1">Inquiry sent! I'll get back to you soon.</div>}
                {packageError && <div className="text-red-500 text-xs mt-1">{packageError}</div>}
              </form>
            )}
          </div>
          {/* Business Website */}
          <div className="glass shadow-md p-6 flex flex-col items-start">
            <h3 className="text-xl font-bold accent mb-1">Business Website</h3>
            <div className="text-2xl font-extrabold mb-2 text-black">
              {mounted ? (
                <>
                  {convert(11000)} – {convert(15000)}
                </>
              ) : (
                <>R11,000 – R15,000</>
              )}
            </div>
            <p className="text-sm text-zinc-700 mb-2">For small businesses or startups. Up to 8 pages, contact forms, Google Maps, blog, and enhanced SEO.</p>
            <button
              className="btn-primary mt-2 !text-white !bg-[#d17927] hover:!bg-orange-700 hover:!text-white focus:!text-white active:!text-white"
              onClick={() => setSelectedPackage(selectedPackage === 'Business Website' ? null : 'Business Website')}
            >
              {selectedPackage === 'Business Website' ? 'Unselect' : 'Select'}
            </button>
            {selectedPackage === 'Business Website' && (
              <form className="w-full mt-4 space-y-2" onSubmit={handlePackageSubmit}>
                <input type="text" className="w-full rounded px-3 py-2 border" placeholder="Your Name" value={packageForm.name} onChange={e => setPackageForm(f => ({...f, name: e.target.value}))} required />
                <input type="email" className="w-full rounded px-3 py-2 border" placeholder="Your Email" value={packageForm.email} onChange={e => setPackageForm(f => ({...f, email: e.target.value}))} required />
                <input type="text" className="w-full rounded px-3 py-2 border" placeholder="Business/Brand (if any)" value={packageForm.business} onChange={e => setPackageForm(f => ({...f, business: e.target.value}))} />
                <textarea className="w-full rounded px-3 py-2 border" placeholder="Project Goals (what do you want to achieve?)" value={packageForm.goals} onChange={e => setPackageForm(f => ({...f, goals: e.target.value}))} required />
                <textarea className="w-full rounded px-3 py-2 border" placeholder="Required Features (e.g. blog, contact form, gallery, etc)" value={packageForm.features} onChange={e => setPackageForm(f => ({...f, features: e.target.value}))} />
                <textarea className="w-full rounded px-3 py-2 border" placeholder="Design Preferences (colors, style, inspiration)" value={packageForm.design} onChange={e => setPackageForm(f => ({...f, design: e.target.value}))} />
                <input type="text" className="w-full rounded px-3 py-2 border" placeholder="Budget Range (optional)" value={packageForm.budget} onChange={e => setPackageForm(f => ({...f, budget: e.target.value}))} />
                <input type="text" className="w-full rounded px-3 py-2 border" placeholder="Timeline (when do you need it?)" value={packageForm.timeline} onChange={e => setPackageForm(f => ({...f, timeline: e.target.value}))} />
                <textarea className="w-full rounded px-3 py-2 border" placeholder="Anything else you'd like to add?" value={packageForm.extra} onChange={e => setPackageForm(f => ({...f, extra: e.target.value}))} />
                <button type="submit" className="btn-primary w-full mt-2" disabled={packageLoading}>{packageLoading ? 'Sending...' : 'Submit Inquiry'}</button>
                {packageSent && <div className="text-green-600 text-xs mt-1">Inquiry sent! I'll get back to you soon.</div>}
                {packageError && <div className="text-red-500 text-xs mt-1">{packageError}</div>}
              </form>
            )}
          </div>
          {/* E-commerce Website */}
          <div className="glass shadow-md p-6 flex flex-col items-start">
            <h3 className="text-xl font-bold accent mb-1">E-commerce Website</h3>
            <div className="text-2xl font-extrabold mb-2 text-black">
              {mounted ? (
                <>
                  {convert(15000)} – {convert(20000)}
                </>
              ) : (
                <>R15,000 – R20,000</>
              )}
            </div>
            <p className="text-sm text-zinc-700 mb-2">Online shop with product catalog, payment gateway, order management, and training. Scalable for growth.</p>
            <button
              className="btn-primary mt-2 !text-white !bg-[#d17927] hover:!bg-orange-700 hover:!text-white focus:!text-white active:!text-white"
              onClick={() => setSelectedPackage(selectedPackage === 'E-commerce Website' ? null : 'E-commerce Website')}
            >
              {selectedPackage === 'E-commerce Website' ? 'Unselect' : 'Select'}
              </button>
            {selectedPackage === 'E-commerce Website' && (
              <form className="w-full mt-4 space-y-2" onSubmit={handlePackageSubmit}>
                <input type="text" className="w-full rounded px-3 py-2 border" placeholder="Your Name" value={packageForm.name} onChange={e => setPackageForm(f => ({...f, name: e.target.value}))} required />
                <input type="email" className="w-full rounded px-3 py-2 border" placeholder="Your Email" value={packageForm.email} onChange={e => setPackageForm(f => ({...f, email: e.target.value}))} required />
                <input type="text" className="w-full rounded px-3 py-2 border" placeholder="Business/Brand (if any)" value={packageForm.business} onChange={e => setPackageForm(f => ({...f, business: e.target.value}))} />
                <textarea className="w-full rounded px-3 py-2 border" placeholder="Project Goals (what do you want to achieve?)" value={packageForm.goals} onChange={e => setPackageForm(f => ({...f, goals: e.target.value}))} required />
                <textarea className="w-full rounded px-3 py-2 border" placeholder="Required Features (e.g. blog, contact form, gallery, etc)" value={packageForm.features} onChange={e => setPackageForm(f => ({...f, features: e.target.value}))} />
                <textarea className="w-full rounded px-3 py-2 border" placeholder="Design Preferences (colors, style, inspiration)" value={packageForm.design} onChange={e => setPackageForm(f => ({...f, design: e.target.value}))} />
                <input type="text" className="w-full rounded px-3 py-2 border" placeholder="Budget Range (optional)" value={packageForm.budget} onChange={e => setPackageForm(f => ({...f, budget: e.target.value}))} />
                <input type="text" className="w-full rounded px-3 py-2 border" placeholder="Timeline (when do you need it?)" value={packageForm.timeline} onChange={e => setPackageForm(f => ({...f, timeline: e.target.value}))} />
                <textarea className="w-full rounded px-3 py-2 border" placeholder="Anything else you'd like to add?" value={packageForm.extra} onChange={e => setPackageForm(f => ({...f, extra: e.target.value}))} />
                <button type="submit" className="btn-primary w-full mt-2" disabled={packageLoading}>{packageLoading ? 'Sending...' : 'Submit Inquiry'}</button>
                {packageSent && <div className="text-green-600 text-xs mt-1">Inquiry sent! I'll get back to you soon.</div>}
                {packageError && <div className="text-red-500 text-xs mt-1">{packageError}</div>}
            </form>
            )}
          </div>
          {/* Custom/Advanced Website */}
          <div className="glass shadow-md p-6 flex flex-col items-start">
            <h3 className="text-xl font-bold accent mb-1">Custom / Advanced Website</h3>
            <div className="text-2xl font-extrabold mb-2 text-black">
              {mounted ? (
                <>
                  From {convert(30000)}+
                </>
              ) : (
                <>From R30,000+</>
              )}
            </div>
            <p className="text-sm text-zinc-700 mb-2">For complex needs: custom features, integrations, web apps, or large corporate sites. Tailored to your vision.</p>
            <button
              className="btn-primary mt-2 !text-white !bg-[#d17927] hover:!bg-orange-700 hover:!text-white focus:!text-white active:!text-white"
              onClick={() => setSelectedPackage(selectedPackage === 'Custom / Advanced Website' ? null : 'Custom / Advanced Website')}
            >
              {selectedPackage === 'Custom / Advanced Website' ? 'Unselect' : 'Select'}
            </button>
            {selectedPackage === 'Custom / Advanced Website' && (
              <form className="w-full mt-4 space-y-2" onSubmit={handlePackageSubmit}>
                <input type="text" className="w-full rounded px-3 py-2 border" placeholder="Your Name" value={packageForm.name} onChange={e => setPackageForm(f => ({...f, name: e.target.value}))} required />
                <input type="email" className="w-full rounded px-3 py-2 border" placeholder="Your Email" value={packageForm.email} onChange={e => setPackageForm(f => ({...f, email: e.target.value}))} required />
                <input type="text" className="w-full rounded px-3 py-2 border" placeholder="Business/Brand (if any)" value={packageForm.business} onChange={e => setPackageForm(f => ({...f, business: e.target.value}))} />
                <textarea className="w-full rounded px-3 py-2 border" placeholder="Project Goals (what do you want to achieve?)" value={packageForm.goals} onChange={e => setPackageForm(f => ({...f, goals: e.target.value}))} required />
                <textarea className="w-full rounded px-3 py-2 border" placeholder="Required Features (e.g. blog, contact form, gallery, etc)" value={packageForm.features} onChange={e => setPackageForm(f => ({...f, features: e.target.value}))} />
                <textarea className="w-full rounded px-3 py-2 border" placeholder="Design Preferences (colors, style, inspiration)" value={packageForm.design} onChange={e => setPackageForm(f => ({...f, design: e.target.value}))} />
                <input type="text" className="w-full rounded px-3 py-2 border" placeholder="Budget Range (optional)" value={packageForm.budget} onChange={e => setPackageForm(f => ({...f, budget: e.target.value}))} />
                <input type="text" className="w-full rounded px-3 py-2 border" placeholder="Timeline (when do you need it?)" value={packageForm.timeline} onChange={e => setPackageForm(f => ({...f, timeline: e.target.value}))} />
                <textarea className="w-full rounded px-3 py-2 border" placeholder="Anything else you'd like to add?" value={packageForm.extra} onChange={e => setPackageForm(f => ({...f, extra: e.target.value}))} />
                <button type="submit" className="btn-primary w-full mt-2" disabled={packageLoading}>{packageLoading ? 'Sending...' : 'Submit Inquiry'}</button>
                {packageSent && <div className="text-green-600 text-xs mt-1">Inquiry sent! I'll get back to you soon.</div>}
                {packageError && <div className="text-red-500 text-xs mt-1">{packageError}</div>}
              </form>
            )}
          </div>

          {/* MCP Server Building */}
          <div className="glass shadow-md p-6 flex flex-col items-start">
            <div className="flex items-center mb-2">
              <Network className="h-6 w-6 text-orange-600 mr-2" />
              <h3 className="text-xl font-bold accent mb-0">MCP Server Building</h3>
            </div>
            <div className="text-2xl font-extrabold mb-2 text-black">
              {mounted ? (
                <>
                  {convert(20000)} – {convert(50000)}
                </>
              ) : (
                <>R20,000 – R50,000</>
              )}
            </div>
            <p className="text-sm text-zinc-700 mb-2">Custom Model Context Protocol (MCP) servers built from scratch. Transform your APIs into powerful AI-integrated tools for Claude and other LLMs.</p>
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
              className="btn-primary mt-auto !text-white !bg-[#d17927] hover:!bg-orange-700 hover:!text-white focus:!text-white active:!text-white"
              onClick={() => setSelectedPackage(selectedPackage === 'MCP Server Building' ? null : 'MCP Server Building')}
            >
              {selectedPackage === 'MCP Server Building' ? 'Unselect' : 'Select'}
            </button>
            {selectedPackage === 'MCP Server Building' && (
              <form className="w-full mt-4 space-y-2" onSubmit={handlePackageSubmit}>
                <input type="text" className="w-full rounded px-3 py-2 border" placeholder="Your Name" value={packageForm.name} onChange={e => setPackageForm(f => ({...f, name: e.target.value}))} required />
                <input type="email" className="w-full rounded px-3 py-2 border" placeholder="Your Email" value={packageForm.email} onChange={e => setPackageForm(f => ({...f, email: e.target.value}))} required />
                <input type="text" className="w-full rounded px-3 py-2 border" placeholder="Business/Brand (if any)" value={packageForm.business} onChange={e => setPackageForm(f => ({...f, business: e.target.value}))} />
                <textarea className="w-full rounded px-3 py-2 border" placeholder="Project Goals (what do you want to achieve?)" value={packageForm.goals} onChange={e => setPackageForm(f => ({...f, goals: e.target.value}))} required />
                <textarea className="w-full rounded px-3 py-2 border" placeholder="Required Features (e.g. blog, contact form, gallery, etc)" value={packageForm.features} onChange={e => setPackageForm(f => ({...f, features: e.target.value}))} />
                <textarea className="w-full rounded px-3 py-2 border" placeholder="Design Preferences (colors, style, inspiration)" value={packageForm.design} onChange={e => setPackageForm(f => ({...f, design: e.target.value}))} />
                <input type="text" className="w-full rounded px-3 py-2 border" placeholder="Budget Range (optional)" value={packageForm.budget} onChange={e => setPackageForm(f => ({...f, budget: e.target.value}))} />
                <input type="text" className="w-full rounded px-3 py-2 border" placeholder="Timeline (when do you need it?)" value={packageForm.timeline} onChange={e => setPackageForm(f => ({...f, timeline: e.target.value}))} />
                <textarea className="w-full rounded px-3 py-2 border" placeholder="Anything else you'd like to add?" value={packageForm.extra} onChange={e => setPackageForm(f => ({...f, extra: e.target.value}))} />
                <button type="submit" className="btn-primary w-full mt-2" disabled={packageLoading}>{packageLoading ? 'Sending...' : 'Submit Inquiry'}</button>
                {packageSent && <div className="text-green-600 text-xs mt-1">Inquiry sent! I'll get back to you soon.</div>}
                {packageError && <div className="text-red-500 text-xs mt-1">{packageError}</div>}
              </form>
            )}
          </div>

          {/* API Endpoint Building */}
          <div className="glass shadow-md p-6 flex flex-col items-start">
            <div className="flex items-center mb-2">
              <Code className="h-6 w-6 text-orange-600 mr-2" />
              <h3 className="text-xl font-bold accent mb-0">API Endpoint Building</h3>
            </div>
            <div className="text-2xl font-extrabold mb-2 text-black">
              {mounted ? (
                <>
                  {convert(15000)} – {convert(40000)}
                </>
              ) : (
                <>R15,000 – R40,000</>
              )}
            </div>
            <p className="text-sm text-zinc-700 mb-2">Custom RESTful API endpoints tailored to your business needs. Scalable, secure, and well-documented APIs that power your applications.</p>
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
              className="btn-primary mt-auto !text-white !bg-[#d17927] hover:!bg-orange-700 hover:!text-white focus:!text-white active:!text-white"
              onClick={() => setSelectedPackage(selectedPackage === 'API Endpoint Building' ? null : 'API Endpoint Building')}
            >
              {selectedPackage === 'API Endpoint Building' ? 'Unselect' : 'Select'}
            </button>
            {selectedPackage === 'API Endpoint Building' && (
              <form className="w-full mt-4 space-y-2" onSubmit={handlePackageSubmit}>
                <input type="text" className="w-full rounded px-3 py-2 border" placeholder="Your Name" value={packageForm.name} onChange={e => setPackageForm(f => ({...f, name: e.target.value}))} required />
                <input type="email" className="w-full rounded px-3 py-2 border" placeholder="Your Email" value={packageForm.email} onChange={e => setPackageForm(f => ({...f, email: e.target.value}))} required />
                <input type="text" className="w-full rounded px-3 py-2 border" placeholder="Business/Brand (if any)" value={packageForm.business} onChange={e => setPackageForm(f => ({...f, business: e.target.value}))} />
                <textarea className="w-full rounded px-3 py-2 border" placeholder="Project Goals (what do you want to achieve?)" value={packageForm.goals} onChange={e => setPackageForm(f => ({...f, goals: e.target.value}))} required />
                <textarea className="w-full rounded px-3 py-2 border" placeholder="Required Features (e.g. blog, contact form, gallery, etc)" value={packageForm.features} onChange={e => setPackageForm(f => ({...f, features: e.target.value}))} />
                <textarea className="w-full rounded px-3 py-2 border" placeholder="Design Preferences (colors, style, inspiration)" value={packageForm.design} onChange={e => setPackageForm(f => ({...f, design: e.target.value}))} />
                <input type="text" className="w-full rounded px-3 py-2 border" placeholder="Budget Range (optional)" value={packageForm.budget} onChange={e => setPackageForm(f => ({...f, budget: e.target.value}))} />
                <input type="text" className="w-full rounded px-3 py-2 border" placeholder="Timeline (when do you need it?)" value={packageForm.timeline} onChange={e => setPackageForm(f => ({...f, timeline: e.target.value}))} />
                <textarea className="w-full rounded px-3 py-2 border" placeholder="Anything else you'd like to add?" value={packageForm.extra} onChange={e => setPackageForm(f => ({...f, extra: e.target.value}))} />
                <button type="submit" className="btn-primary w-full mt-2" disabled={packageLoading}>{packageLoading ? 'Sending...' : 'Submit Inquiry'}</button>
                {packageSent && <div className="text-green-600 text-xs mt-1">Inquiry sent! I'll get back to you soon.</div>}
                {packageError && <div className="text-red-500 text-xs mt-1">{packageError}</div>}
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
