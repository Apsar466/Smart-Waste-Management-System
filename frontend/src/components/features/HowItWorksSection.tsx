import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Upload, Database, Cpu, Tag, Sparkles, Truck, Leaf, ArrowDown } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Upload,
    title: 'Upload Waste',
    description: 'Drag & drop any waste photo or use your device camera. Supports JPG, PNG, WEBP.',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800',
  },
  {
    number: '02',
    icon: Database,
    title: 'Cache Check',
    description: 'Vector cache engine checks for existing matching analyses for sub-50ms rapid responses.',
    color: 'text-teal-600 dark:text-teal-400',
    bg: 'bg-teal-50 dark:bg-teal-950/60 border-teal-200 dark:border-teal-800',
  },
  {
    number: '03',
    icon: Cpu,
    title: 'Gemini Processing',
    description: 'On cache miss, Gemini 1.5 Flash evaluates visual parameters and returns detailed guidance.',
    color: 'text-cyan-600 dark:text-cyan-400',
    bg: 'bg-cyan-50 dark:bg-cyan-950/60 border-cyan-200 dark:border-cyan-800',
  },
  {
    number: '04',
    icon: Tag,
    title: 'Classification',
    description: 'Get clear waste category, recyclability tag, disposal instructions, and safety alerts.',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800',
  },
  {
    number: '05',
    icon: Sparkles,
    title: 'AI Recommendations',
    description: 'Receive personalized eco-tips and automatically earn sustainability reward points.',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800',
  },
  {
    number: '06',
    icon: Truck,
    title: 'Schedule Pickup',
    description: 'Schedule automated waste pickup with driver assignment and real-time status updates.',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800',
  },
  {
    number: '07',
    icon: Leaf,
    title: 'Environmental Impact',
    description: 'Track accumulated environmental savings and CO₂ reduction metrics on your dashboard.',
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-950/60 border-green-200 dark:border-green-800',
  },
];

export function HowItWorksSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="how-it-works" className="relative py-24 md:py-32 bg-slate-50/60 dark:bg-slate-900/40 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <div className="section-badge mb-4">Workflow Architecture</div>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
            How EcoWaste AI <span className="gradient-text">Operates</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-xl mx-auto mt-3">
            Seven seamless steps from photo upload to environmental carbon credit calculations.
          </p>
        </motion.div>

        {/* Animated Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 via-teal-500 to-green-500 opacity-30 hidden sm:block" />

          <div className="space-y-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="relative flex items-start gap-6 group"
                >
                  {/* Timeline Node */}
                  <div className="relative z-10 w-16 h-16 rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-500 flex items-center justify-center font-mono font-bold text-lg text-emerald-600 dark:text-emerald-400 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    {step.number}
                  </div>

                  {/* Arrow Down (except last item) */}
                  {i < steps.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={inView ? { opacity: 1 } : {}}
                      transition={{ duration: 0.6, delay: i * 0.1 + 0.3 }}
                      className="absolute left-8 top-20 hidden sm:block"
                      style={{ transform: 'translateX(-50%)' }}
                    >
                      <ArrowDown size={20} className="text-emerald-400" />
                    </motion.div>
                  )}

                  {/* Step Card */}
                  <div className="flex-1 glass-card p-6 sm:p-8 hover:border-emerald-300 dark:hover:border-emerald-800 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-12 h-12 rounded-xl ${step.bg} border flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon size={24} className={step.color} />
                      </div>
                      <h3 className="font-heading text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed pl-15">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
