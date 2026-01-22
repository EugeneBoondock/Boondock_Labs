'use client';

import Image from 'next/image';
import { Globe, Code, ArrowRight, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';

type Category = 'all' | 'featured' | 'client' | 'opensource';

interface Project {
  id: string;
  categories: Category[];
  component: JSX.Element;
}

export default function Work() {
  const [activeFilter, setActiveFilter] = useState<Category>('all');

  // Handle hash navigation from navbar
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const hashToFilter: { [key: string]: Category } = {
        'featured': 'featured',
        'clients': 'client',
        'opensource': 'opensource'
      };

      if (hash && hashToFilter[hash]) {
        setActiveFilter(hashToFilter[hash]);
      }
    };

    // Check hash on mount
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const projects: Project[] = [
    {
      id: 'earthie',
      categories: ['featured'],
      component: (
        <div className="p-5 card-hover rounded-xl overflow-hidden flex flex-col">
          <div className="h-40 relative mb-3 overflow-hidden rounded-lg">
            <Image
              src="/earthie-world.png"
              alt="Earthie World"
              fill
              className="object-cover transition-all hover:scale-105 brightness-[0.9]"
            />
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 backdrop-blur-sm">
              <h3 className="font-semibold flex items-center" style={{ color: '#d17927' }}>
                Earthie.world <Globe className="ml-2 h-4 w-4 text-green-400" />
              </h3>
            </div>
          </div>
          <p className="text-sm mb-3 text-black">A comprehensive Earth2 metaverse community platform with 17+ API integrations, real-time market data, interactive mapping, community features, and advanced subscription management. Features multiple specialized hubs for market analysis, minerals tracking, logistics, leaderboards, and portfolio management.</p>
          <div className="flex items-center justify-between mt-auto pt-2">
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-zinc-800/70 rounded text-xs text-black">NextJS</span>
              <span className="px-2 py-1 bg-zinc-800/70 rounded text-xs text-black">React</span>
            </div>
            <a href="https://earthie.world" target="_blank" rel="noopener noreferrer" className="text-sm font-medium flex items-center" style={{ color: '#d17927' }}>
              Visit <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>
        </div>
      )
    },
    {
      id: 'morphed',
      categories: ['featured', 'client'],
      component: (
        <div className="p-5 card-hover rounded-xl overflow-hidden flex flex-col">
          <div className="h-40 relative mb-3 overflow-hidden rounded-lg">
            <Image
              src="/morphed.png"
              alt="Morphed.io"
              fill
              className="object-cover transition-all hover:scale-105 brightness-[0.9]"
            />
          </div>
          <h3 className="font-semibold mb-1" style={{ color: '#d17927' }}>
            Morphed.io - Full Platform Development
          </h3>
          <p className="text-sm mb-3 text-black">Designed and developed both backend infrastructure and frontend interface to bring the Morphed.io platform to life. Created custom API endpoints, built the complete Model Context Protocol (MCP) server, and developed the user-facing application.</p>
          <div className="flex items-center justify-between mt-auto pt-2">
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-zinc-800/70 rounded text-xs text-black">Full-Stack</span>
              <span className="px-2 py-1 bg-zinc-800/70 rounded text-xs text-black">MCP Server</span>
              <span className="px-2 py-1 bg-zinc-800/70 rounded text-xs text-black">API Development</span>
              <span className="px-2 py-1 bg-zinc-800/70 rounded text-xs text-black">UI/UX Design</span>
            </div>
            <a href="https://morphed.io" target="_blank" rel="noopener noreferrer" className="text-sm font-medium flex items-center" style={{ color: '#d17927' }}>
              Visit <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>
        </div>
      )
    },
    {
      id: 'platedom',
      categories: ['featured', 'client'],
      component: (
        <div className="p-5 card-hover rounded-xl overflow-hidden flex flex-col">
          <div className="h-40 relative mb-3 overflow-hidden rounded-lg bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center">
            <div className="text-center">
              <Code className="h-16 w-16 text-orange-600 mx-auto mb-2" />
              <p className="text-sm font-bold text-orange-800">Platedom</p>
            </div>
          </div>
          <h3 className="font-semibold mb-1" style={{ color: '#d17927' }}>
            Platedom.com - AI Restaurant Platform
          </h3>
          <p className="text-sm mb-3 text-black">Generative AI platform for restaurants that transforms menus into visual feasts. Creates Michelin-star quality food photography and recipes in seconds. Built with Firebase for database and authentication, featuring real-time data sync and secure user management.</p>
          <div className="flex items-center justify-between mt-auto pt-2">
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-zinc-800/70 rounded text-xs text-black">Firebase</span>
              <span className="px-2 py-1 bg-zinc-800/70 rounded text-xs text-black">Generative AI</span>
              <span className="px-2 py-1 bg-zinc-800/70 rounded text-xs text-black">React</span>
            </div>
            <a href="https://platedom.com" target="_blank" rel="noopener noreferrer" className="text-sm font-medium flex items-center" style={{ color: '#d17927' }}>
              Visit <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>
        </div>
      )
    },
    {
      id: 'earth2-mcp',
      categories: ['featured', 'opensource'],
      component: (
        <div className="p-5 card-hover rounded-xl overflow-hidden flex flex-col">
          <div className="h-40 relative mb-3 overflow-hidden rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
            <div className="text-center">
              <Code className="h-16 w-16 text-orange-600 mx-auto mb-2" />
              <p className="text-sm font-bold text-orange-800">Earth2 MCP Server</p>
            </div>
          </div>
          <h3 className="font-semibold mb-1" style={{ color: '#d17927' }}>
            Earth2 MCP Server - Claude Integration
          </h3>
          <p className="text-sm mb-3 text-black">Built a complete MCP server enabling Claude to access Earth2 account data, properties, wallet information, transactions, and marketplace listings. Features dual credential support and full Claude Desktop integration.</p>
          <div className="flex items-center justify-between mt-auto pt-2">
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-zinc-800/70 rounded text-xs text-black">MCP Server</span>
              <span className="px-2 py-1 bg-zinc-800/70 rounded text-xs text-black">Earth2 API</span>
              <span className="px-2 py-1 bg-zinc-800/70 rounded text-xs text-black">NPM Package</span>
            </div>
            <a href="https://www.npmjs.com/package/earth2-mcp-server" target="_blank" rel="noopener noreferrer" className="text-sm font-medium flex items-center" style={{ color: '#d17927' }}>
              View NPM <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>
        </div>
      )
    },
    {
      id: 'hubspot-mcp',
      categories: ['opensource'],
      component: (
        <div className="p-5 card-hover rounded-xl overflow-hidden flex flex-col">
          <div className="h-40 relative mb-3 overflow-hidden rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
            <div className="text-center">
              <Code className="h-16 w-16 text-white mx-auto mb-2" />
              <p className="text-sm font-bold text-white">HubSpot MCP</p>
            </div>
          </div>
          <h3 className="font-semibold mb-1" style={{ color: '#d17927' }}>
            HubSpot MCP Server - CRM Integration
          </h3>
          <p className="text-sm mb-3 text-black">Model Context Protocol server for HubSpot CRM integration. Enables Claude to interact with HubSpot contacts, companies, deals, and tickets. Streamlines CRM workflows with AI-powered automation and data access.</p>
          <div className="flex items-center justify-between mt-auto pt-2">
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-zinc-800/70 rounded text-xs text-black">MCP Server</span>
              <span className="px-2 py-1 bg-zinc-800/70 rounded text-xs text-black">HubSpot API</span>
              <span className="px-2 py-1 bg-zinc-800/70 rounded text-xs text-black">CRM</span>
            </div>
            <a href="https://www.npmjs.com/package/hubspot-mcp-server" target="_blank" rel="noopener noreferrer" className="text-sm font-medium flex items-center" style={{ color: '#d17927' }}>
              View NPM <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>
        </div>
      )
    },
    {
      id: 'morphed-mcp',
      categories: ['opensource'],
      component: (
        <div className="p-5 card-hover rounded-xl overflow-hidden flex flex-col">
          <div className="h-40 relative mb-3 overflow-hidden rounded-lg bg-gradient-to-br from-purple-100 to-purple-300 flex items-center justify-center">
            <div className="text-center">
              <Code className="h-16 w-16 text-purple-700 mx-auto mb-2" />
              <p className="text-sm font-bold text-purple-900">Morphed MCP</p>
            </div>
          </div>
          <h3 className="font-semibold mb-1" style={{ color: '#d17927' }}>
            Morphed MCP Server - Data Integration
          </h3>
          <p className="text-sm mb-3 text-black">Custom MCP server for Morphed.io platform integration. Provides Claude with access to platform data, user management, and API endpoints. Enables seamless AI-powered interactions with the Morphed ecosystem.</p>
          <div className="flex items-center justify-between mt-auto pt-2">
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-zinc-800/70 rounded text-xs text-black">MCP Server</span>
              <span className="px-2 py-1 bg-zinc-800/70 rounded text-xs text-black">Custom API</span>
              <span className="px-2 py-1 bg-zinc-800/70 rounded text-xs text-black">Integration</span>
            </div>
            <a href="https://www.npmjs.com/package/morphed-mcp-server" target="_blank" rel="noopener noreferrer" className="text-sm font-medium flex items-center" style={{ color: '#d17927' }}>
              View NPM <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>
        </div>
      )
    },
    {
      id: 'earth2-api',
      categories: ['featured', 'opensource'],
      component: (
        <div className="p-5 card-hover rounded-xl overflow-hidden flex flex-col">
          <div className="h-40 relative mb-3 overflow-hidden rounded-lg bg-gradient-to-br from-green-100 to-blue-200 flex items-center justify-center">
            <div className="text-center">
              <Code className="h-16 w-16 text-green-700 mx-auto mb-2" />
              <p className="text-sm font-bold text-green-900">Earth2 API Wrapper</p>
            </div>
          </div>
          <h3 className="font-semibold mb-1" style={{ color: '#d17927' }}>
            Earth2 API Wrapper - JavaScript Library
          </h3>
          <p className="text-sm mb-3 text-black">Comprehensive JavaScript/TypeScript wrapper for the Earth2 metaverse API. Simplifies integration with Earth2 services, providing easy-to-use methods for properties, transactions, marketplace, and user data. Full TypeScript support with detailed documentation.</p>
          <div className="flex items-center justify-between mt-auto pt-2">
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-zinc-800/70 rounded text-xs text-black">TypeScript</span>
              <span className="px-2 py-1 bg-zinc-800/70 rounded text-xs text-black">API Wrapper</span>
              <span className="px-2 py-1 bg-zinc-800/70 rounded text-xs text-black">NPM Package</span>
            </div>
            <a href="https://www.npmjs.com/package/earth2-api-wrapper" target="_blank" rel="noopener noreferrer" className="text-sm font-medium flex items-center" style={{ color: '#d17927' }}>
              View NPM <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>
        </div>
      )
    },
    {
      id: 'dana',
      categories: ['client'],
      component: (
        <div className="p-5 card-hover rounded-xl overflow-hidden flex flex-col">
          <div className="h-40 relative mb-3 overflow-hidden rounded-lg">
            <Image
              src="/dana.png"
              alt="SavingWithDana.com"
              fill
              className="object-cover transition-all hover:scale-105 brightness-[0.9]"
            />
          </div>
          <h3 className="font-semibold mb-1" style={{ color: '#d17927' }}>
            SavingWithDana.com - Backend Development
          </h3>
          <p className="text-sm mb-3 text-black">Built robust backend infrastructure using AWS services and modern cloud architecture for a savings and deals platform.</p>
          <div className="flex items-center justify-between mt-auto pt-2">
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-zinc-800/70 rounded text-xs text-black">AWS</span>
              <span className="px-2 py-1 bg-zinc-800/70 rounded text-xs text-black">Backend</span>
              <span className="px-2 py-1 bg-zinc-800/70 rounded text-xs text-black">Cloud Architecture</span>
            </div>
            <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded">Done</span>
          </div>
        </div>
      )
    },
    {
      id: 'entropysuite',
      categories: ['featured'],
      component: (
        <div className="p-5 card-hover rounded-xl overflow-hidden flex flex-col">
          <div className="h-40 relative mb-3 overflow-hidden rounded-lg">
            <Image
              src="/entropysuite.png"
              alt="Entropysuite"
              fill
              className="object-cover transition-all hover:scale-105 brightness-[0.9]"
            />
          </div>
          <h3 className="font-semibold mb-1" style={{ color: '#d17927' }}>
            entropysuite.co.za
          </h3>
          <p className="text-sm mb-3 text-black">Platform for random tools, including AI tools. A digital suite for experimentation and productivity.</p>
          <div className="flex items-center justify-between mt-auto pt-2">
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-zinc-800/70 rounded text-xs text-black">AI Tools</span>
              <span className="px-2 py-1 bg-zinc-800/70 rounded text-xs text-black">Web Platform</span>
            </div>
            <a href="https://entropysuite.co.za" target="_blank" rel="noopener noreferrer" className="text-sm font-medium flex items-center" style={{ color: '#d17927' }}>
              Visit <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>
        </div>
      )
    },
    {
      id: 'nkechi',
      categories: ['client'],
      component: (
        <div className="p-5 card-hover rounded-xl overflow-hidden flex flex-col">
          <div className="h-40 relative mb-3 overflow-hidden rounded-lg">
            <Image
              src="/biokinetics.jpeg"
              alt="Nkechi Biokinetics"
              fill
              className="object-cover object-left transition-all hover:scale-105 brightness-[0.9]"
            />
          </div>
          <h3 className="font-semibold mb-1" style={{ color: '#d17927' }}>
            nkechi-biokinetics.vercel.app
          </h3>
          <p className="text-sm mb-3 text-black">A Biokineticist portfolio. Showcasing expertise in health, wellness, and movement science.</p>
          <div className="flex items-center justify-between mt-auto pt-2">
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-zinc-800/70 rounded text-xs text-black">Portfolio</span>
              <span className="px-2 py-1 bg-zinc-800/70 rounded text-xs text-black">Biokinetics</span>
            </div>
            <a href="https://nkechi-biokinetics.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-sm font-medium flex items-center" style={{ color: '#d17927' }}>
              Visit <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>
        </div>
      )
    },
    {
      id: 'kinspace',
      categories: ['featured'],
      component: (
        <div className="p-5 card-hover rounded-xl overflow-hidden flex flex-col">
          <div className="h-40 relative mb-3 overflow-hidden rounded-lg">
            <Image
              src="/kinspace.png"
              alt="KinSpace"
              fill
              className="object-cover transition-all hover:scale-105 brightness-[0.9]"
            />
          </div>
          <h3 className="font-semibold mb-1" style={{ color: '#d17927' }}>
            kin-space-jade.vercel.app <span className="ml-2 text-xs text-purple-700">WIP</span>
          </h3>
          <p className="text-sm mb-3 text-black">A platform (WIP) for individuals with chronic and mental illnesses. Community, support, and resources in a safe space.</p>
          <div className="flex items-center justify-between mt-auto pt-2">
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-zinc-800/70 rounded text-xs text-black">Community</span>
              <span className="px-2 py-1 bg-zinc-800/70 rounded text-xs text-black">Health</span>
            </div>
            <a href="https://kin-space-jade.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-sm font-medium flex items-center" style={{ color: '#d17927' }}>
              Visit <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>
        </div>
      )
    },
    {
      id: '3rdisland',
      categories: ['client'],
      component: (
        <div className="p-5 card-hover rounded-xl overflow-hidden flex flex-col">
          <div className="h-40 relative mb-3 overflow-hidden rounded-lg">
            <Image
              src="/3rdislandtours.png"
              alt="3rd Island Tours"
              fill
              className="object-cover transition-all hover:scale-105 brightness-[0.9]"
            />
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 backdrop-blur-sm">
              <h3 className="font-semibold flex items-center" style={{ color: '#d17927' }}>
                3rdIslandTours.com <Globe className="ml-2 h-4 w-4 text-blue-400" />
              </h3>
            </div>
          </div>
          <p className="text-sm mb-3 text-black">Company website for a touring company in South Africa.</p>
          <div className="flex items-center justify-between mt-auto pt-2">
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-zinc-800/70 rounded text-xs text-black">JavaScript</span>
              <span className="px-2 py-1 bg-zinc-800/70 rounded text-xs text-black">HTML & CSS</span>
            </div>
            <a href="https://3rdIslandtours.com" target="_blank" rel="noopener noreferrer" className="text-sm font-medium flex items-center" style={{ color: '#d17927' }}>
              Visit <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>
        </div>
      )
    },
    {
      id: 'earth2-scripts',
      categories: ['opensource'],
      component: (
        <div className="p-5 card-hover rounded-xl overflow-hidden flex flex-col">
          <div className="h-32 relative mb-3 overflow-hidden rounded-lg">
            <Image
              src="/javascript.jpg"
              alt="Earth2 Metaverse Scripts"
              fill
              className="object-cover transition-all hover:scale-105 brightness-[0.9] object-center"
            />
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 backdrop-blur-sm">
              <h3 className="font-semibold flex items-center" style={{ color: '#d17927' }}>
                Earth2 Metaverse JavaScript Scripts <Code className="ml-2 h-4 w-4 text-yellow-400" />
              </h3>
            </div>
          </div>
          <p className="text-sm mb-3 text-black">Custom JavaScript scripts for Earth2 metaverse users. Enhanced functionality, automation, and new capabilities for the virtual world.</p>
          <div className="flex items-center justify-between mt-auto pt-2">
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-zinc-800/70 rounded text-xs text-black">JavaScript</span>
              <span className="px-2 py-1 bg-zinc-800/70 rounded text-xs text-black">Metaverse</span>
              <span className="px-2 py-1 bg-zinc-800/70 rounded text-xs text-black">Earth2</span>
            </div>
            <a href="https://www.earthie.world/script-tools" target="_blank" rel="noopener noreferrer" className="text-sm font-medium flex items-center" style={{ color: '#d17927' }}>
              See scripts <ArrowRight className="h-3 w-3 ml-1" />
            </a>
          </div>
        </div>
      )
    }
  ];

  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter(project => project.categories.includes(activeFilter));

  const handleFilterChange = (filter: Category) => {
    setActiveFilter(filter);
    // Update URL hash without page reload
    const hashMap: { [key in Category]: string } = {
      'all': '',
      'featured': 'featured',
      'client': 'clients',
      'opensource': 'opensource'
    };
    const hash = hashMap[filter];
    window.history.pushState(null, '', hash ? `#${hash}` : window.location.pathname);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start pb-24">
      <section className="w-full pt-24 sm:pt-32 px-4 flex justify-center">
        <div className="pattern-dots max-w-4xl w-full glass border border-orange-900/20 py-8 px-6 sm:px-10 mb-16 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 accent">My Digital Playground</h2>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => handleFilterChange('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeFilter === 'all'
                  ? 'bg-orange-600 text-white'
                  : 'bg-zinc-100 text-black hover:bg-zinc-200'
              }`}
            >
              View all work →
            </button>
            <button
              onClick={() => handleFilterChange('featured')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeFilter === 'featured'
                  ? 'bg-orange-600 text-white'
                  : 'bg-zinc-100 text-black hover:bg-zinc-200'
              }`}
            >
              Featured Projects
            </button>
            <button
              onClick={() => handleFilterChange('client')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeFilter === 'client'
                  ? 'bg-orange-600 text-white'
                  : 'bg-zinc-100 text-black hover:bg-zinc-200'
              }`}
            >
              Client Work
            </button>
            <button
              onClick={() => handleFilterChange('opensource')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeFilter === 'opensource'
                  ? 'bg-orange-600 text-white'
                  : 'bg-zinc-100 text-black hover:bg-zinc-200'
              }`}
            >
              Open Source
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProjects.map(project => (
              <div key={project.id}>
                {project.component}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
