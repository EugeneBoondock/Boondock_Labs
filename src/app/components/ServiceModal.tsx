'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
  serviceTitle: string;
  servicePrice: string;
  serviceDescription: string;
  serviceFeatures: string[];
  formFields: {
    name: string;
    email: string;
    business: string;
    goals: string;
    features: string;
    design: string;
    budget: string;
    timeline: string;
    extra: string;
  };
  onFormChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  sent: boolean;
  error: string | null;
}

export default function ServiceModal({
  isOpen,
  onClose,
  serviceName,
  serviceTitle,
  servicePrice,
  serviceDescription,
  serviceFeatures,
  formFields,
  onFormChange,
  onSubmit,
  loading,
  sent,
  error
}: ServiceModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#e7dbc8] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl border border-orange-900/20">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-[#e7dbc8]/80 hover:bg-[#e7dbc8] rounded-full shadow-lg transition-colors border border-orange-900/20"
        >
          <X className="h-5 w-5 text-[#d17927]" />
        </button>

        {/* Content */}
        <div className="p-6 pt-12">
          {/* Service Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold accent mb-2">{serviceTitle}</h2>
            <div className="text-2xl font-extrabold mb-2 text-black">{servicePrice}</div>
            <p className="text-sm text-zinc-700 leading-relaxed">{serviceDescription}</p>
          </div>

          {/* Features */}
          <div className="mb-6">
            <ul className="space-y-2">
              {serviceFeatures.map((feature, index) => (
                <li key={index} className="flex items-center text-sm text-black">
                  <div className="w-2 h-2 bg-[#d17927] rounded-full mr-3 flex-shrink-0"></div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                className="w-full rounded px-3 py-2 border text-sm focus:ring-2 focus:ring-[#d17927] focus:border-[#d17927] outline-none"
                placeholder="Your Name"
                value={formFields.name}
                onChange={e => onFormChange('name', e.target.value)}
                required
              />
              <input
                type="email"
                className="w-full rounded px-3 py-2 border text-sm focus:ring-2 focus:ring-[#d17927] focus:border-[#d17927] outline-none"
                placeholder="Your Email"
                value={formFields.email}
                onChange={e => onFormChange('email', e.target.value)}
                required
              />
            </div>

            <input
              type="text"
              className="w-full rounded px-3 py-2 border text-sm focus:ring-2 focus:ring-[#d17927] focus:border-[#d17927] outline-none"
              placeholder="Business/Brand (if any)"
              value={formFields.business}
              onChange={e => onFormChange('business', e.target.value)}
            />

            <textarea
              className="w-full rounded px-3 py-2 border text-sm focus:ring-2 focus:ring-[#d17927] focus:border-[#d17927] outline-none"
              placeholder="Project Goals (what do you want to achieve?)"
              value={formFields.goals}
              onChange={e => onFormChange('goals', e.target.value)}
              required
              rows={3}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <textarea
                className="w-full rounded px-3 py-2 border text-sm focus:ring-2 focus:ring-[#d17927] focus:border-[#d17927] outline-none"
                placeholder="Required Features"
                value={formFields.features}
                onChange={e => onFormChange('features', e.target.value)}
                rows={2}
              />
              <textarea
                className="w-full rounded px-3 py-2 border text-sm focus:ring-2 focus:ring-[#d17927] focus:border-[#d17927] outline-none"
                placeholder="Design Preferences"
                value={formFields.design}
                onChange={e => onFormChange('design', e.target.value)}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                className="w-full rounded px-3 py-2 border text-sm focus:ring-2 focus:ring-[#d17927] focus:border-[#d17927] outline-none"
                placeholder="Budget Range (optional)"
                value={formFields.budget}
                onChange={e => onFormChange('budget', e.target.value)}
              />
              <input
                type="text"
                className="w-full rounded px-3 py-2 border text-sm focus:ring-2 focus:ring-[#d17927] focus:border-[#d17927] outline-none"
                placeholder="Timeline (when do you need it?)"
                value={formFields.timeline}
                onChange={e => onFormChange('timeline', e.target.value)}
              />
            </div>

            <textarea
              className="w-full rounded px-3 py-2 border text-sm focus:ring-2 focus:ring-[#d17927] focus:border-[#d17927] outline-none"
              placeholder="Anything else you'd like to add?"
              value={formFields.extra}
              onChange={e => onFormChange('extra', e.target.value)}
              rows={2}
            />

            <button
              type="submit"
              className="btn-primary w-full mt-6 min-h-[44px]"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Submit Inquiry'}
            </button>

            {sent && <div className="text-green-600 text-sm mt-2 text-center">Inquiry sent! I'll get back to you soon.</div>}
            {error && <div className="text-red-500 text-sm mt-2 text-center">{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}
