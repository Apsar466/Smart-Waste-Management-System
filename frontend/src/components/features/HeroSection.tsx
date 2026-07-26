import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Zap, Bot, Cpu, Recycle, CheckCircle2 } from 'lucide-react';

// ── Hero Section Component ───────────────────────────────────────────────────

export function HeroSection() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-28 pb-16 overflow-hidden bg-gradient-to-b from-emerald-50/60 via-white to-slate-50/50 dark:from-slate-950 dark:via-slate-950 dark:to-emerald-950/20">
      
      {/* Background Gradients & Grid */}
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
      <div
        className="absolute top-10 left-1/4 w-[600px] h-[600px] bg-emerald-300/20 dark:bg-emerald-500/10 rounded-full blur-[160px] pointer-events-none transition-transform duration-700 ease-out"
        style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
      />
      <div
        className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-teal-300/20 dark:bg-teal-500/10 rounded-full blur-[160px] pointer-events-none transition-transform duration-700 ease-out"
        style={{ transform: `translate(${-mousePos.x}px, ${-mousePos.y}px)` }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-7 space-y-8 text-left"
        >
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="section-badge"
          >
            <Sparkles size={14} className="text-emerald-600 dark:text-emerald-400" />
            <span>AI-Powered Sustainability Platform</span>
          </motion.div>

          {/* Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="font-heading text-5xl sm:text-6xl md:text-7xl font-bold text-slate-900 dark:text-white tracking-tight leading-[1.15]"
          >
            AI-Powered
            <br />
            <span className="gradient-text">Smart Waste</span>
            <br />
            Management
          </motion.h1>

          {/* Subheadline */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-slate-600 dark:text-slate-300 text-lg sm:text-xl max-w-2xl font-body leading-relaxed"
          >
            Real-time image classification, Gemini AI recycling assistance, carbon tracking, and automated waste pickup logistics in one unified platform.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            <Link to="/register" className="btn-primary group text-base py-4 px-8">
              <span>Start Analysing</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="#ai"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('ai')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-outline text-base py-4 px-8"
            >
              <span>Explore AI</span>
              <Bot size={18} className="text-emerald-600 dark:text-emerald-400" />
            </a>
          </motion.div>

          {/* Trust Metrics */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/80 dark:border-slate-800"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center">
                <Cpu size={16} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">99.2% Accuracy</p>
                <p className="text-[10px] text-slate-500">Gemini 1.5 Flash</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center">
                <Zap size={16} className="text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">&lt;50ms Cache</p>
                <p className="text-[10px] text-slate-500">Fast Vector Hits</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-950/60 border border-green-200 dark:border-green-800 flex items-center justify-center">
                <ShieldCheck size={16} className="text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">10+ Languages</p>
                <p className="text-[10px] text-slate-500">Global AI Support</p>
              </div>
            </div>
          </motion.div>

        </motion.div>

        {/* Right Animated SVG Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-5 h-[420px] sm:h-[500px] relative flex items-center justify-center"
        >
          <div className="w-full h-full glass-card-emerald relative rounded-3xl overflow-hidden border border-emerald-200/80 dark:border-emerald-800/50 shadow-xl">
            
            {/* Header Overlay */}
            <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-emerald-200 dark:border-emerald-800 text-[11px] font-mono text-emerald-700 dark:text-emerald-400 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>AI RECYCLING CORE</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">LIVE ANIMATION</span>
            </div>

            {/* User Image */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.img
                src="/1533013630729.jpg"
                alt="EcoWaste AI Visualization"
                className="w-full h-full object-cover"
                animate={{ 
                  scale: [1, 1.02, 1],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                style={{ transform: `translate(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px)` }}
              />
              {/* Overlay gradient for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 to-transparent pointer-events-none" />
            </div>

            {/* Bottom Overlay */}
            <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between p-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-xs shadow-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span className="text-slate-700 dark:text-slate-300 font-medium">Gemini 1.5 Flash</span>
              </div>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">ONLINE</span>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
