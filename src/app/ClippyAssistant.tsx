"use client";

import { Send, Sparkles, X } from "lucide-react";
import type { initAgent as InitAgentType } from "clippyjs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { sendToGemini } from "./gemini";

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
  _animator?: {
    _sounds?: Record<string, HTMLAudioElement>;
  };
  _balloon?: {
    _balloon?: HTMLElement;
    _content?: HTMLElement;
    _tip?: HTMLElement;
  };
}

type Message = {
  role: "clippy" | "user";
  text: string;
  loading?: boolean;
};

type HistoryItem = {
  role: "user" | "model";
  content: string;
};

const CLIPPY_LINES = {
  greeting:
    "It looks like you're reviewing a portfolio. Click me if you want the sharp summary.",
  idle: [
    "Need the short version? Ask me which project proves the most range.",
    "I can walk you through Eugene's stack, process, or rates.",
    "Want to know whether Eugene is a fit for your team? Ask directly.",
    "I can summarize the AI, backend, or product side of the work.",
  ],
} as const;

const QUICK_PROMPTS = [
  {
    label: "Best projects",
    animation: "Searching",
    prompt: "Which projects best show Eugene's range and why?",
  },
  {
    label: "AI work",
    animation: "Explain",
    prompt: "How does Eugene use AI in real client and product work?",
  },
  {
    label: "Hiring fit",
    animation: "Congratulate",
    prompt: "What kind of roles or teams would Eugene be a strong fit for?",
  },
  {
    label: "Rates and scope",
    animation: "Writing",
    prompt: "What services does Eugene offer and what are his typical rates?",
  },
] as const;

const CLIPPY_SCALE = 1.28;

function muteAgentSounds(agent: ClippyAgent | null) {
  const sounds = agent?._animator?._sounds;

  if (!sounds) {
    return;
  }

  for (const sound of Object.values(sounds)) {
    sound.muted = true;
    sound.volume = 0;
  }
}

function enhanceClippyPresentation(agent: ClippyAgent | null) {
  if (!agent) {
    return;
  }

  agent._el.classList.add("clippy-agent-shell");
  agent._el.setAttribute("aria-label", "Clippy portfolio assistant");

  Object.assign(agent._el.style, {
    transform: `translateZ(0) scale(${CLIPPY_SCALE})`,
    transformOrigin: "bottom right",
    filter:
      "drop-shadow(0 28px 42px rgba(15, 16, 12, 0.22)) saturate(1.08) contrast(1.05)",
    backfaceVisibility: "hidden",
    willChange: "transform, filter",
  });

  const balloon = agent._balloon?._balloon;
  const content = agent._balloon?._content;
  const tip = agent._balloon?._tip;

  if (balloon) {
    balloon.classList.add("clippy-agent-bubble");
    Object.assign(balloon.style, {
      background: "rgba(255, 252, 247, 0.97)",
      color: "#141510",
      border: "1px solid rgba(18, 19, 15, 0.1)",
      borderRadius: "18px",
      padding: "12px 14px",
      boxShadow: "0 22px 55px rgba(20, 20, 16, 0.16)",
      backdropFilter: "blur(14px)",
    });
  }

  if (content) {
    Object.assign(content.style, {
      maxWidth: "260px",
      minWidth: "160px",
      fontFamily: "var(--font-main), sans-serif",
      fontSize: "0.95rem",
      lineHeight: "1.65",
      color: "#141510",
    });
  }

  if (tip) {
    tip.style.filter = "drop-shadow(0 8px 16px rgba(20, 20, 16, 0.1))";
  }
}

function buildHistory(messages: Message[]): HistoryItem[] {
  return messages
    .filter((message) => !message.loading)
    .map((message) => ({
      role: message.role === "user" ? "user" : "model",
      content: message.text,
    }));
}

function clampForSpeech(text: string, max = 180) {
  return text.length > max ? `${text.slice(0, max).trimEnd()}...` : text;
}

