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

// ─── Clippy agent DOM interface ──────────────────────────────────────────────

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

// ─── Context ─────────────────────────────────────────────────────────────────

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
  speak:   () => {},
  play:    () => {},
  animate: () => {},
  show:    () => {},
  hide:    () => {},
});

export const useClippy = () => useContext(ClippyCtx);

// ─── Static fallback lines (used for idle quips & greeting only) ─────────────

export const CLIPPY_LINES = {
  greeting: "It looks like you're visiting a portfolio! Click me anytime to chat.",
  idle: [
    "Did you know? You can drag windows around by their title bar!",
    "Try double-clicking a window's title bar to maximise it!",
    "It looks like you're looking at a really cool portfolio!",
    "Click the Start button to explore all the apps!",
    "Right-click the Minesweeper grid to place flags!",
  ],
};

// ─── Message type ─────────────────────────────────────────────────────────────

interface Message {
  role: 'clippy' | 'user';
  text: string;
  loading?: boolean;
}

// ─── Suggestion prompts sent directly to Gemini ───────────────────────────────

const SUGGESTIONS = [
  { label: '📂 Projects',  anim: 'Searching',   prompt: "Tell me briefly about Eugene's main projects." },
  { label: '💼 Services',  anim: 'Explain',      prompt: "What services does Eugene offer and what are his prices?" },
  { label: '📧 Contact',   anim: 'Writing',      prompt: "How can I contact Eugene Boondock?" },
  { label: '👤 About',     anim: 'Congratulate', prompt: "Tell me about Eugene Boondock and Boondock Labs." },
];

// ─── Helper — build Gemini history from messages ─────────────────────────────

function buildHistory(msgs: Message[]): { role: 'user' | 'model'; content: string }[] {
  return msgs
    .filter(m => !m.loading)
    .map(m => ({ role: m.role === 'user' ? 'user' : 'model', content: m.text }));
}

// ─── Clip long text for the speech bubble ────────────────────────────────────

function clamp(text: string, max = 160): string {
  return text.length > max ? text.slice(0, max).trimEnd() + '…' : text;
}

// ─── Chat panel component ─────────────────────────────────────────────────────

interface ChatPanelProps {
  pos:          { x: number; y: number };
  messages:     Message[];
  isThinking:   boolean;
  onSend:       (text: string) => void;
  onSuggestion: (prompt: string, anim: string) => void;
  onClose:      () => void;
  onWave:       () => void;
}

