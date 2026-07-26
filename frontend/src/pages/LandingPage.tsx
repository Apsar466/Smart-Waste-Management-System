import { HeroSection } from '@/components/features/HeroSection';
import { FeaturesSection } from '@/components/features/FeaturesSection';
import { HowItWorksSection } from '@/components/features/HowItWorksSection';
import { AISection } from '@/components/features/AISection';
import { ImpactSection } from '@/components/features/ImpactSection';
import { ContactSection } from '@/components/features/ContactSection';
import { Github, Recycle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function LandingPage() {
  return (
    <div className="bg-white dark:bg-slate-950 overflow-hidden min-h-screen text-slate-900 dark:text-slate-100">
      {/* 1. Clean Hero Section with 3D Holographic Core */}
      <HeroSection />

      {/* 2. Core Capabilities */}
      <FeaturesSection />

      {/* 3. Timeline Process */}
      <HowItWorksSection />

      {/* 4. Live Gemini AI Preview Console */}
      <AISection />

      {/* 5. Real-Time Impact Counters */}
      <ImpactSection />

      {/* 6. Contact Section */}
      <ContactSection />

      {/* Clean Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-glow-sm">
              <Recycle size={16} />
            </div>
            <span className="font-heading font-bold text-lg tracking-tight text-slate-900 dark:text-white">
              EcoWaste <span className="gradient-text">AI</span>
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-xs font-mono text-slate-600 dark:text-slate-400">
            <a href="#features" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">How It Works</a>
            <a href="#ai" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">AI Assistant</a>
            <a href="#impact" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Impact</a>
            <a href="#contact" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Contact</a>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500 font-mono">
            <span>&copy; {new Date().getFullYear()} EcoWaste AI Platform.</span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              <Github size={14} />
            </a>
          </div>

        </div>
      </footer>
    </div>
  );
}
