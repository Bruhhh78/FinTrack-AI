import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../store/authStore';
import useThemeStore from '../store/themeStore';
import AdvisorChatbot from './AdvisorChatbot';
import {
  LayoutDashboard,
  TrendingDown,
  TrendingUp,
  Target,
  PieChart,
  BarChart3,
  User,
  LogOut,
  Menu,
  Bell,
  ChevronRight,
  Wallet,
  Sun,
  Moon,
  Sparkles
} from 'lucide-react';

const MENU_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',  path: '/',          color: '#6366f1' },
  { icon: Wallet,          label: 'Savings',    path: '/savings',   color: '#8b5cf6' },
  { icon: TrendingDown,    label: 'Expenses',   path: '/expenses',  color: '#f43f5e' },
  { icon: TrendingUp,      label: 'Income',     path: '/income',    color: '#10b981' },
  { icon: Target,          label: 'Budget',     path: '/budget',    color: '#f59e0b' },
  { icon: PieChart,        label: 'Goals',      path: '/goals',     color: '#06b6d4' },
  { icon: BarChart3,       label: 'Analytics',  path: '/analytics', color: '#c084fc' },
  { icon: Sparkles,        label: 'AI Advisor', path: '/ai-advisor', color: '#a855f7' },
  { icon: User,            label: 'Profile',    path: '/profile',   color: '#94a3b8' },
];

/* ─── Sidebar content (shared between desktop + mobile drawer) ─── */
const SidebarContent = ({ location, onNavigate, onLogout, user }) => (
  <div className="flex flex-col h-full">
    {/* Logo */}
    <div className="p-6 pb-4 flex items-center gap-3">
      <div className="logo-icon" style={{ width: 36, height: 36, borderRadius: 10 }}>
        <Wallet className="w-5 h-5 text-white" />
      </div>
      <div>
        <h1 className="text-base" style={{ fontWeight: 800, color: 'var(--text-primary)' }}>FinTrack</h1>
        <span className="text-xs" style={{ color: '#6366f1', fontWeight: 600 }}>AI Powered</span>
      </div>
    </div>

    <div style={{ height: 1, background: 'var(--border)', margin: '0 16px' }} />

    {/* Nav */}
    <nav className="flex-1 px-3 py-4 overflow-y-auto" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <p className="text-xs uppercase tracking-widest px-3 mb-2" style={{ color: 'var(--text-muted)', fontWeight: 600 }}>
        Navigation
      </p>
      {MENU_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={onNavigate}
            className={`nav-item${isActive ? ' active' : ''}`}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                background: isActive ? `${item.color}20` : 'var(--bg-nav-hover)',
                border: `1px solid ${isActive ? `${item.color}40` : 'var(--border)'}`,
              }}
            >
              <Icon className="w-4 h-4" style={{ color: isActive ? item.color : 'var(--text-muted)' }} />
            </div>
            <span style={{ fontWeight: isActive ? 600 : 500 }}>{item.label}</span>
            {isActive && <ChevronRight className="w-4 h-4 ml-auto" style={{ color: '#6366f1' }} />}
          </Link>
        );
      })}
    </nav>

    {/* User card + logout */}
    <div className="p-4" style={{ borderTop: '1px solid var(--border)' }}>
      <div
        className="glass-card p-3 mb-3 flex items-center gap-3"
        style={{ cursor: 'default' }}
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm"
          style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
        >
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{user?.name || 'User'}</p>
          <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{user?.email || ''}</p>
        </div>
      </div>

      <button
        onClick={onLogout}
        className="w-full nav-item"
        style={{ color: '#f87171' }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.15)' }}
        >
          <LogOut className="w-4 h-4" style={{ color: '#f87171' }} />
        </div>
        <span>Sign Out</span>
      </button>
    </div>
  </div>
);

