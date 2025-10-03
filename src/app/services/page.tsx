import React from 'react';
import { Globe, Gamepad2, Code, Cpu, ArrowRight, Network, Database, Monitor } from 'lucide-react';

export default function Services() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start pb-24">
      <section className="w-full pt-24 sm:pt-32 px-4 flex justify-center">
        <div className="max-w-4xl w-full glass grid-pattern border border-orange-900/20 py-8 px-6 sm:px-10 mb-16 shadow-lg">
          <h2 className="text-2xl font-bold mb-5 accent">What I Can Build For You</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Website Development */}
            <div className="p-5 card-hover overflow-hidden rounded-xl">
              <div className="flex items-center mb-3">
                <div className="p-2.5 bg-gradient-to-br from-orange-600 to-orange-400 rounded-lg mr-4">
                  <Monitor className="h-6 w-6 text-black" />
                </div>
                <h3 className="text-lg font-bold" style={{ color: '#d17927' }}>Website Development</h3>
              </div>
              <p className="text-sm text-black mb-2">
                Professional websites that establish your online presence. From personal portfolios to business sites, I create responsive, fast, and visually appealing websites.
              </p>
              <ul className="text-xs text-black space-y-1.5">
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-1.5" style={{ color: '#d17927' }} />
                  Responsive design for all devices
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-1.5" style={{ color: '#d17927' }} />
                  SEO optimization for search visibility
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-1.5" style={{ color: '#d17927' }} />
                  Contact forms and user interactions
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-1.5" style={{ color: '#d17927' }} />
                  Content management systems
                </li>
              </ul>
            </div>

            {/* Web Development */}
            <div className="p-5 card-hover overflow-hidden rounded-xl">
              <div className="flex items-center mb-3">
                <div className="p-2.5 bg-gradient-to-br from-orange-600 to-orange-400 rounded-lg mr-4">
                  <Globe className="h-6 w-6 text-black" />
                </div>
                <h3 className="text-lg font-bold" style={{ color: '#d17927' }}>Web Applications</h3>
              </div>
              <p className="text-sm text-black mb-2">
                Modern, beautiful, and fast web apps that make an impact. From landing pages to complex applications, I build with performance and creativity in mind.
              </p>
              <ul className="text-xs text-black space-y-1.5">
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-1.5" style={{ color: '#d17927' }} />
                  Progressive web apps, e-commerce, and more
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-1.5" style={{ color: '#d17927' }} />
                  React, Vue.js, Next.js ecosystems
                </li>
              </ul>
            </div>
            {/* Game Development */}
            <div className="p-5 card-hover overflow-hidden rounded-xl">
              <div className="flex items-center mb-3">
                <div className="p-2.5 bg-gradient-to-br from-orange-600 to-orange-400 rounded-lg mr-4">
                  <Gamepad2 className="h-6 w-6 text-black" />
                </div>
                <h3 className="text-lg font-bold" style={{ color: '#d17927' }}>Game Development</h3>
              </div>
              <p className="text-sm text-black mb-2">
                Engaging web-based games and interactive experiences that captivate users and deliver your message in a memorable way.
              </p>
              <ul className="text-xs text-black space-y-1.5">
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-1.5" style={{ color: '#d17927' }} />
                  HTML5 games and gamification
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-1.5" style={{ color: '#d17927' }} />
                  Interactive storytelling experiences
                </li>
              </ul>
            </div>
            {/* Metaverse & Virtual Worlds */}
            <div className="p-5 card-hover overflow-hidden rounded-xl">
              <div className="flex items-center mb-3">
                <div className="p-2.5 bg-gradient-to-br from-orange-600 to-orange-400 rounded-lg mr-4">
                  <Code className="h-6 w-6 text-black" />
                </div>
                <h3 className="text-lg font-bold" style={{ color: '#d17927' }}>Metaverse & Scripts</h3>
              </div>
              <p className="text-sm text-black mb-2">
                Custom scripts and solutions for virtual worlds and metaverse platforms. Enhance your presence in the growing digital universe.
              </p>
              <ul className="text-xs text-black space-y-1.5">
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-1.5" style={{ color: '#d17927' }} />
                  Earth2 and other metaverse scripting
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-1.5" style={{ color: '#d17927' }} />
                  Virtual experience enhancements
                </li>
              </ul>
            </div>
            {/* AI & ML Solutions */}
            <div className="p-5 card-hover overflow-hidden rounded-xl">
              <div className="flex items-center mb-3">
                <div className="p-2.5 bg-gradient-to-br from-orange-600 to-orange-400 rounded-lg mr-4">
                  <Cpu className="h-6 w-6 text-black" />
                </div>
                <h3 className="text-lg font-bold" style={{ color: '#d17927' }}>AI & ML Integration</h3>
              </div>
              <p className="text-sm text-black mb-2">
                Integrating AI capabilities into your applications. From chatbots to data analysis, I can help you leverage machine learning power.
              </p>
              <ul className="text-xs text-black space-y-1.5">
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-1.5" style={{ color: '#d17927' }} />
                  AI-powered interfaces and features
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-1.5" style={{ color: '#d17927' }} />
                  Custom model training and deployment
                </li>
              </ul>
            </div>

            {/* MCP Server Development */}
            <div className="p-5 card-hover overflow-hidden rounded-xl">
              <div className="flex items-center mb-3">
                <div className="p-2.5 bg-gradient-to-br from-orange-600 to-orange-400 rounded-lg mr-4">
                  <Network className="h-6 w-6 text-black" />
                </div>
                <h3 className="text-lg font-bold" style={{ color: '#d17927' }}>MCP Server Development</h3>
              </div>
              <p className="text-sm text-black mb-2">
                Custom Model Context Protocol servers built from scratch. Transform your APIs into powerful AI-integrated tools for Claude and other LLMs.
              </p>
              <ul className="text-xs text-black space-y-1.5">
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-1.5" style={{ color: '#d17927' }} />
                  Complete MCP server architecture
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-1.5" style={{ color: '#d17927' }} />
                  Custom tool development for AI integration
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-1.5" style={{ color: '#d17927' }} />
                  NPM package publishing and distribution
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-1.5" style={{ color: '#d17927' }} />
                  API-to-MCP transformation services
                </li>
              </ul>
            </div>

            {/* API Development & Integration */}
            <div className="p-5 card-hover overflow-hidden rounded-xl">
              <div className="flex items-center mb-3">
                <div className="p-2.5 bg-gradient-to-br from-orange-600 to-orange-400 rounded-lg mr-4">
                  <Database className="h-6 w-6 text-black" />
                </div>
                <h3 className="text-lg font-bold" style={{ color: '#d17927' }}>API Development & Integration</h3>
              </div>
              <p className="text-sm text-black mb-2">
                Transform your platform's internal endpoints into robust external APIs. Enable third-party integrations and expand your platform's reach.
              </p>
              <ul className="text-xs text-black space-y-1.5">
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-1.5" style={{ color: '#d17927' }} />
                  External API creation from internal endpoints
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-1.5" style={{ color: '#d17927' }} />
                  RESTful API design and implementation
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-1.5" style={{ color: '#d17927' }} />
                  Authentication and authorization systems
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-1.5" style={{ color: '#d17927' }} />
                  Comprehensive API documentation
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-1.5" style={{ color: '#d17927' }} />
                  Rate limiting and security implementation
                </li>
              </ul>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
} 