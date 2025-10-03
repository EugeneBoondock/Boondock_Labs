import Image from 'next/image';

export default function About() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start pb-24">
      <section className="w-full pt-24 sm:pt-32 px-4 flex justify-center">
        <div className="max-w-4xl w-full">
          {/* Main About Section */}
          <div className="glass text-left py-8 px-6 sm:px-12 mb-12 card-hover shadow-md border border-orange-900/20">
            <h2 className="text-2xl font-bold accent mb-3">A Lab for Boundless Creation</h2>
            <p className="text-base sm:text-lg mb-3 text-black leading-relaxed">
              Hi, I'm Eugene Ncube <span className="cream">(Eugene Boondock)</span> - founder of Boondock Labs. I don't just code; I build digital playgrounds, spark new experiences, and turn ambitious ideas into reality.
            </p>
            <p className="mb-6 text-black leading-relaxed">
              Boondock Labs is my personal tech studio. Here I explore, experiment, and craft projects that matter, blending web technology, game design, and even forays into AI and digital worlds. It's more than a portfolio: it's a launchpad for unconventional thinking and digital artistry.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold accent mb-3">🚀 What I Build</h3>
                <div className="flex flex-col gap-2">
                  <p className="accent text-sm">- Building web apps and digital experiences that invite wonder.</p>
                  <p className="accent text-sm">- Merging utility, play, and bold ideas.</p>
                  <p className="accent text-sm">- Unafraid to experiment, always learning.</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold accent mb-3">⚡ AI-Powered Development</h3>
                <p className="text-sm text-black mb-3">
                  In this AI revolution, I leverage cutting-edge tools to accelerate development:
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {['Cursor', 'Windsurf', 'VS Code', 'Claude Code', 'OpenAI Codex', 'GitHub'].map((tool) => (
                    <span key={tool} className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                      {tool}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-black mb-2">
                  Check out my work: <a href="https://github.com/EugeneBoondock" target="_blank" rel="noopener noreferrer" className="text-[#d17927] hover:underline font-medium">@EugeneBoondock</a>
                </p>
                <p className="text-sm text-black">
                  Projects that would take <span className="font-semibold text-orange-600">years or months</span> now complete in <span className="font-semibold text-green-600">weeks or days</span>.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold accent mb-3">💪 Development Philosophy</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <p className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span><strong>No delays:</strong> Committed to delivering on time, every time</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span><strong>GitHub mastery:</strong> Professional version control and collaboration</span>
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span><strong>Code comprehension:</strong> Deep understanding of complex systems</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span><strong>Debugging expertise:</strong> Hours spent pinpointing and resolving issues</span>
                  </p>
                </div>
              </div>
            </div>

            <p className="text-sm text-black leading-relaxed">
              My mission? Connect ideas and people through beautiful code, creative energy, and a hint of magic. Welcome to Boondock Labs—let's build the future.
            </p>
          </div>

          {/* Skills Timeline Section */}
          <div className="glass text-left py-8 px-6 sm:px-12 card-hover shadow-md border border-orange-900/20">
            <h2 className="text-2xl font-bold accent mb-6">Technical Journey & Expertise</h2>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">1</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold accent mb-2">Foundation Building</h3>
                  <p className="text-sm text-zinc-700 mb-2">Started with HTML, CSS, JavaScript fundamentals</p>
                  <div className="flex flex-wrap gap-1">
                    <span className="px-2 py-1 bg-zinc-100 text-zinc-700 rounded text-xs">HTML5</span>
                    <span className="px-2 py-1 bg-zinc-100 text-zinc-700 rounded text-xs">CSS3</span>
                    <span className="px-2 py-1 bg-zinc-100 text-zinc-700 rounded text-xs">Vanilla JS</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">2</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold accent mb-2">Modern Frameworks</h3>
                  <p className="text-sm text-zinc-700 mb-2">Mastered React, Next.js, and full-stack development</p>
                  <div className="flex flex-wrap gap-1">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">React</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Next.js</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Node.js</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">TypeScript</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">3</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold accent mb-2">AI Integration & Acceleration</h3>
                  <p className="text-sm text-zinc-700 mb-2">Embracing AI tools to 10x development speed and quality</p>
                  <div className="flex flex-wrap gap-1">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">AI Tools</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">Automation</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">Rapid Prototyping</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Result:</strong> Complex projects that once took months or years now complete in weeks or days, with superior quality and no delays.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 