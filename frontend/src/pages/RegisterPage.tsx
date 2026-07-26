import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authApi } from '@/api/endpoints';
import { Recycle, Mail, Lock, User, ArrowRight, Leaf, Globe, Zap, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const highlights = [
  { icon: <Leaf size={16} />, label: 'Carbon Tracker', desc: 'Monitor your footprint in real-time' },
  { icon: <Globe size={16} />, label: 'Global Impact', desc: 'Join a worldwide eco community' },
  { icon: <Zap size={16} />, label: 'Instant AI', desc: 'Sub-50ms Gemini responses via cache' },
];

export function RegisterPage() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      await authApi.register({ fullName: form.fullName, email: form.email, password: form.password });
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/30 flex items-center justify-center p-4">

      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="absolute top-20 right-10 w-80 h-80 bg-emerald-300/20 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-teal-300/15 dark:bg-teal-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl grid lg:grid-cols-2 overflow-hidden rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800">

        {/* Form Panel */}
        <div className="bg-white dark:bg-slate-950 p-8 sm:p-12 flex flex-col justify-center">

          <Link to="/" className="flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white">
              <Recycle size={16} />
            </div>
            <span className="font-heading font-bold text-xl text-slate-900 dark:text-white">
              EcoWaste <span className="gradient-text">AI</span>
            </span>
          </Link>

          <div className="mb-8">
            <h3 className="font-heading text-3xl font-bold text-slate-900 dark:text-white">Create your account</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Start your sustainable journey today — it's free.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Full name</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" required value={form.fullName} onChange={set('fullName')} placeholder="John Doe" className="input-light pl-11" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" required value={form.email} onChange={set('email')} placeholder="you@example.com" className="input-light pl-11" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required 
                  value={form.password} 
                  onChange={set('password')} 
                  placeholder="Min. 8 characters" 
                  className="input-light pl-11 pr-12" 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Confirm password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type={showConfirmPassword ? 'text' : 'password'} 
                  required 
                  value={form.confirmPassword} 
                  onChange={set('confirmPassword')} 
                  placeholder="Confirm password" 
                  className="input-light pl-11 pr-12" 
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60 mt-2">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Creating account...
                </span>
              ) : (
                <>
                  <span>Create Free Account</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">Sign in</Link>
          </div>
        </div>

        {/* Feature Panel */}
        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-teal-600 via-emerald-500 to-green-500 p-10 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

          <div>
            <span className="text-xs font-bold tracking-wider uppercase text-emerald-100">Why join EcoWaste AI?</span>
            <h2 className="font-heading text-3xl font-bold mt-3 leading-tight">
              The AI that makes sustainability actionable.
            </h2>
            <p className="text-emerald-100 text-sm mt-3 leading-relaxed">
              Real-time waste analysis, automated pickups, and carbon intelligence — all in one platform.
            </p>
          </div>

          <div className="space-y-4">
            {highlights.map((h) => (
              <div key={h.label} className="glass-card-dark p-4 rounded-xl flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">{h.icon}</div>
                <div>
                  <div className="font-semibold text-sm">{h.label}</div>
                  <div className="text-emerald-200 text-xs mt-0.5">{h.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-emerald-200 text-xs">
            🌿 Free to start. No credit card required.
          </p>
        </div>

      </div>
    </div>
  );
}
