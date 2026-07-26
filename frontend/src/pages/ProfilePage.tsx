import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Award, Camera, Truck, ShieldCheck, Lock, Save, Eye, EyeOff } from 'lucide-react';
import { userApi, rewardApi, authApi } from '@/api/endpoints';
import { useAuth } from '@/store/AuthContext';
import { toast } from 'sonner';

export function ProfilePage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Fetch real reward metrics from backend
  const { data: rewardResp } = useQuery({ queryKey: ['userReward'], queryFn: () => rewardApi.getRewards() });
  const reward = rewardResp?.data?.data ?? { totalPoints: 0, level: 'Recycler', badges: [] };

  const updateProfileMutation = useMutation({
    mutationFn: () => userApi.updateProfile({ fullName, phone, address }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      toast.success('Profile updated successfully!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: () => authApi.changePassword({ currentPassword: oldPassword, newPassword }),
    onSuccess: () => {
      setOldPassword('');
      setNewPassword('');
      toast.success('Password changed successfully!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to change password.');
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/60 via-white to-teal-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/20 text-slate-900 dark:text-slate-100 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
      
      {/* Top Banner */}
      <div className="glass-card p-6 sm:p-8 border border-white/10 relative overflow-hidden flex flex-col md:flex-row items-center gap-6">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-4xl font-bold shadow-glow">
          {user?.fullName?.[0]?.toUpperCase() ?? 'U'}
        </div>

        <div className="space-y-1 text-center md:text-left flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono">
            ROLE: {user?.role}
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold">{user?.fullName}</h1>
          <p className="text-slate-400 text-xs sm:text-sm">{user?.email}</p>
        </div>

        <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
          <div className="text-center">
            <span className="block font-heading text-2xl font-bold text-amber-400">{reward.totalPoints || 0}</span>
            <span className="text-[10px] font-mono text-slate-400 uppercase">REWARD POINTS</span>
          </div>
          <div className="text-center">
            <span className="block font-heading text-2xl font-bold text-emerald-400">{reward.level || 'Recycler'}</span>
            <span className="text-[10px] font-mono text-slate-400 uppercase">SUSTAINABILITY RANK</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Profile Info Form & Password Change */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left 7 Cols: Personal Info */}
        <div className="lg:col-span-7 glass-card p-6 sm:p-8 border border-white/10 space-y-6">
          <h3 className="font-heading text-lg font-bold flex items-center gap-2">
            <User size={18} className="text-emerald-400" />
            <span>Personal Information</span>
          </h3>

          <form onSubmit={(e) => { e.preventDefault(); updateProfileMutation.mutate(); }} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">FULL NAME</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input-dark"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">EMAIL ADDRESS (READ-ONLY)</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="input-dark opacity-50 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">PHONE NUMBER</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-dark"
                placeholder="+1 555-0199"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">DELIVERY / PICKUP ADDRESS</label>
              <textarea
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="input-dark resize-none"
                placeholder="Enter address for waste pickups..."
              />
            </div>

            <button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="btn-primary py-3 px-6 text-xs font-bold flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={14} />
              <span>Save Profile Changes</span>
            </button>
          </form>
        </div>

        {/* Right 5 Cols: Security & Password */}
        <div className="lg:col-span-5 glass-card p-6 sm:p-8 border border-white/10 space-y-6">
          <h3 className="font-heading text-lg font-bold flex items-center gap-2">
            <Lock size={18} className="text-cyan-400" />
            <span>Security & Password</span>
          </h3>

          <form onSubmit={(e) => { e.preventDefault(); changePasswordMutation.mutate(); }} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">CURRENT PASSWORD</label>
              <div className="relative">
                <input
                  type={showOldPassword ? 'text' : 'password'}
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="input-dark pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  aria-label={showOldPassword ? 'Hide password' : 'Show password'}
                >
                  {showOldPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">NEW PASSWORD</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input-dark pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={changePasswordMutation.isPending || !oldPassword || !newPassword}
              className="btn-outline py-3 px-6 text-xs font-bold flex items-center gap-2 w-full justify-center disabled:opacity-50"
            >
              <ShieldCheck size={14} className="text-cyan-400" />
              <span>Update Password</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
