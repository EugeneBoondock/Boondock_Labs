import Image from 'next/image';
import { Globe, Code, ArrowRight, ExternalLink } from 'lucide-react';

export default function Work() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start pb-24">
      <section className="w-full pt-24 sm:pt-32 px-4 flex justify-center">
        <div className="pattern-dots max-w-4xl w-full glass border border-orange-900/20 py-8 px-6 sm:px-10 mb-16 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 accent">My Digital Playground</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* SavingWithDana.com - Backend Development */}
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
              <p className="text-sm mb-3 text-black">Currently polishing robust backend infrastructure using AWS services and modern cloud architecture for a savings and deals platform.</p>
              <div className="flex items-center justify-between mt-auto pt-2">
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-zinc-800/70 rounded text-xs text-black">AWS</span>
                  <span className="px-2 py-1 bg-zinc-800/70 rounded text-xs text-black">Backend</span>
                  <span className="px-2 py-1 bg-zinc-800/70 rounded text-xs text-black">Cloud Architecture</span>
                </div>
                <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-800 rounded">In Progress</span>
              </div>
            </div>

            {/* Morphed.io - Full Platform Development */}
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
            {/* Showcase Item 1 */}
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
              <p className="text-sm mb-3 text-black">A Community platform for the Earth2 community. Interactive and user-friendly.</p>
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
            {/* Showcase Item 4: entropysuite.co.za */}
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
            {/* Showcase Item 5: nkechi-biokinetics.vercel.app */}
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
            {/* Showcase Item 6: kin-space-jade.vercel.app */}
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
            {/* Bottom row: 3rdIslandTours.com and Earth2 Metaverse Scripts */}
            <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 3rdIslandTours.com */}
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
              {/* Earth2 Metaverse JavaScript Scripts */}
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
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 