import { Suspense, lazy } from 'react';
import { Github, Recycle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HeroSection } from '@/components/features/HeroSection';

// Lazy load all sections so a crash in one doesn't blank the whole page
const FeaturesSection = lazy(() => import('@/components/features/FeaturesSection').then(m => ({ default: m.FeaturesSection })));
const HowItWorksSection = lazy(() => import('@/components/features/HowItWorksSection').then(m => ({ default: m.HowItWorksSection })));
const AISection = lazy(() => import('@/components/features/AISection').then(m => ({ default: m.AISection })));
const ImpactSection = lazy(() => import('@/components/features/ImpactSection').then(m => ({ default: m.ImpactSection })));
const ContactSection = lazy(() => import('@/components/features/ContactSection').then(m => ({ default: m.ContactSection })));

function SectionFallback() {
  return (
    <div className="w-full py-24 flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
    </div>
  );
}

export function LandingPage() {
  return (
    <div className="bg-white dark:bg-slate-950 overflow-hidden min-h-screen text-slate-900 dark:text-slate-100">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Core Capabilities */}
      <Suspense fallback={<SectionFallback />}>
        <FeaturesSection />
      </Suspense>

      {/* 3. Timeline Process */}
      <Suspense fallback={<SectionFallback />}>
        <HowItWorksSection />
      </Suspense>

      {/* 4. Live Gemini AI Preview Console */}
      <Suspense fallback={<SectionFallback />}>
        <AISection />
      </Suspense>

      {/* 5. Real-Time Impact Counters */}
      <Suspense fallback={<SectionFallback />}>
        <ImpactSection />
      </Suspense>

      {/* 6. Contact Section */}
      <Suspense fallback={<SectionFallback />}>
        <ContactSection />
      </Suspense>

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
              href="https://github.com/Apsar466/Smart-Waste-Management-System"
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
