import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Award, Zap, ShieldCheck, Star, Trophy, Sparkles, CheckCircle2 } from 'lucide-react';
import { rewardApi } from '@/api/endpoints';

export function RewardsPage() {
  const { data: rewardResp, isLoading } = useQuery({
    queryKey: ['userReward'],
    queryFn: () => rewardApi.getRewards(),
  });

  const reward = rewardResp?.data?.data ?? {
    totalPoints: 250,
    level: 'Green Champion',
    badges: ['Eco Starter', 'Scan Master', 'Recycling Hero', 'Carbon Saver'],
    reportsCount: 12,
    pickupsCount: 5,
    complaintsCount: 2,
  };

  const allBadges = [
    { title: 'Eco Starter', desc: 'Completed your first AI waste scan', unlocked: true, icon: Star },
    { title: 'Scan Master', desc: 'Analyzed over 10 items via Gemini', unlocked: true, icon: Sparkles },
    { title: 'Recycling Hero', desc: 'Recycled over 5kg of plastic waste', unlocked: true, icon: Trophy },
    { title: 'Carbon Saver', desc: 'Saved 20kg+ of estimated CO₂', unlocked: true, icon: Zap },
    { title: 'Community Defender', desc: 'Filed a resolved litter complaint', unlocked: false, icon: ShieldCheck },
    { title: 'Zero Waste Pioneer', desc: 'Achieved Level 5 Sustainability Status', unlocked: false, icon: Award },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/60 via-white to-teal-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/20 text-slate-900 dark:text-slate-100 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-10 border border-white/10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono">
            <Trophy size={12} /> GAMIFIED SUSTAINABILITY ENGINE
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight">
            Sustainability <span className="gradient-text">Rewards & Badges</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-md">
            Earn points for every waste scan, pickup scheduled, and community litter report filed.
          </p>
        </div>

        {/* Score Counter Box */}
        <div className="glass-card p-6 border border-amber-500/30 bg-amber-500/5 text-center min-w-[200px] relative z-10 shadow-glow-sm">
          <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-widest">TOTAL BALANCE</span>
          <div className="font-heading text-4xl font-extrabold text-white my-1">
            {reward.totalPoints || 250} <span className="text-sm font-normal text-amber-400">PTS</span>
          </div>
          <span className="text-xs font-semibold text-slate-300">Rank: {reward.level || 'Green Champion'}</span>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="space-y-4">
        <h2 className="font-heading text-xl font-bold flex items-center gap-2">
          <Award size={20} className="text-amber-400" />
          <span>Achievements & Badges</span>
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allBadges.map((b) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`glass-card p-6 border transition-all flex items-start gap-4 ${
                  b.unlocked
                    ? 'border-amber-500/30 bg-amber-500/5 shadow-glow-sm'
                    : 'border-white/5 opacity-50'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  b.unlocked ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-white/5 text-slate-600'
                }`}>
                  <Icon size={24} />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading text-base font-bold text-white">{b.title}</h3>
                    {b.unlocked && <CheckCircle2 size={16} className="text-amber-400 shrink-0 ml-2" />}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{b.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
