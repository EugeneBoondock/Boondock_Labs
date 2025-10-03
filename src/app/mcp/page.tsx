'use client';

import { Network, Code, Terminal, CheckCircle2, ArrowRight, ExternalLink, Zap, Shield, Layers, Package, FileCode, GitBranch, Server, Blocks, Cpu, Globe } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function MCPPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start pb-24">
      {/* Hero Section */}
      <section className="w-full pt-24 sm:pt-32 px-4 flex justify-center mb-12">
        <div className="max-w-5xl w-full text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-orange-600 to-orange-400 rounded-2xl mr-4 shadow-lg">
              <Network className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold accent">Model Context Protocol</h1>
          </div>
          <p className="text-xl text-black mb-4 max-w-3xl mx-auto">
            Building custom MCP servers from scratch, transforming APIs into powerful AI-integrated tools
          </p>
          <p className="text-base text-zinc-700 max-w-2xl mx-auto">
            Specializing in creating Model Context Protocol servers that connect your business data with AI platforms like Claude, ChatGPT, and Replit
          </p>
        </div>
      </section>

      {/* Platform Integration Section */}
      <section className="w-full px-4 flex justify-center mb-16">
        <div className="max-w-5xl w-full glass shadow-xl py-8 px-6 sm:px-10 border border-orange-900/20">
          <h2 className="text-2xl font-bold accent mb-6 text-center">AI Platforms with MCP Integration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Claude Desktop */}
            <div className="p-5 bg-white/60 rounded-xl border border-orange-200 hover:shadow-lg transition-all group">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-white rounded-xl mb-3 group-hover:scale-110 transition-transform">
                  <Image src="/claude-color.svg" alt="Claude" width={32} height={32} />
                </div>
                <h3 className="font-bold text-lg accent mb-2">Claude Desktop</h3>
                <p className="text-sm text-zinc-700 mb-3">Native MCP support for seamless AI integration with your tools</p>
                <a
                  href="https://claude.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-orange-600 hover:underline flex items-center"
                >
                  Learn more <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            </div>

            {/* ChatGPT */}
            <div className="p-5 bg-white/60 rounded-xl border border-orange-200 hover:shadow-lg transition-all group">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-white rounded-xl mb-3 group-hover:scale-110 transition-transform">
                  <Image src="/chatgpt.svg" alt="ChatGPT" width={32} height={32} />
                </div>
                <h3 className="font-bold text-lg accent mb-2">ChatGPT</h3>
                <p className="text-sm text-zinc-700 mb-3">Connect your custom tools to OpenAI's ChatGPT platform</p>
                <a
                  href="https://openai.com/chatgpt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-orange-600 hover:underline flex items-center"
                >
                  Learn more <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            </div>

            {/* Replit */}
            <div className="p-5 bg-white/60 rounded-xl border border-orange-200 hover:shadow-lg transition-all group">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-white rounded-xl mb-3 group-hover:scale-110 transition-transform">
                  <Image src="/replit-logo.svg" alt="Replit" width={32} height={32} />
                </div>
                <h3 className="font-bold text-lg accent mb-2">Replit Agent</h3>
                <p className="text-sm text-zinc-700 mb-3">MCP integration for AI-powered development workflows</p>
                <a
                  href="https://replit.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-orange-600 hover:underline flex items-center"
                >
                  Learn more <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            </div>

            {/* Other Platforms */}
            <div className="p-5 bg-white/60 rounded-xl border border-orange-200 hover:shadow-lg transition-all group">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl mb-3 group-hover:scale-110 transition-transform">
                  <Blocks className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg accent mb-2">More Platforms</h3>
                <p className="text-sm text-zinc-700 mb-3">Growing ecosystem of AI tools supporting MCP protocol</p>
                <span className="text-xs text-zinc-500 italic">Coming soon</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is MCP Section */}
      <section className="w-full px-4 flex justify-center mb-16">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Explanation */}
          <div className="glass shadow-lg p-8 border border-orange-900/20">
            <h2 className="text-2xl font-bold accent mb-4 flex items-center">
              <Terminal className="h-6 w-6 mr-3" />
              What is MCP?
            </h2>
            <p className="text-base text-black mb-4 leading-relaxed">
              Model Context Protocol (MCP) is an open protocol that standardizes how applications provide context to Large Language Models (LLMs). It enables AI assistants like Claude to securely connect with your data sources and tools.
            </p>
            <p className="text-base text-black mb-4 leading-relaxed">
              Think of it as a universal adapter that lets AI understand and interact with your business systems, databases, and APIs in a secure, controlled way.
            </p>
            <div className="mt-6 space-y-3">
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-orange-600 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-black">Standardized protocol for AI-data integration</span>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-orange-600 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-black">Secure, controlled access to your data</span>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-orange-600 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-black">Works with multiple AI platforms</span>
              </div>
            </div>
          </div>

          {/* Why MCP */}
          <div className="glass shadow-lg p-8 border border-orange-900/20">
            <h2 className="text-2xl font-bold accent mb-4 flex items-center">
              <Zap className="h-6 w-6 mr-3" />
              Why Build MCP Servers?
            </h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="p-2 bg-orange-100 rounded-lg mr-3 mt-0.5">
                  <Shield className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-black mb-1">Secure Data Access</h3>
                  <p className="text-sm text-zinc-700">Control exactly what data AI can access with fine-grained permissions</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="p-2 bg-orange-100 rounded-lg mr-3 mt-0.5">
                  <Layers className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-black mb-1">Business Integration</h3>
                  <p className="text-sm text-zinc-700">Connect AI directly to your CRM, databases, and internal tools</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="p-2 bg-orange-100 rounded-lg mr-3 mt-0.5">
                  <Server className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-black mb-1">Custom Capabilities</h3>
                  <p className="text-sm text-zinc-700">Build specialized tools tailored to your business workflows</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* My MCP Work */}
      <section className="w-full px-4 flex justify-center mb-16">
        <div className="max-w-5xl w-full glass shadow-xl py-8 px-6 sm:px-10 border border-orange-900/20">
          <h2 className="text-2xl font-bold accent mb-6 flex items-center justify-center">
            <Package className="h-6 w-6 mr-3" />
            My MCP Server Projects
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Morphed MCP Server */}
            <a
              href="https://www.npmjs.com/package/morphed-mcp-server"
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 bg-white/60 hover:bg-white/80 rounded-xl border-2 border-orange-200 hover:border-orange-400 transition-all group"
            >
              <div className="flex items-center mb-3">
                <Network className="h-6 w-6 text-orange-600 mr-2" />
                <h3 className="font-bold text-lg accent">morphed-mcp-server</h3>
              </div>
              <p className="text-sm text-zinc-700 mb-4">
                Complete MCP server for Morphed.io platform. Built from scratch with authentication, database integration, and 15+ custom tools.
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-xs text-black">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                  HubSpot OAuth integration
                </div>
                <div className="flex items-center text-xs text-black">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                  PostgreSQL database connection
                </div>
                <div className="flex items-center text-xs text-black">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                  Custom audit & blueprint tools
                </div>
              </div>
              <div className="flex items-center text-sm text-orange-600 group-hover:underline">
                View on NPM <ExternalLink className="h-4 w-4 ml-1" />
              </div>
            </a>

            {/* HubSpot MCP Server */}
            <a
              href="https://www.npmjs.com/package/hubspot-mcp-server"
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 bg-white/60 hover:bg-white/80 rounded-xl border-2 border-orange-200 hover:border-orange-400 transition-all group"
            >
              <div className="flex items-center mb-3">
                <Network className="h-6 w-6 text-orange-600 mr-2" />
                <h3 className="font-bold text-lg accent">hubspot-mcp-server</h3>
              </div>
              <p className="text-sm text-zinc-700 mb-4">
                Enhanced MCP server built on top of morphed-mcp-server with additional HubSpot-specific features and improvements.
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-xs text-black">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                  Extended tool capabilities
                </div>
                <div className="flex items-center text-xs text-black">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                  Advanced data analysis
                </div>
                <div className="flex items-center text-xs text-black">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                  Portfolio management
                </div>
              </div>
              <div className="flex items-center text-sm text-orange-600 group-hover:underline">
                View on NPM <ExternalLink className="h-4 w-4 ml-1" />
              </div>
            </a>

            {/* Earth2 API Wrapper */}
            <a
              href="https://www.npmjs.com/package/earth2-api-wrapper"
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 bg-white/60 hover:bg-white/80 rounded-xl border-2 border-orange-200 hover:border-orange-400 transition-all group"
            >
              <div className="flex items-center mb-3">
                <Package className="h-6 w-6 text-orange-600 mr-2" />
                <h3 className="font-bold text-lg accent">earth2-api-wrapper</h3>
              </div>
              <p className="text-sm text-zinc-700 mb-4">
                API wrapper for Earth2 platform. Foundation for building MCP tools that integrate with metaverse platforms.
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-xs text-black">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                  RESTful API wrapper
                </div>
                <div className="flex items-center text-xs text-black">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                  Type-safe integration
                </div>
                <div className="flex items-center text-xs text-black">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                  MCP-ready architecture
                </div>
              </div>
              <div className="flex items-center text-sm text-orange-600 group-hover:underline">
                View on NPM <ExternalLink className="h-4 w-4 ml-1" />
              </div>
            </a>
          </div>

          <div className="bg-orange-50/50 rounded-xl p-6 border border-orange-100">
            <h3 className="font-bold text-lg accent mb-3">Technology Stack</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center text-sm text-black">
                <FileCode className="h-4 w-4 text-orange-600 mr-2" />
                Node.js / ES Modules
              </div>
              <div className="flex items-center text-sm text-black">
                <GitBranch className="h-4 w-4 text-orange-600 mr-2" />
                MCP SDK
              </div>
              <div className="flex items-center text-sm text-black">
                <Server className="h-4 w-4 text-orange-600 mr-2" />
                PostgreSQL
              </div>
              <div className="flex items-center text-sm text-black">
                <Shield className="h-4 w-4 text-orange-600 mr-2" />
                OAuth 2.0
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How I Build MCP Servers */}
      <section className="w-full px-4 flex justify-center mb-16">
        <div className="max-w-5xl w-full glass shadow-xl py-8 px-6 sm:px-10 border border-orange-900/20">
          <h2 className="text-2xl font-bold accent mb-6 text-center">How I Build MCP Servers</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Step 1 */}
            <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl border border-orange-200">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-orange-600 text-white rounded-full font-bold mr-3">1</div>
                <h3 className="text-lg font-bold accent">Architecture Design</h3>
              </div>
              <p className="text-sm text-black mb-3">Define server structure, tools, and data flow. Map out authentication strategy and API endpoints.</p>
              <ul className="space-y-1 text-xs text-zinc-700">
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2 text-orange-600" />
                  Tool definitions & schemas
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2 text-orange-600" />
                  Authentication flow
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2 text-orange-600" />
                  Database integration
                </li>
              </ul>
            </div>

            {/* Step 2 */}
            <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl border border-orange-200">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-orange-600 text-white rounded-full font-bold mr-3">2</div>
                <h3 className="text-lg font-bold accent">API Development</h3>
              </div>
              <p className="text-sm text-black mb-3">Build custom API endpoints or wrap existing APIs. Implement data fetching, transformation, and validation.</p>
              <ul className="space-y-1 text-xs text-zinc-700">
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2 text-orange-600" />
                  RESTful endpoint creation
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2 text-orange-600" />
                  Data transformation
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2 text-orange-600" />
                  Error handling
                </li>
              </ul>
            </div>

            {/* Step 3 */}
            <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl border border-orange-200">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-orange-600 text-white rounded-full font-bold mr-3">3</div>
                <h3 className="text-lg font-bold accent">MCP Tool Creation</h3>
              </div>
              <p className="text-sm text-black mb-3">Transform APIs into MCP tools using the Model Context Protocol SDK. Define schemas and handlers.</p>
              <ul className="space-y-1 text-xs text-zinc-700">
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2 text-orange-600" />
                  Tool schema definition
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2 text-orange-600" />
                  Request handlers
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2 text-orange-600" />
                  Response formatting
                </li>
              </ul>
            </div>

            {/* Step 4 */}
            <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl border border-orange-200">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-orange-600 text-white rounded-full font-bold mr-3">4</div>
                <h3 className="text-lg font-bold accent">Testing & Publishing</h3>
              </div>
              <p className="text-sm text-black mb-3">Comprehensive testing, documentation, and NPM publishing. Ensure compatibility across platforms.</p>
              <ul className="space-y-1 text-xs text-zinc-700">
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2 text-orange-600" />
                  Unit & integration tests
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2 text-orange-600" />
                  Documentation & README
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2 text-orange-600" />
                  NPM package publishing
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full px-4 flex justify-center">
        <div className="max-w-3xl w-full glass shadow-xl py-10 px-8 text-center border border-orange-900/20">
          <h2 className="text-2xl font-bold accent mb-4">Ready to Build Your MCP Server?</h2>
          <p className="text-base text-black mb-6">
            Let's transform your APIs and data into powerful AI-integrated tools that work seamlessly with Claude, ChatGPT, and other AI platforms.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#pricing"
              className="btn-primary px-6 py-3 !text-white !bg-[#d17927] hover:!bg-orange-700 transition-all inline-flex items-center justify-center"
            >
              View Pricing <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="btn-primary px-6 py-3 bg-white/60 hover:bg-white/80 border-2 border-orange-600 text-orange-600 transition-all inline-flex items-center justify-center"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