/* ─── Main Layout ─── */
const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate  = useNavigate();
  const location  = useLocation();
  const { logout, user } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';

  // Close mobile drawer on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleLogout = () => { logout(); navigate('/login'); };

  const currentPage = MENU_ITEMS.find(i => i.path === location.pathname);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }} className="app-bg">

      {/* ── DESKTOP SIDEBAR (always visible ≥ 1024 px) ── */}
      <aside
        className="sidebar"
        style={{
          width: 260,
          flexShrink: 0,
          height: '100vh',
          display: 'none',   /* overridden by media-query helper below */
        }}
        id="desktop-sidebar"
      >
        <SidebarContent
          location={location}
          onNavigate={() => {}}
          onLogout={handleLogout}
          user={user}
        />
      </aside>

      {/* ── MOBILE DRAWER (overlay, < 1024 px) ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              style={{
                position: 'fixed', inset: 0,
                background: 'rgba(0,0,0,0.65)',
                backdropFilter: 'blur(6px)',
                zIndex: 40,
              }}
            />
            {/* drawer panel */}
            <motion.aside
              key="drawer"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="sidebar"
              style={{
                position: 'fixed', top: 0, left: 0,
                width: 260, height: '100vh',
                zIndex: 50,
              }}
            >
              <SidebarContent
                location={location}
                onNavigate={() => setMobileOpen(false)}
                onLogout={handleLogout}
                user={user}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* Header */}
        <header
          style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 24px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg-header)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Hamburger — only shown on mobile */}
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileOpen(true)}
              className="btn-icon"
              style={{ display: 'none' }}   /* shown via media-query helper */
            >
              <Menu className="w-4 h-4" />
            </button>

            <div>
              <h2 style={{ color: 'var(--text-primary)', fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>
                {currentPage?.label || 'Dashboard'}
              </h2>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className="theme-toggle"
              whileTap={{ scale: 0.88, rotate: isDark ? -20 : 20 }}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ opacity: 0, y: isDark ? 8 : -8, scale: 0.7 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: isDark ? -8 : 8, scale: 0.7 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {isDark
                    ? <Sun  className="w-4 h-4" />
                    : <Moon className="w-4 h-4" />}
                </motion.span>
              </AnimatePresence>
            </motion.button>

            {/* Bell */}
            <button className="btn-icon" style={{ position: 'relative' }}>
              <Bell className="w-4 h-4" />
              <span
                style={{
                  position: 'absolute', top: 6, right: 6,
                  width: 7, height: 7, borderRadius: '50%',
                  background: '#6366f1',
                }}
              />
            </button>

            {/* Avatar */}
            <div
              onClick={() => navigate('/profile')}
              style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 700, fontSize: 14, cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: 24, position: 'relative' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              style={{ minHeight: '100%', width: '100%' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
        {/* Footer */}
          <footer aria-label="Site footer" style={{ flexShrink: 0, borderTop: '1px solid var(--border)', background: 'var(--bg-footer)' }}>
            <div style={{ padding: '10px 20px', display: 'flex', justifyContent: 'center', gap: 10, alignItems: 'center' }}>
              <nav aria-label="Legal" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <Link to="/privacy" className="text-sm" style={{ color: 'var(--text-muted)' }}>Privacy Policy</Link>
                <span style={{ color: 'var(--text-muted)' }}>•</span>
                <Link to="/terms" className="text-sm" style={{ color: 'var(--text-muted)' }}>Terms & Conditions</Link>
              </nav>
              <div style={{ marginLeft: 12, color: 'var(--text-muted)', fontSize: 13 }}>
                © {new Date().getFullYear()} FinTrack AI
              </div>
            </div>
          </footer>
      </div>

      <AdvisorChatbot />

      {/* ── Inline responsive helper ── */}
      <style>{`
        @media (min-width: 1024px) {
          #desktop-sidebar { display: flex !important; flex-direction: column; }
          #mobile-menu-btn { display: none !important; }
        }
        @media (max-width: 1023px) {
          #desktop-sidebar { display: none !important; }
          #mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </div>
  );
};

export default Layout;
