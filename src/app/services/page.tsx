import { Globe, Gamepad2, Code, Cpu, ArrowRight } from 'lucide-react';

export default function Services() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start pb-24">
      <section className="w-full pt-24 sm:pt-32 px-4 flex justify-center">
        <div className="max-w-4xl w-full glass grid-pattern border border-orange-900/20 py-8 px-6 sm:px-10 mb-16 shadow-lg">
          <h2 className="text-2xl font-bold mb-5 accent">What I Can Build For You</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
          </div>
        </div>
      </section>
    </main>
  );
} 