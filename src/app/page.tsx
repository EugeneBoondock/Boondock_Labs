"use client";

import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { ArrowRight, Globe, Code, Gamepad2, Cpu, Braces, MessagesSquare, ExternalLink, Menu, X, ChevronUp, Twitter, Linkedin, Facebook, Github } from 'lucide-react';
import Link from 'next/link';
import { sendToGemini } from './gemini';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Make sure to set NEXT_PUBLIC_FORMSPREE_ENDPOINT in your .env.local file

export default function Home() {
  const [activeSection, setActiveSection] = useState('home');
  const [navOpen, setNavOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<{role: 'user'|'ai', text: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summarySent, setSummarySent] = useState(false);
  const [summaryError, setSummaryError] = useState<string|null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
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

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setShowScrollTop(window.scrollY > 500);

      // Update active section based on scroll position
      const sections = ['home', 'about', 'showcase', 'services', 'scripts', 'contact'];

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll function
  const scrollToSection = (sectionId: string) => {
    setNavOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function handleChatSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatHistory(h => [...h, { role: 'user', text: chatInput }]);
    setLoading(true);
    setError(null);
    try {
      const aiReply = await sendToGemini(chatInput);
      setChatHistory(h => [...h, { role: 'ai', text: aiReply }]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error talking to AI');
    } finally {
      setLoading(false);
      setChatInput("");
      // Focus input after AI responds
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }

  // Replace with your Formspree endpoint
  const FORMSPREE_ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;

  async function handleSendSummary() {
    if (!FORMSPREE_ENDPOINT) {
      setSummaryError('NEXT_PUBLIC_FORMSPREE_ENDPOINT is not set in .env.local');
      return;
    }
    setSummaryLoading(true);
    setSummarySent(false);
    setSummaryError(null);
    try {
      // Generate summary using Gemini, instructing the AI to ask for contact details
      const summary = await sendToGemini(
        "Summarize this conversation in 3-5 sentences for Eugene. Focus on the user's intent, questions, and any important context. If the user provided their contact details (email, phone, etc), include them in the summary. If not, remind the user to provide a way for Eugene to contact them.",
        chatHistory.map(m => ({
          role: m.role === 'ai' ? 'model' : 'user',
          content: m.text
        }))
      );
      // Try to extract a contact detail from the chat history (simple heuristic)
      const contactMatch = chatHistory.find(m => m.text.match(/@|\d{10,}/));
      const contact = contactMatch ? contactMatch.text : '';
      // Send summary to Formspree
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          summary,
          contact,
          _subject: 'New AI Chat Summary from Portfolio',
        }),
      });
      if (!res.ok) throw new Error('Failed to send summary email');
      setSummarySent(true);
    } catch (err: unknown) {
      setSummaryError(err instanceof Error ? err.message : 'Error sending summary');
    } finally {
      setSummaryLoading(false);
    }
  }

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
      <section className="w-full pt-0 sm:pt-0 px-4 flex justify-center items-center min-h-0">
        <div className="glass shadow-xl max-w-2xl w-full text-center py-10 px-6 sm:px-12 flex flex-col items-center animate-in mt-2">
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
          <p className="text-lg mb-1 cream animate-in-delay-1">By Eugene Boondock</p>
          <p className="text-lg font-medium mb-3 text-black animate-in-delay-2">
            Boldly building webapps, games, digital worlds & the future of the web
          </p>
          <p className="mb-4 text-black text-sm animate-in-delay-2">Portfolio, tech studio, and playground for ambitious digital creativity</p>
          <div className="flex justify-center gap-4 mt-6">
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
      {/* Chat Interface Card - moved up, visually grouped */}
      <section className="w-full flex justify-center items-center">
        <div className="glass shadow-lg max-w-2xl w-full py-4 px-3 sm:px-8 mb-8 flex flex-col items-center animate-in-delay-2 mt-4">
          <div className="w-full flex flex-col items-center">
            <div className="text-center text-lg font-medium mb-2 relative h-8">
              <span className="ghostly-text">hie, wanna talk to my AI avatar?</span>
            </div>
            <div className="w-full max-h-56 overflow-y-auto mb-2 bg-white/40 rounded-lg px-3 py-2" style={{minHeight: 48}}>
              {chatHistory.length === 0 && (
                <div className="text-zinc-500 text-sm text-center">Start a conversation...</div>
              )}
              {chatHistory.map((msg, i) => (
                <div key={i} className={`my-1 text-sm flex items-start ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'ai' ? (
                    <>
                      <Image
                        src="/ai_avatar.jpg"
                        alt="AI Avatar"
                        width={32}
                        height={32}
                        className="rounded-full mr-2 mt-0.5 border border-orange-200 shadow-sm"
                      />
                      <div className="max-w-[80%]">
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: ({node, ...props}) => <p className="mb-2" {...props} />,
                            a: ({node, ...props}) => <a className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                            strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                            em: ({node, ...props}) => <em className="italic" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-2" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal ml-4 mb-2" {...props} />,
                            li: ({node, ...props}) => <li className="mb-1" {...props} />,
                            code: ({node, inline, ...props}: {node?: unknown, inline?: boolean} & React.HTMLAttributes<HTMLElement>) => 
                              inline ? 
                                <code className="bg-gray-100 rounded px-1" {...props} /> :
                                <code className="block bg-gray-100 rounded p-2 mb-2 overflow-x-auto" {...props} />,
                            pre: ({node, ...props}) => <pre className="bg-gray-100 rounded p-2 mb-2 overflow-x-auto" {...props} />,
                            table: ({node, ...props}) => <table className="border-collapse border border-gray-300 mb-2" {...props} />,
                            th: ({node, ...props}) => <th className="border border-gray-300 px-2 py-1 bg-gray-100" {...props} />,
                            td: ({node, ...props}) => <td className="border border-gray-300 px-2 py-1" {...props} />,
                          }}
                        >
                          {msg.text}
                        </ReactMarkdown>
                </div>
                    </>
                  ) : (
                    <div className="max-w-[80%] text-black text-right ml-auto">{msg.text}</div>
                  )}
                </div>
              ))}
              {loading && <div className="text-xs text-zinc-500 italic">AI is thinking...</div>}
              {error && <div className="text-xs text-red-500 italic">{error}</div>}
            </div>
            <form className="w-full flex gap-2 mt-2" onSubmit={handleChatSubmit}>
              <input
                ref={inputRef}
                type="text"
                className="flex-1 rounded-lg px-3 py-2 border border-orange-900/20 bg-white/60 text-black focus:ring-2 focus:ring-[#d17927] focus:border-transparent transition text-base sm:text-lg"
                placeholder="Type your message..."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                disabled={loading}
                autoComplete="off"
              />
              <button type="submit" className="btn-primary px-4 sm:px-5" style={{ background: 'linear-gradient(90deg, #d17927, #d17927)' }} disabled={loading || !chatInput.trim()}>{loading ? '...' : 'Send'}</button>
            </form>
            <button
              className={`mt-3 btn-primary px-4 py-2 text-sm ${chatHistory.length === 0 ? 'opacity-50 cursor-not-allowed bg-gray-300 text-gray-500' : ''}`}
              style={{ background: chatHistory.length === 0 ? undefined : 'linear-gradient(90deg, #d17927, #d17927)' }}
              onClick={handleSendSummary}
              disabled={summaryLoading || chatHistory.length === 0}
              aria-disabled={chatHistory.length === 0}
            >
              {summaryLoading ? 'Sending summary...' : 'Send Summary to Eugene'}
            </button>
            {summarySent && <div className="text-green-600 text-xs mt-1">Summary sent to Eugene!</div>}
            {summaryError && <div className="text-red-500 text-xs mt-1">{summaryError}</div>}
          </div>
        </div>
      </section>
      {/* Packages & Pricing Section */}
      <section className="w-full flex justify-center items-center mb-16">
        <div className="max-w-3xl w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Basic Website */}
          <div className="glass shadow-md p-6 flex flex-col items-start">
            <h3 className="text-xl font-bold accent mb-1">Basic Website</h3>
            <div className="text-2xl font-extrabold mb-2 text-black">R3,000 – R10,000</div>
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
            <div className="text-2xl font-extrabold mb-2 text-black">R11,000 – R15,000</div>
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
            <div className="text-2xl font-extrabold mb-2 text-black">R15,000 – R20,000</div>
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
            <div className="text-2xl font-extrabold mb-2 text-black">From R30,000+</div>
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
        </div>
      </section>
    </main>
  );
}
