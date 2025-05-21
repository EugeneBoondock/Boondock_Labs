import { Braces, MessagesSquare } from 'lucide-react';

export default function Scripts() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start pb-24">
      <section className="w-full pt-24 sm:pt-32 px-4 flex justify-center">
        <div className="pattern-dots max-w-4xl w-full glass border border-orange-900/20 py-8 px-6 sm:px-10 mb-16 shadow-lg">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold accent">Lab Notes & Scripts</h2>
            <button className="text-sm font-medium text-black bg-orange-700/60 px-3 py-1.5 rounded hover:bg-orange-700/80 transition">
              All Posts
            </button>
          </div>
          <div className="space-y-6">
            {/* Blog Post 1 */}
            <div className="p-5 card-hover rounded-xl overflow-hidden border border-orange-900/10">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-600/20 rounded-lg shrink-0">
                  <Braces className="h-6 w-6" style={{ color: '#d17927' }} />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1" style={{ color: '#d17927' }}>Earth2 Auto-Marketplace Lister</h3>
                  <p className="text-xs text-black mb-2">JavaScript • Earth2 • Automation</p>
                  <p className="text-sm text-black mb-3">
                    A script that allows Earth2 users to automatically list properties on the marketplace with custom pricing strategies. Includes safeguards and monitoring.
                  </p>
                  <a href="#script1" className="text-sm font-medium underline underline-offset-2" style={{ color: '#d17927' }}>
                    View Script Documentation
                  </a>
                </div>
              </div>
            </div>
            {/* Blog Post 2 */}
            <div className="p-5 card-hover rounded-xl overflow-hidden border border-orange-900/10">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-600/20 rounded-lg shrink-0">
                  <Braces className="h-6 w-6" style={{ color: '#d17927' }} />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1" style={{ color: '#d17927' }}>Earth2 Property Data Visualizer</h3>
                  <p className="text-xs text-black mb-2">JavaScript • Data Visualization • Earth2</p>
                  <p className="text-sm text-black mb-3">
                    Enhance your Earth2 experience with advanced property data visualization. Track value changes, compare properties, and identify opportunities with this script.
                  </p>
                  <a href="#script2" className="text-sm font-medium underline underline-offset-2" style={{ color: '#d17927' }}>
                    View Script Documentation
                  </a>
                </div>
              </div>
            </div>
          </div>
          <p className="text-sm text-black mt-6 text-center">
            More scripts and tutorials coming soon! Follow for updates.
          </p>
        </div>
      </section>
    </main>
  );
} 