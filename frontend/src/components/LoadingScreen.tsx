import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const bootSequence = [
  { text: 'Initializing AI Core...', delay: 400 },
  { text: 'Loading Gemini Connection...', delay: 700 },
  { text: 'Connecting Backend...', delay: 500 },
  { text: 'Loading User Preferences...', delay: 400 },
  { text: 'Preparing Smart Analysis Engine...', delay: 600 },
  { text: 'Loading Environmental Intelligence...', delay: 500 },
  { text: 'System Ready.', delay: 300 },
];

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  useEffect(() => {
    let step = 0;
    const runStep = () => {
      if (step >= bootSequence.length) {
        setDone(true);
        setTimeout(onComplete, 300);
        return;
      }
      const current = bootSequence[step];
      setCurrentStep(step);
      setLogs(prev => [...prev, current.text]);
      setProgress(Math.round(((step + 1) / bootSequence.length) * 100));
      step++;
      setTimeout(runStep, current.delay);
    };

    const timer = setTimeout(runStep, 100);
    return () => clearTimeout(timer);
  }, []); // Run ONCE on mount
  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[100] bg-gray-950 flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Ambient particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-emerald-500/30"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 15}s`,
                  animationDuration: `${10 + Math.random() * 10}s`,
                }}
                animate={{
                  y: [typeof window !== 'undefined' ? window.innerHeight : 800, -50],
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: 10 + Math.random() * 10,
                  repeat: Infinity,
                  delay: Math.random() * 10,
                }}
              />
            ))}
          </div>

          {/* Grid lines */}
          <div className="absolute inset-0 grid-bg opacity-30" />

          {/* Scan line */}
          <motion.div
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent"
            animate={{ top: ['0%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            style={{ position: 'absolute' }}
          />

          {/* Main content */}
          <div className="relative flex flex-col items-center gap-10 px-6 max-w-lg w-full">
            {/* HUD Ring */}
            <div className="relative w-40 h-40 flex items-center justify-center">
              {/* Outer rotating ring */}
              <motion.div
                className="absolute inset-0 rounded-full border border-emerald-500/20"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute inset-2 rounded-full border border-dashed border-emerald-500/30"
                animate={{ rotate: -360 }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute inset-4 rounded-full border-2 border-emerald-500/50"
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              />

              {/* Progress ring */}
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(22,163,74,0.1)" strokeWidth="4" />
                <motion.circle
                  cx="80" cy="80" r="70" fill="none"
                  stroke="#16A34A" strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={440}
                  animate={{ strokeDashoffset: 440 - (440 * progress) / 100 }}
                  transition={{ duration: 0.4 }}
                />
              </svg>

              {/* Core */}
              <motion.div
                className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center"
                animate={{ boxShadow: ['0 0 20px rgba(22,163,74,0.3)', '0 0 60px rgba(22,163,74,0.6)', '0 0 20px rgba(22,163,74,0.3)'] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-2xl font-bold text-white font-heading">E</span>
              </motion.div>

              {/* Orbiting dot */}
              <motion.div
                className="absolute w-3 h-3 rounded-full bg-emerald-400 shadow-glow-sm"
                style={{ top: '50%', left: '50%', marginLeft: -6, marginTop: -6, transformOrigin: '60px 0px' }}
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
            </div>

            {/* Brand */}
            <div className="text-center">
              <h1 className="font-heading text-3xl font-bold text-white mb-1">
                EcoWaste <span className="text-emerald-400">AI</span>
              </h1>
              <p className="text-sm text-gray-500">Smart Waste Management System v1.0</p>
            </div>

            {/* Progress bar */}
            <div className="w-full">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>System Boot</span>
                <span className="text-emerald-400 font-mono">{progress}%</span>
              </div>
              <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>

            {/* Boot log */}
            <div className="w-full bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl p-4 font-mono text-xs space-y-1.5 min-h-[120px]">
              {logs.map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex items-center gap-2 ${i === logs.length - 1 ? 'text-emerald-400' : 'text-gray-500'}`}
                >
                  <span className="text-emerald-600">›</span>
                  {log}
                  {i === logs.length - 1 && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                      className="inline-block w-2 h-3 bg-emerald-400 ml-1"
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