function ClippyPanel({
  anchor,
  messages,
  isThinking,
  onClose,
  onSend,
  onPrompt,
}: {
  anchor: { x: number; y: number };
  messages: Message[];
  isThinking: boolean;
  onClose: () => void;
  onSend: (text: string) => void;
  onPrompt: (prompt: string, animation: string) => void;
}) {
  const [input, setInput] = useState("");
  const [viewport, setViewport] = useState({ width: 1280, height: 720 });
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);

    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const panelPosition = useMemo(() => {
    const margin = 12;
    const width = Math.min(380, Math.max(312, viewport.width - 24));
    const height = Math.min(560, Math.max(420, viewport.height - 32));

    let left = anchor.x - width - margin;
    let top = anchor.y - height + 80;

    if (left < 12) {
      left = Math.min(anchor.x + 78, viewport.width - width - 12);
    }

    if (top < 12) {
      top = 12;
    }

    if (top + height > viewport.height - 12) {
      top = viewport.height - height - 12;
    }

    return { left, top, width, height };
  }, [anchor, viewport.height, viewport.width]);

  const submit = () => {
    const trimmed = input.trim();

    if (!trimmed || isThinking) {
      return;
    }

    onSend(trimmed);
    setInput("");
  };

  return (
    <div
      className="clippy-chat-panel"
      style={{
        left: panelPosition.left,
        top: panelPosition.top,
        width: panelPosition.width,
        maxHeight: panelPosition.height,
      }}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="clippy-chat-titlebar">
        <div className="clippy-title-copy">
          <p className="mono-label">Clippy</p>
          <h3>Portfolio assistant</h3>
        </div>
        <button
          type="button"
          className="clippy-chat-close"
          onClick={onClose}
          aria-label="Close Clippy chat"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="clippy-chat-caption">
        Ask about project depth, hiring fit, process, pricing, or specific builds.
      </div>

      <div className="clippy-chat-messages">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`clippy-msg clippy-msg-${message.role}`}
          >
            {message.role === "clippy" && (
              <span className="clippy-msg-icon">C</span>
            )}
            <span
              className={`clippy-msg-bubble ${message.loading ? "clippy-loading" : ""}`}
            >
              {message.loading ? (
                <span className="clippy-dots" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
              ) : (
                message.text
              )}
            </span>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="clippy-chat-suggestions">
        {QUICK_PROMPTS.map((suggestion) => (
          <button
            key={suggestion.label}
            type="button"
            className="clippy-suggestion-btn"
            onClick={() => onPrompt(suggestion.prompt, suggestion.animation)}
            disabled={isThinking}
          >
            {suggestion.label}
          </button>
        ))}
      </div>

      <div className="clippy-chat-input-row">
        <input
          type="text"
          className="clippy-chat-input"
          placeholder={isThinking ? "Clippy is thinking..." : "Ask Clippy anything..."}
          value={input}
          disabled={isThinking}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              submit();
            }
          }}
        />
        <button
          type="button"
          className="clippy-chat-send"
          onClick={submit}
          disabled={isThinking || !input.trim()}
        >
          <Send className="h-4 w-4" />
          Send
        </button>
      </div>

      <div className="clippy-gemini-badge">
        <Sparkles className="h-3.5 w-3.5" />
        Powered by Gemini
      </div>
    </div>
  );
}

