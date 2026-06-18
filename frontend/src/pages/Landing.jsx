import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useThemeStore from '../store/themeStore';
import {
  Wallet,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Target,
  PieChart,
  BarChart3,
  Bot,
  Shield,
  Zap,
  Sun,
  Moon,
  CheckCircle2,
  Menu,
  X,
  Lock,
  Code,
  Heart,
} from 'lucide-react';

const STATS = [
  { value: '6+', label: 'Finance tools' },
  { value: 'AI', label: 'Smart insights' },
  { value: '24/7', label: 'Advisor chat' },
  { value: '100%', label: 'Free to start' },
];

const FEATURES = [
  {
    icon: TrendingUp,
    color: '#10b981',
    title: 'Income & Expenses',
    desc: 'Log transactions with categories and tags. See where your money goes every month.',
  },
  {
    icon: Target,
    color: '#f59e0b',
    title: 'Smart Budgeting',
    desc: 'Set limits per category and get alerts before you overspend.',
  },
  {
    icon: PieChart,
    color: '#06b6d4',
    title: 'Savings Goals',
    desc: 'Define targets, track contributions, and measure progress toward each goal.',
  },
  {
    icon: BarChart3,
    color: '#c084fc',
    title: 'Analytics Dashboard',
    desc: 'Charts, trends, and a financial health score — all in one clear view.',
  },
  {
    icon: Sparkles,
    color: '#a855f7',
    title: 'AI Insights',
    desc: 'Personalized forecasts, warnings, and savings tips based on your data.',
  },
  {
    icon: Bot,
    color: '#6366f1',
    title: 'AI Advisor',
    desc: 'Chat about budgeting, investing, and wealth building from any page.',
  },
];

const STEPS = [
  { num: '01', title: 'Create your account', desc: 'Sign up in seconds. Set your currency and you are ready to go.' },
  { num: '02', title: 'Track your finances', desc: 'Add income, expenses, budgets, and savings goals as you go.' },
  { num: '03', title: 'Act on AI guidance', desc: 'Review insights and ask your advisor for tailored recommendations.' },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
};

