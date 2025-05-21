"use client";
import { useState } from 'react';
import { MessagesSquare } from 'lucide-react';
import React from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const FORMSPREE_ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT!;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSent(false);
    setError(null);
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: form.message,
          _subject: 'New Contact Form Submission',
        }),
      });
      if (!res.ok) throw new Error('Failed to send message');
      setSent(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error sending message');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start pb-24">
      <section className="w-full pt-24 sm:pt-32 px-4 flex justify-center">
        <div className="max-w-2xl w-full glass grid-pattern border border-orange-900/20 py-8 px-6 sm:px-12 mb-16 shadow-lg relative z-10" style={{ pointerEvents: 'auto' }}>
          <h2 className="text-2xl font-bold mb-3 accent text-center">Let's Build The Future Together</h2>
          <p className="text-center mb-6 text-black">Have a project in mind? Want to talk?</p>
          <div className="p-6 rounded-xl">
            <form className="space-y-4 relative z-20" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-black mb-1">Name</label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 rounded-lg border border-orange-900/30 bg-[#f7f2e7] text-black focus:ring-2 focus:ring-[#d17927] focus:border-transparent transition"
                    placeholder="Your name"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-black mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 rounded-lg border border-orange-900/30 bg-[#f7f2e7] text-black focus:ring-2 focus:ring-[#d17927] focus:border-transparent transition"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-black mb-1">Subject</label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-4 py-2 rounded-lg border border-orange-900/30 bg-[#f7f2e7] text-black focus:ring-2 focus:ring-[#d17927] focus:border-transparent transition"
                  placeholder="What's this about?"
                  value={form.subject}
                  onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-black mb-1">Message</label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-orange-900/30 bg-[#f7f2e7] text-black focus:ring-2 focus:ring-[#d17927] focus:border-transparent transition"
                  placeholder="Tell me about your project or idea..."
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  required
                />
              </div>
              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2" disabled={loading}>
                <span>{loading ? 'Sending...' : 'Send Message'}</span>
                <MessagesSquare className="h-4 w-4" />
              </button>
              {sent && <div className="text-green-600 text-xs mt-1">Message sent! I'll get back to you soon.</div>}
              {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
            </form>
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-black">
              Or reach out directly at <a href="mailto:contact@boondocklabs.com" className="cream hover:[color:#d17927]">philosncube@gmail.com</a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
} 