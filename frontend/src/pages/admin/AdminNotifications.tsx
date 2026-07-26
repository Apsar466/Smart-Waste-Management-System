import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { adminApi } from '@/api/endpoints';
import { Bell, Send, Check } from 'lucide-react';
import { toast } from 'sonner';

export function AdminNotifications() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const { mutate: broadcast, isPending } = useMutation({
    mutationFn: () => adminApi.broadcastNotification(title, message),
    onSuccess: () => {
      toast.success('System announcement broadcasted to all users!');
      setTitle('');
      setMessage('');
    },
    onError: () => toast.error('Failed to broadcast notification.'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      toast.error('Title and message are required.');
      return;
    }
    broadcast();
  };

  return (
    <div className="space-y-6 pb-12 max-w-2xl">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold font-heading text-white">Announcements</h2>
        <p className="text-xs font-mono text-slate-400 mt-1 uppercase tracking-wider">System-wide broadcast panel</p>
      </div>

      {/* Broadcast Form */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 bg-slate-900/40 relative">
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-5 bg-emerald-500" />
        
        <h3 className="font-heading font-bold text-lg text-white mb-6 flex items-center gap-2">
          <Bell size={20} className="text-emerald-500" /> Broadcast System Alert
        </h3>

        <form onSubmit={handleSubmit} className="space-y-5 text-sm">
          <div>
            <label className="text-xs font-mono text-slate-400 uppercase block mb-1.5">Announcement Title</label>
            <input
              type="text"
              placeholder="Enter title (e.g. Schedule Maintenance)..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-850 bg-slate-950 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-slate-400 uppercase block mb-1.5">Alert Message Description</label>
            <textarea
              rows={5}
              placeholder="Enter descriptive detail for this alert..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-850 bg-slate-950 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 resize-none transition-colors"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="btn-primary py-3 px-6 text-xs flex items-center gap-1.5 font-bold tracking-wider"
            >
              {isPending ? 'Broadcasting...' : <><Send size={14} /> Send Broadcast</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
