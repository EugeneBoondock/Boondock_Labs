import Image from 'next/image';

export default function About() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start pb-24">
      <section className="w-full pt-24 sm:pt-32 px-4 flex justify-center">
        <div className="max-w-2xl w-full glass text-left py-8 px-6 sm:px-12 mb-12 card-hover shadow-md border border-orange-900/20">
          <h2 className="text-2xl font-bold accent mb-3">A Lab for Boundless Creation</h2>
          <p className="text-base sm:text-lg mb-3 text-black leading-relaxed">
            Hi, I'm Eugene Ncube <span className="cream">(Eugene Boondock)</span> - founder of Boondock Labs. I don't just code; I build digital playgrounds, spark new experiences, and turn ambitious ideas into reality.
          </p>
          <p className="mb-3 text-black">
            Boondock Labs is my personal tech studio. Here I explore, experiment, and craft projects that matter, blending web technology, game design, and even forays into AI and digital worlds. It's more than a portfolio: it's a launchpad for unconventional thinking and digital artistry.
          </p>
          <div className="flex flex-col gap-1 mb-2">
            <p className="accent">- Building web apps and digital experiences that invite wonder.</p>
            <p className="accent">- Merging utility, play, and bold ideas.</p>
            <p className="accent">- Unafraid to experiment, always learning.</p>
          </div>
          <p className="mt-2 text-xs text-black">My mission? Connect ideas and people through beautiful code, creative energy, and a hint of magic. Welcome to Boondock Labs-let's build the future.</p>
        </div>
      </section>
    </main>
  );
} 