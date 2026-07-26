import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, Sun, Moon, Globe, Bell, ChevronDown,
  LogOut, User, LayoutDashboard, Check, CheckCheck, Recycle, Shield
} from 'lucide-react';
import { useAuth } from '@/store/AuthContext';
import { useTheme } from '@/store/ThemeContext';
import { cn, LANGUAGES, type LanguageCode } from '@/lib/utils';
import { notificationApi } from '@/api/endpoints';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Notification } from '@/types';
import { toast } from 'sonner';

const navLinks = [
  { href: '#features',     label: 'Features' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#ai',           label: 'AI Assistant' },
  { href: '#impact',       label: 'Impact' },
  { href: '#contact',      label: 'Contact' },
];

interface NavbarProps {
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
}

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function NavItem({
  href, label, onClick
}: { href: string; label: string; onClick?: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const sectionId = href.replace('#', '');
    if (location.pathname !== '/') {
      navigate(`/${href}`);
    } else {
      scrollToSection(sectionId);
    }
    onClick?.();
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className="px-3.5 py-2 text-sm text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-all duration-200 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
    >
      {label}
    </a>
  );
}

export function Navbar({ language, onLanguageChange }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { data: notificationsResp } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationApi.getNotifications(),
    enabled: isAuthenticated,
    refetchInterval: 30000,
  });

  const notifications: Notification[] = notificationsResp?.data?.data ?? [];
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllMutation = useMutation({
    mutationFn: () => notificationApi.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('All notifications marked as read');
    },
  });

  const markReadMutation = useMutation({
    mutationFn: (id: number) => notificationApi.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
    toast.success('Signed out successfully');
  };

  const isHomePage = location.pathname === '/';

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 py-3 shadow-md'
          : 'bg-transparent py-5'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-glow-sm group-hover:scale-105 transition-transform duration-300">
              <Recycle size={20} className="text-white" />
            </div>
            <span className="font-heading font-bold text-xl text-slate-900 dark:text-white tracking-tight">
              EcoWaste <span className="gradient-text">AI</span>
            </span>
          </Link>

          {/* Desktop Nav Items */}
          {isHomePage && (
            <nav className="hidden md:flex items-center gap-1 glass-sm px-4 py-1.5 rounded-full border border-slate-200/60 dark:border-slate-800/60">
              {navLinks.map((link) => (
                <NavItem key={link.href} href={link.href} label={link.label} />
              ))}
            </nav>
          )}

          {/* Controls Right */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-all"
              >
                <Globe size={14} className="text-emerald-600 dark:text-emerald-400" />
                <span className="uppercase">{language}</span>
                <ChevronDown size={12} className="text-slate-400" />
              </button>

              <AnimatePresence>
                {langMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-36 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50"
                  >
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          onLanguageChange(lang.code);
                          setLangMenuOpen(false);
                        }}
                        className={cn(
                          'w-full text-left px-4 py-1.5 text-xs font-medium flex items-center justify-between hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors',
                          language === lang.code ? 'text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/30' : 'text-slate-700 dark:text-slate-300'
                        )}
                      >
                        <span>{lang.name}</span>
                        {language === lang.code && <Check size={12} />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-all"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-emerald-600" />}
            </button>

            {/* Auth Controls */}
            {isAuthenticated ? (
              <>
                {/* Notifications Bell */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => setNotifOpen(!notifOpen)}
                    className="relative p-2 rounded-full text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-all"
                  >
                    <Bell size={16} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {notifOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-80 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50"
                      >
                        <div className="px-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Notifications</span>
                          {unreadCount > 0 && (
                            <button
                              onClick={() => markAllMutation.mutate()}
                              className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                            >
                              <CheckCheck size={12} /> Mark all read
                            </button>
                          )}
                        </div>

                        <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                          {notifications.length === 0 ? (
                            <div className="p-4 text-center text-xs text-slate-500">No notifications</div>
                          ) : (
                            notifications.map((n) => (
                              <div
                                key={n.id}
                                onClick={() => !n.read && markReadMutation.mutate(n.id)}
                                className={cn(
                                  'p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer text-left',
                                  !n.read ? 'bg-emerald-50/50 dark:bg-emerald-950/20' : 'opacity-70'
                                )}
                              >
                                <p className="text-xs font-semibold text-slate-900 dark:text-white">{n.title}</p>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Dashboard Link */}
                <Link
                  to={user?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-all flex items-center gap-1.5"
                >
                  <LayoutDashboard size={14} />
                  <span>Dashboard</span>
                </Link>

                {/* User Menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-all"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-xs font-bold">
                      {user?.fullName?.[0]?.toUpperCase() ?? 'U'}
                    </div>
                    <span className="text-xs font-medium text-slate-900 dark:text-white max-w-[90px] truncate">
                      {user?.fullName ?? 'User'}
                    </span>
                    <ChevronDown size={12} className="text-slate-400" />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50"
                      >
                        <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user?.fullName}</p>
                          <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
                          <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-mono bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-semibold uppercase">
                            {user?.role}
                          </span>
                        </div>

                        <Link
                          to="/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="w-full px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                        >
                          <User size={14} className="text-emerald-600 dark:text-emerald-400" /> Profile & Settings
                        </Link>

                        {user?.role === 'ADMIN' && (
                          <Link
                            to="/admin/dashboard"
                            onClick={() => setUserMenuOpen(false)}
                            className="w-full px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                          >
                            <Shield size={14} className="text-cyan-500" /> Admin Module
                          </Link>
                        )}

                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800 mt-1"
                        >
                          <LogOut size={14} /> Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-primary py-2 px-5 text-xs font-bold"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl border-b border-slate-200 dark:border-slate-800 px-4 py-6 space-y-4"
          >
            {isHomePage && (
              <div className="flex flex-col space-y-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                {navLinks.map((link) => (
                  <NavItem
                    key={link.href}
                    href={link.href}
                    label={link.label}
                    onClick={() => setMobileOpen(false)}
                  />
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-mono text-slate-500">Language:</span>
              <div className="flex gap-2">
                {LANGUAGES.slice(0, 3).map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => onLanguageChange(lang.code)}
                    className={cn(
                      'px-2.5 py-1 text-xs rounded-lg font-mono border',
                      language === lang.code
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                        : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                    )}
                  >
                    {lang.code.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {isAuthenticated ? (
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="w-full py-2.5 px-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 font-bold rounded-xl text-center flex items-center justify-center gap-2 text-sm"
                >
                  <LayoutDashboard size={16} /> Open Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  className="w-full py-2.5 px-4 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold rounded-xl text-center flex items-center justify-center gap-2 text-sm"
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="py-2.5 text-center text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary py-2.5 text-center text-sm font-bold flex justify-center"
                >
                  Get Started
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
