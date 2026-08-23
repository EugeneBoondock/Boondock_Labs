"use client";

import type { initAgent as InitAgentType } from "clippyjs";
import { Paperclip, Send, Sparkles, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { sendToAssistant } from "./chat";

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
  role: "user" | "assistant";
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
    label: "The products",
    animation: "Searching",
    prompt: "What products does Boondock Labs build and operate?",
  },
  {
    label: "PactLoop",
    animation: "Explain",
    prompt: "What is PactLoop and who is it for?",
  },
  {
    label: "How you work",
    animation: "Congratulate",
    prompt: "How does the studio run an engagement from brief to launch?",
  },
  {
    label: "Rates and scope",
    animation: "Writing",
    prompt: "What services does the studio offer and what are typical rates?",
  },
] as const;

const CLIPPY_SCALE = 0.68;

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
    imageRendering: "auto",
    // Warm the stock sprite (blue clip on yellow pad) toward the site's ember palette.
    filter:
      "sepia(0.75) hue-rotate(-14deg) saturate(1.3) brightness(0.96) drop-shadow(0 12px 24px rgba(0, 0, 0, 0.45))",
    backfaceVisibility: "hidden",
    willChange: "transform",
  });

  const balloon = agent._balloon?._balloon;
  const content = agent._balloon?._content;
  const tip = agent._balloon?._tip;

  if (balloon) {
    balloon.classList.add("clippy-agent-bubble");
    Object.assign(balloon.style, {
      background: "rgba(18, 18, 22, 0.95)",
      color: "#ddd9d3",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      borderRadius: "14px",
      padding: "10px 12px",
      boxShadow: "0 14px 36px rgba(0, 0, 0, 0.4)",
      backdropFilter: "blur(16px)",
    });
  }

  if (content) {
    Object.assign(content.style, {
      maxWidth: "220px",
      minWidth: "140px",
      fontFamily: "var(--font-main), sans-serif",
      fontSize: "0.82rem",
      lineHeight: "1.55",
      color: "#ddd9d3",
    });
  }

  if (tip) {
    tip.style.filter = "drop-shadow(0 4px 10px rgba(0, 0, 0, 0.3))";
  }
}

function buildHistory(messages: Message[]): HistoryItem[] {
  return messages
    .filter((message) => !message.loading)
    .map((message) => ({
      role: message.role === "user" ? "user" : "assistant",
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
    const width = Math.min(380, Math.max(312, viewport.width - 24));
    // Anchor the panel by its bottom edge just above the Clippy toggle so it
    // hugs the agent and grows upward as the conversation fills in.
    const bottom = Math.min(
      Math.max(88, viewport.height - anchor.y + 44),
      viewport.height - 240,
    );
    const maxHeight = Math.min(560, viewport.height - bottom - 16);
    const right = Math.max(12, Math.min(24, viewport.width - width - 12));

    return { right, bottom, width, maxHeight };
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
        right: panelPosition.right,
        bottom: panelPosition.bottom,
        width: panelPosition.width,
        maxHeight: panelPosition.maxHeight,
      }}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="clippy-chat-titlebar">
        <span className="clippy-chat-mark" aria-hidden="true">
          <Paperclip size={15} strokeWidth={1.8} />
        </span>
        <div className="clippy-title-copy">
          <h3>Clippy</h3>
          <p>
            <i aria-hidden="true" /> Studio assistant
          </p>
        </div>
        <button
          type="button"
          className="clippy-chat-close"
          onClick={onClose}
          aria-label="Close Clippy chat"
        >
          <X size={15} />
        </button>
      </div>

      <div className="clippy-chat-messages">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`clippy-msg clippy-msg-${message.role}`}
          >
            <div
              className={`clippy-msg-bubble ${message.loading ? "clippy-loading" : ""}`}
            >
              {message.loading ? (
                <span className="clippy-dots" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
              ) : message.role === "clippy" ? (
                <ReactMarkdown>{message.text}</ReactMarkdown>
              ) : (
                message.text
              )}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {messages.some((message) => message.role === "user") ? null : (
        <div className="clippy-chat-suggestions">
          <p>Quick asks</p>
          <div>
            {QUICK_PROMPTS.map((suggestion) => (
              <button
                key={suggestion.label}
                type="button"
                className="clippy-suggestion-btn"
                onClick={() =>
                  onPrompt(suggestion.prompt, suggestion.animation)
                }
                disabled={isThinking}
              >
                {suggestion.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="clippy-chat-input-row">
        <input
          type="text"
          className="clippy-chat-input"
          placeholder={
            isThinking ? "Clippy is thinking..." : "Ask about the studio..."
          }
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
          aria-label="Send message"
        >
          <Send size={16} />
        </button>
      </div>

      <div className="clippy-provider-badge">
        <Sparkles size={11} />
        Powered by OpenAI
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
      text: "Need the fast read? Ask what the studio builds, how we work, or whether we are the right fit for your project.",
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
        const reply = await sendToAssistant(userText, history);

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
          const width = agent._el.offsetWidth || 84;
          const height = agent._el.offsetHeight || 63;
          const isMobile = window.innerWidth < 768;
          const rightMargin = isMobile ? 16 : 48;
          const bottomMargin = isMobile ? 80 : 64;
          const x = Math.max(window.innerWidth - width - rightMargin, 16);
          const y = Math.max(window.innerHeight - height - bottomMargin, 60);
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
