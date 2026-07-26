import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/api/endpoints';
import { Calendar, User, Truck, Clipboard, Edit, Check } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export function AdminPickups() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [editingPickup, setEditingPickup] = useState<any | null>(null);

  // States for updating pickup request
  const [driver, setDriver] = useState('');
  const [remarks, setRemarks] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const { data: pickupsData, isLoading } = useQuery({
    queryKey: ['admin-pickups-list'],
    queryFn: () => adminApi.getPickups(),
  });

  const pickups = pickupsData?.data?.data || [];

  const { mutate: updatePickup, isPending } = useMutation({
    mutationFn: ({ id, status, driverName, internalRemarks }: { id: number; status: string; driverName: string; internalRemarks: string }) =>
      adminApi.updatePickupStatus(id, status, driverName, internalRemarks),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pickups-list'] });
      toast.success('Pickup request details updated.');
      setEditingPickup(null);
    },
    onError: () => toast.error('Failed to update pickup request.'),
  });

  const filteredPickups = pickups.filter((p: any) => {
    return statusFilter === 'ALL' || p.status === statusFilter;
  });

  const startEdit = (p: any) => {
    setEditingPickup(p);
    setDriver(p.assignedDriver || '');
    setRemarks(p.remarks || '');
    setSelectedStatus(p.status);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPickup) return;
    updatePickup({
      id: editingPickup.id,
      status: selectedStatus,
      driverName: driver,
      internalRemarks: remarks,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
      case 'ACCEPTED': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'SCHEDULED': return 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20';
      case 'IN_PROGRESS': return 'bg-pink-500/10 text-pink-400 border border-pink-500/20';
      case 'COMPLETED': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'CANCELLED': return 'bg-red-500/10 text-red-400 border border-red-500/20';
      default: return 'bg-slate-500/10 text-slate-450';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-heading text-white">Pickup Dispatches</h2>
          <p className="text-xs font-mono text-slate-400 mt-1 uppercase tracking-wider">Scheduled recycling collections</p>
        </div>
      </div>

      {/* Filter */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800/60 bg-slate-900/40 flex items-center justify-between">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-300 text-sm focus:outline-none focus:border-emerald-500"
        >
          <option value="ALL">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Pickups Table */}
      <div className="glass-card rounded-2xl border border-slate-800/60 bg-slate-900/40 overflow-hidden shadow-lg">
        {isLoading ? (
          <div className="py-20 text-center text-slate-400 text-sm font-mono tracking-widest animate-pulse">
            LOADING COLLECTION SCHEDULES...
          </div>
        ) : filteredPickups.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-sm font-mono tracking-wider">
            NO PICKUP REQUESTS REPORTED
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] font-mono tracking-wider text-slate-400 uppercase bg-slate-950/40">
                  <th className="px-6 py-4">Report ID</th>
                  <th className="px-6 py-4">Preferred Date</th>
                  <th className="px-6 py-4">Driver Name</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Remarks</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-slate-300 text-xs">
                {filteredPickups.map((p: any) => (
                  <tr key={p.id} className="hover:bg-slate-850/20 transition-colors">
                    <td className="px-6 py-4 font-mono text-slate-400">#REP-{p.reportId}</td>
                    <td className="px-6 py-4 font-mono">
                      {new Date(p.pickupDate).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-medium text-white flex items-center gap-1.5 pt-4">
                      <Truck size={14} className="text-slate-500" />
                      {p.assignedDriver || 'Unassigned'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusColor(p.status)}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 truncate max-w-[200px]" title={p.remarks}>
                      {p.remarks || 'No remarks added'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => startEdit(p)}
                        className="p-1.5 rounded-lg border border-slate-800 hover:border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-400 transition-colors"
                        title="Update Status"
                      >
                        <Edit size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Pickup Details Modal */}
      <AnimatePresence>
        {editingPickup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card max-w-md w-full p-6 rounded-2xl border border-slate-800 bg-slate-900 text-slate-100 shadow-xl relative"
            >
              <h3 className="font-heading font-bold text-lg mb-4 text-white">Update Pickup Request</h3>

              <form onSubmit={handleUpdate} className="space-y-4 text-sm">
                {/* Status Selection */}
                <div>
                  <label className="text-xs font-mono text-slate-400 uppercase block mb-1.5">Collection Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-850 bg-slate-950 text-slate-200 text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="ACCEPTED">Accepted</option>
                    <option value="SCHEDULED">Scheduled</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>

                {/* Driver Assignment */}
                <div>
                  <label className="text-xs font-mono text-slate-400 uppercase block mb-1.5">Assigned Driver</label>
                  <input
                    type="text"
                    placeholder="Enter driver name..."
                    value={driver}
                    onChange={(e) => setDriver(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-850 bg-slate-950 text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Internal Remarks */}
                <div>
                  <label className="text-xs font-mono text-slate-400 uppercase block mb-1.5">Administrative Remarks</label>
                  <textarea
                    rows={3}
                    placeholder="Enter internal dispatch instructions..."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-850 bg-slate-950 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingPickup(null)}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="btn-primary py-2.5 px-5 text-xs flex items-center gap-1"
                  >
                    {isPending ? 'Updating...' : <><Check size={14} /> Update Dispatch</>}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
