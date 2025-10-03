'use client';

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles } from 'lucide-react';
import { sendToGemini } from './gemini';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<{role: 'user'|'ai', text: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (isOpen && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isOpen]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  async function handleChatSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setChatHistory(h => [...h, { role: 'user', text: chatInput }]);
    setLoading(true);
    setError(null);

    try {
      const aiReply = await sendToGemini(chatInput, chatHistory.map(m => ({
        role: m.role === 'ai' ? 'model' : 'user',
        content: m.text
      })));
      setChatHistory(h => [...h, { role: 'ai', text: aiReply }]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error talking to AI');
    } finally {
      setLoading(false);
      setChatInput("");
    }
  }

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-6 z-50 group"
          aria-label="Open chat with AI avatar"
        >
          <div className="relative">
            {/* Bouncing Avatar with AI Avatar Image */}
            <div className="chat-button-bounce bg-gradient-to-br from-orange-500 to-orange-600 rounded-full p-1 shadow-2xl hover:shadow-orange-500/50 transition-all hover:scale-110 border-4 border-white">
              <div className="relative w-16 h-16 rounded-full overflow-hidden">
                <Image
                  src="/ai_avatar.jpg"
                  alt="AI Avatar"
                  fill
                  className="object-cover"
                />
                {/* Sparkle overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-transparent via-transparent to-orange-400/30">
                  <Sparkles className="h-6 w-6 text-white/90 drop-shadow-lg" />
                </div>
              </div>
            </div>

            {/* Notification Badge */}
            <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-pulse shadow-lg shadow-orange-500/50">
              1
            </div>
          </div>

          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="bg-black/80 text-white text-sm px-4 py-2 rounded-lg whitespace-nowrap">
              Talk to my AI avatar ✨
            </div>
          </div>
        </button>
      )}

      {/* Chat Interface */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] animate-slide-up">
          <div className="glass shadow-2xl border-2 border-orange-200/50 flex flex-col max-h-[600px]">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-orange-200/30 bg-gradient-to-r from-orange-50/50 to-orange-100/50">
              <div className="flex items-center gap-3">
                <Image
                  src="/ai_avatar.jpg"
                  alt="AI Avatar"
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-orange-400 shadow-sm"
                />
                <div>
                  <h3 className="font-bold text-base accent">Eugene's AI Avatar</h3>
                  <p className="text-xs text-zinc-600">Always online</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/50 rounded-full transition-colors"
                aria-label="Close chat"
              >
                <X className="h-5 w-5 text-zinc-600" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white/40" style={{ minHeight: 300, maxHeight: 400 }}>
              {chatHistory.length === 0 && (
                <div className="text-center text-zinc-500 text-sm py-8">
                  <p className="mb-2">👋 Hi! I'm Eugene's AI avatar.</p>
                  <p>Ask me anything about his work, services, or projects!</p>
                </div>
              )}

              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex items-start gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'ai' && (
                    <Image
                      src="/ai_avatar.jpg"
                      alt="AI Avatar"
                      width={32}
                      height={32}
                      className="rounded-full border border-orange-200 shadow-sm flex-shrink-0"
                    />
                  )}
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                    msg.role === 'user'
                      ? 'bg-orange-500 text-white ml-auto'
                      : 'bg-white/80 text-black'
                  }`}>
                    {msg.role === 'ai' ? (
                      <div className="text-sm prose prose-sm max-w-none">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                            a: ({node, ...props}) => <a className="text-orange-600 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                            strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-2" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal ml-4 mb-2" {...props} />,
                            li: ({node, ...props}) => <li className="mb-1" {...props} />,
                            code: ({node, inline, ...props}: {node?: unknown, inline?: boolean} & React.HTMLAttributes<HTMLElement>) =>
                              inline ?
                                <code className="bg-gray-100 rounded px-1 text-xs" {...props} /> :
                                <code className="block bg-gray-100 rounded p-2 mb-2 overflow-x-auto text-xs" {...props} />,
                          }}
                        >
                          {msg.text}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm">{msg.text}</p>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-start gap-2">
                  <Image
                    src="/ai_avatar.jpg"
                    alt="AI Avatar"
                    width={32}
                    height={32}
                    className="rounded-full border border-orange-200 shadow-sm"
                  />
                  <div className="bg-white/80 rounded-2xl px-4 py-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="text-xs text-red-500 text-center bg-red-50 rounded-lg p-2">
                  {error}
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleChatSubmit} className="p-4 border-t border-orange-200/30 bg-white/60">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  className="flex-1 rounded-full px-4 py-2 border border-orange-200 bg-white/80 text-black focus:ring-2 focus:ring-orange-400 focus:border-transparent transition text-sm"
                  placeholder="Type your message..."
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  disabled={loading}
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading || !chatInput.trim()}
                  aria-label="Send message"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
