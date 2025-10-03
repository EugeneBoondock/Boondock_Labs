'use client';

import { Calendar, Clock, Users, TrendingUp, Code, Database, Network, ArrowRight, ExternalLink, CheckCircle2, Layers, Zap, Globe, Cpu, Shield, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import NewsletterSignup from '../components/NewsletterSignup';
import ContentModal from '../components/ContentModal';

const caseStudies = [
  {
    id: 'earthie-platform',
    title: 'Earthie: A Comprehensive Earth2 Metaverse Analytics & Community Platform',
    category: 'Full-Stack Development',
    client: 'Earth2 Community',
    duration: '8 months',
    team: 'Solo Developer',
    technologies: ['Next.js 14', 'React 18', 'Supabase', 'PostgreSQL', 'TypeScript', 'Tailwind CSS', 'PWA', 'Real-time APIs', 'AI Integration', 'Chart.js', 'Leaflet Maps', 'WebSockets', 'OAuth 2.0', 'Multi-tenancy', 'Google Gemini AI', 'Moralis API', 'GoldRush.dev API', 'Overpass API', 'Nominatim API', 'USGS API', 'YouTube API', 'Twitch API', 'Three.js', 'React Leaflet'],
    challenge: 'The Earth2 metaverse community needed a comprehensive platform to manage land data, track Essence prices, analyze market trends, share knowledge, and connect users across 13 specialized hubs with real-time data processing and AI-powered insights.',
    solution: 'Built a full-featured platform with 17+ API integrations, real-time data processing, AI-powered analytics, advanced mapping features, community tools, and a multi-hub architecture supporting 13 specialized tools for Earth2 players.',
    results: [
      '13 specialized hubs for different Earth2 activities',
      '20+ API integrations including Earth2, Moralis, GoldRush, Overpass, USGS, and Google Gemini',
      'Real-time Essence price tracking with Moralis API and historical analytics',
      'AI-powered portfolio advisor with Google Gemini integration for smart recommendations',
      'Interactive mapping with Leaflet, Three.js globe, and comprehensive geospatial data',
      'Advanced mineral prospecting with USGS data integration and geological analysis',
      'Community features with social hub, posts, reactions, and live streaming integration',
      'Comprehensive leaderboards for 195+ countries across multiple metrics',
      'Location Search Engine with AI-powered queries combining Earth2 and real-world data',
      'Mobile-responsive PWA design with offline capabilities and push notifications',
      'Multi-tenant architecture supporting 1,000+ users with subscription management',
      'Trading-style market terminal with real-time charts and country analytics'
    ],
    metrics: {
      'Specialized Hubs': '13',
      'API Integrations': '20+',
      'Active Users': '1000+',
      'Data Points Tracked': '100000+',
      'Countries Supported': '195+',
      'Performance': '99.9% uptime',
      'External Services': '15+',
      'AI Models': '2'
    },
    featured: true,
    image: '/earthie-world.png'
  },
  {
    id: 'morphed-platform',
    title: 'Morphed: Enterprise Business Intelligence & AI Integration Platform',
    category: 'Full-Stack Development',
    client: 'Morphed.io',
    duration: '12 months',
    team: 'Solo Developer',
    technologies: ['Next.js 14', 'React 18', 'Node.js', 'PostgreSQL', 'TypeScript', 'Tailwind CSS', 'OAuth 2.0', 'Multi-tenancy', 'MCP Servers', 'AI Integration', 'HubSpot API', 'Pinecone Vector DB', 'WebSockets', 'JWT', 'Real-time APIs', 'File Processing', 'PWA'],
    challenge: 'Build a comprehensive enterprise business intelligence platform with multi-tenancy, advanced AI integration, HubSpot CRM integration, MCP server architecture, real-time data processing, and sophisticated authentication systems for business automation and AI-assisted workflows.',
    solution: 'Developed a full-stack platform with advanced multi-tenancy architecture, OAuth 2.0 integration, comprehensive audit trails, custom MCP servers for AI integration, HubSpot CRM operations, vector database embeddings, real-time notifications, and enterprise-grade security.',
    results: [
      'Multi-tenant architecture supporting 100+ enterprise clients with role-based access',
      'Advanced OAuth 2.0 integration with HubSpot, Google, and custom providers',
      'Custom MCP servers enabling seamless AI assistant integration with business data',
      'Comprehensive HubSpot CRM integration for contact, company, and deal management',
      'AI-powered business intelligence with OpenAI, Anthropic, and Google Gemini integration',
      'Vector database with Pinecone for semantic search and content analysis',
      'Advanced audit and compliance systems with real-time activity monitoring',
      'Real-time data processing with WebSocket connections and token heartbeat',
      'File processing capabilities for PDF, DOCX, and document analysis',
      'Enterprise-grade security with encrypted token storage and rate limiting',
      'Proactive monitoring system with automated alerts and notifications',
      'Mobile-responsive PWA design with offline capabilities'
    ],
    metrics: {
      'Active Clients': '100+',
      'MCP Tools': '15+',
      'API Endpoints': '75+',
      'AI Models': '3',
      'Vector DB Entries': '115,000+',
      'Security Score': 'A+',
      'Uptime': '99.9%',
      'Response Time': '<200ms'
    },
    featured: true,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop&crop=center'
  },
  {
    id: 'entropy-suite',
    title: 'Entropy Suite: AI-Powered Productivity Platform',
    category: 'Full-Stack Development',
    client: 'Internal Project',
    duration: '4 months',
    team: 'Solo Developer',
    technologies: ['React', 'Node.js', 'Supabase', 'AI APIs', 'Document Processing', 'Real Terminal', 'Crypto Payments'],
    challenge: 'Create a comprehensive productivity suite with AI-powered document processing, real terminal functionality, university application assistance, and cryptocurrency payments.',
    solution: 'Built an integrated platform featuring AI document conversion, real terminal capabilities, university application tools, and crypto payment processing with subscription management.',
    results: [
      'AI-powered document conversion and summarization',
      'Real terminal functionality for development workflows',
      'University application assistance with AI guidance',
      'Cryptocurrency payment integration',
      'Advanced subscription and user management',
      'Knowledge base with South African university data'
    ],
    metrics: {
      'AI Tools': '5+',
      'Document Types': '10+',
      'Universities': '26',
      'Payment Methods': '3'
    },
    featured: true,
    image: '/entropysuite.png'
  }
];

export default function CaseStudiesPage() {
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<typeof caseStudies[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (study: typeof caseStudies[0]) => {
    setSelectedCaseStudy(study);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCaseStudy(null);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start pb-24">
      {/* Hero Section */}
      <section className="w-full pt-24 sm:pt-32 px-4 flex justify-center mb-16">
        <div className="max-w-4xl w-full text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-orange-600 to-orange-400 rounded-2xl mr-4 shadow-lg">
              <Layers className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold accent">Project Case Studies</h1>
          </div>
          <p className="text-xl text-black mb-4 max-w-3xl mx-auto">
            Deep dives into complex projects showcasing technical expertise and problem-solving
          </p>
          <p className="text-base text-zinc-700 max-w-2xl mx-auto">
            Explore detailed breakdowns of challenging projects, from Earth2 metaverse platforms to enterprise AI solutions.
          </p>
        </div>
      </section>

      {/* Featured Case Studies */}
      <section className="w-full px-4 flex justify-center">
        <div className="max-w-7xl w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {caseStudies.map((study) => (
              <article key={study.id} className="glass shadow-xl border border-orange-900/20 hover:shadow-2xl transition-all group">
                <div className="p-6">
                  {/* Header */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                        {study.category}
                      </span>
                      {study.featured && (
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          Featured
                        </span>
                      )}
                    </div>

                    <div className="relative h-32 mb-3 overflow-hidden rounded-lg">
                      <Image
                        src={study.image}
                        alt={study.title}
                        fill
                        className="object-cover transition-all group-hover:scale-105"
                      />
                    </div>

                    <h3 className="text-lg font-bold accent mb-2 group-hover:text-orange-700 transition-colors line-clamp-2">
                      {study.title}
                    </h3>

                    <div className="flex items-center gap-4 text-sm text-zinc-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {study.client}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {study.duration}
                      </div>
                    </div>
                  </div>

                  {/* Brief Description */}
                  <div className="mb-4">
                    <p className="text-sm text-zinc-700 leading-relaxed line-clamp-3">{study.challenge}</p>
                  </div>

                  {/* Key Results Preview */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-semibold text-zinc-900">Key Results</span>
                    </div>
                    <ul className="space-y-1">
                      {study.results.slice(0, 2).map((result, index) => (
                        <li key={index} className="flex items-start text-xs text-zinc-600">
                          <CheckCircle2 className="h-3 w-3 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-1">{result}</span>
                        </li>
                      ))}
                      {study.results.length > 2 && (
                        <li className="text-xs text-zinc-500 ml-5">+{study.results.length - 2} more results</li>
                      )}
                    </ul>
                  </div>

                  {/* Technologies Preview */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {study.technologies.slice(0, 3).map((tech) => (
                        <span key={tech} className="px-2 py-1 bg-zinc-100 text-zinc-700 rounded text-xs">
                          {tech}
                        </span>
                      ))}
                      {study.technologies.length > 3 && (
                        <span className="px-2 py-1 bg-zinc-100 text-zinc-500 rounded text-xs">
                          +{study.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => openModal(study)}
                    className="w-full btn-primary px-4 py-2 !text-white !bg-[#d17927] hover:!bg-orange-700 transition-all inline-flex items-center justify-center group text-sm"
                  >
                    Read Full Case Study <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Newsletter CTA */}
          <div className="mt-16">
            <NewsletterSignup
              title="Want to See More Case Studies?"
              description="Get notified when I publish detailed breakdowns of complex projects and technical challenges overcome."
              variant="hero"
            />
          </div>
        </div>
      </section>

      {/* Modal */}
      <ContentModal
        content={selectedCaseStudy ? { ...selectedCaseStudy, type: 'case-study' as const } : null}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </main>
  );
}