function ClippyChatPanel({
  pos, messages, isThinking, onSend, onSuggestion, onClose, onWave,
}: ChatPanelProps) {
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const submit = () => {
    const t = input.trim();
    if (!t || isThinking) return;
    onSend(t);
    setInput('');
  };

  // Smart positioning — stay on screen
  const W = 310, H = 440, margin = 12;
  let left = pos.x - W - margin;
  let top  = pos.y - H + 60;
  if (left < 8)                          left = pos.x + 80 + margin;
  if (top  < 8)                          top  = 8;
  if (top + H > window.innerHeight - 52) top  = window.innerHeight - H - 52;

  return (
    <div
      className="clippy-chat-panel"
      style={{ left, top, width: W }}
      onClick={e => e.stopPropagation()}
    >
      {/* Classic Win98/XP blue title bar */}
      <div className="clippy-chat-titlebar">
        <img src="/win7/icons/authentic/stock_help-agent.png" alt="" className="clippy-chat-titleicon" />
        <span>Clippy — Eugene&apos;s Assistant</span>
        <button className="clippy-chat-close" onClick={onClose} title="Close">✕</button>
      </div>

      {/* Message history */}
      <div className="clippy-chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`clippy-msg clippy-msg-${m.role}`}>
            {m.role === 'clippy' && <span className="clippy-msg-icon">📎</span>}
            <span className={`clippy-msg-bubble ${m.loading ? 'clippy-loading' : ''}`}>
              {m.loading ? <span className="clippy-dots"><span /><span /><span /></span> : m.text}
            </span>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Quick suggestion buttons */}
      <div className="clippy-chat-suggestions">
        {SUGGESTIONS.map(s => (
          <button
            key={s.label}
            className="clippy-suggestion-btn"
            onClick={() => onSuggestion(s.prompt, s.anim)}
            disabled={isThinking}
          >
            {s.label}
          </button>
        ))}
        <button className="clippy-suggestion-btn" onClick={onWave} disabled={isThinking}>
          👋 Wave
        </button>
      </div>

      {/* Gemini-powered input */}
      <div className="clippy-chat-input-row">
        <input
          type="text"
          className="clippy-chat-input"
          placeholder={isThinking ? 'Clippy is thinking…' : 'Ask Clippy (powered by Gemini)…'}
          value={input}
          disabled={isThinking}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
          autoFocus
        />
        <button className="clippy-chat-send" onClick={submit} disabled={isThinking}>
          Ask
        </button>
      </div>

      {/* Gemini attribution */}
      <div className="clippy-gemini-badge">✨ Powered by Gemini AI</div>
    </div>
  );
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ClippyProvider({ children }: { children: React.ReactNode }) {
  const agentRef      = useRef<ClippyAgent | null>(null);
  const messagesRef   = useRef<Message[]>([]);          // always-fresh mirror of messages state
  const idleTimerRef  = useRef<ReturnType<typeof setInterval> | null>(null);

  const [isReady,     setIsReady]     = useState(false);
  const [chatOpen,    setChatOpen]    = useState(false);
  const [clippyPos,   setClippyPos]   = useState({ x: 0, y: 0 });
  const [isThinking,  setIsThinking]  = useState(false);
  const [messages,    setMessages]    = useState<Message[]>([
    { role: 'clippy', text: "It looks like you're visiting a portfolio! Click a suggestion or ask me anything." },
  ]);

  // Keep ref in sync with state
  useEffect(() => { messagesRef.current = messages; }, [messages]);

  // ── Low-level agent helpers ───────────────────────────────────────────────

  const speakAgent = useCallback((text: string, hold?: boolean) => {
    agentRef.current?.speak(text, hold);
  }, []);

  const playAgent = useCallback((animation: string) => {
    agentRef.current?.play(animation);
  }, []);

  // ── Gemini API call ───────────────────────────────────────────────────────

  const sendToGemini = useCallback(async (userText: string, anim = 'Explain') => {
    // 1. Add user message & loading indicator
    const withUser: Message[] = [
      ...messagesRef.current,
      { role: 'user', text: userText },
    ];
    setMessages([...withUser, { role: 'clippy', text: '', loading: true }]);
    setIsThinking(true);

    // 2. Thinking animation
    playAgent('Thinking');

    // 3. Build history (exclude the loading placeholder)
    const history = buildHistory(withUser);

    try {
      const res  = await fetch('/api/gemini', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ message: userText, history }),
      });

      const data  = await res.json();
      const reply = (data.reply as string | undefined) ??
        "It looks like I'm having trouble connecting. Try again in a moment!";

      // 4. Replace loading message with real reply
      setMessages([...withUser, { role: 'clippy', text: reply }]);

      // 5. Animate + speak (clamped for the speech bubble)
      playAgent(anim);
      setTimeout(() => speakAgent(clamp(reply)), 500);
    } catch {
      const fallback = "It looks like I lost my connection! Please try again.";
      setMessages([...withUser, { role: 'clippy', text: fallback }]);
      playAgent('Alert');
      setTimeout(() => speakAgent(fallback), 500);
    } finally {
      setIsThinking(false);
    }
  }, [playAgent, speakAgent]);

  // ── Clippy init ──────────────────────────────────────────────────────────

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const { initAgent } = await import('clippyjs');
        const { Clippy }    = await import('clippyjs/agents');

        const agent = await (initAgent as typeof InitAgentType)(Clippy);
        if (!mounted) { agent.dispose(); return; }

        agentRef.current = agent as unknown as ClippyAgent;
        setIsReady(true);
        agent.show(true);

        // Bottom-right, above taskbar
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

        // Click → toggle chat
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
          isThinking={isThinking}
          onSend={text => sendToGemini(text)}
          onSuggestion={(prompt, anim) => sendToGemini(prompt, anim)}
          onClose={() => setChatOpen(false)}
          onWave={() => { playAgent('Wave'); speakAgent("Hi there! 👋"); }}
        />
      )}
    </ClippyCtx.Provider>
  );
}
