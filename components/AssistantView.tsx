
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { askAssistant } from '../services/geminiService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const AssistantView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your Empires Property Virtual Concierge. How can I help you with your stay today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const responseText = await askAssistant(input);
    const assistantMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: responseText || "I'm sorry, I couldn't process that request." };

    setMessages(prev => [...prev, assistantMsg]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-200px)] animate-in slide-in-from-right duration-500">
      <header className="mb-4">
        <h1 className="font-serif text-3xl">AI Concierge</h1>
        <p className="text-luxury-black/60 dark:text-luxury-off/60 text-sm">Ask about wifi, appliances, or checkout.</p>
      </header>

      {/* Messages area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-4 pr-2 no-scrollbar pb-4"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-earth/20 text-earth' : 'bg-luxury-black/10 dark:bg-luxury-off/10'
                }`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                ? 'bg-earth text-white font-medium shadow-md'
                : 'glass text-luxury-black dark:text-luxury-off/90 shadow-sm'
                }`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-luxury-black/10 dark:bg-luxury-off/10 text-luxury-black dark:text-luxury-off flex items-center justify-center">
                <Bot size={16} />
              </div>
              <div className="glass p-4 rounded-2xl text-sm italic text-luxury-black/50 dark:text-luxury-off/50 flex items-center gap-2">
                <Loader2 size={14} className="animate-spin" /> Thinking...
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="mt-4 safe-area-bottom pb-4">
        <div className="glass rounded-2xl flex items-center p-2 border border-earth/20 shadow-lg">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your question..."
            className="flex-1 bg-transparent px-4 py-1.5 outline-none text-base placeholder:text-luxury-black/30 dark:placeholder:text-luxury-off/30 text-luxury-black dark:text-luxury-light"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-earth text-white p-3 rounded-xl disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssistantView;
