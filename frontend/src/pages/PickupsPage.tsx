import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Truck, Calendar, MapPin, Clock, Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import { pickupApi, wasteApi } from '@/api/endpoints';
import type { PickupRequest } from '@/types';
import { toast } from 'sonner';

export function PickupsPage() {
  const [showModal, setShowModal] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [location, setLocation] = useState('');
  const [wasteType, setWasteType] = useState('Recyclable Plastic');
  const [notes, setNotes] = useState('');

  const queryClient = useQueryClient();

  // Fetch real pickups from backend
  const { data: pickupsResp, isLoading } = useQuery({
    queryKey: ['pickupsHistory'],
    queryFn: () => pickupApi.getHistory(),
  });

  const pickups: PickupRequest[] = pickupsResp?.data?.data?.content ?? [];

  const createMutation = useMutation({
    mutationFn: () => pickupApi.create({ scheduledDate, location, wasteType, notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pickupsHistory'] });
      setShowModal(false);
      setScheduledDate('');
      setLocation('');
      setNotes('');
      toast.success('Pickup request submitted successfully!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to schedule pickup.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduledDate || !location) {
      toast.error('Please enter a date and location.');
      return;
    }
    createMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/60 via-white to-teal-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/20 text-slate-900 dark:text-slate-100 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-6 sm:p-8 border border-white/10 relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono">
            <Truck size={12} /> AUTOMATED LOGISTICS DISPATCH
          </div>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight">Smart Waste Pickups</h1>
          <p className="text-slate-400 text-xs sm:text-sm">Schedule household or commercial waste collection with driver tracking.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn-primary py-3 px-6 text-xs font-bold flex items-center gap-2"
        >
          <Plus size={16} /> Schedule New Pickup
        </button>
      </div>

      {/* Pickups Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pickups.length === 0 && !isLoading ? (
          <div className="col-span-full glass-card p-12 text-center text-xs text-slate-500 space-y-3">
            <Truck size={32} className="mx-auto text-slate-600" />
            <p>No waste pickup requests scheduled yet.</p>
          </div>
        ) : (
          pickups.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 border border-white/10 space-y-4 hover:border-cyan-500/30 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">PICKUP #{p.id}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                  p.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                  p.status === 'IN_PROGRESS' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
                  'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {p.status}
                </span>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Calendar size={14} className="text-cyan-400" />
                  <span>Scheduled: {p.scheduledDate}</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <MapPin size={14} className="text-emerald-400" />
                  <span className="truncate">{p.location}</span>
                </div>

                <div className="text-xs text-slate-400 pt-1">
                  Waste Type: <span className="text-white font-semibold">{p.wasteType}</span>
                </div>
              </div>

              {p.driverName && (
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs flex items-center justify-between">
                  <span className="text-slate-400">Assigned Driver:</span>
                  <span className="font-semibold text-emerald-400">{p.driverName}</span>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>

      {/* Schedule Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 sm:p-8 border border-white/10 w-full max-w-lg space-y-6 bg-slate-950"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-heading text-lg font-bold">Schedule Waste Pickup</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">PICKUP DATE & TIME *</label>
                <input
                  type="date"
                  required
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="input-dark"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">PICKUP LOCATION / ADDRESS *</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Street address, City"
                  className="input-dark"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">WASTE TYPE *</label>
                <select
                  value={wasteType}
                  onChange={(e) => setWasteType(e.target.value)}
                  className="input-dark"
                >
                  <option value="Recyclable Plastic">Recyclable Plastic</option>
                  <option value="Paper & Cardboard">Paper & Cardboard</option>
                  <option value="Glass Bottles">Glass Bottles</option>
                  <option value="Electronic Waste">Electronic Waste</option>
                  <option value="Organic Waste">Organic Waste</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">NOTES / DRIVER INSTRUCTIONS</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Leave bins outside gate..."
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
                  {createMutation.isPending ? 'Scheduling...' : 'Confirm Pickup'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
