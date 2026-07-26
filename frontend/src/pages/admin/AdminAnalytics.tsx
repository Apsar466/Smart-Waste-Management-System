import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/api/endpoints';
import {
  Cpu, Database, Sparkles, AlertCircle, Clock, Zap
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import CountUp from 'react-countup';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'];

export function AdminAnalytics() {
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['admin-analytics-stats'],
    queryFn: () => adminApi.getAnalytics(),
  });

  const stats = analyticsData?.data?.data || {
    geminiRequests: 0,
    cacheHits: 0,
    cacheMisses: 0,
    cacheHitRate: 0.0,
    averageResponseTimeMs: 0,
    savedRequests: 0,
    topWasteTypes: [],
    mostCommonQuestions: [],
    mostUploadedImages: []
  };

  const cacheUsageData = [
    { name: 'Cache Hits', value: stats.cacheHits },
    { name: 'Cache Misses', value: stats.cacheMisses },
  ];

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
        <span className="text-xs font-mono text-slate-400 tracking-wider">CONNECTING TO ANALYTICS ENGINE...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold font-heading text-white">AI Core Analytics</h2>
        <p className="text-xs font-mono text-slate-400 mt-1 uppercase tracking-wider">Advanced cache intelligence and LLM metrics</p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Gemini Requests */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 bg-slate-900/40 relative">
          <p className="text-xs font-mono text-slate-400 uppercase">Gemini API Requests</p>
          <h3 className="text-2xl font-bold text-white mt-1.5 flex items-baseline">
            <CountUp end={stats.geminiRequests} duration={1.5} />
            <span className="text-xs font-medium text-slate-500 ml-1.5">calls</span>
          </h3>
          <Cpu className="absolute top-4 right-4 text-emerald-500/20" size={24} />
        </div>

        {/* Cache Hit Rate */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 bg-slate-900/40 relative">
          <p className="text-xs font-mono text-slate-400 uppercase">Cache Hit Rate</p>
          <h3 className="text-2xl font-bold text-white mt-1.5 flex items-baseline">
            <CountUp end={stats.cacheHitRate} duration={1.5} decimals={1} />
            <span className="text-xs font-medium text-slate-500 ml-1.5">%</span>
          </h3>
          <Database className="absolute top-4 right-4 text-emerald-500/20" size={24} />
        </div>

        {/* Average Response Time */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 bg-slate-900/40 relative">
          <p className="text-xs font-mono text-slate-400 uppercase">Average Latency</p>
          <h3 className="text-2xl font-bold text-white mt-1.5 flex items-baseline">
            <CountUp end={stats.averageResponseTimeMs} duration={1.5} />
            <span className="text-xs font-medium text-slate-500 ml-1.5">ms</span>
          </h3>
          <Clock className="absolute top-4 right-4 text-emerald-500/20" size={24} />
        </div>
      </div>

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cache Usage breakdown */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 bg-slate-900/40">
          <h4 className="text-sm font-semibold font-heading text-white mb-6 uppercase tracking-wider">Cache Effectiveness</h4>
          <div className="h-72 w-full flex items-center justify-center">
            {stats.cacheHits === 0 && stats.cacheMisses === 0 ? (
              <span className="text-xs font-mono text-slate-500">NO CACHE TRANSACTION RECORDS</span>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={cacheUsageData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {cacheUsageData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff', borderRadius: '12px' }} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Most Common Questions */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 bg-slate-900/40">
          <h4 className="text-sm font-semibold font-heading text-white mb-6 uppercase tracking-wider">Top Chatbot Inquiries</h4>
          <div className="h-72 w-full">
            {stats.mostCommonQuestions.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <span className="text-xs font-mono text-slate-500">NO CHAT CONVERSATIONS RECORDED</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.mostCommonQuestions}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.2} vertical={false} />
                  <XAxis dataKey="question" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff', borderRadius: '12px' }} />
                  <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} barSize={25} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
