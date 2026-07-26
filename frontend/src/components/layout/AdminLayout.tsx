import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Recycle, Truck, AlertTriangle,
  Bell, Cpu, BarChart3, Settings, LogOut, Menu, X, User as UserIcon
} from 'lucide-react';
import { useAuth } from '@/store/AuthContext';
import type { User } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

const sidebarLinks = [
  { to: '/admin/dashboard',     label: 'Dashboard',      icon: LayoutDashboard },
  { to: '/admin/users',         label: 'Users',          icon: Users },
  { to: '/admin/waste',         label: 'Waste Analysis', icon: Recycle },
  { to: '/admin/pickups',       label: 'Pickups',        icon: Truck },
  { to: '/admin/complaints',    label: 'Complaints',     icon: AlertTriangle },
  { to: '/admin/notifications', label: 'Announcements',  icon: Bell },
  { to: '/admin/analytics',     label: 'AI Analytics',   icon: Cpu },
  { to: '/admin/reports',       label: 'Reports',        icon: BarChart3 },
  { to: '/admin/settings',      label: 'Settings',       icon: Settings },
  { to: '/profile',             label: 'Profile',        icon: UserIcon },
];

// ─── Reusable sidebar content ─────────────────────────────────────────────────
function SidebarContent({
  user,
  onLogout,
  onLinkClick,
}: {
  user: User | null;
  onLogout: () => void;
  onLinkClick: () => void;
}) {
  return (
    <>
      {/* Logo / brand */}
      <div className="space-y-6">
        <div className="flex items-center gap-2.5 px-2 mb-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center font-bold text-white shadow-lg">
            A
          </div>
          <div>
            <h1 className="font-heading font-extrabold text-sm text-white tracking-widest">
              ECOWASTE <span className="text-emerald-400">AI</span>
            </h1>
            <span className="text-[9px] font-mono tracking-widest text-emerald-500 uppercase">SYS ADMIN</span>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="space-y-1">
          {sidebarLinks.map(link => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onLinkClick}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium tracking-wide transition-all duration-300 group ${
                    isActive
                      ? 'bg-emerald-500/10 border-l-4 border-emerald-500 text-emerald-400'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40 border-l-4 border-transparent'
                  }`
                }
              >
                <Icon size={16} className="group-hover:scale-110 transition-transform duration-300" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User / Logout */}
      <div className="space-y-4 pt-4 border-t border-slate-800/40">
        <div className="flex items-center gap-3 px-2 py-1.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center font-bold text-white text-sm">
            {user?.fullName?.[0]?.toUpperCase() ?? 'A'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">{user?.fullName}</p>
            <p className="text-[10px] font-mono text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:text-red-400 hover:bg-red-950/20 border-l-4 border-transparent rounded-xl text-sm transition-all duration-300"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </>
  );
}

// ─── Main AdminLayout ──────────────────────────────────────────────────────────
export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row relative">
      {/* Background glowing gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      {/* ── Mobile header bar ── */}
      <header className="md:hidden w-full h-16 bg-slate-900/60 backdrop-blur-xl border-b border-slate-800/80 flex items-center justify-between px-6 z-40 relative flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-white text-sm">
            A
          </div>
          <span className="font-heading font-bold text-slate-100 tracking-wider">
            ECOWASTE <span className="text-emerald-400">ADMIN</span>
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(prev => !prev)}
          className="p-2 text-slate-400 hover:text-white"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* ── Desktop sidebar — always visible ── */}
      <aside className="hidden md:flex w-64 flex-shrink-0 bg-slate-900/40 backdrop-blur-xl border-r border-slate-800/60 flex-col justify-between py-6 px-4 h-screen sticky top-0 z-10">
        <SidebarContent user={user} onLogout={handleLogout} onLinkClick={() => {}} />
      </aside>

      {/* ── Mobile sidebar — overlay, AnimatePresence ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
            />
            {/* Drawer */}
            <motion.aside
              key="drawer"
              initial={{ x: -260, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -260, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 flex flex-col justify-between py-6 px-4 md:hidden"
            >
              <SidebarContent user={user} onLogout={handleLogout} onLinkClick={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main content ── */}
      <main className="flex-grow min-w-0 p-6 md:p-8 overflow-y-auto relative z-10">
        <Outlet />
      </main>
    </div>
  );
}
