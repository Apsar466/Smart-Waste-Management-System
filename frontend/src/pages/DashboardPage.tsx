import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import CountUp from 'react-countup';
import {
  Camera, MessageSquare, Truck, Award, AlertTriangle, Leaf,
  TrendingUp, Activity, Clock, ArrowRight, ShieldCheck
} from 'lucide-react';
import { wasteApi, pickupApi, complaintApi, rewardApi } from '@/api/endpoints';
import { useAuth } from '@/store/AuthContext';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export function DashboardPage() {
  const { user } = useAuth();

  // Real APIs - unchanged backend integration
  const { data: reportsResp } = useQuery({ queryKey: ['wasteHistory'], queryFn: () => wasteApi.getHistory() });
  const { data: pickupsResp } = useQuery({ queryKey: ['pickupsHistory'], queryFn: () => pickupApi.getHistory() });
  const { data: complaintsResp } = useQuery({ queryKey: ['complaintsHistory'], queryFn: () => complaintApi.getHistory() });
  const { data: rewardResp } = useQuery({ queryKey: ['userReward'], queryFn: () => rewardApi.getRewards() });

  const reports = reportsResp?.data?.data?.content ?? [];
  const pickups = pickupsResp?.data?.data?.content ?? [];
  const complaints = complaintsResp?.data?.data?.content ?? [];
  const reward = rewardResp?.data?.data ?? { totalPoints: 0, badges: [], level: 'Recycler' };

  // Calculate carbon impact based on real analysis count (avg 2.1kg per recycling item)
  const carbonSaved = reports.length * 2.1;

  // Chart data from real reports
  const chartData = reports.slice(0, 7).reverse().map((item, idx) => ({
    name: `Report #${item.id || idx + 1}`,
    confidence: Math.round((item.confidence || 0.85) * 100),
    carbon: 2.1,
  }));

  if (chartData.length === 0) {
    chartData.push(
      { name: 'Mon', confidence: 85, carbon: 2.1 },
      { name: 'Tue', confidence: 92, carbon: 4.2 },
      { name: 'Wed', confidence: 78, carbon: 2.1 },
      { name: 'Thu', confidence: 95, carbon: 6.3 },
      { name: 'Fri', confidence: 88, carbon: 4.2 }
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/60 via-white to-teal-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/20 text-slate-900 dark:text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8">
      
      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
            <Activity size={12} className="animate-pulse" /> LIVE USER CONSOLE
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight">
            Welcome back, <span className="gradient-text">{user?.fullName ?? 'User'}</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            AI Waste Management Dashboard · Real-time telemetry & activity logs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <Link to="/analyze" className="btn-primary py-2.5 px-5 text-xs font-bold">
            <Camera size={14} /> Scan Waste Photo
          </Link>
          <Link to="/chat" className="btn-outline py-2.5 px-5 text-xs font-bold">
            <MessageSquare size={14} className="text-emerald-400" /> AI Assistant
          </Link>
        </div>
      </div>

      {/* 4 Primary Stat Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Stat 1: Waste Scans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-card p-6 relative group overflow-hidden hover:-translate-y-1 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/10 transition-all" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <Camera size={24} />
            </div>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 font-semibold">
              TOTAL SCANS
            </span>
          </div>
          <div className="font-heading text-4xl font-extrabold text-slate-900 dark:text-white mb-1 relative z-10">
            <CountUp end={reports.length} duration={2} />
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">AI Analyses Completed</p>
        </motion.div>

        {/* Stat 2: Pickups */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="glass-card p-6 relative group overflow-hidden hover:-translate-y-1 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/10 transition-all" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 flex items-center justify-center text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform">
              <Truck size={24} />
            </div>
            <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-950/60 px-2.5 py-1 rounded-full border border-cyan-200 dark:border-cyan-800 font-semibold">
              PICKUPS
            </span>
          </div>
          <div className="font-heading text-4xl font-extrabold text-slate-900 dark:text-white mb-1 relative z-10">
            <CountUp end={pickups.length} duration={2} />
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Scheduled & Completed</p>
        </motion.div>

        {/* Stat 3: Reward Points */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="glass-card p-6 relative group overflow-hidden hover:-translate-y-1 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/10 transition-all" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
              <Award size={24} />
            </div>
            <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800 font-semibold">
              REWARDS
            </span>
          </div>
          <div className="font-heading text-4xl font-extrabold text-slate-900 dark:text-white mb-1 relative z-10">
            <CountUp end={reward.totalPoints || 0} duration={2} />
            <span className="text-sm text-amber-600 dark:text-amber-400 ml-1">pts</span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Sustainability Score</p>
        </motion.div>

        {/* Stat 4: Carbon Saved */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="glass-card p-6 relative group overflow-hidden hover:-translate-y-1 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/10"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-violet-500/10 transition-all" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-950/60 border border-violet-200 dark:border-violet-800 flex items-center justify-center text-violet-600 dark:text-violet-400 group-hover:scale-110 transition-transform">
              <Leaf size={24} />
            </div>
            <span className="text-[10px] font-mono text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-950/60 px-2.5 py-1 rounded-full border border-violet-200 dark:border-violet-800 font-semibold">
              CARBON
            </span>
          </div>
          <div className="font-heading text-4xl font-extrabold text-slate-900 dark:text-white mb-1 relative z-10">
            <CountUp end={carbonSaved} decimals={1} duration={2} />
            <span className="text-sm text-violet-600 dark:text-violet-400 ml-1">kg</span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Est. CO₂ Reduction</p>
        </motion.div>

      </div>

      {/* Main Grid: Chart & Quick Actions */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left 8 Cols: Recharts Telemetry Graph */}
        <div className="lg:col-span-8 glass-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading text-lg font-bold">AI Analysis Telemetry</h3>
              <p className="text-xs text-slate-400">Model confidence rating per scan</p>
            </div>
            <span className="text-[10px] font-mono text-slate-500">LIVE FEED</span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorConf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090d16',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="confidence" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorConf)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 4 Cols: Quick Navigation Cards */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-card p-6">
            <h3 className="font-heading text-base font-bold mb-4 flex items-center justify-between">
              <span>Quick Actions</span>
              <TrendingUp size={16} className="text-emerald-400" />
            </h3>

            <div className="space-y-3">
              <Link
                to="/analyze"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 border border-slate-200 dark:border-white/5 hover:border-emerald-300 dark:hover:border-emerald-500/30 transition-all text-xs font-semibold group"
              >
                <div className="flex items-center gap-3">
                  <Camera size={16} className="text-emerald-400" />
                  <span>Analyze New Photo</span>
                </div>
                <ArrowRight size={14} className="text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                to="/pickups"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 border border-slate-200 dark:border-white/5 hover:border-cyan-300 dark:hover:border-cyan-500/30 transition-all text-xs font-semibold group"
              >
                <div className="flex items-center gap-3">
                  <Truck size={16} className="text-cyan-400" />
                  <span>Schedule Waste Pickup</span>
                </div>
                <ArrowRight size={14} className="text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                to="/chat"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-violet-50 dark:hover:bg-violet-500/10 border border-slate-200 dark:border-white/5 hover:border-violet-300 dark:hover:border-violet-500/30 transition-all text-xs font-semibold group"
              >
                <div className="flex items-center gap-3">
                  <MessageSquare size={16} className="text-violet-400" />
                  <span>Gemini Recycling Chat</span>
                </div>
                <ArrowRight size={14} className="text-slate-500 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                to="/complaints"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-amber-50 dark:hover:bg-amber-500/10 border border-slate-200 dark:border-white/5 hover:border-amber-300 dark:hover:border-amber-500/30 transition-all text-xs font-semibold group"
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle size={16} className="text-amber-400" />
                  <span>Report Litter Complaint</span>
                </div>
                <ArrowRight size={14} className="text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* Recent Activity Table */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading text-lg font-bold">Recent AI Scans</h3>
            <p className="text-xs text-slate-400">History of analyzed waste items</p>
          </div>
          <Link to="/analyze" className="text-xs font-bold text-emerald-400 hover:underline">
            View All Scans &rarr;
          </Link>
        </div>

        {reports.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">
            No waste scans recorded yet. <Link to="/analyze" className="text-emerald-400 font-bold hover:underline">Perform your first scan</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="text-[10px] font-mono text-slate-500 uppercase border-b border-slate-200 dark:border-white/10">
                <tr>
                  <th className="pb-3">ID</th>
                  <th className="pb-3">CATEGORY</th>
                  <th className="pb-3">CONFIDENCE</th>
                  <th className="pb-3">RECYCLABLE</th>
                  <th className="pb-3">SOURCE</th>
                  <th className="pb-3">DATE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {reports.slice(0, 5).map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <td className="py-3 font-mono text-slate-400">#{r.id}</td>
                    <td className="py-3 font-semibold text-slate-900 dark:text-white">{r.wasteCategory}</td>
                    <td className="py-3">
                      <span className="font-mono text-emerald-400 font-bold">
                        {Math.round((r.confidence || 0.9) * 100)}%
                      </span>
                    </td>
                    <td className="py-3">
                      {r.recyclable ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          YES
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                          NO
                        </span>
                      )}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        r.source === 'CACHE' 
                          ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30' 
                          : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      }`}>
                        {r.source || 'GEMINI'}
                      </span>
                    </td>
                    <td className="py-3 text-slate-500 font-mono">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