export default function ClippyAssistant({
  children,
}: {
  children: React.ReactNode;
}) {
  const agentRef = useRef<ClippyAgent | null>(null);
  const messagesRef = useRef<Message[]>([]);
  const idleTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const clickCleanupRef = useRef<(() => void) | null>(null);
  const chatOpenRef = useRef(false);
  const thinkingRef = useRef(false);

  const [chatOpen, setChatOpen] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [anchor, setAnchor] = useState({ x: 0, y: 0 });
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "clippy",
      text: "Need the fast read? Ask me what Eugene builds, how he works, or whether he fits your team.",
    },
  ]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    chatOpenRef.current = chatOpen;
  }, [chatOpen]);

  useEffect(() => {
    thinkingRef.current = isThinking;
  }, [isThinking]);

  const speak = useCallback((text: string, hold?: boolean) => {
    agentRef.current?.speak(text, hold);
  }, []);

  const play = useCallback((animation: string) => {
    muteAgentSounds(agentRef.current);
    agentRef.current?.play(animation);
  }, []);

  const sendMessage = useCallback(
    async (userText: string, animation = "Explain") => {
      const history = buildHistory(messagesRef.current);
      const withUser: Message[] = [
        ...messagesRef.current,
        { role: "user", text: userText },
      ];

      setMessages([...withUser, { role: "clippy", text: "", loading: true }]);
      setIsThinking(true);
      play("Thinking");

      try {
        const reply = await sendToGemini(userText, history);

        setMessages([...withUser, { role: "clippy", text: reply }]);
        play(animation);
        window.setTimeout(() => {
          speak(clampForSpeech(reply));
        }, 450);
      } catch {
        const fallback =
          "I hit a connection problem for a moment. Try again and I will pick it up from there.";

        setMessages([...withUser, { role: "clippy", text: fallback }]);
        play("Alert");
        window.setTimeout(() => {
          speak(fallback);
        }, 350);
      } finally {
        setIsThinking(false);
      }
    },
    [play, speak],
  );

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const { initAgent } = await import("clippyjs");
        const { Clippy } = await import("clippyjs/agents");

        const instance = await (initAgent as typeof InitAgentType)(Clippy);

        if (!mounted) {
          instance.dispose();
          return;
        }

        const agent = instance as unknown as ClippyAgent;
        agentRef.current = agent;
        muteAgentSounds(agent);
        agent.show(true);
        enhanceClippyPresentation(agent);

        const moveToDefaultPosition = () => {
          const width = agent._el.offsetWidth || 124;
          const height = agent._el.offsetHeight || 93;
          const x = Math.max(window.innerWidth - width - 44, 84);
          const y = Math.max(window.innerHeight - height - 38, 96);
          agent.moveTo(x, y, 0);
        };

        moveToDefaultPosition();
        window.addEventListener("resize", moveToDefaultPosition);

        window.setTimeout(() => {
          if (!mounted || !agentRef.current) {
            return;
          }

          agentRef.current.play("Greeting");
          window.setTimeout(() => {
            if (mounted && agentRef.current) {
              agentRef.current.speak(CLIPPY_LINES.greeting);
            }
          }, 900);
        }, 700);

        const handleClick = (event: MouseEvent) => {
          event.stopPropagation();
          const rect = agent._el.getBoundingClientRect();

          setAnchor({
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
          });
          setChatOpen((current) => !current);
        };

        agent._el.addEventListener("click", handleClick);
        clickCleanupRef.current = () => {
          agent._el.removeEventListener("click", handleClick);
          window.removeEventListener("resize", moveToDefaultPosition);
        };

        idleTimerRef.current = setInterval(() => {
          if (!mounted || !agentRef.current || thinkingRef.current) {
            return;
          }

          const line =
            CLIPPY_LINES.idle[
              Math.floor(Math.random() * CLIPPY_LINES.idle.length)
            ];

          agentRef.current.animate();
          window.setTimeout(() => {
            if (mounted && agentRef.current && !chatOpenRef.current) {
              agentRef.current.speak(line);
            }
          }, 850);
        }, 90000);
      } catch (error) {
        console.warn("[ClippyAssistant] Failed to initialize Clippy.", error);
      }
    };

    init();

    return () => {
      mounted = false;
      clickCleanupRef.current?.();

      if (idleTimerRef.current) {
        clearInterval(idleTimerRef.current);
      }

      try {
        agentRef.current?.dispose();
      } catch {
        // Ignore disposal failures from the third-party library.
      }

      agentRef.current = null;
    };
  }, []);

  return (
    <>
      {children}

      {chatOpen ? (
        <ClippyPanel
          anchor={anchor}
          messages={messages}
          isThinking={isThinking}
          onClose={() => setChatOpen(false)}
          onSend={(text) => sendMessage(text)}
          onPrompt={(prompt, animation) => sendMessage(prompt, animation)}
        />
      ) : null}
    </>
  );
}
