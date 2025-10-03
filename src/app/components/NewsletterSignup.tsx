'use client';

import { useState } from 'react';
import { Mail, CheckCircle, X } from 'lucide-react';

interface NewsletterSignupProps {
  title?: string;
  description?: string;
  className?: string;
  variant?: 'default' | 'compact' | 'hero';
}

export default function NewsletterSignup({
  title = "Stay Updated",
  description = "Get notified when I publish new articles about AI integration, web development, and building complex digital platforms.",
  className = "",
  variant = 'default'
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');

    try {
      // ConvertKit API integration
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to subscribe');
      }

      setSuccess(true);
      setEmail('');
    } catch (err) {
      setError('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (variant === 'hero') {
    return (
      <div className={`glass shadow-xl p-8 text-center border border-orange-900/20 ${className}`}>
        <div className="max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold accent mb-4">{title}</h3>
          <p className="text-base text-black mb-6">{description}</p>

          {!success ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg border border-zinc-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-primary px-6 py-3 !text-white !bg-[#d17927] hover:!bg-orange-700 transition-all disabled:opacity-50"
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span>Successfully subscribed!</span>
            </div>
          )}

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`bg-orange-50/50 rounded-lg p-6 border border-orange-100 ${className}`}>
        <div className="flex items-center gap-3 mb-3">
          <Mail className="h-5 w-5 text-orange-600" />
          <h3 className="font-semibold accent">{title}</h3>
        </div>
        <p className="text-sm text-zinc-700 mb-4">{description}</p>

        {!success ? (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 px-3 py-2 rounded border border-zinc-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded transition-all disabled:opacity-50 text-sm font-medium"
            >
              {loading ? '...' : 'Join'}
            </button>
          </form>
        ) : (
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <CheckCircle className="h-4 w-4" />
            <span>Subscribed!</span>
          </div>
        )}

        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
      </div>
    );
  }

  // Default variant
  return (
    <div className={`glass shadow-xl p-8 text-center border border-orange-900/20 ${className}`}>
      <div className="max-w-2xl mx-auto">
        <h3 className="text-2xl font-bold accent mb-4">{title}</h3>
        <p className="text-base text-black mb-6">{description}</p>

        {!success ? (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-lg border border-zinc-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-6 py-3 !text-white !bg-[#d17927] hover:!bg-orange-700 transition-all disabled:opacity-50"
            >
              {loading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        ) : (
          <div className="flex items-center justify-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span>Successfully subscribed!</span>
          </div>
        )}

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    </div>
  );
}

