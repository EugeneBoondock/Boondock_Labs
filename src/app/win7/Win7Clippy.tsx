"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import type { initAgent as InitAgentType } from 'clippyjs';

// Minimal public API surface we use from the Agent class
interface ClippyAgent {
  speak: (text: string, hold?: boolean) => void;
  play: (animation: string, timeout?: number, cb?: () => void) => boolean;
  show: (fast?: boolean) => void;
  hide: (fast?: boolean, callback?: () => void) => void;
  moveTo: (x: number, y: number, duration?: number) => void;
  stop: () => void;
  animate: () => void;
  dispose: () => void;
}

interface ClippyContextType {
  isReady: boolean;
  speak: (text: string, hold?: boolean) => void;
  play: (animation: string) => void;
  animate: () => void;
  show: () => void;
  hide: () => void;
}

const ClippyCtx = createContext<ClippyContextType>({
  isReady: false,
  speak: () => {},
  play: () => {},
  animate: () => {},
  show: () => {},
  hide: () => {},
});

export const useClippy = () => useContext(ClippyCtx);

// Portfolio-themed contextual messages Clippy can say
export const CLIPPY_LINES = {
  greeting: "It looks like you're browsing a portfolio! Would you like help with something?",
  projects: "It looks like you want to see projects! I found Earthie.world, Morphed.io, and more!",
  services: "It looks like you need development help! Eugene offers web apps, AI integration, and MCP servers!",
  contact: "It looks like you want to get in touch! Eugene's email is eugene@boondocklabs.com",
  about: "It looks like you want to know more about Eugene Boondock - founder of Boondock Labs!",
  minesweeper: "Careful with those mines! Right-click to flag them.",
  solitaire: "It looks like you want to play Solitaire! Try to build stacks from King down to Ace.",
  media: "It looks like you want to listen to music! Enjoy the show!",
  idle: [
    "Did you know? You can drag windows around by their title bar!",
    "Try double-clicking a window's title bar to maximize it!",
    "It looks like you're looking at a really cool portfolio!",
    "Click the Start button to explore all the apps!",
    "Right-click the Minesweeper grid to place flags!",
  ],
};

export function ClippyProvider({ children }: { children: React.ReactNode }) {
  const agentRef = useRef<ClippyAgent | null>(null);
  const [isReady, setIsReady] = useState(false);
  const idleTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const { initAgent } = await import('clippyjs');
        const agentsModule = await import('clippyjs/agents');
        const ClippyLoader = agentsModule.Clippy;

        const agent = await (initAgent as typeof InitAgentType)(ClippyLoader);
        if (!mounted) {
          agent.dispose();
          return;
        }

        agentRef.current = agent as unknown as ClippyAgent;
        setIsReady(true);

        agent.show(true);

        // Position bottom-right, near taskbar
        const x = Math.max(window.innerWidth - 220, 100);
        const y = Math.max(window.innerHeight - 280, 100);
        (agent as unknown as ClippyAgent).moveTo(x, y, 0);

        // Greeting after a short delay
        setTimeout(() => {
          if (mounted && agentRef.current) {
            agentRef.current.play('Greeting');
            setTimeout(() => {
              if (mounted && agentRef.current) {
                agentRef.current.speak(CLIPPY_LINES.greeting);
              }
            }, 1200);
          }
        }, 800);

        // Idle random quips every 90 seconds
        idleTimerRef.current = setInterval(() => {
          if (mounted && agentRef.current) {
            const lines = CLIPPY_LINES.idle;
            const msg = lines[Math.floor(Math.random() * lines.length)];
            agentRef.current.animate();
            setTimeout(() => {
              if (mounted && agentRef.current) agentRef.current.speak(msg);
            }, 1000);
          }
        }, 90_000);
      } catch (err) {
        console.warn('[Win7] Clippy unavailable:', err);
      }
    };

    init();

    return () => {
      mounted = false;
      if (idleTimerRef.current) clearInterval(idleTimerRef.current);
      if (agentRef.current) {
        try { agentRef.current.dispose(); } catch {}
        agentRef.current = null;
      }
    };
  }, []);

  const speak = useCallback((text: string, hold?: boolean) => {
    agentRef.current?.speak(text, hold);
  }, []);

  const play = useCallback((animation: string) => {
    agentRef.current?.play(animation);
  }, []);

  const animate = useCallback(() => {
    agentRef.current?.animate();
  }, []);

  const show = useCallback(() => {
    agentRef.current?.show();
  }, []);

  const hide = useCallback(() => {
    agentRef.current?.hide();
  }, []);

  return (
    <ClippyCtx.Provider value={{ isReady, speak, play, animate, show, hide }}>
      {children}
    </ClippyCtx.Provider>
  );
}
