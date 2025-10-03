'use client';

import { X, Calendar, Clock, Users, TrendingUp, Code, ExternalLink, Layers, Database, Globe, Cpu } from 'lucide-react';
import Image from 'next/image';

interface BaseContent {
  id: string;
  title: string;
  image: string;
}

interface CaseStudyContent extends BaseContent {
  type: 'case-study';
  category: string;
  client: string;
  duration: string;
  team: string;
  technologies: string[];
  challenge: string;
  solution: string;
  results: string[];
  metrics: Record<string, string | undefined>;
  featured: boolean;
}

interface BlogContent extends BaseContent {
  type: 'blog';
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  featured: boolean;
  fullContent?: string; // For the full blog post content
}

type Content = CaseStudyContent | BlogContent;

interface ContentModalProps {
  content: Content | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ContentModal({ content, isOpen, onClose }: ContentModalProps) {
  if (!isOpen || !content) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#e7dbc8] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl border border-orange-900/20">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-[#e7dbc8]/80 hover:bg-[#e7dbc8] rounded-full shadow-lg transition-colors border border-orange-900/20"
        >
          <X className="h-5 w-5 text-zinc-600" />
        </button>

        {/* Header Image */}
        <div className="relative h-64 md:h-80 rounded-t-2xl overflow-hidden">
          <Image
            src={content.image}
            alt={content.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                {content.type === 'case-study' ? content.category : content.category}
              </span>
              {content.featured && (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Featured
                </span>
              )}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {content.title}
            </h2>
            {content.type === 'blog' && (
              <div className="flex items-center gap-4 text-sm text-white/80">
                <span>{content.author}</span>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(content.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {content.readTime}
                </div>
              </div>
            )}
            {content.type === 'case-study' && (
              <div className="flex items-center gap-4 text-sm text-white/80">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {content.client}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {content.duration}
                </div>
                <div className="flex items-center gap-1">
                  <Code className="h-4 w-4" />
                  {content.team}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          {content.type === 'case-study' ? (
            <CaseStudyContent content={content} />
          ) : (
            <BlogContent content={content} />
          )}
        </div>
      </div>
    </div>
  );
}

function CaseStudyContent({ content }: { content: CaseStudyContent }) {
  return (
    <div className="space-y-8">
      {/* Challenge & Solution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-bold text-zinc-900 mb-4 flex items-center">
            <div className="w-2 h-2 bg-orange-600 rounded-full mr-3" />
            Challenge
          </h3>
          <p className="text-zinc-700 leading-relaxed">{content.challenge}</p>
        </div>
        <div>
          <h3 className="text-xl font-bold text-zinc-900 mb-4 flex items-center">
            <div className="w-2 h-2 bg-green-600 rounded-full mr-3" />
            Solution
          </h3>
          <p className="text-zinc-700 leading-relaxed">{content.solution}</p>
        </div>
      </div>

      {/* Key Features & Capabilities */}
      <div>
        <h3 className="text-xl font-bold text-zinc-900 mb-4 flex items-center">
          <Layers className="h-5 w-5 mr-3 text-purple-600" />
          Key Features & Capabilities
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {content.results.map((result, index) => (
            <div key={index} className="flex items-start">
              <div className="w-2 h-2 bg-green-600 rounded-full mr-3 mt-2 flex-shrink-0" />
              <span className="text-zinc-700">{result}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Architecture */}
      <div>
        <h3 className="text-xl font-bold text-zinc-900 mb-4 flex items-center">
          <Database className="h-5 w-5 mr-3 text-blue-600" />
          Technical Architecture
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-zinc-900 mb-2">Frontend Stack</h4>
            <ul className="space-y-1 text-zinc-700">
              <li>• Next.js 14 with App Router</li>
              <li>• React 18 with TypeScript</li>
              <li>• Tailwind CSS for styling</li>
              <li>• Progressive Web App (PWA)</li>
              <li>• Real-time WebSocket connections</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-zinc-900 mb-2">Backend & Infrastructure</h4>
            <ul className="space-y-1 text-zinc-700">
              <li>• Supabase for database & auth</li>
              <li>• PostgreSQL with Prisma ORM</li>
              <li>• 17+ API integrations</li>
              <li>• Redis for caching</li>
              <li>• Multi-tenant architecture</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Hub-Specific Features */}
      <div>
        <h3 className="text-xl font-bold text-zinc-900 mb-4 flex items-center">
          <Globe className="h-5 w-5 mr-3 text-indigo-600" />
          Specialized Hub Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-lg p-4 border border-sky-200">
            <h4 className="font-semibold text-zinc-900 mb-2 text-sky-800">Portfolio Advisor</h4>
            <p className="text-sm text-zinc-700">AI-powered analysis with smart buy/sell/hold recommendations</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-lg p-4 border border-emerald-200">
            <h4 className="font-semibold text-zinc-900 mb-2 text-emerald-800">Essence Tracker</h4>
            <p className="text-sm text-zinc-700">Real-time price tracking, wallet analytics, and market insights</p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-200">
            <h4 className="font-semibold text-zinc-900 mb-2 text-amber-800">Minerals Explorer</h4>
            <p className="text-sm text-zinc-700">Geological data, mineral deposits, and prospecting tools</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-200">
            <h4 className="font-semibold text-zinc-900 mb-2 text-purple-800">Social Hub</h4>
            <p className="text-sm text-zinc-700">Community features with posts, comments, and live chat</p>
          </div>
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg p-4 border border-teal-200">
            <h4 className="font-semibold text-zinc-900 mb-2 text-teal-800">Leaderboards</h4>
            <p className="text-sm text-zinc-700">Comprehensive rankings for players and countries</p>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg p-4 border border-gray-200">
            <h4 className="font-semibold text-zinc-900 mb-2 text-gray-800">Logistics Planner</h4>
            <p className="text-sm text-zinc-700">Visual property management and optimal route planning</p>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div>
        <h3 className="text-xl font-bold text-zinc-900 mb-4">Project Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(content.metrics).map(([key, value]) => (
            value ? (
              <div key={key} className="bg-orange-50 rounded-lg p-4 text-center border border-orange-200">
                <div className="text-2xl font-bold text-orange-600 mb-1">{value}</div>
                <div className="text-sm text-zinc-600">{key}</div>
              </div>
            ) : null
          ))}
        </div>
      </div>

      {/* Technologies */}
      <div>
        <h3 className="text-xl font-bold text-zinc-900 mb-4">Technologies Used</h3>
        <div className="flex flex-wrap gap-2">
          {content.technologies.map((tech) => (
            <span key={tech} className="px-3 py-2 bg-zinc-100 text-zinc-700 rounded-lg text-sm border border-zinc-200">
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Development Process */}
      <div>
        <h3 className="text-xl font-bold text-zinc-900 mb-4 flex items-center">
          <Cpu className="h-5 w-5 mr-3 text-indigo-600" />
          Development Process
        </h3>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-1">1</div>
            <div>
              <h4 className="font-semibold text-zinc-900">Planning & Architecture</h4>
              <p className="text-zinc-700">Designed microservices architecture and 13-hub structure</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-1">2</div>
            <div>
              <h4 className="font-semibold text-zinc-900">Core Development</h4>
              <p className="text-zinc-700">Built foundational features including authentication and basic data management</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-1">3</div>
            <div>
              <h4 className="font-semibold text-zinc-900">API Integration</h4>
              <p className="text-zinc-700">Implemented 17+ API connections with error handling and rate limiting</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-1">4</div>
            <div>
              <h4 className="font-semibold text-zinc-900">Real-time Features</h4>
              <p className="text-zinc-700">Added WebSocket connections for live data and chat functionality</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-1">5</div>
            <div>
              <h4 className="font-semibold text-zinc-900">AI Integration</h4>
              <p className="text-zinc-700">Integrated AI for portfolio analysis and smart recommendations</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-1">6</div>
            <div>
              <h4 className="font-semibold text-zinc-900">Testing & Deployment</h4>
              <p className="text-zinc-700">Comprehensive testing and deployment with monitoring and analytics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BlogContent({ content }: { content: BlogContent }) {
  return (
    <div className="space-y-6">
      <div className="prose prose-zinc max-w-none">
        <p className="text-lg text-zinc-700 leading-relaxed mb-6">
          {content.excerpt}
        </p>

        {/* Earthie Platform Case Study Content */}
        {content.id === 'earth2-platform-case-study' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">Project Overview</h2>
              <p className="text-zinc-700 leading-relaxed mb-4">
                The Earthie platform represents a comprehensive solution for Earth2 metaverse enthusiasts, providing 13 specialized hubs that cater to every aspect of the Earth2 experience. From real-time Essence price tracking to AI-powered portfolio analysis, this platform transforms how users interact with the metaverse.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">Technical Architecture</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                  <h3 className="text-lg font-semibold text-zinc-900 mb-3 flex items-center">
                    <Database className="h-5 w-5 mr-2 text-blue-600" />
                    Backend Infrastructure
                  </h3>
                  <ul className="space-y-2 text-zinc-700">
                    <li>• Supabase for database and authentication</li>
                    <li>• PostgreSQL with Prisma ORM</li>
                    <li>• 17+ API integrations</li>
                    <li>• Real-time WebSocket connections</li>
                    <li>• Multi-tenant architecture</li>
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                  <h3 className="text-lg font-semibold text-zinc-900 mb-3 flex items-center">
                    <Code className="h-5 w-5 mr-2 text-green-600" />
                    Frontend Stack
                  </h3>
                  <ul className="space-y-2 text-zinc-700">
                    <li>• Next.js 14 with App Router</li>
                    <li>• React 18 with TypeScript</li>
                    <li>• Tailwind CSS for styling</li>
                    <li>• Progressive Web App (PWA)</li>
                    <li>• Real-time data visualization</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">API Integrations & External Services</h2>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-zinc-900 mb-3">Earth2 Ecosystem APIs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-200">
                    <h4 className="font-semibold text-zinc-900 mb-2 text-purple-800">Property & Marketplace APIs</h4>
                    <p className="text-sm text-zinc-700">Real-time property data, marketplace listings, transaction history, and land ownership information</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
                    <h4 className="font-semibold text-zinc-900 mb-2 text-blue-800">Leaderboard APIs</h4>
                    <p className="text-sm text-zinc-700">Player rankings, country statistics, and competitive metrics across 195+ countries</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-zinc-900 mb-3">Financial & Blockchain APIs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-200">
                    <h4 className="font-semibold text-zinc-900 mb-2 text-orange-800">Moralis API</h4>
                    <p className="text-sm text-zinc-700">Real-time Essence token price data, blockchain analytics, and wallet balance tracking</p>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg p-4 border border-emerald-200">
                    <h4 className="font-semibold text-zinc-900 mb-2 text-emerald-800">GoldRush.dev API</h4>
                    <p className="text-sm text-zinc-700">Historical pricing data, market trends, and advanced financial analytics</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-zinc-900 mb-3">Geospatial & Location Services</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                    <h4 className="font-semibold text-zinc-900 mb-2 text-green-800">Overpass API</h4>
                    <p className="text-sm text-zinc-700">OpenStreetMap data for location-based services, amenities, and geographical features</p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
                    <h4 className="font-semibold text-zinc-900 mb-2 text-yellow-800">Nominatim API</h4>
                    <p className="text-sm text-zinc-700">Geocoding and reverse geocoding for location search and place identification</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-zinc-900 mb-3">AI & Intelligence Services</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg p-4 border border-pink-200">
                    <h4 className="font-semibold text-zinc-900 mb-2 text-pink-800">Google Gemini AI</h4>
                    <p className="text-sm text-zinc-700">Advanced AI for portfolio analysis, smart recommendations, and natural language processing</p>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
                    <h4 className="font-semibold text-zinc-900 mb-2 text-indigo-800">Location Search Engine</h4>
                    <p className="text-sm text-zinc-700">AI-powered search combining Earth2 data with real-world geographical information</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-zinc-900 mb-3">Geological & Mining Data</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-200">
                    <h4 className="font-semibold text-zinc-900 mb-2 text-amber-800">USGS Mineral Resources</h4>
                    <p className="text-sm text-zinc-700">Comprehensive mineral deposit data, critical minerals, and geological surveys</p>
                  </div>
                  <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-lg p-4 border border-slate-200">
                    <h4 className="font-semibold text-zinc-900 mb-2 text-slate-800">Global Energy Monitor</h4>
                    <p className="text-sm text-zinc-700">World oil and gas field data and energy infrastructure information</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-zinc-900 mb-3">Media & Social Integration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg p-4 border border-red-200">
                    <h4 className="font-semibold text-zinc-900 mb-2 text-red-800">YouTube API</h4>
                    <p className="text-sm text-zinc-700">Video content integration for location-based educational content</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-200">
                    <h4 className="font-semibold text-zinc-900 mb-2 text-purple-800">Twitch API</h4>
                    <p className="text-sm text-zinc-700">Live streaming integration for community events and gaming content</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-zinc-900 mb-3">Mapping & Visualization</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg p-4 border border-emerald-200">
                    <h4 className="font-semibold text-zinc-900 mb-2 text-emerald-800">Leaflet Maps</h4>
                    <p className="text-sm text-zinc-700">Interactive mapping with custom layers, markers, and geospatial visualization</p>
                  </div>
                  <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg p-4 border border-cyan-200">
                    <h4 className="font-semibold text-zinc-900 mb-2 text-cyan-800">Three.js Globe</h4>
                    <p className="text-sm text-zinc-700">3D globe visualization for global Earth2 property and resource data</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">13 Specialized Hubs</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-lg p-4 border border-sky-200">
                  <h4 className="font-semibold text-zinc-900 mb-2 text-sky-800">Portfolio Advisor</h4>
                  <p className="text-sm text-zinc-700">AI-powered analysis with smart buy/sell/hold recommendations</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-lg p-4 border border-emerald-200">
                  <h4 className="font-semibold text-zinc-900 mb-2 text-emerald-800">Essence Tracker</h4>
                  <p className="text-sm text-zinc-700">Real-time price tracking, wallet analytics, and market insights</p>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-200">
                  <h4 className="font-semibold text-zinc-900 mb-2 text-amber-800">Minerals Explorer</h4>
                  <p className="text-sm text-zinc-700">Geological data, mineral deposits, and prospecting tools</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-200">
                  <h4 className="font-semibold text-zinc-900 mb-2 text-purple-800">Social Hub (Lobbyist)</h4>
                  <p className="text-sm text-zinc-700">Community features with posts, comments, live chat, and social networking</p>
                </div>
                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg p-4 border border-teal-200">
                  <h4 className="font-semibold text-zinc-900 mb-2 text-teal-800">Leaderboards</h4>
                  <p className="text-sm text-zinc-700">Comprehensive rankings for players and countries across multiple metrics</p>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold text-zinc-900 mb-2 text-gray-800">Logistics Planner</h4>
                  <p className="text-sm text-zinc-700">Visual property management and optimal route planning</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
                  <h4 className="font-semibold text-zinc-900 mb-2 text-indigo-800">Location Search Engine</h4>
                  <p className="text-sm text-zinc-700">AI-powered search combining Earth2 data with real-world geographical information</p>
                </div>
                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg p-4 border border-cyan-200">
                  <h4 className="font-semibold text-zinc-900 mb-2 text-cyan-800">Market Analysis Terminal</h4>
                  <p className="text-sm text-zinc-700">Trading-style market floors, country analytics, and real-time charts</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                  <h4 className="font-semibold text-zinc-900 mb-2 text-green-800">Watchlists</h4>
                  <p className="text-sm text-zinc-700">Save areas and monitor signals, resources, and news</p>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
                  <h4 className="font-semibold text-zinc-900 mb-2 text-yellow-800">Know Your Land</h4>
                  <p className="text-sm text-zinc-700">Explore detailed information and insights about your land assets</p>
                </div>
                <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg p-4 border border-pink-200">
                  <h4 className="font-semibold text-zinc-900 mb-2 text-pink-800">E2Pedia</h4>
                  <p className="text-sm text-zinc-700">Access Earth2 announcements and comprehensive knowledge base</p>
                </div>
                <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-lg p-4 border border-slate-200">
                  <h4 className="font-semibold text-zinc-900 mb-2 text-slate-800">User Profile</h4>
                  <p className="text-sm text-zinc-700">View and manage your linked Earth2 profile and properties</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-lg p-4 border border-violet-200">
                  <h4 className="font-semibold text-zinc-900 mb-2 text-violet-800">Settings & Subscription</h4>
                  <p className="text-sm text-zinc-700">Manage membership, billing, wallet addresses, and platform preferences</p>
                </div>
                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg p-4 border border-teal-200">
                  <h4 className="font-semibold text-zinc-900 mb-2 text-teal-800">Advanced Analytics</h4>
                  <p className="text-sm text-zinc-700">Comprehensive data analysis and visualization across all Earth2 metrics</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">Key Achievements</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-3 mt-2 flex-shrink-0" />
                  <span className="text-zinc-700">Successfully integrated 17+ different APIs for comprehensive Earth2 data coverage</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-3 mt-2 flex-shrink-0" />
                  <span className="text-zinc-700">Built 13 specialized hubs addressing every major Earth2 use case</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-3 mt-2 flex-shrink-0" />
                  <span className="text-zinc-700">Implemented AI-powered portfolio advisor with real-time recommendations</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-3 mt-2 flex-shrink-0" />
                  <span className="text-zinc-700">Created real-time Essence price tracking with historical analytics</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-3 mt-2 flex-shrink-0" />
                  <span className="text-zinc-700">Developed comprehensive leaderboards for 195+ countries</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-3 mt-2 flex-shrink-0" />
                  <span className="text-zinc-700">Built advanced geospatial analysis for minerals and logistics planning</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-3 mt-2 flex-shrink-0" />
                  <span className="text-zinc-700">Created intelligent Location Search Engine with AI-powered queries</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-3 mt-2 flex-shrink-0" />
                  <span className="text-zinc-700">Developed full-featured social platform with posts, reactions, and live streaming</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-3 mt-2 flex-shrink-0" />
                  <span className="text-zinc-700">Implemented trading-style market terminal with real-time charts and analytics</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-3 mt-2 flex-shrink-0" />
                  <span className="text-zinc-700">Achieved 99.9% uptime with robust error handling and monitoring</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">Development Challenges & Solutions</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900 mb-2">Multi-API Rate Limiting & Error Handling</h3>
                  <p className="text-zinc-700">Implemented sophisticated retry logic with exponential backoff, circuit breaker patterns, and intelligent failover across 17+ APIs including Earth2, Moralis, GoldRush, Overpass, and Google services. Built custom middleware to handle rate limits, timeouts, and service degradation gracefully.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900 mb-2">Real-time Data Synchronization</h3>
                  <p className="text-zinc-700">Architected WebSocket infrastructure for live updates across multiple data sources including Essence prices, Earth2 market data, and user activities. Implemented efficient pub/sub patterns and optimized data structures to handle 100,000+ data points without performance degradation.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900 mb-2">Complex Multi-Hub State Management</h3>
                  <p className="text-zinc-700">Designed a robust state management system using React Context and custom hooks to handle complex interactions between 13 specialized hubs. Implemented data caching, optimistic updates, and conflict resolution for seamless user experience across different Earth2 domains.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900 mb-2">AI Integration & Natural Language Processing</h3>
                  <p className="text-zinc-700">Integrated Google Gemini AI for portfolio analysis and location search capabilities. Built natural language processing for the Location Search Engine (LSE) that can understand complex queries and provide intelligent responses based on Earth2 context and real-world data.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900 mb-2">Geospatial Data Processing</h3>
                  <p className="text-zinc-700">Implemented complex geospatial algorithms for mineral prospecting, logistics planning, and location-based services. Used Overpass API integration with custom spatial queries and Haversine distance calculations for accurate proximity-based features.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-6 border border-orange-200">
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">Impact & Results</h2>
              <p className="text-zinc-700 leading-relaxed">
                The Earthie platform has revolutionized how Earth2 users interact with the metaverse, providing comprehensive tools that were previously scattered across multiple platforms. By centralizing 13 specialized hubs into a single, cohesive experience, users can now access everything they need in one place, from portfolio management to social interaction to market analysis.
              </p>
              <p className="text-zinc-700 leading-relaxed mt-4">
                The platform's success is evidenced by its 1,000+ active users, 100,000+ data points tracked daily, and 99.9% uptime, making it a reliable and essential tool for serious Earth2 participants.
              </p>
            </div>
          </div>
        )}

        {/* AI Tools Revolution Blog Content */}
        {content.id === 'ai-accelerated-development' && (
          <div className="space-y-8">
            <div className="prose prose-zinc max-w-none">
              <p className="text-lg text-zinc-700 leading-relaxed mb-6">
                Web development used to be this grind where you'd spend hours just setting up environments, writing boilerplate code, debugging endlessly, and searching StackOverflow for that one missing semicolon. Things have changed - and honestly, they're changing faster than most of us can even keep up with. AI tools are at the center of that change, and if you're a dev or just someone curious about tech, you've probably already felt the shift.
              </p>

              <p className="text-zinc-700 leading-relaxed mb-6">
                I'm not talking about some sci-fi "AI builds entire websites by itself" hype. I mean practical, right-now tools that are streamlining the boring parts, accelerating the creative flow, and cutting weeks of dev time into days.
              </p>

              <p className="text-zinc-700 leading-relaxed mb-6">
                Let's break it down.
              </p>

              <h2 className="text-2xl font-bold text-zinc-900 mb-4 mt-8">1. From Boilerplate to Custom in Seconds</h2>
              <p className="text-zinc-700 leading-relaxed mb-6">
                Remember how setting up a React app, or even a vanilla HTML/CSS/JS project, used to mean copying the same starter template for the 100th time? AI has basically killed that routine. You can literally prompt an AI assistant with: <em>"Give me a landing page with a navbar, hero section, and contact form using TailwindCSS"</em> - and boom, it's there.
              </p>
              <p className="text-zinc-700 leading-relaxed mb-6">
                That's not just saving 15 minutes; it's saving the mental energy you'd waste repeating yourself. The real win? You can jump straight into customizing and refining. Instead of starting at zero, you're starting at 60% done.
              </p>

              <h2 className="text-2xl font-bold text-zinc-900 mb-4 mt-8">2. Debugging Is Less of a Nightmare</h2>
              <p className="text-zinc-700 leading-relaxed mb-6">
                This one's huge. Debugging used to mean trial and error until your eyes bled. Now you can paste an error log into an AI tool, and it will not only tell you what's wrong but also <em>why</em>.
              </p>
              <p className="text-zinc-700 leading-relaxed mb-6">
                AI doesn't just point out the bug; it often generates the fix. And even if it doesn't nail it 100%, it's enough to push you in the right direction. That kind of speed is a game-changer when you're working on deadlines or juggling multiple projects.
              </p>

              <h2 className="text-2xl font-bold text-zinc-900 mb-4 mt-8">3. Learning on the Fly</h2>
              <p className="text-zinc-700 leading-relaxed mb-6">
                One thing I've noticed: AI is basically replacing the "junior developer who asks a lot of questions." Don't know how to connect a Next.js project to a database? Instead of digging through outdated docs, you can ask AI and get a working snippet in seconds.
              </p>
              <p className="text-zinc-700 leading-relaxed mb-6">
                This doesn't mean you stop learning. If anything, it speeds up how you absorb concepts because you're applying them directly, not just memorizing. It's like having a mentor who never sleeps.
              </p>

              <h2 className="text-2xl font-bold text-zinc-900 mb-4 mt-8">4. Content + Code = Faster Delivery</h2>
              <p className="text-zinc-700 leading-relaxed mb-6">
                Web dev isn't just code - it's content too. Whether you're filling placeholders with blog posts, product descriptions, or even SEO meta tags, AI tools make content generation almost instant.
              </p>
              <p className="text-zinc-700 leading-relaxed mb-6">
                That combo - AI handling both design/code scaffolding and content - means a single dev can now produce what used to require a small team. That's crazy power in one person's hands.
              </p>

              <h2 className="text-2xl font-bold text-zinc-900 mb-4 mt-8">5. Collaboration & Version Control Evolved</h2>
              <p className="text-zinc-700 leading-relaxed mb-6">
                Even collab tools like GitHub are leaning hard into AI. GitHub Copilot, for example, doesn't just autocomplete code; it predicts entire functions, suggests tests, and adapts to your coding style. Pair that with tools like ChatGPT, and suddenly, "pair programming" feels less like a buzzword and more like your daily reality.
              </p>
              <p className="text-zinc-700 leading-relaxed mb-6">
                The result? Teams spend less time debating syntax and more time on actual strategy and user experience.
              </p>

              <h2 className="text-2xl font-bold text-zinc-900 mb-4 mt-8">6. Speed Doesn't Mean Laziness</h2>
              <p className="text-zinc-700 leading-relaxed mb-6">
                I know some people worry: "If AI is doing the heavy lifting, are we just getting lazy as devs?" I don't buy that. Speed doesn't equal laziness - it equals freedom.
              </p>
              <p className="text-zinc-700 leading-relaxed mb-6">
                You're freeing yourself from repetitive grunt work so you can focus on logic, problem-solving, and creativity. AI isn't replacing the craft; it's removing the bottlenecks that made coding frustrating in the first place.
              </p>

              <h2 className="text-2xl font-bold text-zinc-900 mb-4 mt-8">7. The Bigger Picture: Democratizing Development</h2>
              <p className="text-zinc-700 leading-relaxed mb-6">
                The speed boost AI gives isn't just about making pros faster. It's also lowering the barrier for beginners. Someone with basic HTML knowledge can now spin up something functional and polished without months of study.
              </p>
              <p className="text-zinc-700 leading-relaxed mb-6">
                That democratization means more voices in tech, more small businesses building their own platforms, and more innovation from unexpected places. That's the revolution.
              </p>

              <h2 className="text-2xl font-bold text-zinc-900 mb-4 mt-8">Final Thoughts</h2>
              <p className="text-zinc-700 leading-relaxed mb-6">
                AI in web development isn't about pressing a button and watching a website magically appear. It's about augmenting your workflow so you spend less time stuck and more time building.
              </p>
              <p className="text-zinc-700 leading-relaxed mb-6">
                From boilerplate generation, bug fixes, and live learning, to handling content and collaboration, AI tools are making development faster, smarter, and honestly - more fun.
              </p>
              <p className="text-zinc-700 leading-relaxed mb-6">
                If you're a dev and you're not already leaning into these tools, you're basically running with weights tied to your legs while everyone else is in a sports car. The speed difference is real.
              </p>
              <p className="text-zinc-700 leading-relaxed mb-6">
                The question isn't <em>"Will AI change web development?"</em> - it already has. The real question is: are you adapting fast enough?
              </p>
            </div>
          </div>
        )}

        {/* Modern Backend Architecture Blog Content */}
        {content.id === 'modern-backend-architecture' && (
          <div className="space-y-8">
            <div className="prose prose-zinc max-w-none">
              <p className="text-lg text-zinc-700 leading-relaxed mb-6">
                When people talk about "scalability," it often sounds like this vague buzzword. But if you've ever actually built something that users *touch* - even a small app - you know how real the struggle is. At first, everything works fine when it's just you testing locally. Then, you push to production, a couple dozen users hit the app at the same time, and suddenly you're staring at errors, slow queries, and a backend that feels like it's held together with tape.
              </p>

              <p className="text-zinc-700 leading-relaxed mb-6">
                That's why modern backend architecture matters. It's not just about servers and databases anymore; it's about building systems that grow with demand, stay reliable, and don't buckle under pressure.
              </p>

              <p className="text-zinc-700 leading-relaxed mb-6">
                Let's unpack what "modern" looks like.
              </p>

              <h2 className="text-2xl font-bold text-zinc-900 mb-4 mt-8">1. The Shift from Monolith to Microservices</h2>
              <p className="text-zinc-700 leading-relaxed mb-6">
                The old-school way: you build one giant application. Everything - user auth, payments, notifications, content management - sits inside a single codebase. It's simple at first, but as soon as you scale, the cracks show. Deployments take forever, one bug can break the entire app, and scaling means throwing more power at the whole thing even if only one part (say, image processing) is the bottleneck.
              </p>
              <p className="text-zinc-700 leading-relaxed mb-6">
                Modern backends lean toward **microservices**. Break the app down into smaller, independent services:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-zinc-700">
                <li>A service for authentication</li>
                <li>A service for billing</li>
                <li>A service for analytics</li>
              </ul>
              <p className="text-zinc-700 leading-relaxed mb-6">
                Each runs separately, communicates over APIs, and can scale on its own.
              </p>
              <p className="text-zinc-700 leading-relaxed mb-6">
                This modularity is what lets giants like Netflix, Uber, and Amazon scale without collapsing. But it's not just for billion-dollar companies - even mid-sized apps benefit.
              </p>

              <h2 className="text-2xl font-bold text-zinc-900 mb-4 mt-8">2. APIs as the Backbone</h2>
              <p className="text-zinc-700 leading-relaxed mb-6">
                APIs are no longer just "nice to have." They're the **nervous system** of modern apps. REST was the standard for years, and it still works, but many teams are shifting toward **GraphQL** or even event-driven APIs.
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-zinc-700">
                <li><strong>REST</strong> - Simple, widely supported, great for CRUD.</li>
                <li><strong>GraphQL</strong> - Efficient queries, clients get exactly what they need.</li>
                <li><strong>gRPC</strong> - High performance, binary communication, often used between microservices.</li>
              </ul>
              <p className="text-zinc-700 leading-relaxed mb-6">
                In scalable backends, APIs aren't just endpoints; they're contracts. They define how services talk to each other, making the architecture flexible enough to swap out or upgrade components without breaking everything.
              </p>

              <h2 className="text-2xl font-bold text-zinc-900 mb-4 mt-8">3. Databases: Beyond Just SQL vs NoSQL</h2>
              <p className="text-zinc-700 leading-relaxed mb-6">
                Data is where apps live or die. If your database can't scale, neither can your app.
              </p>
              <p className="text-zinc-700 leading-relaxed mb-6">
                Modern backends usually mix and match:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-zinc-700">
                <li><strong>SQL (Postgres, MySQL, MariaDB)</strong> - Strong consistency, great for structured data.</li>
                <li><strong>NoSQL (MongoDB, DynamoDB, Couchbase)</strong> - Flexible schemas, perfect for massive scale and high read/write loads.</li>
                <li><strong>In-memory databases (Redis, Memcached)</strong> - Caching, session storage, real-time speed boosts.</li>
              </ul>
              <p className="text-zinc-700 leading-relaxed mb-6">
                A scalable backend isn't about choosing one - it's about using the right database for the right job. For example, user profiles in SQL, logs in NoSQL, and hot data in Redis.
              </p>

              <h2 className="text-2xl font-bold text-zinc-900 mb-4 mt-8">4. Event-Driven Architectures</h2>
              <p className="text-zinc-700 leading-relaxed mb-6">
                Here's where things start to feel "modern." Instead of services constantly polling each other, apps now fire **events**.
              </p>
              <p className="text-zinc-700 leading-relaxed mb-6">
                Think: <em>"User signed up."</em> That single event can trigger multiple things at once:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-zinc-700">
                <li>Send a welcome email</li>
                <li>Start a trial subscription</li>
                <li>Log analytics</li>
                <li>Push a notification to the dashboard</li>
              </ul>
              <p className="text-zinc-700 leading-relaxed mb-6">
                This is handled by message queues like **Kafka, RabbitMQ, or AWS SQS**. Event-driven setups are scalable because they decouple services - no one's waiting on anyone else, and workloads can be processed asynchronously.
              </p>

              <h2 className="text-2xl font-bold text-zinc-900 mb-4 mt-8">5. Containers & Orchestration</h2>
              <p className="text-zinc-700 leading-relaxed mb-6">
                Remember when you had to configure servers manually? Modern backend development basically said, "nah, too slow."
              </p>
              <p className="text-zinc-700 leading-relaxed mb-6">
                Enter **containers (Docker)** - portable, lightweight environments where your app runs consistently everywhere. But with scale comes the chaos of managing dozens (or hundreds) of containers. That's where **Kubernetes** steps in.
              </p>
              <p className="text-zinc-700 leading-relaxed mb-6">
                K8s automates:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-zinc-700">
                <li>Scaling services up/down</li>
                <li>Load balancing</li>
                <li>Self-healing (if a container dies, it restarts automatically)</li>
              </ul>
              <p className="text-zinc-700 leading-relaxed mb-6">
                This combo is a cornerstone of modern backend setups.
              </p>

              <h2 className="text-2xl font-bold text-zinc-900 mb-4 mt-8">6. Security at Scale</h2>
              <p className="text-zinc-700 leading-relaxed mb-6">
                When you're small, security feels like an afterthought. But at scale, it's make-or-break.
              </p>
              <p className="text-zinc-700 leading-relaxed mb-6">
                Modern backends integrate security from the ground up:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-zinc-700">
                <li><strong>API gateways</strong> (like Kong, NGINX, or AWS API Gateway) for authentication and rate limiting</li>
                <li><strong>Zero-trust models</strong> (every service must authenticate, even internally)</li>
                <li><strong>Token-based auth</strong> (JWT, OAuth2)</li>
                <li><strong>Secrets management</strong> (Vault, AWS Secrets Manager)</li>
              </ul>
              <p className="text-zinc-700 leading-relaxed mb-6">
                Because the bigger you get, the more attractive you are to attackers.
              </p>

              <h2 className="text-2xl font-bold text-zinc-900 mb-4 mt-8">7. Observability: Logs, Metrics, Traces</h2>
              <p className="text-zinc-700 leading-relaxed mb-6">
                You can't scale what you can't see. Observability is non-negotiable in modern architecture.
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-zinc-700">
                <li><strong>Logging</strong> - Centralized logs (ELK stack, Datadog) to trace errors.</li>
                <li><strong>Metrics</strong> - Real-time health stats (Prometheus, Grafana).</li>
                <li><strong>Tracing</strong> - See requests flow across microservices (Jaeger, OpenTelemetry).</li>
              </ul>
              <p className="text-zinc-700 leading-relaxed mb-6">
                These aren't extras. Without observability, scaling is like driving a car at 200km/h with your eyes closed.
              </p>

              <h2 className="text-2xl font-bold text-zinc-900 mb-4 mt-8">8. Cloud-Native Everything</h2>
              <p className="text-zinc-700 leading-relaxed mb-6">
                Modern backends are born in the cloud. Whether it's AWS, GCP, Azure, or newer players like DigitalOcean, cloud platforms handle the heavy lifting: auto-scaling, managed databases, serverless functions, and global CDNs.
              </p>
              <p className="text-zinc-700 leading-relaxed mb-6">
                And speaking of **serverless** - that's another piece of the puzzle. Functions-as-a-Service (like AWS Lambda, Vercel Functions, Cloudflare Workers) let you scale specific workloads without managing servers at all. Perfect for event-driven use cases or unpredictable traffic spikes.
              </p>

              <h2 className="text-2xl font-bold text-zinc-900 mb-4 mt-8">9. CI/CD and Automation</h2>
              <p className="text-zinc-700 leading-relaxed mb-6">
                Scalable apps need scalable deployments. Manual pushes to production won't cut it anymore.
              </p>
              <p className="text-zinc-700 leading-relaxed mb-6">
                CI/CD pipelines (Jenkins, GitHub Actions, GitLab CI) automate:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-zinc-700">
                <li>Testing</li>
                <li>Building</li>
                <li>Deployments</li>
              </ul>
              <p className="text-zinc-700 leading-relaxed mb-6">
                This keeps the system fast, reduces downtime, and ensures that scaling isn't bottlenecked by human error.
              </p>

              <h2 className="text-2xl font-bold text-zinc-900 mb-4 mt-8">10. The Human Element</h2>
              <p className="text-zinc-700 leading-relaxed mb-6">
                At the end of the day, all this tech doesn't mean much without developers who understand the tradeoffs. Modern backend architecture is less about following one pattern and more about mixing tools intelligently.
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-zinc-700">
                <li>Microservices aren't always better than monoliths.</li>
                <li>GraphQL isn't always better than REST.</li>
                <li>Kubernetes isn't necessary for every project.</li>
              </ul>
              <p className="text-zinc-700 leading-relaxed mb-6">
                Scalability is about context: what works for *your* app, *your* users, and *your* growth.
              </p>

              <h2 className="text-2xl font-bold text-zinc-900 mb-4 mt-8">Final Thoughts</h2>
              <p className="text-zinc-700 leading-relaxed mb-6">
                Modern backend architecture isn't just about using the latest buzzword tech. It's about building systems that:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-zinc-700">
                <li>Scale horizontally</li>
                <li>Stay resilient under load</li>
                <li>Evolve as the product evolves</li>
              </ul>
              <p className="text-zinc-700 leading-relaxed mb-6">
                The core themes? **Microservices, APIs, event-driven design, containers, observability, and automation.**
              </p>
              <p className="text-zinc-700 leading-relaxed mb-6">
                The landscape has shifted from "Can it run?" to "Can it scale, survive, and adapt?"
              </p>
              <p className="text-zinc-700 leading-relaxed mb-6">
                Because in today's world, it's not enough to launch an app. You have to build it for the future - and the future doesn't wait.
              </p>
            </div>
          </div>
        )}

        {/* OAuth Integration Patterns Blog Content */}
        {content.id === 'oauth-integration-patterns' && (
          <div className="space-y-8">
            <div className="prose prose-zinc max-w-none">
              <p className="text-lg text-zinc-700 leading-relaxed mb-6">
                If you're building apps that need to work across web, mobile, and maybe even desktop, you can't escape OAuth 2.0. It's the standard for delegating access without tossing passwords around like candy. But here's the thing: OAuth isn't just one flow - it's a set of patterns. And the pattern you pick depends on your platform, your threat model, and how much you value your users not hating the login process.
              </p>

              <p className="text-zinc-700 leading-relaxed mb-6">
                Let's break this down.
              </p>

              <h2 className="text-2xl font-bold text-zinc-900 mb-4 mt-8">Why OAuth 2.0 Exists in the First Place</h2>
              <p className="text-zinc-700 leading-relaxed mb-6">
                Back in the day, apps would just ask for your username and password directly, then store them. That's sketchy for a million reasons. OAuth flipped the script: instead of sharing your actual password, you get an **access token** from the provider (Google, Facebook, GitHub, etc.), and that token represents your permission to access certain resources.
              </p>
              <p className="text-zinc-700 leading-relaxed mb-6">
                This separation makes it secure, flexible, and user-friendly. But depending on where your app lives (browser, native mobile, server-side), the integration looks different.
              </p>

              <h2 className="text-2xl font-bold text-zinc-900 mb-4 mt-8">1. Authorization Code Flow (with PKCE)</h2>
              <p className="text-zinc-700 leading-relaxed mb-6">
                This is the bread and butter for **web and mobile apps**.
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-zinc-700">
                <li><strong>How it works (simplified):</strong></li>
              </ul>
              <ol className="list-decimal pl-6 mb-6 space-y-2 text-zinc-700">
                <li>User clicks "Sign in with X."</li>
                <li>They get redirected to the provider's login page.</li>
                <li>Once they approve, the provider sends back an authorization code.</li>
                <li>The app exchanges that code (plus PKCE challenge) for an access token.</li>
              </ol>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-zinc-700">
                <li><strong>Why PKCE matters:</strong> On mobile or SPA apps, you don't have a secure server to hide secrets. PKCE (Proof Key for Code Exchange) protects against code interception.</li>
                <li><strong>Where to use:</strong></li>
              </ul>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-zinc-700">
                <li>SPAs (React, Angular, Vue)</li>
                <li>Native mobile (iOS, Android, Flutter, React Native)</li>
                <li>Desktop apps with embedded browsers</li>
              </ul>
              <p className="text-zinc-700 leading-relaxed mb-6">
                This is the go-to for most modern multi-platform setups because it balances security with usability.
              </p>

              <h2 className="text-2xl font-bold text-zinc-900 mb-4 mt-8">2. Client Credentials Flow</h2>
              <p className="text-zinc-700 leading-relaxed mb-6">
                This isn't for users - it's for **apps talking to other apps**.
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-zinc-700">
                <li><strong>Example:</strong> Your backend service needs to call an external API to process payments or fetch data. No human user involved.</li>
              </ul>
              <p className="text-zinc-700 leading-relaxed mb-6">
                You just exchange the app's client ID and secret for a token.
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-zinc-700">
                <li><strong>Where to use:</strong></li>
              </ul>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-zinc-700">
                <li>Microservices talking to each other</li>
                <li>Server-to-server API integrations</li>
                <li>Background jobs or daemons</li>
              </ul>
              <p className="text-zinc-700 leading-relaxed mb-6">
                It's simple, but don't confuse it with user authentication. This flow is about *machine identity*.
              </p>

              <h2 className="text-2xl font-bold text-zinc-900 mb-4 mt-8">3. Implicit Flow (The Old Way)</h2>
              <p className="text-zinc-700 leading-relaxed mb-6">
                Once popular for SPAs, now considered insecure. Tokens were returned directly in the URL fragment, which exposed them to leaks in browser history, logs, etc.
              </p>
              <p className="text-zinc-700 leading-relaxed mb-6">
                Modern guidance: <strong>Don't use it.</strong> Always go with Authorization Code + PKCE.
              </p>

              <h2 className="text-2xl font-bold text-zinc-900 mb-4 mt-8">4. Device Authorization Flow</h2>
              <p className="text-zinc-700 leading-relaxed mb-6">
                This one's for **devices with limited input**. Think: smart TVs, gaming consoles, IoT devices.
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-zinc-700">
                <li>User is shown a code and told to visit a link on another device.</li>
                <li>They log in there, approve, and the device polls for confirmation.</li>
                <li>Once confirmed, the device gets an access token.</li>
              </ul>
              <p className="text-zinc-700 leading-relaxed mb-6">
                If you've ever signed into Netflix on a smart TV, you've seen this in action.
              </p>

              <h2 className="text-2xl font-bold text-zinc-900 mb-4 mt-8">5. Hybrid Flow</h2>
              <p className="text-zinc-700 leading-relaxed mb-6">
                Some enterprise setups still use hybrid flows (especially with OpenID Connect on top of OAuth). It's basically a mix of Authorization Code and Implicit, where you can get both an ID token and an authorization code at the same time.
              </p>
              <p className="text-zinc-700 leading-relaxed mb-6">
                More complex, less common in consumer apps, but you'll bump into it if you're deep into enterprise identity management.
              </p>

              <h2 className="text-2xl font-bold text-zinc-900 mb-4 mt-8">Multi-Platform Integration Patterns</h2>
              <p className="text-zinc-700 leading-relaxed mb-6">
                Here's where it all comes together. If you're building an app that runs everywhere - web, iOS, Android, maybe even desktop - your integration strategy looks something like this:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-zinc-700">
                <li><strong>Web (SPA + backend)</strong> - Authorization Code with PKCE, backend handles refresh tokens.</li>
                <li><strong>Mobile apps</strong> - Authorization Code with PKCE via system browser (don't embed login UIs; use browser redirects for security).</li>
                <li><strong>Desktop apps</strong> - Same as mobile: launch system browser for login, catch redirect URI.</li>
                <li><strong>API-to-API</strong> - Client Credentials Flow.</li>
                <li><strong>Smart devices/IoT</strong> - Device Authorization Flow.</li>
              </ul>
              <p className="text-zinc-700 leading-relaxed mb-6">
                This way, you're consistent, secure, and your users only ever see familiar, trusted login screens.
              </p>

              <h2 className="text-2xl font-bold text-zinc-900 mb-4 mt-8">Handling Tokens Properly</h2>
              <p className="text-zinc-700 leading-relaxed mb-6">
                Tokens are the heart of OAuth. How you manage them matters.
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-zinc-700">
                <li><strong>Access tokens</strong> - Short-lived (minutes to an hour). Used to access APIs.</li>
                <li><strong>Refresh tokens</strong> - Longer-lived, used to get new access tokens. Keep them secure - especially on mobile and web.</li>
                <li><strong>ID tokens (OIDC)</strong> - Contain user identity info in JWT format. Perfect for login sessions.</li>
              </ul>
              <p className="text-zinc-700 leading-relaxed mb-6">
                Pattern: Store access tokens in memory, refresh tokens securely (Keychain on iOS, Keystore on Android, secure cookies on web). Never dump them in localStorage where scripts can grab them.
              </p>

              <h2 className="text-2xl font-bold text-zinc-900 mb-4 mt-8">OAuth + OpenID Connect (OIDC)</h2>
              <p className="text-zinc-700 leading-relaxed mb-6">
                Worth noting: OAuth 2.0 by itself doesn't define *who* the user is, only what they can access. That's where **OIDC** rides on top. It standardizes user identity through ID tokens.
              </p>
              <p className="text-zinc-700 leading-relaxed mb-6">
                So if you're building login across platforms, you're almost always doing OAuth 2.0 + OIDC. That's what "Sign in with Google/Microsoft/Apple" really runs on.
              </p>

              <h2 className="text-2xl font-bold text-zinc-900 mb-4 mt-8">Common Pitfalls to Avoid</h2>
              <ol className="list-decimal pl-6 mb-6 space-y-2 text-zinc-700">
                <li><strong>Rolling your own OAuth</strong> - Don't. Use libraries (Auth0 SDK, Firebase Auth, NextAuth.js, AppAuth). Security mistakes in auth can be fatal.</li>
                <li><strong>Keeping tokens too long</strong> - Expire them, refresh them. Tokens aren't forever.</li>
                <li><strong>Embedding secrets in mobile apps</strong> - Secrets belong on servers, not inside APKs/IPA files where anyone can extract them.</li>
                <li><strong>Forgetting logout flows</strong> - Tokens must be revoked properly; otherwise users get "phantom logins."</li>
              </ol>

              <h2 className="text-2xl font-bold text-zinc-900 mb-4 mt-8">Final Thoughts</h2>
              <p className="text-zinc-700 leading-relaxed mb-6">
                OAuth 2.0 isn't a one-size-fits-all thing. It's a toolbox. For multi-platform apps, the trick is knowing which flow to use where.
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-zinc-700">
                <li>Authorization Code with PKCE - Your default for anything user-facing (web, mobile, desktop).</li>
                <li>Client Credentials - Server-to-server.</li>
                <li>Device Flow - Smart/IoT devices.</li>
                <li>OIDC - Add identity on top of OAuth for actual user login.</li>
              </ul>
              <p className="text-zinc-700 leading-relaxed mb-6">
                Done right, OAuth makes authentication consistent, secure, and scalable - no matter where your app runs.
              </p>
              <p className="text-zinc-700 leading-relaxed mb-6">
                Because at the end of the day, the login flow isn't just about security. It's about trust. And in a world where your app might live on phones, laptops, browsers, and TVs, you can't afford to get that wrong.
              </p>
            </div>
          </div>
        )}

        {/* Debugging Complex Distributed Systems Blog Content */}
        {content.id === 'debugging-complex-systems' && (
          <div className="space-y-8">
            <div className="prose prose-zinc max-w-none">
              <p className="text-lg text-zinc-700 leading-relaxed mb-6">
                If you've ever debugged a simple web app, you know it can be frustrating. Now multiply that by 10,000 and you'll start to feel what it's like debugging a **distributed system**. Multiple services, scattered logs, race conditions, requests bouncing across networks - it's like trying to chase shadows in the dark.
              </p>

              <p className="text-zinc-700 leading-relaxed mb-6">
                But here's the truth: debugging distributed systems isn't about being a "10x developer." It's about having the right **toolkit** and the right **mental models**. With the right approach, you can make sense of the chaos.
              </p>

              <h2 className="text-2xl font-bold text-zinc-900 mb-4 mt-8">1. Understand the Beast</h2>
              <p className="text-zinc-700 leading-relaxed mb-6">
                Before tools, you need a mindset. Distributed systems fail in ways monoliths never will:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-zinc-700">
                <li><strong>Partial failures</strong> - One service dies, others keep running.</li>
                <li><strong>Network partitions</strong> - Messages don't get through, or get delayed.</li>
                <li><strong>Non-determinism</strong> - Bugs that appear randomly under load but vanish in test.</li>
              </ul>
              <p className="text-zinc-700 leading-relaxed mb-6">
                Step one is accepting that failure is normal in distributed systems. You're not "avoiding failure," you're **managing it**.
              </p>

              <h2 className="text-2xl font-bold text-zinc-900 mb-4 mt-8">2. Centralized Logging</h2>
              <p className="text-zinc-700 leading-relaxed mb-6">
                Logs are still your best friend, but in a distributed world, local logs don't cut it. You need aggregation.
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-zinc-700">
                <li><strong>ELK Stack (Elasticsearch, Logstash, Kibana)</strong></li>
                <li><strong>Datadog Logs</strong></li>
                <li><strong>Splunk</strong></li>
              </ul>
              <p className="text-zinc-700 leading-relaxed mb-6">
                Centralized logs let you trace what happened across services. Tag logs with **request IDs** so you can follow a user's journey end-to-end. Without that, you're just guessing.
              </p>

              <h2 className="text-2xl font-bold text-zinc-900 mb-4 mt-8">3. Distributed Tracing</h2>
              <p className="text-zinc-700 leading-relaxed mb-6">
                Logs show the *what*. Tracing shows the *where*.
              </p>
              <p className="text-zinc-700 leading-relaxed mb-6">
                Tools like **Jaeger, Zipkin, or OpenTelemetry** let you visualize how requests flow across services. You can see:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-zinc-700">
                <li>Which service is slow</li>
                <li>Where requests are failing</li>
                <li>Bottlenecks across the system</li>
              </ul>
              <p className="text-zinc-700 leading-relaxed mb-6">
                Tracing is the closest thing you get to "x-ray vision" in distributed systems.
              </p>

              <h2 className="text-2xl font-bold text-zinc-900 mb-4 mt-8">4. Metrics & Monitoring</h2>
              <p className="text-zinc-700 leading-relaxed mb-6">
                Metrics answer the question: *"Is the system healthy?"*
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-zinc-700">
                <li><strong>Prometheus + Grafana</strong> for real-time metrics</li>
                <li><strong>Cloud-native monitoring (AWS CloudWatch, GCP Stackdriver)</strong></li>
                <li>Custom business-level metrics (e.g. # of successful checkouts per minute)</li>
              </ul>
              <p className="text-zinc-700 leading-relaxed mb-6">
                When debugging, metrics narrow down *when* and *where* a failure started. They're the difference between panic and precision.
              </p>

              <h2 className="text-2xl font-bold text-zinc-900 mb-4 mt-8">5. Chaos Engineering</h2>
              <p className="text-zinc-700 leading-relaxed mb-6">
                This one feels counterintuitive: break your own system on purpose.
              </p>
              <p className="text-zinc-700 leading-relaxed mb-6">
                Tools like **Gremlin** or **Chaos Monkey** introduce failures (kill services, add latency, drop packets). Why? Because it forces you to design for resilience *before* production blows up.
              </p>
              <p className="text-zinc-700 leading-relaxed mb-6">
                Debugging distributed systems is easier if you've already seen how they fail under controlled chaos.
              </p>

              <h2 className="text-2xl font-bold text-zinc-900 mb-4 mt-8">6. Debugging in Production (Yes, It Happens)</h2>
              <p className="text-zinc-700 leading-relaxed mb-6">
                Sometimes bugs don't show up until real users hit your system. That's where you need:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-zinc-700">
                <li><strong>Feature flags</strong> - Roll changes out safely, toggle off if things break.</li>
                <li><strong>Production debuggers</strong> - Tools like Rookout or Lightrun let you insert debug logs in prod without redeploying.</li>
                <li><strong>Safe rollbacks</strong> - CI/CD pipelines that let you revert in seconds.</li>
              </ul>
              <p className="text-zinc-700 leading-relaxed mb-6">
                In distributed systems, debugging in production isn't taboo - it's survival.
              </p>

              <h2 className="text-2xl font-bold text-zinc-900 mb-4 mt-8">7. Communication Between Teams</h2>
              <p className="text-zinc-700 leading-relaxed mb-6">
                Distributed systems are as much about people as code. Debugging means:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-zinc-700">
                <li>Clear escalation paths (who owns which service?)</li>
                <li>Shared dashboards/logs (no siloed visibility)</li>
                <li>Postmortems (not blame games, but learning tools)</li>
              </ul>
              <p className="text-zinc-700 leading-relaxed mb-6">
                Because if your debugging process requires 10 Slack DMs to figure out who's on-call, the system isn't just broken - the org is too.
              </p>

              <h2 className="text-2xl font-bold text-zinc-900 mb-4 mt-8">8. Developer Toolkit Essentials</h2>
              <p className="text-zinc-700 leading-relaxed mb-6">
                Let's be real: no single tool solves everything. But here's a starter pack:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-zinc-700">
                <li><strong>Logs</strong> - ELK / Datadog / Splunk</li>
                <li><strong>Tracing</strong> - OpenTelemetry / Jaeger</li>
                <li><strong>Metrics</strong> - Prometheus / Grafana</li>
                <li><strong>Service Mesh Debugging</strong> - Istio / Linkerd dashboards</li>
                <li><strong>Chaos Engineering</strong> - Chaos Monkey / Gremlin</li>
                <li><strong>API Debugging</strong> - Postman / cURL / gRPCurl</li>
                <li><strong>Production Debuggers</strong> - Rookout / Lightrun</li>
              </ul>
              <p className="text-zinc-700 leading-relaxed mb-6">
                Combine these with a disciplined process, and suddenly the "impossible bug" becomes traceable.
              </p>

              <h2 className="text-2xl font-bold text-zinc-900 mb-4 mt-8">Final Thoughts</h2>
              <p className="text-zinc-700 leading-relaxed mb-6">
                Debugging distributed systems isn't about brute force. It's about **observability, tooling, and process**. You can't eliminate complexity, but you can illuminate it.
              </p>
              <p className="text-zinc-700 leading-relaxed mb-6">
                When everything is breaking at scale, the best developers aren't the ones who "guess faster." They're the ones who know how to gather signals, connect dots, and lean on the right tools.
              </p>
              <p className="text-zinc-700 leading-relaxed mb-6">
                The truth is, debugging distributed systems never gets easy. But with the right toolkit, it gets possible - and that's enough to keep your sanity.
              </p>
            </div>
          </div>
        )}

        {/* Debugging AI-Written Code Blog Content */}
        {content.id === 'debugging-ai-written-code' && (
          <div className="space-y-8">
            <div className="prose prose-zinc max-w-none">
              <p className="text-lg text-zinc-700 leading-relaxed mb-6">
                We're living in an age where AI doesn't just autocomplete code; it writes entire modules, tests, even APIs. That's wild - but if you've used Copilot, ChatGPT, or Cursor AI for long enough, you know: **AI code isn't always correct.**
              </p>

              <p className="text-zinc-700 leading-relaxed mb-6">
                It compiles, it runs, sometimes it even looks beautiful. But hidden inside might be logic errors, security flaws, or subtle inefficiencies. Debugging AI-written code is a new skill, and honestly, it's one every dev needs now.
              </p>

              <h2 className="text-2xl font-bold text-zinc-900 mb-4 mt-8">1. Don't Trust the First Draft</h2>
              <p className="text-zinc-700 leading-relaxed mb-6">
                AI-written code often *looks* right because it mimics patterns. But correctness is another story.
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-zinc-700">
                <li>AI might import libraries that don't exist.</li>
                <li>It might assume an outdated API version.</li>
                <li>Or worse - it "hallucinates" functions that sound real but aren't.</li>
              </ul>
              <p className="text-zinc-700 leading-relaxed mb-6">
                First rule: treat AI output like a junior dev's PR. Helpful, but needs review.
              </p>

              <h2 className="text-2xl font-bold text-zinc-900 mb-4 mt-8">2. Static Analysis First</h2>
              <p className="text-zinc-700 leading-relaxed mb-6">
                Before running anything, run the code through static analyzers:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-zinc-700">
                <li><strong>ESLint / Pylint / Flake8</strong> - Catch style + syntax issues.</li>
                <li><strong>Type checkers (TypeScript, mypy)</strong> - Catch type mismatches.</li>
                <li><strong>Security scanners (Bandit, SonarQube)</strong> - Catch vulnerabilities AI might not consider.</li>
              </ul>
              <p className="text-zinc-700 leading-relaxed mb-6">
                AI often glosses over strict typing and security best practices. Static analysis forces reality checks.
              </p>

              <h2 className="text-2xl font-bold text-zinc-900 mb-4 mt-8">3. Write (or Regenerate) Tests</h2>
              <p className="text-zinc-700 leading-relaxed mb-6">
                AI loves writing code but often skips thorough test coverage. Always:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-zinc-700">
                <li>Write unit tests around critical logic.</li>
                <li>Run property-based tests (Hypothesis for Python, QuickCheck for Haskell).</li>
                <li>Use integration tests to validate external API assumptions.</li>
              </ul>
              <p className="text-zinc-700 leading-relaxed mb-6">
                In fact, sometimes the best use of AI is not writing the feature itself, but generating **tests** to catch its own mistakes.
              </p>

              <h2 className="text-2xl font-bold text-zinc-900 mb-4 mt-8">4. Step Through Debugging</h2>
              <p className="text-zinc-700 leading-relaxed mb-6">
                Don't assume correctness. Run the code in debug mode and step through line by line. Watch:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-zinc-700">
                <li>Variable values - Did AI assume the wrong type?</li>
                <li>Edge cases - Did AI handle empty arrays, nulls, unexpected inputs?</li>
                <li>Control flow - Is it looping forever or skipping conditions?</li>
              </ul>
              <p className="text-zinc-700 leading-relaxed mb-6">
                Debugging AI code is often about surfacing silent wrong assumptions.
              </p>

              <h2 className="text-2xl font-bold text-zinc-900 mb-4 mt-8">5. Validate Against Docs</h2>
              <p className="text-zinc-700 leading-relaxed mb-6">
                AI is trained on a snapshot of the web. Libraries evolve. APIs deprecate.
              </p>
              <p className="text-zinc-700 leading-relaxed mb-6">
                Always cross-check AI-written functions against **official documentation**. Don't just trust "pip install whatever" - verify it's real and current.
              </p>

              <h2 className="text-2xl font-bold text-zinc-900 mb-4 mt-8">6. Watch Out for Hidden Complexity</h2>
              <p className="text-zinc-700 leading-relaxed mb-6">
                AI sometimes writes "clever" code when a simpler solution exists. Complexity is a bug magnet.
              </p>
              <p className="text-zinc-700 leading-relaxed mb-6">
                If the AI writes something overly abstract, ask:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-zinc-700">
                <li>Can this be simplified?</li>
                <li>Is this idiomatic for the language?</li>
                <li>Would a human teammate understand this in a code review?</li>
              </ul>
              <p className="text-zinc-700 leading-relaxed mb-6">
                Readable > magical.
              </p>

              <h2 className="text-2xl font-bold text-zinc-900 mb-4 mt-8">7. Keep Human Judgment at the Core</h2>
              <p className="text-zinc-700 leading-relaxed mb-6">
                AI can accelerate coding, but debugging still requires human reasoning. You need to:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-zinc-700">
                <li>Spot when logic doesn't align with business rules.</li>
                <li>Catch when performance will tank under real-world load.</li>
                <li>Question assumptions AI can't.</li>
              </ul>
              <p className="text-zinc-700 leading-relaxed mb-6">
                At the end of the day, debugging AI-written code is about applying **old-school debugging discipline** to a new-school source of code.
              </p>

              <h2 className="text-2xl font-bold text-zinc-900 mb-4 mt-8">Final Thoughts</h2>
              <p className="text-zinc-700 leading-relaxed mb-6">
                Debugging AI code isn't just about fixing mistakes - it's about creating a feedback loop. Use AI to generate tests, improve its own drafts, and iterate. But don't ever hand over the wheel.
              </p>
              <p className="text-zinc-700 leading-relaxed mb-6">
                Because AI-written code is like hiring a super fast but careless junior dev: they'll crank out features in minutes, but without review and debugging, you're shipping chaos.
              </p>
              <p className="text-zinc-700 leading-relaxed mb-6">
                Your toolkit here? **Static analysis, tests, docs, and your own critical thinking.** AI can help, but debugging remains a human art.
              </p>
            </div>
          </div>
        )}

        {/* Default blog content for other posts */}
        {content.id !== 'earth2-platform-case-study' && content.id !== 'ai-accelerated-development' && content.id !== 'modern-backend-architecture' && content.id !== 'oauth-integration-patterns' && content.id !== 'debugging-complex-systems' && content.id !== 'debugging-ai-written-code' && (
          <div className="bg-zinc-50 rounded-lg p-6 text-center">
            <p className="text-zinc-600 mb-2">Full blog content would go here...</p>
            <p className="text-sm text-zinc-500">
              This would contain the complete article content for "{content.title}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
