import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Camera, MessageSquare, Truck, Globe2, Leaf, Zap,
  ArrowUpRight
} from 'lucide-react';

const features = [
  {
    icon: Camera,
    title: 'Image Analysis',
    description: 'Upload any waste photo for instant AI classification, disposal instructions, and confidence scoring powered by Gemini 1.5 Flash.',
    tag: 'Computer Vision',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800',
  },
  {
    icon: MessageSquare,
    title: 'AI Assistant',
    description: 'Chat with our intelligent assistant about waste reduction, recycling rules, and environmental impact in any language.',
    tag: 'Natural Language',
    color: 'text-teal-600 dark:text-teal-400',
    bg: 'bg-teal-50 dark:bg-teal-950/60 border-teal-200 dark:border-teal-800',
  },
  {
    icon: Truck,
    title: 'Waste Pickup',
    description: 'Schedule household or commercial waste collection with automated driver assignments and status tracking.',
    tag: 'Logistics AI',
    color: 'text-cyan-600 dark:text-cyan-400',
    bg: 'bg-cyan-50 dark:bg-cyan-950/60 border-cyan-200 dark:border-cyan-800',
  },
  {
    icon: Globe2,
    title: 'Multilingual',
    description: 'Full AI responses in 10+ languages. Breaking language barriers in environmental education worldwide.',
    tag: '10+ Languages',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800',
  },
  {
    icon: Leaf,
    title: 'Carbon Tracking',
    description: 'Track your environmental footprint in real-time. See how your recycling actions directly reduce CO₂ emissions.',
    tag: 'Carbon Analytics',
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-950/60 border-green-200 dark:border-green-800',
  },
  {
    icon: Zap,
    title: 'Cache Optimization',
    description: 'Fast sub-50ms responses for repeated queries via vector caching. Reduces latency and optimizes API usage.',
    tag: 'Performance',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800',
  },
];

export function FeaturesSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="features" className="relative py-24 md:py-32 bg-white dark:bg-slate-950 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <div className="section-badge mb-4">Core Platform Features</div>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
            Intelligent Waste Management <br className="hidden sm:inline" />
            <span className="gradient-text">Powered by Gemini AI</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto mt-4">
            A comprehensive sustainability platform combining computer vision, smart caching, and automated logistics.
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="glass-card p-8 group hover:-translate-y-2 transition-all duration-300 relative border border-slate-200/80 dark:border-slate-800 hover:shadow-xl hover:shadow-emerald-500/10"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-14 h-14 rounded-2xl ${f.bg} border flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3 duration-300`}>
                    <Icon size={28} className={f.color} />
                  </div>
                  <span className={`text-xs font-mono font-semibold px-3 py-1 rounded-full ${f.bg} border ${f.color}`}>
                    {f.tag}
                  </span>
                </div>

                <h3 className="font-heading text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {f.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {f.description}
                </p>

                <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Learn more</span>
                  <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
