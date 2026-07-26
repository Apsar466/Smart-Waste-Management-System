import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Database, Zap, RefreshCw, Trash2, Plus, MessageSquare, Clock } from 'lucide-react';
import { chatApi } from '@/api/endpoints';
import type { ChatMessage } from '@/types';
import { useAuth } from '@/store/AuthContext';
import { toast } from 'sonner';

export function ChatPage() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Fetch past chat history from real backend
  const { data: historyResp, isLoading } = useQuery({
    queryKey: ['chatHistory'],
    queryFn: () => chatApi.getHistory(),
  });

  useEffect(() => {
    if (historyResp?.data?.data?.content) {
      setMessages(historyResp.data.data.content);
    }
  }, [historyResp]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMutation = useMutation({
    mutationFn: (q: string) => chatApi.sendMessage({ question: q, language: 'en' }),
    onSuccess: (resp) => {
      const newMsg = resp.data.data;
      setMessages((prev) => [...prev, newMsg]);
      setQuestion('');
      queryClient.invalidateQueries({ queryKey: ['chatHistory'] });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Failed to get response from Gemini AI.';
      toast.error(msg);
    },
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || sendMutation.isPending) return;
    sendMutation.mutate(question.trim());
  };

  const handleNewChat = () => {
    setMessages([]);
    setQuestion('');
    toast.success('Started new conversation');
  };

  const suggestedPrompts = [
    "How do I recycle electronic waste?",
    "Where can I dispose of used lithium batteries?",
    "What plastic resin numbers are recyclable?",
    "How can I reduce my household waste?",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/60 via-white to-teal-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/20 text-slate-900 dark:text-slate-100 flex">
      
      {/* Left Sidebar - Recent Chats */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ duration: 0.3 }}
        className="w-80 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col shrink-0"
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={handleNewChat}
            className="w-full btn-primary py-3 text-sm font-bold flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            <span>New Chat</span>
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <div className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-3">Recent Chats</div>
          
          {messages.length > 0 ? (
            messages.slice(-5).reverse().map((msg, idx) => (
              <div
                key={msg.id || idx}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <MessageSquare size={14} className="text-emerald-500" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                    {msg.question.slice(0, 30)}...
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-500">
                  <Clock size={10} />
                  <span>{new Date(msg.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-xs text-slate-500">
              No chat history yet
            </div>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-xs font-bold">
              {user?.fullName?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{user?.fullName ?? 'User'}</p>
              <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header Bar */}
        <div className="glass-card p-4 sm:p-6 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-all lg:hidden"
            >
              <MessageSquare size={18} className="text-slate-600 dark:text-slate-400" />
            </button>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white shadow-glow-sm">
              <Bot size={20} />
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold tracking-tight">Gemini AI Recycling Assistant</h1>
              <p className="text-xs text-slate-400">Natural language advice & waste reduction strategies</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold hidden sm:inline-block">
              MODEL: GEMINI 1.5 FLASH
            </span>
            <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full ${
              messages.some(m => m.source === 'CACHE')
                ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
            }`}>
              {messages.some(m => m.source === 'CACHE') ? 'CACHE ACTIVE' : 'LIVE API'}
            </span>
          </div>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {messages.length === 0 && !isLoading && (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-6">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-glow-sm">
                <Sparkles size={36} />
              </div>
              <div>
                <h3 className="font-heading text-2xl font-bold text-slate-900 dark:text-white mb-2">Ask Gemini Anything</h3>
                <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
                  Get instant answers about recycling, waste disposal, and environmental impact from our AI assistant.
                </p>
              </div>
              
              {/* Suggested Prompts */}
              <div className="grid sm:grid-cols-2 gap-3 max-w-2xl mx-auto w-full">
                {suggestedPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQuestion(prompt)}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-700 text-left transition-all group"
                  >
                    <p className="text-xs text-slate-700 dark:text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {prompt}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className="space-y-4 max-w-4xl mx-auto w-full">
              
              {/* User Question */}
              <div className="flex justify-end gap-3">
                <div className="bg-emerald-600/30 border border-emerald-500/40 p-4 rounded-2xl max-w-2xl text-sm text-slate-100 leading-relaxed">
                  {msg.question}
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {user?.fullName?.[0]?.toUpperCase() ?? 'U'}
                </div>
              </div>

              {/* Gemini Answer */}
              <div className="flex justify-start gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-white/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-sm font-bold shrink-0">
                  G
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl max-w-2xl text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line relative group shadow-sm">
                  {msg.source && (
                    <span className={`absolute -top-2.5 right-4 text-[9px] font-mono font-bold px-2 py-0.5 rounded-md ${
                      msg.source === 'CACHE' 
                        ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30' 
                        : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    }`}>
                      {msg.source}
                    </span>
                  )}
                  {msg.answer}
                </div>
              </div>

            </div>
          ))}

          {sendMutation.isPending && (
            <div className="flex justify-start gap-3 max-w-4xl mx-auto w-full">
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-white/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-sm font-bold shrink-0">
                G
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-5 py-4 rounded-2xl flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
                <span className="ml-2">Gemini thinking...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Chat Input Console - Fixed at Bottom */}
        <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shrink-0">
          <form onSubmit={handleSend} className="max-w-4xl mx-auto">
            <div className="flex gap-3">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a question about recycling or waste disposal..."
                className="input-light flex-1 py-4 text-sm"
              />
              <button
                type="submit"
                disabled={!question.trim() || sendMutation.isPending}
                className="btn-primary py-4 px-6 text-sm font-bold flex items-center gap-2 disabled:opacity-50 shrink-0"
              >
                <span>Send</span>
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>

      </div>

    </div>
  );
}
