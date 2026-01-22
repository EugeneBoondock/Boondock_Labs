"use client";
import { useState } from 'react';
import { MessagesSquare, CheckCircle, Clock, DollarSign, Calendar, ArrowRight } from 'lucide-react';
import React from 'react';

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    projectType: '',
    budget: '',
    timeline: '',
    description: '',
    goals: '',
    challenges: '',
    additionalInfo: ''
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const FORMSPREE_ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT!;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return form.name && form.email && form.projectType;
      case 2:
        return form.budget && form.timeline;
      case 3:
        return form.description;
      default:
        return false;
    }
  };

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
          company: form.company,
          projectType: form.projectType,
          budget: form.budget,
          timeline: form.timeline,
          description: form.description,
          goals: form.goals,
          challenges: form.challenges,
          additionalInfo: form.additionalInfo,
          _subject: 'New Project Inquiry',
        }),
      });
      if (!res.ok) throw new Error('Failed to send message');
      setSent(true);
      setForm({
        name: '', email: '', company: '', projectType: '', budget: '', timeline: '',
        description: '', goals: '', challenges: '', additionalInfo: ''
      });
      setCurrentStep(1);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error sending message');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start pb-24">
      <section className="w-full pt-24 sm:pt-32 px-4 flex justify-center">
        <div id="message" className="max-w-4xl w-full glass grid-pattern border border-orange-900/20 py-8 px-6 sm:px-12 mb-16 shadow-lg relative z-10 scroll-mt-24" style={{ pointerEvents: 'auto' }}>
          <h2 id="inquiry" className="text-2xl font-bold mb-6 accent text-center scroll-mt-24">Let's Build Something Amazing Together</h2>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-2">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    step <= currentStep ? 'bg-[#d17927] text-white' : 'bg-zinc-200 text-zinc-600'
                  }`}>
                    {step < currentStep ? <CheckCircle className="h-4 w-4" /> : step}
                  </div>
                  {step < 3 && (
                    <div className={`w-12 h-0.5 mx-2 transition-all ${
                      step < currentStep ? 'bg-[#d17927]' : 'bg-zinc-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Basic Info & Project Type */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-in slide-in-from-left duration-300">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold accent mb-2">Tell me about yourself</h3>
                    <p className="text-zinc-600">Let's start with the basics</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-black mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="w-full px-4 py-3 rounded-lg border border-orange-900/30 bg-[#f7f2e7] text-black focus:ring-2 focus:ring-[#d17927] focus:border-transparent transition"
                        placeholder="Your full name"
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="w-full px-4 py-3 rounded-lg border border-orange-900/30 bg-[#f7f2e7] text-black focus:ring-2 focus:ring-[#d17927] focus:border-transparent transition"
                        placeholder="your.email@example.com"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-black mb-2">
                      Company/Organization <span className="text-zinc-500">(optional)</span>
                    </label>
                    <input
                      type="text"
                      id="company"
                      className="w-full px-4 py-3 rounded-lg border border-orange-900/30 bg-[#f7f2e7] text-black focus:ring-2 focus:ring-[#d17927] focus:border-transparent transition"
                      placeholder="Your company name"
                      value={form.company}
                      onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-3">
                      What type of project are you interested in? <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        'Website Development',
                        'Web Application',
                        'API Development',
                        'MCP Server',
                        'AI Integration',
                        'Consulting'
                      ].map((type) => (
                        <label key={type} className="flex items-center">
                          <input
                            type="radio"
                            name="projectType"
                            value={type}
                            checked={form.projectType === type}
                            onChange={e => setForm(f => ({ ...f, projectType: e.target.value }))}
                            className="mr-2 text-[#d17927] focus:ring-[#d17927]"
                          />
                          <span className="text-sm text-black">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Budget & Timeline */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-in slide-in-from-left duration-300">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold accent mb-2">Project scope & timeline</h3>
                    <p className="text-zinc-600">Help me understand your project requirements</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-3">
                      What's your budget range? <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        'R5,000 - R15,000',
                        'R15,000 - R30,000',
                        'R30,000 - R60,000',
                        'R60,000+',
                        'Discuss with me'
                      ].map((budget) => (
                        <label key={budget} className="flex items-center">
                          <input
                            type="radio"
                            name="budget"
                            value={budget}
                            checked={form.budget === budget}
                            onChange={e => setForm(f => ({ ...f, budget: e.target.value }))}
                            className="mr-2 text-[#d17927] focus:ring-[#d17927]"
                          />
                          <span className="text-sm text-black">{budget}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-3">
                      What's your preferred timeline? <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        'ASAP (Rush job)',
                        '1-2 weeks',
                        '1-2 months',
                        '3-6 months',
                        'No rush'
                      ].map((timeline) => (
                        <label key={timeline} className="flex items-center">
                          <input
                            type="radio"
                            name="timeline"
                            value={timeline}
                            checked={form.timeline === timeline}
                            onChange={e => setForm(f => ({ ...f, timeline: e.target.value }))}
                            className="mr-2 text-[#d17927] focus:ring-[#d17927]"
                          />
                          <span className="text-sm text-black">{timeline}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Project Details */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-in slide-in-from-left duration-300">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold accent mb-2">Project details</h3>
                    <p className="text-zinc-600">Tell me more about your vision</p>
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-black mb-2">
                      Project Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-orange-900/30 bg-[#f7f2e7] text-black focus:ring-2 focus:ring-[#d17927] focus:border-transparent transition"
                      placeholder="Describe your project, what you want to build, and what problem it solves..."
                      value={form.description}
                      onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="goals" className="block text-sm font-medium text-black mb-2">
                      Project Goals <span className="text-zinc-500">(optional)</span>
                    </label>
                    <textarea
                      id="goals"
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-orange-900/30 bg-[#f7f2e7] text-black focus:ring-2 focus:ring-[#d17927] focus:border-transparent transition"
                      placeholder="What do you want to achieve with this project?"
                      value={form.goals}
                      onChange={e => setForm(f => ({ ...f, goals: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label htmlFor="challenges" className="block text-sm font-medium text-black mb-2">
                      Current Challenges <span className="text-zinc-500">(optional)</span>
                    </label>
                    <textarea
                      id="challenges"
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-orange-900/30 bg-[#f7f2e7] text-black focus:ring-2 focus:ring-[#d17927] focus:border-transparent transition"
                      placeholder="What challenges are you facing that this project will solve?"
                      value={form.challenges}
                      onChange={e => setForm(f => ({ ...f, challenges: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label htmlFor="additionalInfo" className="block text-sm font-medium text-black mb-2">
                      Additional Information <span className="text-zinc-500">(optional)</span>
                    </label>
                    <textarea
                      id="additionalInfo"
                      rows={2}
                      className="w-full px-4 py-3 rounded-lg border border-orange-900/30 bg-[#f7f2e7] text-black focus:ring-2 focus:ring-[#d17927] focus:border-transparent transition"
                      placeholder="Any other details, references, or questions..."
                      value={form.additionalInfo}
                      onChange={e => setForm(f => ({ ...f, additionalInfo: e.target.value }))}
                    />
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-orange-900/20">
                <button
                  type="button"
                  onClick={prevStep}
                  className={`px-6 py-3 rounded-lg border-2 transition-all ${
                    currentStep === 1
                      ? 'opacity-50 cursor-not-allowed'
                      : 'border-orange-600 text-orange-600 hover:bg-orange-50'
                  }`}
                  disabled={currentStep === 1}
                >
                  Previous
                </button>

                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!isStepValid(currentStep)}
                    className="btn-primary px-6 py-3 !text-white !bg-[#d17927] hover:!bg-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
                  >
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading || !isStepValid(currentStep)}
                    className="btn-primary px-6 py-3 !text-white !bg-[#d17927] hover:!bg-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                  >
                    <span>{loading ? 'Sending...' : 'Send Project Inquiry'}</span>
                    <MessagesSquare className="h-4 w-4" />
                  </button>
                )}
              </div>

              {sent && <div className="text-green-600 text-sm mt-4 text-center bg-green-50 p-3 rounded-lg">Project inquiry sent! I'll review your requirements and get back to you within 24 hours.</div>}
              {error && <div className="text-red-500 text-sm mt-4 text-center bg-red-50 p-3 rounded-lg">{error}</div>}
            </form>
          </div>

          <div id="social" className="mt-8 text-center scroll-mt-24">
            <p className="text-sm text-black mb-4">
              Prefer direct contact? <a href="mailto:philosncube@gmail.com" className="cream hover:[color:#d17927] font-medium">philosncube@gmail.com</a>
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <a href="https://github.com/EugeneBoondock" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors text-sm">
                GitHub
              </a>
              <a href="https://twitter.com/EugeneBoondock" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
                Twitter
              </a>
              <a href="https://linkedin.com/in/eugene-ncube" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 