import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/api/endpoints';
import { Calendar, Eye, ShieldAlert, Check, X, MessageSquare, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export function AdminComplaints() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedComplaint, setSelectedComplaint] = useState<any | null>(null);

  // Resolution states
  const [comment, setComment] = useState('');
  const [resolutionAction, setResolutionAction] = useState<'RESOLVED' | 'REJECTED' | null>(null);

  const { data: complaintsData, isLoading } = useQuery({
    queryKey: ['admin-complaints-list'],
    queryFn: () => adminApi.getComplaints(),
  });

  const complaints = complaintsData?.data?.data || [];

  const { mutate: resolveOrReject, isPending } = useMutation({
    mutationFn: ({ id, status, adminComment }: { id: number; status: string; adminComment: string }) =>
      adminApi.updateComplaintStatus(id, status, adminComment),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-complaints-list'] });
      toast.success(`Complaint marked as ${variables.status}`);
      setSelectedComplaint(null);
      setComment('');
      setResolutionAction(null);
    },
    onError: () => toast.error('Failed to update complaint status.'),
  });

  const filteredComplaints = complaints.filter((c: any) => {
    return statusFilter === 'ALL' || c.status === statusFilter;
  });

  const handleActionSubmit = (status: 'RESOLVED' | 'REJECTED') => {
    if (!selectedComplaint) return;
    resolveOrReject({
      id: selectedComplaint.id,
      status,
      adminComment: comment,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
      case 'RESOLVED': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'REJECTED': return 'bg-red-500/10 text-red-400 border border-red-500/20';
      default: return 'bg-slate-500/10 text-slate-450';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-heading text-white">Public Complaints</h2>
          <p className="text-xs font-mono text-slate-400 mt-1 uppercase tracking-wider">Environmental dumpsite reports</p>
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
          <option value="RESOLVED">Resolved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* Complaints Table */}
      <div className="glass-card rounded-2xl border border-slate-800/60 bg-slate-900/40 overflow-hidden shadow-lg">
        {isLoading ? (
          <div className="py-20 text-center text-slate-400 text-sm font-mono tracking-widest animate-pulse">
            LOADING MUNICIPAL COMPLAINTS...
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-sm font-mono tracking-wider">
            NO PUBLIC COMPLAINTS REPORTED
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] font-mono tracking-wider text-slate-400 uppercase bg-slate-950/40">
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">AI Severity</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date Reported</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-slate-300 text-xs">
                {filteredComplaints.map((c: any) => {
                  const relativeUrl = c.imageUrl?.replace(/^\/api/, '') || '';
                  const absoluteUrl = `http://localhost:8080/api${relativeUrl}`;

                  return (
                    <tr key={c.id} className="hover:bg-slate-850/20 transition-colors">
                      <td className="px-6 py-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-850 overflow-hidden flex items-center justify-center">
                          {c.imageUrl ? (
                            <img src={absoluteUrl} alt={c.complaintType} className="w-full h-full object-cover" />
                          ) : (
                            <MessageSquare size={14} className="text-slate-600" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-white">{c.complaintType}</td>
                      <td className="px-6 py-4 text-slate-400 truncate max-w-[200px]" title={c.description}>
                        {c.description}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          c.aiSeverity === 'CRITICAL' || c.aiSeverity === 'HIGH'
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                            : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                        }`}>
                          {c.aiSeverity || 'LOW'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusColor(c.status)}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedComplaint(c)}
                          className="p-1.5 rounded-lg border border-slate-800 hover:border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-400 transition-colors"
                          title="Review & Resolve"
                        >
                          <Eye size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review & Resolve Modal */}
      <AnimatePresence>
        {selectedComplaint && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card max-w-lg w-full p-6 rounded-2xl border border-slate-800 bg-slate-900 text-slate-100 shadow-xl relative max-h-[90vh] overflow-y-auto"
            >
              <h3 className="font-heading font-bold text-lg mb-4 text-white">Review dumping Incident</h3>

              <div className="space-y-4 text-sm">
                {selectedComplaint.imageUrl && (
                  <div className="w-full h-48 rounded-xl overflow-hidden bg-slate-950 border border-slate-850 mb-4">
                    <img
                      src={`http://localhost:8080/api${selectedComplaint.imageUrl.replace(/^\/api/, '')}`}
                      alt="Incident location"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs font-mono text-slate-500 uppercase block">Complaint Type</span>
                    <span className="font-semibold text-white">{selectedComplaint.complaintType}</span>
                  </div>
                  <div>
                    <span className="text-xs font-mono text-slate-500 uppercase block">Incident Status</span>
                    <span className={`inline-block px-2.5 py-0.5 mt-1 rounded-full text-[10px] font-bold ${getStatusColor(selectedComplaint.status)}`}>
                      {selectedComplaint.status}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-mono text-slate-500 uppercase block">User Description</span>
                  <p className="text-slate-300 bg-slate-950/40 p-3 rounded-xl border border-slate-850 mt-1">{selectedComplaint.description}</p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 space-y-2">
                  <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 font-bold">
                    <AlertTriangle size={13} /> Gemini AI Analysis Report
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-500">Severity Level:</span>
                      <span className="text-red-400 font-bold ml-1">{selectedComplaint.aiSeverity}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Waste Material:</span>
                      <span className="text-white font-medium ml-1">{selectedComplaint.aiWasteType}</span>
                    </div>
                  </div>
                  <div className="text-xs pt-1">
                    <span className="text-slate-500 block">Recommended Action:</span>
                    <span className="text-slate-300 italic">{selectedComplaint.aiRecommendedAction}</span>
                  </div>
                </div>

                {selectedComplaint.adminComment && (
                  <div>
                    <span className="text-xs font-mono text-slate-500 uppercase block">Existing Admin Comments</span>
                    <p className="text-slate-400 bg-slate-950/40 p-3 rounded-xl border border-slate-850 mt-1 italic">
                      "{selectedComplaint.adminComment}"
                    </p>
                  </div>
                )}

                {/* Form to resolve or reject */}
                {selectedComplaint.status === 'PENDING' && (
                  <div className="pt-2 border-t border-slate-850 space-y-3">
                    <div>
                      <label className="text-xs font-mono text-slate-400 uppercase block mb-1.5">Action Remarks (Comment)</label>
                      <textarea
                        rows={2}
                        placeholder="Add resolution or rejection comments..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-850 bg-slate-950 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 resize-none"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        onClick={() => handleActionSubmit('REJECTED')}
                        disabled={isPending || !comment.trim()}
                        className="px-4 py-2.5 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/20 rounded-xl text-xs font-bold transition-colors disabled:opacity-30 flex items-center gap-1"
                      >
                        <X size={14} /> Reject Incident
                      </button>
                      <button
                        onClick={() => handleActionSubmit('RESOLVED')}
                        disabled={isPending || !comment.trim()}
                        className="px-4 py-2.5 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-bold transition-colors disabled:opacity-30 flex items-center gap-1"
                      >
                        <Check size={14} /> Resolve Dump
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => { setSelectedComplaint(null); setComment(''); }}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
                  >
                    Close Review
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
