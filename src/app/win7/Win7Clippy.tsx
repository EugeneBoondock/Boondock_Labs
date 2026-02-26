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

interface ClippyAgent {
  speak: (text: string, hold?: boolean) => void;
  play: (animation: string, timeout?: number, cb?: () => void) => boolean;
  show: (fast?: boolean) => void;
  hide: (fast?: boolean, callback?: () => void) => void;
  moveTo: (x: number, y: number, duration?: number) => void;
  stop: () => void;
  animate: () => void;
  dispose: () => void;
  _el: HTMLElement;
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

export const CLIPPY_LINES = {
  greeting:    "It looks like you're browsing a portfolio! Would you like help with something?",
  projects:    "It looks like you want to see projects! I found Earthie.world, Morphed.io, and Platedom.com in Eugene's portfolio!",
  services:    "It looks like you need development help! Eugene offers web apps, AI integration, MCP servers, and game development!",
  contact:     "It looks like you want to get in touch! Eugene's email is eugene@boondocklabs.com — he'd love to hear from you!",
  about:       "It looks like you want to know more about Boondock Labs — Eugene Ncube's personal tech studio. He builds digital experiences that matter!",
  minesweeper: "Careful with those mines! Right-click to flag them.",
  solitaire:   "It looks like you want to play Solitaire! Try to build stacks from King down to Ace.",
  media:       "It looks like you want to listen to music! Enjoy the show!",
  idle: [
    "Did you know? You can drag windows around by their title bar!",
    "Try double-clicking a window's title bar to maximize it!",
    "It looks like you're looking at a really cool portfolio!",
    "Click the Start button to explore all the apps!",
    "Right-click the Minesweeper grid to place flags!",
  ],
};

// ─── Chat Message Types ──────────────────────────────────────────────────────

interface Message {
  role: 'clippy' | 'user';
  text: string;
}

// ─── Suggestion config ───────────────────────────────────────────────────────

const SUGGESTIONS = [
  { label: '📂 Projects',  anim: 'Searching',    line: CLIPPY_LINES.projects },
  { label: '💼 Services',  anim: 'Explain',       line: CLIPPY_LINES.services },
  { label: '📧 Contact',   anim: 'Writing',       line: CLIPPY_LINES.contact  },
  { label: '👤 About',     anim: 'Congratulate',  line: CLIPPY_LINES.about    },
];

// ─── Classic Clippy chat panel ───────────────────────────────────────────────

interface ChatPanelProps {
  pos: { x: number; y: number };
  messages: Message[];
  onSend: (text: string) => void;
  onSuggestion: (anim: string, text: string) => void;
  onClose: () => void;
  onWave: () => void;
}

function ClippyChatPanel({ pos, messages, onSend, onSuggestion, onClose, onWave }: ChatPanelProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const submit = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setInput('');
  };

  // Position the panel above/left of Clippy so it stays on screen
  const panelW = 300;
  const panelH = 420;
  const margin = 12;
  let left = pos.x - panelW - margin;
  let top  = pos.y - panelH + 60;
  if (left < 8)  left = pos.x + 80 + margin;
  if (top  < 8)  top  = 8;
  if (top + panelH > window.innerHeight - 50) top = window.innerHeight - panelH - 50;

  return (
    <div
      className="clippy-chat-panel"
      style={{ left, top, width: panelW }}
      onClick={e => e.stopPropagation()}
    >
      {/* Title bar — classic Win98/XP blue */}
      <div className="clippy-chat-titlebar">
        <img src="/win7/icons/authentic/stock_help-agent.png" alt="" className="clippy-chat-titleicon" />
        <span>Clippy</span>
        <button className="clippy-chat-close" onClick={onClose} title="Close">✕</button>
      </div>

      {/* Message area */}
      <div className="clippy-chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`clippy-msg clippy-msg-${m.role}`}>
            {m.role === 'clippy' && <span className="clippy-msg-icon">📎</span>}
            <span className="clippy-msg-bubble">{m.text}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick-action buttons */}
      <div className="clippy-chat-suggestions">
        {SUGGESTIONS.map(s => (
          <button
            key={s.label}
            className="clippy-suggestion-btn"
            onClick={() => onSuggestion(s.anim, s.line)}
          >
            {s.label}
          </button>
        ))}
        <button className="clippy-suggestion-btn" onClick={onWave}>👋 Wave</button>
      </div>

