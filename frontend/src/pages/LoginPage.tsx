import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/store/AuthContext';
import { authApi } from '@/api/endpoints';
import { Recycle, Mail, Lock, ArrowRight, ShieldCheck, Sparkles, CheckCircle2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const benefits = [
  'AI waste classification powered by Gemini 1.5 Flash',
  'Sub-50ms cache responses for instant analysis',
  'Real-time carbon footprint tracking',
  'Automated waste pickup scheduling',
];

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      const authData = res.data.data;
      login(authData);
      toast.success('Welcome back!');
      
      // Role-based redirection (handle both 'ADMIN' and 'ROLE_ADMIN' formats)
      const normalizedRole = authData.role.startsWith('ROLE_') ? authData.role.substring(5) : authData.role;
      const redirectPath = normalizedRole === 'ADMIN' ? '/admin/dashboard' : '/dashboard';
      navigate(location.state?.from?.pathname || redirectPath, { replace: true });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.getModifierState && e.getModifierState('CapsLock')) {
      setCapsLockOn(true);
    } else {
      setCapsLockOn(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/30 flex items-center justify-center p-4">

      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      {/* Ambient blobs */}
      <div className="absolute top-20 left-10 w-80 h-80 bg-emerald-300/20 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-300/15 dark:bg-teal-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl grid lg:grid-cols-2 overflow-hidden rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800">

        {/* Left Panel — Brand / Benefits */}
        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />

          <Link to="/" className="flex items-center gap-2.5 relative z-10">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Recycle size={20} className="text-white" />
            </div>
            <span className="font-heading font-bold text-xl tracking-tight">EcoWaste AI</span>
          </Link>

          <div className="relative z-10 space-y-6">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-white/20 border border-white/30 mb-4">
                <Sparkles size={12} /> AI Sustainability Platform
              </span>
              <h2 className="font-heading text-3xl font-bold leading-tight">
                Smart Waste Management Starts Here
              </h2>
              <p className="text-emerald-100 text-sm mt-3 leading-relaxed">
                Join thousands of users making a real environmental difference with Gemini-powered waste intelligence.
              </p>
            </div>

            <div className="space-y-3">
              {benefits.map((b) => (
                <div key={b} className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-200 mt-0.5 shrink-0" />
                  <span className="text-emerald-100 text-xs leading-relaxed">{b}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-emerald-200 relative z-10">
            <ShieldCheck size={14} />
            <span>Encrypted · Secure · GDPR Compliant</span>
          </div>
        </div>

        {/* Right Panel — Login Form */}
        <div className="bg-white dark:bg-slate-950 p-8 sm:p-12 flex flex-col justify-center">

          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white">
              <Recycle size={16} />
            </div>
            <span className="font-heading font-bold text-xl text-slate-900 dark:text-white">
              EcoWaste <span className="gradient-text">AI</span>
            </span>
          </Link>

          <div className="mb-8">
            <h3 className="font-heading text-3xl font-bold text-slate-900 dark:text-white">Welcome back</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Sign in to access your sustainability dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-light pl-11"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onKeyUp={handleKeyDown}
                  placeholder="••••••••"
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
              {capsLockOn && (
                <div className="flex items-center gap-2 mt-2 text-xs text-amber-600 dark:text-amber-400">
                  <AlertCircle size={12} />
                  <span>Caps Lock is on</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Signing in...
                </span>
              ) : (
                <>
                  <span>Sign In to Platform</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
              Create a free account
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
