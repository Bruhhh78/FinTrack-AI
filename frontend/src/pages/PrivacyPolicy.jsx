import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Wallet, Lock, Eye, Cookie, Mail, Sun, Moon, Heart } from 'lucide-react';
import useThemeStore from '../store/themeStore';

const SECTIONS = [
  {
    icon: Eye,
    num: '1',
    title: 'Information We Collect',
    content: (
      <>
        <p>We collect information to provide and improve our services. This includes:</p>
        <ul>
          <li><strong>Account information</strong> — your name and email address when you register.</li>
          <li><strong>Profile & preferences</strong> — currency, display settings, and customizations.</li>
          <li><strong>Financial data</strong> — transactions, budgets, goals, and savings you add to the platform.</li>
          <li><strong>Device & usage analytics</strong> — browser type, pages visited, and interaction patterns to improve UX.</li>
        </ul>
      </>
    ),
  },
  {
    icon: Shield,
    num: '2',
    title: 'How We Use Information',
    content: (
      <p>
        We use collected data to provide, maintain, and improve the service; personalize
        your experience and AI-powered insights; detect fraud and ensure security; and
        communicate with you about your account, updates, and relevant features.
      </p>
    ),
  },
  {
    icon: Lock,
    num: '3',
    title: 'Sharing & Disclosure',
    content: (
      <>
        <p>
          We do <strong>not</strong> sell your personal data — ever. We may share information with:
        </p>
        <ul>
          <li>Service providers who help us operate the platform (e.g., hosting, AI processing).</li>
          <li>Legal authorities when required by applicable law or to protect our rights.</li>
        </ul>
      </>
    ),
  },
  {
    icon: Eye,
    num: '4',
    title: 'Your Choices',
    content: (
      <p>
        You can update or delete your account information at any time through your profile
        settings. To request a full data export or account deletion, contact us at{' '}
        <a href="mailto:anmolsrivastave678@gmail.com" className="legal-link">anmolsrivastave678@gmail.com</a>.
      </p>
    ),
  },
  {
    icon: Cookie,
    num: '5',
    title: 'Cookies & Tracking',
    content: (
      <p>
        We use cookies and similar technologies for functionality, authentication, and
        analytics. You can manage cookie preferences through your browser settings. Disabling
        cookies may affect some features of the service.
      </p>
    ),
  },
  {
    icon: Mail,
    num: '6',
    title: 'Contact',
    content: (
      <p>
        For privacy-related questions or requests, email us at{' '}
        <a href="mailto:anmolsrivastave678@gmail.com" className="legal-link">anmolsrivastave678@gmail.com</a>.
        You can also review our <Link to="/terms" className="legal-link">Terms & Conditions</Link>.
      </p>
    ),
  },
];

const PrivacyPolicy = () => {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <div className="legal-page">
      <div className="landing-bg-orb landing-bg-orb--1" />
      <div className="landing-bg-orb landing-bg-orb--2" />
      <div className="landing-bg-grid" />

      <header className="legal-header">
        <div className="legal-header-inner">
          <Link to="/" className="landing-logo">
            <div className="logo-icon landing-logo-icon">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span>
              FinTrack <span className="landing-logo-ai">AI</span>
            </span>
          </Link>
          <div className="legal-header-actions">
            <button type="button" onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      <main className="legal-main">
        <div className="legal-container">
          <Link to="/" className="legal-back">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="legal-hero">
            <div className="legal-hero-icon">
              <Shield className="w-6 h-6" />
            </div>
            <h1>Privacy Policy</h1>
            <p className="legal-date">Last updated: June 15, 2026</p>
            <p className="legal-intro">
              FinTrack AI is a MERN stack project built by <strong>Anmol Srivastava</strong>.
              This Privacy Policy explains what information we collect, why we collect it,
              and how you can manage that information.
            </p>
          </div>

          <div className="legal-sections">
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              return (
                <section key={section.num} className="legal-section-card">
                  <div className="legal-section-header">
                    <div className="legal-section-num">{section.num}</div>
                    <h2>{section.title}</h2>
                  </div>
                  <div className="legal-section-body">
                    {section.content}
                  </div>
                </section>
              );
            })}
          </div>

          <div className="legal-footer-nav">
            <Link to="/terms" className="btn-secondary">
              View Terms & Conditions <ArrowLeft className="w-4 h-4" style={{ transform: 'rotate(180deg)' }} />
            </Link>
            <Link to="/" className="btn-primary">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