      {/* Input row */}
      <div className="clippy-chat-input-row">
        <input
          type="text"
          className="clippy-chat-input"
          placeholder="Ask Clippy…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
          autoFocus
        />
        <button className="clippy-chat-send" onClick={submit}>Ask</button>
      </div>
    </div>
  );
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function ClippyProvider({ children }: { children: React.ReactNode }) {
  const agentRef    = useRef<ClippyAgent | null>(null);
  const [isReady, setIsReady]       = useState(false);
  const [chatOpen, setChatOpen]     = useState(false);
  const [clippyPos, setClippyPos]   = useState({ x: 0, y: 0 });
  const [messages, setMessages]     = useState<Message[]>([
    { role: 'clippy', text: "It looks like you're visiting a portfolio! Click a suggestion or ask me anything." },
  ]);
  const idleTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const addMsg = useCallback((role: Message['role'], text: string) => {
    setMessages(prev => [...prev, { role, text }]);
  }, []);

  const speakAgent = useCallback((text: string, hold?: boolean) => {
    agentRef.current?.speak(text, hold);
  }, []);

  const playAgent = useCallback((animation: string) => {
    agentRef.current?.play(animation);
  }, []);

  const triggerClippy = useCallback((animation: string, text: string) => {
    playAgent(animation);
    setTimeout(() => speakAgent(text), 500);
    addMsg('clippy', text);
  }, [playAgent, speakAgent, addMsg]);

  const handleUserSend = useCallback((text: string) => {
    addMsg('user', text);
    const lower = text.toLowerCase();
    let anim = 'Thinking';
    let response = "It looks like you have a question! Try one of the suggestion buttons for quick answers.";
    if (lower.includes('project') || lower.includes('work'))          { anim = 'Searching';    response = CLIPPY_LINES.projects; }
    else if (lower.includes('service') || lower.includes('build'))    { anim = 'Explain';       response = CLIPPY_LINES.services; }
    else if (lower.includes('contact') || lower.includes('email'))    { anim = 'Writing';       response = CLIPPY_LINES.contact; }
    else if (lower.includes('about') || lower.includes('who'))        { anim = 'Congratulate';  response = CLIPPY_LINES.about; }
    else if (lower.includes('hello') || lower.includes('hi'))         { anim = 'Wave';          response = "Hello there! I'm Clippy, your portfolio guide!"; }
    else if (lower.includes('bye') || lower.includes('goodbye'))      { anim = 'GoodBye';       response = "Goodbye! Thanks for visiting Boondock Labs!"; }
    else if (lower.includes('game') || lower.includes('mines'))       { anim = 'GetTechy';      response = CLIPPY_LINES.minesweeper; }
    else if (lower.includes('music') || lower.includes('media'))      { anim = 'Processing';    response = CLIPPY_LINES.media; }
    setTimeout(() => triggerClippy(anim, response), 300);
  }, [addMsg, triggerClippy]);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const { initAgent } = await import('clippyjs');
        const agentsModule  = await import('clippyjs/agents');
        const ClippyLoader  = agentsModule.Clippy;

        const agent = await (initAgent as typeof InitAgentType)(ClippyLoader);
        if (!mounted) { agent.dispose(); return; }

        agentRef.current = agent as unknown as ClippyAgent;
        setIsReady(true);
        agent.show(true);

        // Place bottom-right, above taskbar
        const x = Math.max(window.innerWidth  - 210, 100);
        const y = Math.max(window.innerHeight - 260, 100);
        (agent as unknown as ClippyAgent).moveTo(x, y, 0);

        // Greeting
        setTimeout(() => {
          if (!mounted || !agentRef.current) return;
          agentRef.current.play('Greeting');
          setTimeout(() => {
            if (!mounted || !agentRef.current) return;
            agentRef.current.speak(CLIPPY_LINES.greeting);
          }, 1200);
        }, 800);

        // Click → open/close chat & capture position
        const el = (agent as unknown as ClippyAgent)._el;
        const handleClick = (e: MouseEvent) => {
          e.stopPropagation();
          const rect = el.getBoundingClientRect();
          setClippyPos({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
          setChatOpen(prev => !prev);
        };
        el.addEventListener('click', handleClick);

        // Idle quips every 90s
        idleTimerRef.current = setInterval(() => {
          if (!mounted || !agentRef.current) return;
          const lines = CLIPPY_LINES.idle;
          agentRef.current.animate();
          setTimeout(() => {
            if (mounted && agentRef.current)
              agentRef.current.speak(lines[Math.floor(Math.random() * lines.length)]);
          }, 1000);
        }, 90_000);

        return () => el.removeEventListener('click', handleClick);
      } catch (err) {
        console.warn('[Win7] Clippy unavailable:', err);
      }
    };

    init();

    return () => {
      mounted = false;
      if (idleTimerRef.current) clearInterval(idleTimerRef.current);
      try { agentRef.current?.dispose(); } catch {}
      agentRef.current = null;
    };
  }, []);

  const speak   = useCallback((text: string, hold?: boolean) => agentRef.current?.speak(text, hold), []);
  const play    = useCallback((animation: string) => agentRef.current?.play(animation), []);
  const animate = useCallback(() => agentRef.current?.animate(), []);
  const show    = useCallback(() => agentRef.current?.show(), []);
  const hide    = useCallback(() => agentRef.current?.hide(), []);

  return (
    <ClippyCtx.Provider value={{ isReady, speak, play, animate, show, hide }}>
      {children}

      {chatOpen && (
        <ClippyChatPanel
          pos={clippyPos}
          messages={messages}
          onSend={handleUserSend}
          onSuggestion={(anim, text) => triggerClippy(anim, text)}
          onClose={() => setChatOpen(false)}
          onWave={() => { playAgent('Wave'); speakAgent("Hi there! 👋"); }}
        />
      )}
    </ClippyCtx.Provider>
  );
}
