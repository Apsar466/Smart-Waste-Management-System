import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/api/endpoints';
import {
  Users, Eye, Recycle, Cpu, Database, Award, Truck, AlertTriangle,
  Bell, FileText, CheckCircle
} from 'lucide-react';
import CountUp from 'react-countup';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, Legend
} from 'recharts';
import { motion } from 'framer-motion';

const CHART_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<any>;
  suffix?: string;
  decimals?: number;
  colorClass: string;
  glowClass: string;
}

function StatCard({ title, value, icon: Icon, suffix = '', decimals = 0, colorClass, glowClass }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-card p-5 rounded-2xl border border-slate-800/60 bg-slate-900/40 relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-300 shadow-lg`}
    >
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity ${glowClass}`} />
      
      <div className="flex items-center justify-between relative z-10">
        <div>
          <p className="text-xs font-mono tracking-wider text-slate-400 uppercase">{title}</p>
          <h3 className="text-2xl font-bold font-heading text-white mt-1.5 flex items-baseline">
            <CountUp end={value} duration={1.5} separator="," decimals={decimals} />
            <span className="text-sm font-medium text-slate-400 ml-1">{suffix}</span>
          </h3>
        </div>
        <div className={`w-10 h-10 rounded-xl bg-slate-850/60 flex items-center justify-center border border-slate-800 ${colorClass}`}>
          <Icon size={18} />
        </div>
      </div>
    </motion.div>
  );
}

export function AdminDashboard() {
  const { data: statsData, isLoading } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: () => adminApi.getDashboard(),
    refetchInterval: 10000, // Dynamic automatic updates every 10 seconds
  });

  const stats = statsData?.data?.data || {
    totalUsers: 0,
    todayLogins: 0,
    totalWasteAnalysed: 0,
    geminiRequests: 0,
    cacheHits: 0,
    cacheHitRate: 0.0,
    carbonSaved: 0.0,
    pendingPickups: 0,
    completedPickups: 0,
    unreadNotifications: 0,
    totalComplaints: 0,
    monthlyWasteStats: [],
    wasteCategoryStats: [],
    pickupStatusStats: []
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
        <span className="text-xs font-mono text-slate-400 tracking-wider">CONNECTING TO METRIC ENGINE...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold font-heading text-white">System Monitor</h2>
        <p className="text-xs font-mono text-slate-400 mt-1 uppercase tracking-wider">Live database aggregation streams</p>
      </div>

      {/* Counters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={stats.totalUsers} icon={Users} colorClass="text-blue-400" glowClass="bg-blue-500" />
        <StatCard title="Today's Logins" value={stats.todayLogins} icon={Eye} colorClass="text-emerald-400" glowClass="bg-emerald-500" />
        <StatCard title="Waste Analysed" value={stats.totalWasteAnalysed} icon={Recycle} colorClass="text-cyan-400" glowClass="bg-cyan-500" />
        <StatCard title="Gemini Requests" value={stats.geminiRequests} icon={Cpu} colorClass="text-purple-400" glowClass="bg-purple-500" />
        <StatCard title="Cache Hits" value={stats.cacheHits} icon={Database} colorClass="text-pink-400" glowClass="bg-pink-500" />
        <StatCard title="Cache Hit Rate" value={stats.cacheHitRate} icon={Database} suffix="%" decimals={1} colorClass="text-amber-400" glowClass="bg-amber-500" />
        <StatCard title="Carbon Saved" value={stats.carbonSaved} icon={Award} suffix=" kg" colorClass="text-green-400" glowClass="bg-green-500" />
        <StatCard title="Complaints Logged" value={stats.totalComplaints} icon={AlertTriangle} colorClass="text-red-400" glowClass="bg-red-500" />
        <StatCard title="Pending Pickups" value={stats.pendingPickups} icon={Truck} colorClass="text-orange-400" glowClass="bg-orange-500" />
        <StatCard title="Completed Pickups" value={stats.completedPickups} icon={CheckCircle} colorClass="text-teal-400" glowClass="bg-teal-500" />
        <StatCard title="System Unread Alerts" value={stats.unreadNotifications} icon={Bell} colorClass="text-indigo-400" glowClass="bg-indigo-500" />
      </div>

      {/* Visual Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Waste Analysis Chart */}
        <div className="glass-card lg:col-span-2 p-6 rounded-2xl border border-slate-800/60 bg-slate-900/40 relative">
          <h4 className="text-sm font-semibold font-heading text-white mb-6 uppercase tracking-wider">Monthly Analysis Streams</h4>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.monthlyWasteStats}>
                <defs>
                  <linearGradient id="colorWaste" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="count" stroke="#10b981" fillOpacity={1} fill="url(#colorWaste)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Waste Categories breakdown */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800/60 bg-slate-900/40 relative">
          <h4 className="text-sm font-semibold font-heading text-white mb-6 uppercase tracking-wider">Waste Distribution</h4>
          <div className="h-80 w-full flex items-center justify-center">
            {stats.wasteCategoryStats.length === 0 ? (
              <span className="text-xs font-mono text-slate-500">NO DISPOSITION RECORDS FOUND</span>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.wasteCategoryStats} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.2} horizontal={false} />
                  <XAxis type="number" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis type="category" dataKey="category" stroke="#64748b" fontSize={10} width={70} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff', borderRadius: '12px' }} />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={12}>
                    {stats.wasteCategoryStats.map((_item: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