const Landing = () => {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#how-it-works', label: 'How it works' },
    { href: '#ai', label: 'AI Advisor' },
  ];

  return (
    <div className="landing-page">
      <div className="landing-bg-orb landing-bg-orb--1" />
      <div className="landing-bg-orb landing-bg-orb--2" />
      <div className="landing-bg-grid" />

      <header className={`landing-nav${scrolled ? ' landing-nav--scrolled' : ''}`}>
        <div className="landing-container landing-nav-inner">
          <Link to="/" className="landing-logo">
            <div className="logo-icon landing-logo-icon">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span>
              FinTrack <span className="landing-logo-ai">AI</span>
            </span>
          </Link>

          <nav className="landing-nav-links" aria-label="Main">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href}>{link.label}</a>
            ))}
          </nav>

          <div className="landing-nav-actions">
            <button type="button" onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link to="/login" className="landing-nav-login">Log in</Link>
            <Link to="/register" className="btn-primary landing-nav-cta">
              Get started <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              type="button"
              className="landing-nav-menu-btn"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button
              type="button"
              className="landing-mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
              aria-label="Close menu"
            />
            <motion.div
              className="landing-mobile-menu"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            >
              <div className="landing-mobile-menu-head">
                <div className="landing-logo" style={{ pointerEvents: 'none' }}>
                  <div className="logo-icon landing-logo-icon">
                    <Wallet className="w-4 h-4 text-white" />
                  </div>
                  <span style={{ fontSize: 15 }}>FinTrack <span className="landing-logo-ai">AI</span></span>
                </div>
                <button type="button" onClick={closeMenu} className="landing-mobile-menu-close" aria-label="Close menu">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="landing-mobile-menu-links">
                {navLinks.map((link) => (
                  <a key={link.href} href={link.href} onClick={closeMenu}>{link.label}</a>
                ))}
                <a href="/privacy" onClick={closeMenu}>Privacy Policy</a>
                <a href="/terms" onClick={closeMenu}>Terms & Conditions</a>
              </nav>
              <div className="landing-mobile-menu-actions">
                <Link to="/login" className="btn-secondary" onClick={closeMenu}>Log in</Link>
                <Link to="/register" className="btn-primary" onClick={closeMenu}>
                  Get started <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <section className="landing-hero">
        <div className="landing-container landing-hero-grid">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="landing-hero-content"
          >
            <div className="landing-badge">
              <Sparkles className="w-3.5 h-3.5" />
              Personal finance, reimagined with AI
            </div>
            <h1 className="landing-hero-title">
              Clarity for your money.{' '}
              <span className="gradient-text">Confidence in every decision.</span>
            </h1>
            <p className="landing-hero-desc">
              FinTrack AI brings together expense tracking, budgeting, analytics, and an
              intelligent advisor — so you always know where you stand and what to do next.
            </p>
            <div className="landing-hero-ctas">
              <Link to="/register" className="btn-primary landing-hero-btn landing-hero-btn--primary">
                Start for free <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#features" className="btn-secondary landing-hero-btn">
                See features
              </a>
            </div>
            <div className="landing-hero-trust">
              {[
                { icon: CheckCircle2, text: 'Free to use' },
                { icon: Lock, text: 'Secure by design' },
                { icon: Shield, text: 'No card required' },
              ].map(({ icon: Icon, text }) => (
                <span key={text}>
                  <Icon className="w-3.5 h-3.5" style={{ color: '#10b981' }} />
                  {text}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="landing-hero-preview"
          >
            <div className="landing-preview-glow" />
            <div className="landing-preview-card">
              <div className="landing-preview-header">
                <div className="landing-preview-dots">
                  <span /><span /><span />
                </div>
                <span className="landing-preview-label">Overview</span>
              </div>
              <div className="landing-preview-stats">
                {[
                  { label: 'Income', value: '₹85,000', color: '#10b981' },
                  { label: 'Expenses', value: '₹52,400', color: '#f43f5e' },
                  { label: 'Savings', value: '₹32,600', color: '#6366f1' },
                ].map((s) => (
                  <div key={s.label} className="landing-preview-stat">
                    <span className="landing-preview-stat-label">{s.label}</span>
                    <span className="landing-preview-stat-value" style={{ color: s.color }}>{s.value}</span>
                  </div>
                ))}
              </div>
              <div className="landing-preview-chart">
                <div className="landing-preview-bars">
                  {[65, 45, 80, 55, 70, 40, 85].map((h, i) => (
                    <div
                      key={i}
                      className="landing-preview-bar"
                      style={{ height: `${h}%`, animationDelay: `${i * 0.08}s` }}
                    />
                  ))}
                </div>
                <div className="landing-preview-ai-card">
                  <div className="landing-preview-ai-icon">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="landing-preview-ai-title">Health Score</p>
                    <p className="landing-preview-ai-score">82 <span>/ 100</span></p>
                  </div>
                </div>
              </div>
            </div>
            <div className="landing-preview-float landing-preview-float--1">
              <Bot className="w-4 h-4" style={{ color: '#a855f7' }} />
              <span>AI Advisor ready</span>
            </div>
            <div className="landing-preview-float landing-preview-float--2">
              <Zap className="w-4 h-4" style={{ color: '#f59e0b' }} />
              <span>On budget</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="landing-stats" aria-label="Highlights">
        <div className="landing-container">
          <div className="landing-stats-grid">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.05 }}
                className="landing-stat-item"
              >
                <span className="landing-stat-value">{stat.value}</span>
                <span className="landing-stat-label">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="landing-section">
        <div className="landing-container">
          <motion.div {...fadeUp} className="landing-section-head">
            <span className="landing-section-tag">Platform</span>
            <h2>Built for complete financial visibility</h2>
            <p>
              Every tool you need to track, plan, and improve your finances — designed with
              precision and powered by AI.
            </p>
          </motion.div>
          <div className="landing-features-grid">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: i * 0.05 }}
                  className="landing-feature-card"
                  style={{ '--feature-accent': f.color }}
                >
                  <div className="landing-feature-icon" style={{ background: `${f.color}14`, borderColor: `${f.color}30` }}>
                    <Icon className="w-5 h-5" style={{ color: f.color }} />
                  </div>
                  <div className="landing-feature-body">
                    <h3>{f.title}</h3>
                    <p>{f.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="ai" className="landing-section landing-ai-section">
        <div className="landing-container landing-ai-grid">
          <motion.div {...fadeUp} className="landing-ai-content">
            <span className="landing-section-tag">AI Advisor</span>
            <h2>Intelligent guidance, always within reach</h2>
            <p>
              Receive a financial health score, spending forecasts, and tailored recommendations.
              Chat with your advisor anytime — budgeting, saving, or investing.
            </p>
            <ul className="landing-ai-list">
              {[
                'Personalized health score and monthly insights',
                'Budget warnings and non-essential spend detection',
                'Finance-focused chatbot on every screen',
              ].map((item) => (
                <li key={item}>
                  <CheckCircle2 className="w-4 h-4" style={{ color: '#a855f7', flexShrink: 0 }} />
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/register" className="btn-primary landing-ai-cta">
              Try AI Advisor <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
          <motion.div {...fadeUp} className="landing-ai-visual">
            <div className="landing-ai-chat-mock">
              <div className="landing-ai-chat-header">
                <div className="landing-ai-chat-avatar">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <span className="landing-ai-chat-name">AI Advisor</span>
                  <span className="landing-ai-chat-status">Online</span>
                </div>
              </div>
              <div className="landing-ai-chat-body">
                <div className="landing-ai-msg landing-ai-msg--bot">
                  Hi! I can help with saving, budgeting, and investing strategies.
                </div>
                <div className="landing-ai-msg landing-ai-msg--user">
                  How should I build an emergency fund?
                </div>
                <div className="landing-ai-msg landing-ai-msg--bot">
                  Start with one month of essential expenses saved separately, then grow toward 3–6 months over time.
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="how-it-works" className="landing-section">
        <div className="landing-container">
          <motion.div {...fadeUp} className="landing-section-head">
            <span className="landing-section-tag">Process</span>
            <h2>From signup to insight in three steps</h2>
            <p>A straightforward flow designed to get you value quickly.</p>
          </motion.div>
          <div className="landing-steps">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.08 }}
                className="landing-step"
              >
                <span className="landing-step-num">{step.num}</span>
                <div className="landing-step-body">
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section landing-section--cta">
        <div className="landing-container">
          <motion.div {...fadeUp} className="landing-cta-card">
            <div className="landing-cta-glow" />
            <h2>Start managing your finances with confidence</h2>
            <p>Create your free account and unlock AI-powered insights today.</p>
            <div className="landing-cta-actions">
              <Link to="/register" className="btn-primary landing-cta-btn">
                Create free account <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/login" className="btn-secondary landing-cta-btn">Log in</Link>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-container">
          <div className="landing-footer-main">
            <div className="landing-footer-brand-block">
              <Link to="/" className="landing-footer-brand">
                <div className="logo-icon landing-footer-logo">
                  <Wallet className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="landing-footer-brand-name">FinTrack AI</span>
                  <span className="landing-footer-brand-sub">MERN Stack Project</span>
                </div>
              </Link>
              <p className="landing-footer-tagline">
                A full-stack MERN personal finance platform built by Anmol Srivastava —
                featuring expense tracking, budgeting, analytics, and AI-powered insights.
              </p>
              <div className="landing-footer-badges">
                <span className="landing-footer-badge">
                  <Shield className="w-3.5 h-3.5" />
                  Secure
                </span>
                <span className="landing-footer-badge">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI-powered
                </span>
                <span className="landing-footer-badge">
                  <Code className="w-3.5 h-3.5" />
                  MERN Stack
                </span>
              </div>
            </div>

            <div className="landing-footer-columns">
              <div className="landing-footer-col">
                <span className="landing-footer-col-title">Product</span>
                <a href="#features">Features</a>
                <a href="#ai">AI Advisor</a>
                <a href="#how-it-works">How it works</a>
              </div>
              <div className="landing-footer-col">
                <span className="landing-footer-col-title">Platform</span>
                <a href="#features">Expense tracking</a>
                <a href="#features">Budget planning</a>
                <a href="#features">Analytics</a>
              </div>
              <div className="landing-footer-col">
                <span className="landing-footer-col-title">Get started</span>
                <Link to="/register">Create account</Link>
                <Link to="/login">Log in</Link>
              </div>
              <div className="landing-footer-col">
                <span className="landing-footer-col-title">Legal</span>
                <Link to="/privacy">Privacy Policy</Link>
                <Link to="/terms">Terms & Conditions</Link>
              </div>
            </div>
          </div>

          <div className="landing-footer-bar">
            <p className="landing-footer-copyright">
              © {new Date().getFullYear()} FinTrack AI. Built with <Heart className="w-3 h-3" style={{ color: '#f43f5e', display: 'inline', verticalAlign: '-1px' }} /> by Anmol Srivastava
            </p>
            <p className="landing-footer-note">
              <a href="mailto:anmolsrivastave678@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>anmolsrivastave678@gmail.com</a> · MERN Stack Project
            </p>
          </div>
        </div>
      </footer>

      <div className="landing-mobile-cta">
        <Link to="/register" className="btn-primary landing-mobile-cta-btn">
          Get started free <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default Landing;
