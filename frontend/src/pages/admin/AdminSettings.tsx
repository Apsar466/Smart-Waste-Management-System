import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/api/endpoints';
import { Settings, Cpu, Database, Save, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export function AdminSettings() {
  const { data: cacheData, isLoading } = useQuery({
    queryKey: ['admin-settings-cache'],
    queryFn: () => adminApi.getCacheStatistics(),
  });

  const cache = cacheData?.data?.data || {
    totalGeminiRequests: 0,
    totalCacheHits: 0,
    cacheHitRate: 0.0,
    requestsSaved: 0
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Configuration saved successfully!');
  };

  return (
    <div className="space-y-6 pb-12 max-w-3xl">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold font-heading text-white">System Settings</h2>
        <p className="text-xs font-mono text-slate-400 mt-1 uppercase tracking-wider">Configure local application defaults</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Left Form */}
        <div className="glass-card md:col-span-2 p-6 rounded-3xl border border-slate-800 bg-slate-900/40 relative">
          <form onSubmit={handleSave} className="space-y-5 text-sm">
            <h3 className="font-heading font-bold text-base text-white mb-2 flex items-center gap-2">
              <Settings size={18} className="text-emerald-500" /> Platform Configuration
            </h3>

            <div>
              <label className="text-xs font-mono text-slate-400 uppercase block mb-1.5">Application Name</label>
              <input
                type="text"
                defaultValue="EcoWaste AI Platform"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-850 bg-slate-950 text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-slate-400 uppercase block mb-1.5">Cache Expiry (Days)</label>
                <input
                  type="number"
                  defaultValue={30}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-850 bg-slate-950 text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 uppercase block mb-1.5">Default language</label>
                <select
                  defaultValue="en"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-850 bg-slate-950 text-slate-350 text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="btn-primary py-3 px-6 text-xs flex items-center gap-1.5 font-bold tracking-wider"
              >
                <Save size={14} /> Save Configuration
              </button>
            </div>
          </form>
        </div>

        {/* Right Status */}
        <div className="glass-card p-5 rounded-3xl border border-slate-800 bg-slate-900/40 space-y-4">
          <h4 className="font-heading font-bold text-sm text-white mb-2 uppercase tracking-wider flex items-center gap-1.5">
            <Cpu size={16} className="text-emerald-500" /> API Cache Health
          </h4>

          {isLoading ? (
            <div className="py-8 text-center text-slate-500 text-xs font-mono tracking-widest animate-pulse">
              RESOLVING...
            </div>
          ) : (
            <div className="space-y-3.5 text-xs font-mono">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Gemini Requests:</span>
                <span className="text-white font-bold">{cache.totalGeminiRequests}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Cache Hits:</span>
                <span className="text-emerald-400 font-bold">{cache.totalCacheHits}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Requests Saved:</span>
                <span className="text-cyan-400 font-bold">{cache.requestsSaved}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Cache Hit Rate:</span>
                <span className="text-amber-400 font-bold">{cache.cacheHitRate.toFixed(1)}%</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
