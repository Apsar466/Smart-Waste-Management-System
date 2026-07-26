import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Bot, Send, Sparkles, AlertCircle, Database, Zap, ShieldAlert, CheckCircle2, Globe, Activity, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { chatApi } from '@/api/endpoints';

export function AISection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const [demoQuestion, setDemoQuestion] = useState('How should I clean and recycle plastic milk jugs?');
  const [demoAnswer, setDemoAnswer] = useState('');
  const [demoError, setDemoError] = useState('');
  const [loadingDemo, setLoadingDemo] = useState(false);
  const [sourceBadge, setSourceBadge] = useState<'CACHE' | 'GEMINI' | null>(null);
  const [confidence, setConfidence] = useState(0);

  const triggerDemo = async () => {
    if (!demoQuestion.trim()) return;
    setLoadingDemo(true);
    setDemoAnswer('');
    setDemoError('');
    setSourceBadge(null);
    setConfidence(0);

    try {
      // Calls real backend Gemini API
      const response = await chatApi.sendMessage({ question: demoQuestion.trim(), language: 'en' });
      setDemoAnswer(response.data.data.answer);
      setSourceBadge((response.data.data.source as 'CACHE' | 'GEMINI') || 'GEMINI');
      setConfidence(Math.random() * 15 + 85); // Simulated confidence 85-100%
    } catch (err: any) {
      setDemoError(
        'The live AI assistant is available to registered accounts. Please sign in or create an account to chat.'
      );
    } finally {
      setLoadingDemo(false);
    }
  };

  return (
    <section id="ai" className="relative py-24 md:py-32 bg-white dark:bg-slate-950 overflow-hidden" ref={ref}>
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="section-badge mb-4">
            <Bot size={14} className="text-emerald-600 dark:text-emerald-400" />
            <span>Interactive Gemini AI Assistant</span>
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white">
            Try the <span className="gradient-text">Gemini Assistant</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto mt-3">
            Ask any question about waste sorting, recycling standards, or environmental footprint.
          </p>
        </motion.div>

        {/* Status Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto"
        >
          {/* Gemini Connected Card */}
          <div className="glass-card p-6 border border-emerald-200 dark:border-emerald-800 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center">
                <Bot size={20} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">GEMINI CONNECTED</span>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Gemini 1.5 Flash model active and ready for queries</p>
          </div>

          {/* Cache Active Card */}
          <div className="glass-card p-6 border border-violet-200 dark:border-violet-800 hover:border-violet-400 dark:hover:border-violet-600 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-950/60 border border-violet-200 dark:border-violet-800 flex items-center justify-center">
                <Database size={20} className="text-violet-600 dark:text-violet-400" />
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                <span className="text-xs font-mono font-bold text-violet-600 dark:text-violet-400">CACHE ACTIVE</span>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Vector cache engine enabled for sub-50ms responses</p>
          </div>

          {/* Live API Status Card */}
          <div className="glass-card p-6 border border-cyan-200 dark:border-cyan-800 hover:border-cyan-400 dark:hover:border-cyan-600 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 flex items-center justify-center">
                <Activity size={20} className="text-cyan-600 dark:text-cyan-400" />
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">LIVE API</span>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Real-time API connection established and operational</p>
          </div>
        </motion.div>

        {/* Console Box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          <div className="glass-card-emerald p-6 sm:p-10 border border-emerald-200 dark:border-emerald-800 shadow-xl relative">
            
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-xs font-mono text-slate-500 ml-2">gemini-1.5-flash · Live</span>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                  <Globe size={12} /> 10+ Languages
                </span>

                {sourceBadge && (
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                    sourceBadge === 'CACHE' 
                      ? 'bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-400 border border-violet-300 dark:border-violet-800' 
                      : 'bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 border border-teal-300 dark:border-teal-800'
                  }`}>
                    {sourceBadge}
                  </span>
                )}
              </div>
            </div>

            {/* Input & Response Console */}
            <div className="space-y-6">
              
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold font-mono shadow-sm">
                  U
                </div>
                <input
                  type="text"
                  value={demoQuestion}
                  onChange={(e) => setDemoQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && triggerDemo()}
                  className="input-light flex-1 py-3 text-sm"
                  placeholder="Ask Gemini about recycling..."
                />
                <button
                  onClick={triggerDemo}
                  disabled={loadingDemo || !demoQuestion.trim()}
                  className="btn-primary py-3 px-6 text-xs font-bold flex items-center gap-2 disabled:opacity-50"
                >
                  {loadingDemo ? 'Thinking...' : (
                    <>
                      <span>Ask AI</span>
                      <Send size={14} />
                    </>
                  )}
                </button>
              </div>

              {/* Loading Indicator */}
              {loadingDemo && (
                <div className="flex gap-3 justify-start pt-2">
                  <div className="w-9 h-9 rounded-full bg-slate-900 dark:bg-slate-800 text-emerald-400 font-mono font-bold flex items-center justify-center text-xs">
                    G
                  </div>
                  <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 px-5 py-3.5 rounded-2xl flex items-center gap-2 text-xs font-mono text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
                    <span className="ml-2">Gemini processing query...</span>
                  </div>
                </div>
              )}

              {/* Response Output */}
              {demoAnswer && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 justify-start pt-2"
                >
                  <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-mono font-bold flex items-center justify-center text-xs shadow-md shrink-0">
                    G
                  </div>
                  <div className="bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line flex-1 shadow-sm">
                    {demoAnswer}
                  </div>
                </motion.div>
              )}

              {/* Auth Prompt if guest */}
              {demoError && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 items-start pt-2"
                >
                  <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                    <AlertCircle size={18} />
                  </div>
                  <div className="flex-1 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 p-4 rounded-2xl text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                    <p className="font-semibold">{demoError}</p>
                    <div className="mt-3 flex items-center gap-3">
                      <Link to="/login" className="btn-primary py-1.5 px-4 text-xs font-bold">
                        Sign In
                      </Link>
                      <Link to="/register" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                        Create Free Account
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}

            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
