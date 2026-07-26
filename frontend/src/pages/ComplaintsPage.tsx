import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { AlertTriangle, Plus, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';
import { complaintApi } from '@/api/endpoints';
import type { Complaint } from '@/types';
import { toast } from 'sonner';

export function ComplaintsPage() {
  const [showModal, setShowModal] = useState(false);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [severity, setSeverity] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('MEDIUM');

  const queryClient = useQueryClient();

  const { data: complaintsResp, isLoading } = useQuery({
    queryKey: ['complaintsHistory'],
    queryFn: () => complaintApi.getHistory(),
  });

  const complaints: Complaint[] = complaintsResp?.data?.data?.content ?? [];

  const createMutation = useMutation({
    mutationFn: () => {
      const fd = new FormData();
      fd.append('description', description);
      fd.append('location', location);
      fd.append('severity', severity);
      return complaintApi.report(fd);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaintsHistory'] });
      setShowModal(false);
      setDescription('');
      setLocation('');
      toast.success('Complaint submitted successfully!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to submit complaint.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !location) {
      toast.error('Please enter a description and location.');
      return;
    }
    createMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/60 via-white to-teal-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/20 text-slate-900 dark:text-slate-100 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-6 sm:p-8 border border-white/10 relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono">
            <AlertTriangle size={12} /> COMMUNITY REPORTING CONSOLE
          </div>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight">Illegal Litter & Waste Complaints</h1>
          <p className="text-slate-400 text-xs sm:text-sm">Report illegal dumping or uncleaned public waste spots for rapid municipal cleanup.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn-primary py-3 px-6 text-xs font-bold flex items-center gap-2"
        >
          <Plus size={16} /> File New Complaint
        </button>
      </div>

      {/* Complaints Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {complaints.length === 0 && !isLoading ? (
          <div className="col-span-full glass-card p-12 text-center text-xs text-slate-500 space-y-3">
            <ShieldAlert size={32} className="mx-auto text-slate-600" />
            <p>No environmental complaints filed yet.</p>
          </div>
        ) : (
          complaints.map((c) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 border border-white/10 space-y-4 hover:border-amber-500/30 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">TICKET #{c.id}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                  c.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                  c.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                }`}>
                  SEVERITY: {c.severity}
                </span>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/10">
                <h3 className="font-heading text-base font-bold text-white leading-snug">{c.description}</h3>
                <p className="text-xs text-slate-400 font-mono">Location: {c.location}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-slate-400">
                <span>Status:</span>
                <span className="font-semibold text-emerald-400 uppercase">{c.status}</span>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 sm:p-8 border border-white/10 w-full max-w-lg space-y-6 bg-slate-950"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-heading text-lg font-bold">File Litter Complaint</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">LOCATION / LANDMARK *</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Corner of 5th Ave & Main St"
                  className="input-dark"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">SEVERITY LEVEL *</label>
                <select
                  value={severity}
                  onChange={(e: any) => setSeverity(e.target.value)}
                  className="input-dark"
                >
                  <option value="LOW">LOW - Minor litter</option>
                  <option value="MEDIUM">MEDIUM - Hazardous bin overflow</option>
                  <option value="HIGH">HIGH - Large illegal dumping</option>
                  <option value="CRITICAL">CRITICAL - Chemical / biohazard risk</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">DESCRIPTION *</label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the waste buildup issue..."
                  className="input-dark resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-outline flex-1 py-3 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="btn-primary flex-1 py-3 text-xs font-bold disabled:opacity-50"
                >
                  {createMutation.isPending ? 'Filing...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
